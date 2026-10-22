// #/check/run/:checkId — the question runner (§8.2): section rail with progress, one question per card,
// "Why we ask", five-point answer scale, optional note, autosave indicator, Save & exit, Skip to results (demo).
import { CHECKS, ANSWER_SCALE } from '../../../data/checks.js';
import { RUNNER } from '../../../data/checkFlow.js';
import { esc } from '../../util.js';
import { icon } from '../../components/icon.js';
import { flowSteps } from '../../components/flowSteps.js';
import { showToast } from '../../components/toast.js';
import { navigate } from '../../router.js';
import { chooseCheck, answerQuestion, setCheckNote, goToQuestion, completeCheck, skipCheckToResults } from '../../store.js';
import { checkQuestions, checkSections } from '../../checkSelectors.js';

let focusQuestion = false; // set before a Back/Next re-render so focus lands on the new question

function savedText(savedAt) {
  if (!savedAt) return 'Answers save automatically';
  const secs = Math.round((Date.now() - savedAt) / 1000);
  if (secs < 10) return 'Saved just now';
  if (secs < 60) return `Saved ${secs} seconds ago`;
  const mins = Math.round(secs / 60);
  return `Saved ${mins} minute${mins === 1 ? '' : 's'} ago`;
}

function notStarted(check, c) {
  // Reached by a direct link before the details step: don't show earlier steps as done
  return `
    <div class="container check-flow">
      ${flowSteps(c?.orgName ? 2 : 0)}
      <section class="card stack" aria-labelledby="runner-start-h">
        <h1 class="h2 rule" id="runner-start-h">Ready to start the <span class="accent">${esc(check.short)}</span> check?</h1>
        <p class="lead">${check.questions} questions · about ${check.mins} minutes. Your answers save as you go.</p>
        <p><button class="btn btn--action" type="button" data-begin="${check.id}">${c?.orgName ? 'Start now' : 'Add your details first'}${icon('arrow-right')}</button></p>
      </section>
    </div>`;
}

export function render(ctx) {
  const check = CHECKS[ctx.params.checkId];
  const c = ctx.state.check;
  if (!check) return `<div class="container check-flow"><h1 class="h2">That check doesn’t exist</h1><p><a href="#/check/choose">Choose a check</a></p></div>`;
  if (!c?.orgName || c.checkId !== check.id) return notStarted(check, c);

  const questions = checkQuestions(check.id);
  const i = Math.min(c.index, questions.length - 1);
  const q = questions[i];
  const sections = checkSections(check.id, c.answers);
  const answered = questions.filter((x) => c.answers[x.id]).length;
  const isLast = i === questions.length - 1;
  const sampled = questions.length < check.questions;

  return `
    <div class="runner">
      <div class="runner-bar">
        <div class="container runner-bar__inner">
          <p class="runner-bar__title">${esc(check.name)}</p>
          <p class="runner-bar__count">Question ${i + 1} of ${check.questions}</p>
          <p class="runner-bar__saved" data-saved aria-live="polite">${icon('cloud-check')}<span>${savedText(c.savedAt)}</span></p>
          <button class="btn btn--outline" type="button" data-save-exit>Save & exit</button>
        </div>
        <div class="container">
          <div class="progress" role="progressbar" aria-label="Questions answered" aria-valuemin="0" aria-valuemax="${questions.length}" aria-valuenow="${answered}" aria-valuetext="${answered} of ${questions.length} answered">
            <div class="progress__fill" style="width:${(answered / questions.length) * 100}%"></div>
          </div>
        </div>
      </div>

      <div class="container runner__body">
        <nav class="runner-rail card card--flat" aria-label="Check sections">
          <p class="eyebrow">Sections</p>
          <ul>
            ${sections.map((s) => {
              const current = q.sectionId === s.id;
              const done = s.answered === s.total;
              return `<li><button type="button" class="runner-rail__item${current ? ' is-current' : ''}" data-section="${s.firstIndex}"${current ? ' aria-current="true"' : ''}>
                <span>${esc(s.name)}</span>
                <span class="runner-rail__count">${done ? `${icon('check')}<span class="sr-only">complete, </span>` : ''}${s.answered}/${s.total}</span>
              </button></li>`;
            }).join('')}
          </ul>
        </nav>

        <div class="runner-main">
          <form class="card runner-card" data-runner>
            <p class="eyebrow">${esc(q.sectionName)} · ${esc(q.id)}</p>
            <h1 class="h3 runner-q" id="runner-q" tabindex="-1">${esc(q.question)}</h1>
            <details class="why">
              <summary>${icon('circle-question-mark')}${esc(RUNNER.whyLabel)}</summary>
              <p>${esc(q.why)}</p>
            </details>
            <fieldset class="fieldset answer-scale">
              <legend>${esc(RUNNER.prompt)}</legend>
              <div class="stack stack-sm">
                ${ANSWER_SCALE.map((a) => `
                  <label class="option">
                    <input type="radio" name="answer" id="ans-${q.id}-${a.id}" value="${a.id}"${c.answers[q.id] === a.id ? ' checked' : ''}>
                    <span><strong>${esc(a.label)}</strong>${a.hint ? ` — ${esc(a.hint)}` : ''}</span>
                  </label>`).join('')}
              </div>
            </fieldset>
            <div class="field">
              <label class="field__label" for="note-${q.id}">${esc(RUNNER.noteLabel)} <span class="field__optional">(optional)</span></label>
              <textarea class="textarea" id="note-${q.id}" data-note rows="3">${esc(c.notes[q.id] ?? '')}</textarea>
            </div>
            <div class="runner-nav">
              <button class="btn btn--outline" type="button" id="runner-back" data-back ${i === 0 ? 'disabled' : ''}>${icon('arrow-left')}Back</button>
              <button class="btn btn--action" type="button" id="runner-next" data-next>${isLast ? 'See my results' : 'Next question'}${icon('arrow-right')}</button>
            </div>
          </form>
          <div class="runner-foot">
            <p class="text-3">${esc(RUNNER.footer)}</p>
            <button class="link-btn" type="button" data-skip>${esc(RUNNER.skip)}${icon('arrow-right')}</button>
          </div>
          ${sampled ? `<p class="placeholder-flag">${icon('triangle-alert')}${esc(RUNNER.sampleNote)}</p>` : ''}
        </div>
      </div>
    </div>`;
}

export function bind(root, ctx) {
  const begin = root.querySelector('[data-begin]');
  if (begin) {
    begin.addEventListener('click', () => {
      if (!ctx.state.check?.orgName) navigate('/check/start');
      else chooseCheck(begin.dataset.begin);
    });
    return;
  }
  const form = root.querySelector('[data-runner]');
  if (!form) return;
  const c = ctx.state.check;
  const questions = checkQuestions(c.checkId);
  const i = Math.min(c.index, questions.length - 1);
  const q = questions[i];

  if (focusQuestion) { focusQuestion = false; root.querySelector('#runner-q').focus(); }

  form.addEventListener('change', (e) => {
    if (e.target.name === 'answer') answerQuestion(q.id, e.target.value);
  });

  const saved = root.querySelector('[data-saved] span');
  let timer;
  root.querySelector('[data-note]').addEventListener('input', (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => { setCheckNote(q.id, e.target.value); saved.textContent = 'Saved just now'; }, 500);
  });
  // Keep "Saved n seconds ago" current while this page is open
  const tick = setInterval(() => {
    if (!document.contains(saved)) { clearInterval(tick); return; }
    saved.textContent = savedText(ctx.state.check?.savedAt);
  }, 10000);

  const go = (index) => { focusQuestion = true; goToQuestion(index); };
  root.querySelector('[data-back]').addEventListener('click', () => go(i - 1));
  root.querySelector('[data-next]').addEventListener('click', () => {
    if (i < questions.length - 1) { go(i + 1); return; }
    navigate('/check/results');
    completeCheck();
  });
  root.querySelectorAll('[data-section]').forEach((b) => b.addEventListener('click', () => {
    const first = Number(b.dataset.section);
    const firstOpen = questions.findIndex((x, idx) => idx >= first && x.sectionId === questions[first].sectionId && !c.answers[x.id]);
    go(firstOpen >= 0 ? firstOpen : first);
  }));
  root.querySelector('[data-save-exit]').addEventListener('click', () => {
    navigate('/');
    showToast('Your check is saved', { text: 'Pick up where you left off any time from Start free check.', iconName: 'cloud-check' });
  });
  root.querySelector('[data-skip]').addEventListener('click', () => {
    navigate('/check/results');
    skipCheckToResults();
  });
}
