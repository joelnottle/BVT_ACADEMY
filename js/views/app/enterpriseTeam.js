// Enterprise hub: Team (invites, pending/active, per-person Micro-Unit progress), the Micro-Unit catalogue,
// and enrolment with a live price summary and a pretend checkout (§8.14). $1,500 first, $1,000 each additional.
import { TEAM_PAGE as T, MICRO as M, HUB } from '../../../data/enterprise.js';
import { MICRO_UNITS, MICRO_UNIT_AREAS } from '../../../data/microunits.js';
import { fmtCredits } from '../../../data/copy.js';
import { esc } from '../../util.js';
import { icon, renderIcons } from '../../components/icon.js';
import { validateForm, isEmail } from '../../components/form.js';
import { openModal } from '../../components/modal.js';
import { showToast } from '../../components/toast.js';
import { navigate } from '../../router.js';
import { currentOrg } from '../../store.js';
import { microUnitPrice } from '../../selectors.js';
import { inviteMember, acceptInvite, enrolMicroUnit, viewAsMember, unitById } from '../../enterpriseStore.js';

const money = (n) => `$${n.toLocaleString('en-AU')}`;

function unitsOf(m) {
  const entries = Object.entries(m.units ?? {});
  if (!entries.length) return `<span class="text-3">${esc(T.none)}</span>`;
  return `<ul class="hub-units">${entries.map(([id, done]) => {
    const u = unitById(id);
    return `<li>${esc(u.title)} <span class="text-3">· ${done}/${u.lessons.length}</span></li>`;
  }).join('')}</ul>`;
}

export function teamSection(ctx) {
  const { org } = ctx;
  const team = org.team ?? [];
  return `
    <p class="text-2">${esc(T.lead)}</p>
    <section class="card stack" aria-labelledby="inv-h">
      <h2 class="h3" id="inv-h">${esc(T.invite)}</h2>
      <form class="invite-form" data-invite novalidate>
        <div class="field"><label class="field__label" for="inv-name">${esc(T.name)}</label><input class="input" id="inv-name" name="name" autocomplete="off"><p class="field__error" id="inv-name-err" hidden></p></div>
        <div class="field"><label class="field__label" for="inv-email">${esc(T.email)}</label><input class="input" id="inv-email" name="email" type="email" autocomplete="off"><p class="field__error" id="inv-email-err" hidden></p></div>
        <div class="field"><label class="field__label" for="inv-role">${esc(T.role)}</label><select class="select" id="inv-role" name="role">${T.roles.map((r) => `<option>${esc(r)}</option>`).join('')}</select></div>
        <div class="invite-form__go"><button type="submit" class="btn btn--action">${icon('send')}${esc(T.send)}</button></div>
      </form>
    </section>
    <div class="data-table-wrap"><table class="data-table team-table"><caption class="sr-only">Team</caption>
      <thead><tr>${T.cols.map((c) => `<th scope="col">${esc(c)}</th>`).join('')}</tr></thead>
      <tbody>${team.map((m) => `
        <tr>
          <td data-label="${T.cols[0]}"><strong>${esc(m.name)}</strong><br><span class="text-3">${esc(m.email)}</span></td>
          <td data-label="${T.cols[1]}">${esc(m.role)}${m.title ? ` · ${esc(m.title)}` : ''}</td>
          <td data-label="${T.cols[2]}">${m.status === 'active' ? `<span class="chip chip--st-verified">${icon('user-check')}${esc(T.active)}</span>` : `<span class="chip chip--st-evidence">${icon('mail')}${esc(T.invited)}</span>`}</td>
          <td data-label="${T.cols[3]}">${unitsOf(m)}</td>
          <td data-label="${T.cols[4]}">${esc(fmtCredits(m.aliCredits ?? 0))}</td>
          <td data-label="${T.cols[5]}"><span class="ev-actions">
            ${m.status === 'invited'
              ? `<button type="button" class="btn btn--ghost" data-accept="${esc(m.id)}" data-focus-key="acc-${esc(m.id)}">${esc(T.accept)}<span class="sr-only">: ${esc(m.name)}</span></button>
                 <button type="button" class="btn btn--ghost" data-resend>${esc(T.resend)}<span class="sr-only"> to ${esc(m.name)}</span></button>`
              : m.name === ctx.persona.name ? '<span class="text-3">You</span>'
                : `<button type="button" class="btn btn--ghost" data-view-as="${esc(m.id)}">${icon('eye')}${esc(T.viewAs)}<span class="sr-only">: ${esc(m.name)}</span></button>`}
          </span></td>
        </tr>`).join('')}</tbody></table></div>`;
}

export function microSection(ctx) {
  const enrolments = ctx.org.microUnitEnrolments ?? [];
  const count = (id) => enrolments.filter((e) => e.unitId === id).reduce((n, e) => n + e.memberIds.length, 0);
  return `
    <p class="text-2">${esc(M.lead)}</p>
    ${MICRO_UNIT_AREAS.map((area) => `
      <section class="stack" aria-labelledby="mu-${esc(area)}">
        <h2 class="h3" id="mu-${esc(area)}">${esc(area)}</h2>
        <ul class="hub-cards">${MICRO_UNITS.filter((u) => u.area === area).map((u) => `
          <li class="card stack mu-card">
            <h3 class="card__title">${esc(u.title)}</h3>
            <p class="text-2">${esc(u.summary)}</p>
            <p class="text-3">${esc(M.facts(u))}</p>
            <p class="mu-card__price">${esc(M.price)}</p>
            ${count(u.id) ? `<span class="chip chip--st-verified">${icon('users')}${esc(M.enrolled(count(u.id)))}</span>` : ''}
            <div><a class="btn btn--outline" href="#/app/enterprise/enrol?unit=${esc(u.id)}">${esc(M.enrol)}<span class="sr-only">: ${esc(u.title)}</span></a></div>
          </li>`).join('')}</ul>
      </section>`).join('')}`;
}

function summary(unit, n) {
  if (!n) return `<p class="text-2">${esc(M.needOne)}</p>`;
  const lines = Array.from({ length: n }, (_, i) => `<div><dt>${esc(i === 0 ? M.first : M.additional)}</dt><dd>${money(i === 0 ? unit.priceFirst : unit.priceAdditional)}</dd></div>`).join('');
  return `<dl class="price-lines">${lines}<div class="price-lines__total"><dt>${esc(M.total)}</dt><dd>${money(microUnitPrice(n, unit))}</dd></div></dl>
    <p class="text-3">${icon('sparkles')} ${esc(M.credits(n * unit.aliCredits))}</p>`;
}

export function enrolSection(ctx) {
  const unit = unitById(ctx.query.unit);
  if (!unit) return `<p class="text-2">Choose a Micro-Unit first. <a href="#/app/enterprise/micro-units">See the catalogue</a></p>`;
  const team = ctx.org.team ?? [];
  return `
    <form class="hub-enrol" data-enrol="${esc(unit.id)}" novalidate>
      <section class="card stack" aria-labelledby="en-h">
        <h2 class="h3" id="en-h">${esc(M.enrolTitle(unit.title))}</h2>
        <p class="text-2">${esc(unit.summary)}</p>
        <p class="text-3">${esc(M.facts(unit))}</p>
        <fieldset class="fieldset"><legend>${esc(M.choose)}</legend>
          <p class="field__hint">${esc(M.chooseHint)}</p>
          <div class="stack stack-sm">${team.map((m) => {
            const already = m.units?.[unit.id] != null;
            return `<label class="check"><input type="checkbox" name="member" value="${esc(m.id)}"${already ? ' disabled' : ''}><span class="check__text">${esc(m.name)} <span class="check__hint">${esc(m.role)} · ${esc(m.status === 'active' ? T.active : T.invited)}${already ? ` · ${esc(M.already)}` : ''}</span></span></label>`;
          }).join('')}</div>
          <p class="field__error" id="en-err" hidden></p>
        </fieldset>
      </section>
      <aside class="card stack hub-summary" aria-labelledby="en-sum-h">
        <h2 class="h3" id="en-sum-h">${esc(M.summary)}</h2>
        <div data-summary aria-live="polite">${summary(unit, 0)}</div>
        <p class="text-3">${icon('shield-check')} ${esc(HUB.paid)}</p>
        <button type="submit" class="btn btn--action btn--block">${icon('lock')}${esc(M.pay)}</button>
      </aside>
    </form>`;
}

export function bindTeam(root) {
  const invite = root.querySelector('[data-invite]');
  invite?.addEventListener('submit', (e) => {
    e.preventDefault();
    const bad = validateForm(invite, { name: (v) => (v ? '' : T.errors.name), email: (v) => (isEmail(v) ? '' : T.errors.email) }, 'inv');
    if (bad) { bad.focus(); return; }
    const m = inviteMember({ name: invite.elements.name.value.trim(), email: invite.elements.email.value.trim(), role: invite.elements.role.value });
    showToast(T.sent(m.name), { text: T.sentText, iconName: 'mail' });
    setTimeout(() => document.getElementById('inv-name')?.focus(), 80);
  });
  root.querySelectorAll('[data-accept]').forEach((b) => b.addEventListener('click', () => {
    const m = currentOrg().team.find((x) => x.id === b.dataset.accept);
    acceptInvite(m.id);
    showToast(T.accepted(m.name), { iconName: 'user-check' });
  }));
  root.querySelectorAll('[data-resend]').forEach((b) => b.addEventListener('click', () => showToast(T.resent, { iconName: 'mail' })));
  root.querySelectorAll('[data-view-as]').forEach((b) => b.addEventListener('click', () => {
    navigate('/app/learn');
    viewAsMember(b.dataset.viewAs);
  }));

  const form = root.querySelector('[data-enrol]');
  if (!form) return;
  const unit = unitById(form.dataset.enrol);
  const picked = () => [...form.querySelectorAll('input[name="member"]:checked')].map((c) => c.value);
  form.addEventListener('change', () => {
    const box = form.querySelector('[data-summary]');
    box.innerHTML = summary(unit, picked().length);
    renderIcons(box);
    form.querySelector('#en-err').hidden = true;
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ids = picked();
    if (!ids.length) {
      const err = form.querySelector('#en-err');
      err.hidden = false;
      err.textContent = M.needOne;
      form.querySelector('input[name="member"]:not(:disabled)')?.focus();
      return;
    }
    const total = money(microUnitPrice(ids.length, unit));
    openModal({
      title: M.confirmTitle,
      body: `<p>${esc(unit.title)} · ${ids.length} ${ids.length === 1 ? 'participant' : 'participants'} · <strong>${esc(total)}</strong></p><p class="text-3">${esc(HUB.paid)}</p>`,
      actions: [{ label: 'Cancel', value: 'cancel', variant: 'outline' }, { label: `Pay ${total} (demo)`, value: 'pay', variant: 'action' }],
      onAction(v) {
        if (v !== 'pay') return;
        navigate('/app/enterprise/team');
        enrolMicroUnit(unit.id, ids);
        showToast(M.done(ids.length, unit.title, total), { text: M.doneText, iconName: 'graduation-cap' });
      },
    });
  });
}
