// Requirement page events (§8.7). Every pretend action gives visible feedback: a state change, a toast,
// or a timeline entry. Hash first, then the store change, so a step change renders once.
import { STEPS, FEEDBACK } from '../../../data/copy.js';
import { REQ } from '../../../data/reqPage.js';
import { BADGE_BY_ID } from '../../../data/badges.js';
import { esc, formatDate } from '../../util.js';
import { icon, renderIcons } from '../../components/icon.js';
import { bindStepper } from '../../components/stepper.js';
import { openModal } from '../../components/modal.js';
import { showToast, announce } from '../../components/toast.js';
import { navigate } from '../../router.js';
import { getState, setUi, currentOrg } from '../../store.js';
import {
  markWatched, markLearned, downloadTemplate, toggleChecklist, saveNotes, saveVerifierNote, saveReply, readyForEvidence,
  addFiles, removeFile, linkEvidence, unlinkEvidence, setDeclared, submitForVerification, draftOf,
} from '../../reqStore.js';

const slugOf = (id) => STEPS.find((s) => s.id === id).slug;
/** After an action removes the focused control, put focus somewhere sensible once the page re-renders. */
const focusLater = (sel) => setTimeout(() => document.querySelector(sel)?.focus(), 80);

export function bindRequirement(root, ctx, m) {
  const { req, p } = m;
  const id = req.id;
  const keepLearning = ctx.query.learning ? '?learning=1' : '';
  const go = (stepId) => navigate(`/app/req/${id}/${slugOf(stepId)}${keepLearning && ['watch', 'learn', 'download', 'doIt'].includes(stepId) ? keepLearning : ''}`);

  bindStepper(root, (stepId) => go(stepId));

  root.querySelector('[data-fast-track]')?.addEventListener('click', () => {
    go('upload');
    readyForEvidence(id, { fastTrack: true });
    showToast(REQ.fastTracked, { text: 'Your verifier will see you went straight to evidence, and will still check understanding.', iconName: 'fast-forward' });
  });

  // ---- Learning steps ----
  root.querySelector('[data-play]')?.addEventListener('click', () => showToast(REQ.watch.playToast, { text: REQ.watch.playText, iconName: 'play' }));
  root.querySelector('[data-captions]')?.addEventListener('click', (e) => {
    const b = e.currentTarget;
    b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'));
  });
  root.querySelectorAll('[data-mark]').forEach((b) => b.addEventListener('click', () => {
    const watch = b.dataset.mark === 'watch';
    if (watch) markWatched(id); else markLearned(id);
    showToast(watch ? `Watched: ${req.video.title}` : `${id} learning done`, { text: 'Next: Download the templates, or skip ahead.', iconName: 'circle-check' });
  }));
  root.querySelectorAll('[data-download]').forEach((b) => b.addEventListener('click', () => {
    const t = m.mod.templates.find((x) => x.id === b.dataset.download);
    downloadTemplate(id, t.id);
    showToast(`Downloaded: ${t.title}`, { text: 'Pretend download — no file was saved.', iconName: 'file-down' });
  }));
  root.querySelectorAll('[data-check]').forEach((c) => c.addEventListener('change', () => toggleChecklist(id, Number(c.dataset.check), c.checked)));
  root.querySelector('[data-verifier-note]')?.addEventListener('input', (e) => saveVerifierNote(id, e.target.value));
  root.querySelector('[data-ready]')?.addEventListener('click', () => { go('upload'); readyForEvidence(id); });

  // ---- Notes (right rail) ----
  const notes = root.querySelector('[data-notes]');
  const hint = root.querySelector('[data-notes-hint]');
  let t;
  notes?.addEventListener('input', () => {
    saveNotes(id, notes.value);
    clearTimeout(t);
    hint.textContent = 'Saved';
    t = setTimeout(() => { hint.textContent = REQ.rail.notesHint; }, 1500);
  });

  // ---- Upload ----
  const fileInput = root.querySelector('[data-files]');
  fileInput?.addEventListener('change', () => {
    const files = [...fileInput.files];
    if (!files.length) return;
    addFiles(id, files);
    announce(`${files.length} ${files.length === 1 ? 'file' : 'files'} added`);
  });
  const zone = root.querySelector('[data-dropzone]');
  if (zone && !m.locked) {
    ['dragenter', 'dragover'].forEach((ev) => zone.addEventListener(ev, (e) => { e.preventDefault(); zone.classList.add('is-over'); }));
    ['dragleave', 'drop'].forEach((ev) => zone.addEventListener(ev, () => zone.classList.remove('is-over')));
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      const files = [...(e.dataTransfer?.files ?? [])];
      if (files.length) { addFiles(id, files); announce(`${files.length} ${files.length === 1 ? 'file' : 'files'} added`); }
    });
  }
  root.querySelectorAll('[data-remove-file]').forEach((b) => b.addEventListener('click', () => { removeFile(id, b.dataset.removeFile); announce('File removed'); focusLater('[data-focus-key="link-evidence"]'); }));
  root.querySelectorAll('[data-unlink]').forEach((b) => b.addEventListener('click', () => { unlinkEvidence(id, b.dataset.unlink); announce('Unlinked'); focusLater('[data-focus-key="link-evidence"]'); }));
  root.querySelector('[data-link-evidence]')?.addEventListener('click', () => openLinkModal(ctx, m));
  root.querySelector('[data-declared]')?.addEventListener('change', (e) => setDeclared(id, e.target.checked));
  root.querySelectorAll('[data-reply]').forEach((r) => r.addEventListener('input', () => saveReply(id, r.value)));
  root.querySelector('[data-dismiss-vault]')?.addEventListener('click', () => {
    setUi({ vaultDismissed: true });
    announce('Partner suggestion dismissed');
    focusLater('[data-focus-key="link-evidence"]');
  });
  root.querySelector('[data-submit-form]')?.addEventListener('submit', (e) => { e.preventDefault(); trySubmit(root, m); });
}

function openLinkModal(ctx, m) {
  const d = draftOf(m.p);
  const items = getState().evidence.filter((e) => e.orgId === ctx.org.id && !m.p.evidenceIds.includes(e.id) && !d.linkedIds.includes(e.id));
  openModal({
    title: REQ.upload.linkTitle,
    body: items.length
      ? `<fieldset class="fieldset"><legend class="sr-only">Evidence in your locker</legend><div class="stack stack-sm">
        ${items.map((e) => `<label class="option"><input type="checkbox" value="${esc(e.id)}"><span><strong>${esc(e.fileName)}</strong><br><span class="text-3">Uploaded ${esc(formatDate(e.uploadedOn))} · supports ${esc(e.requirementIds.join(', '))}</span></span></label>`).join('')}
        </div></fieldset>`
      : `<p>${esc(REQ.upload.linkNone)}</p>`,
    actions: items.length ? [{ label: 'Cancel', value: 'cancel', variant: 'outline' }, { label: 'Link selected', value: 'link', variant: 'action' }] : [{ label: 'Close', value: 'cancel', variant: 'outline' }],
    onAction(value) {
      if (value !== 'link') return;
      const ids = [...document.querySelectorAll('.overlay input[type=checkbox]:checked')].map((c) => c.value);
      if (!ids.length) return;
      linkEvidence(m.req.id, ids);
      announce(`${ids.length} linked from your locker`);
    },
  });
}

function trySubmit(root, m) {
  const d = draftOf(getState().progress[currentOrg().id][m.req.id]);
  const err = root.querySelector('#submit-err');
  const declared = root.querySelector('[data-declared]');
  const msg = !(d.files.length + d.linkedIds.length) ? REQ.upload.needFile : !declared.checked ? REQ.upload.needDeclare : '';
  err.hidden = !msg;
  err.innerHTML = msg ? `${icon('circle-alert')}${esc(msg)}` : '';
  declared.setAttribute('aria-invalid', String(Boolean(msg) && !declared.checked));
  if (msg) {
    declared.setAttribute('aria-describedby', 'submit-err');
    renderIcons(err);
    (declared.checked ? root.querySelector('[data-focus-key="link-evidence"]') : declared).focus();
    return;
  }
  const n = d.files.length + d.linkedIds.length;
  openModal({
    title: REQ.upload.confirmTitle,
    body: `<p>${esc(REQ.upload.confirmText(n, m.req.id))}</p>`,
    actions: [{ label: 'Cancel', value: 'cancel', variant: 'outline' }, { label: m.p.status === 'changes' ? REQ.upload.resubmit : REQ.upload.submit, value: 'submit', variant: 'action' }],
    onAction(value) {
      if (value !== 'submit') return;
      navigate(`/app/req/${m.req.id}/verify`);
      const r = submitForVerification(m.req.id);
      const ms = r?.milestones ?? [];
      showToast((r?.resubmit ? FEEDBACK.resubmittedTitle : FEEDBACK.submittedTitle)(m.req.id), {
        text: `${FEEDBACK.submittedText}${ms.length ? ` Milestone: ${ms.map((x) => BADGE_BY_ID[x].name).join(', ')}.` : ''}`,
        iconName: 'send',
      });
    },
  });
}
