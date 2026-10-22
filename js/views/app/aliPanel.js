// Ask Ali slide-over (BUILD_PLAN §8.10): context chip (removable), suggested prompts, scripted answers after a
// short "typing" pause (no flourish), 0.25 credits per answer, low-credit notice, pretend top-up, pin to notes.
// The panel lives outside #app, so it updates its own DOM; the store change refreshes the header chip behind it.
import { ALI, fmtCredits } from '../../../data/copy.js';
import { ALI_UI as U, ALI_DEFAULT_PROMPTS, ALI_TOPUPS, ALI_CREDIT_PER_ANSWER } from '../../../data/ali.js';
import { REQ_BY_ID } from '../../../data/requirements.js';
import { MODULE_BY_ID } from '../../../data/modules.js';
import { esc } from '../../util.js';
import { icon, renderIcons } from '../../components/icon.js';
import { openSlideOver } from '../../components/slideOver.js';
import { openModal } from '../../components/modal.js';
import { showToast, announce } from '../../components/toast.js';
import { currentOrg, currentPersona } from '../../store.js';
import { askAli, pinAnswer, topUpAli, aliBalance, matchScript } from '../../supportStore.js';
import { ALI_FALLBACK } from '../../../data/ali.js';

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function contextChip(c) {
  if (!c) return '';
  const label = c.reqId ? U.context(c.reqId, REQ_BY_ID[c.reqId].title) : U.moduleContext(MODULE_BY_ID[c.moduleId].title);
  return `<span class="ali-context">${icon(c.reqId ? 'file-text' : 'book-open')}<span>${esc(label)}</span>
    <button type="button" class="ali-context__x" data-ali-uncontext aria-label="${esc(U.removeContext)}">${icon('x')}</button></span>`;
}

const promptsFor = (c) => (c?.reqId ? REQ_BY_ID[c.reqId].aliPrompts : ALI_DEFAULT_PROMPTS);

function prompts(c) {
  return `<p class="ali__label">${esc(U.suggested)}</p>
    <ul class="ali__prompts">${promptsFor(c).map((q) => `<li><button type="button" class="prompt" data-ali-ask="${esc(q)}">${esc(q)}</button></li>`).join('')}</ul>`;
}

function meter() {
  const c = aliBalance();
  const notice = c < ALI_CREDIT_PER_ANSWER ? U.out : c < 1 ? U.low(fmtCredits(c)) : '';
  return `
    ${notice ? `<p class="ali__notice">${icon('info')}<span>${esc(notice)}</span></p>` : ''}
    <div class="ali__meter"><span>${icon('sparkles')}${esc(ALI.creditLine(c))}</span>
      <button type="button" class="btn btn--ghost" data-ali-topup>${icon('plus')}${esc(U.topUp)}</button></div>`;
}

const bubble = (role, html, extra = '') => `
  <div class="ali-msg ali-msg--${role}">
    <p class="ali-msg__who">${esc(role === 'user' ? U.you : U.ali)}</p>
    <div class="ali-msg__body">${html}</div>${extra}
  </div>`;

/** Open the panel. `reqId` / `moduleId` set the context; `prompt` asks it straight away. */
export function openAliPanel({ reqId = null, moduleId = null, prompt = null } = {}) {
  const org = currentOrg();
  // Mentors get "Ask Ali (mentor)" (§8.17): same guidance, no credits, nothing stored.
  const mentorMode = !org && currentPersona().role === 'mentor';
  if (!org && !mentorMode) return;
  let ctx = reqId && REQ_BY_ID[reqId] ? { reqId } : moduleId && MODULE_BY_ID[moduleId] ? { moduleId } : null;
  const first = currentPersona().name.split(' ')[0];
  const overlay = openSlideOver({
    title: U.title,
    iconName: 'sparkles',
    body: `
      <div class="ali" data-ali>
        <div data-ali-ctx>${contextChip(ctx)}</div>
        <div class="ali__log" data-ali-log aria-live="polite">
          ${bubble('ali', `<p>Hi ${esc(first)}. ${esc(ALI.intro)}</p>`)}
        </div>
        <div data-ali-prompts>${prompts(ctx)}</div>
        <form class="ali__form" data-ali-form>
          <label class="sr-only" for="ali-q">Your question for Ali</label>
          <textarea class="textarea" id="ali-q" rows="2" placeholder="${esc(U.placeholder)}"></textarea>
          <button type="submit" class="btn btn--action">${icon('send')}${esc(U.send)}</button>
        </form>
        <div data-ali-meter>${mentorMode ? `<p class="ali__meter">${icon('users')}<span>Mentor access · no credits used</span></p>` : meter()}</div>
      </div>`,
    footer: `<p>${icon('shield-check')}${esc(ALI.footer)} ${esc(ALI.privacy)}</p>${mentorMode ? '' : `<p><a href="#${currentPersona().role === 'member' ? '/app/learn/ali' : '/app/ali'}">${esc(U.history)}</a></p>`}`,
  });
  const root = overlay.dialog;
  renderIcons(root);
  const log = root.querySelector('[data-ali-log]');
  const form = root.querySelector('[data-ali-form]');
  const input = root.querySelector('#ali-q');
  let busy = false;

  const refreshMeter = () => {
    if (mentorMode) return;
    const m = root.querySelector('[data-ali-meter]');
    m.innerHTML = meter();
    renderIcons(m);
    const out = aliBalance() < ALI_CREDIT_PER_ANSWER;
    form.querySelector('button').disabled = out;
    input.disabled = out;
  };

  function ask(q) {
    if (busy || !q.trim()) return;
    if (!mentorMode && aliBalance() < ALI_CREDIT_PER_ANSWER) { refreshMeter(); return; }
    busy = true;
    log.insertAdjacentHTML('beforeend', bubble('user', `<p>${esc(q)}</p>`));
    log.insertAdjacentHTML('beforeend', `<p class="ali-typing" data-typing>${esc(U.typing)}<span class="ali-typing__dots" aria-hidden="true"><span></span><span></span><span></span></span></p>`);
    log.scrollTop = log.scrollHeight;
    setTimeout(() => {
      log.querySelector('[data-typing]')?.remove();
      const entry = mentorMode ? { answer: matchScript(q, ctx?.reqId ?? null)?.answer ?? ALI_FALLBACK, reqId: null } : askAli(q, ctx?.reqId ?? null);
      const pin = entry?.reqId ? `<button type="button" class="link-btn ali-msg__pin" data-ali-pin="${esc(entry.id)}">${icon('pin')}${esc(U.pin(entry.reqId))}</button>` : '';
      log.insertAdjacentHTML('beforeend', bubble('ali', entry ? `<p>${esc(entry.answer)}</p>` : `<p>${esc(U.out)}</p>`, pin));
      renderIcons(log);
      log.scrollTop = log.scrollHeight;
      refreshMeter();
      busy = false;
    }, reduced() ? 400 : 900);
  }

  root.addEventListener('click', (e) => {
    const t = e.target;
    const askBtn = t.closest('[data-ali-ask]');
    const pinBtn = t.closest('[data-ali-pin]');
    if (askBtn) ask(askBtn.dataset.aliAsk);
    else if (pinBtn) {
      const entry = pinAnswer(pinBtn.dataset.aliPin);
      if (entry) {
        pinBtn.outerHTML = `<span class="chip chip--st-verified ali-msg__pin">${icon('check')}${esc(U.pinned)}</span>`;
        renderIcons(log);
        showToast(U.pinnedToast(entry.reqId), { iconName: 'pin' });
      }
    } else if (t.closest('[data-ali-uncontext]')) {
      ctx = null;
      root.querySelector('[data-ali-ctx]').innerHTML = '';
      const p = root.querySelector('[data-ali-prompts]');
      p.innerHTML = prompts(null);
      renderIcons(p);
      announce('Context removed');
      input.focus();
    } else if (t.closest('[data-ali-topup]')) {
      openTopUp(refreshMeter);
    }
  });
  form.addEventListener('submit', (e) => { e.preventDefault(); const q = input.value; input.value = ''; ask(q); });
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); } });
  refreshMeter();
  if (prompt) ask(prompt);
  else input.focus();
}

/** Pretend top-up (a confirmation, because it would be a payment). */
export function openTopUp(after) {
  openModal({
    title: U.topUpTitle,
    body: `<fieldset class="fieldset"><legend class="sr-only">Bundle</legend><div class="stack stack-sm">
      ${ALI_TOPUPS.map((n, i) => `<label class="option"><input type="radio" name="ali-topup" value="${n}"${i === 1 ? ' checked' : ''}><span><strong>${n} credits</strong> · about ${n} hours · ${esc(U.topUpPrice)}</span></label>`).join('')}
      </div></fieldset><p class="text-3">${icon('shield-check')} ${esc(U.topUpNote)}</p>`,
    actions: [{ label: 'Cancel', value: 'cancel', variant: 'outline' }, { label: 'Add credits (demo)', value: 'add', variant: 'action' }],
    onAction(value) {
      if (value !== 'add') return;
      const n = Number(document.querySelector('.overlay input[name="ali-topup"]:checked')?.value ?? ALI_TOPUPS[1]);
      topUpAli(n);
      showToast(U.topUpToast(n), { text: U.topUpNote, iconName: 'sparkles' });
      after?.();
    },
  });
}
