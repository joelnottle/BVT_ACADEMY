// Tabs (ARIA tablist, arrow-key navigation) and segmented control (aria-pressed toggle group).
import { esc, uid } from '../util.js';
import { icon } from './icon.js';

/** tabs({ label, items: [{ id, label, count?, panel }], selected }) */
export function tabs({ label, items, selected = items[0]?.id }) {
  const base = uid('tabs');
  const list = items.map((t) => {
    const on = t.id === selected;
    return `<button type="button" role="tab" class="tabs__tab" id="${base}-${t.id}-tab"
      aria-controls="${base}-${t.id}" aria-selected="${on}" tabindex="${on ? 0 : -1}">${esc(t.label)}${
      t.count != null ? `<span class="tabs__count">${esc(t.count)}</span>` : ''}</button>`;
  }).join('');
  const panels = items.map((t) => `
    <div role="tabpanel" class="tabs__panel" id="${base}-${t.id}" aria-labelledby="${base}-${t.id}-tab"
      tabindex="0" ${t.id === selected ? '' : 'hidden'}>${t.panel}</div>`).join('');
  return `<div class="tabs"><div class="tabs__list" role="tablist" aria-label="${esc(label)}">${list}</div>${panels}</div>`;
}

export function bindTabs(root) {
  root.querySelectorAll('.tabs').forEach((tabsEl) => {
    const tabList = [...tabsEl.querySelectorAll('[role="tab"]')];
    const select = (tab, focus = true) => {
      tabList.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', on);
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabList.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab, false));
      tab.addEventListener('keydown', (e) => {
        const map = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabList.length - 1 };
        if (!(e.key in map)) return;
        e.preventDefault();
        select(tabList[(map[e.key] + tabList.length) % tabList.length]);
      });
    });
  });
}

/** segmented({ label, items: [{ id, label, icon? }], selected }) */
export function segmented({ label, items, selected }) {
  const btns = items.map((s) => `<button type="button" class="segmented__item" data-value="${esc(s.id)}"
    aria-pressed="${s.id === selected}">${s.icon ? icon(s.icon) : ''}${esc(s.label)}</button>`).join('');
  return `<div class="segmented" role="group" aria-label="${esc(label)}">${btns}</div>`;
}

/** Calls onChange(value) when a segment is chosen. */
export function bindSegmented(root, onChange) {
  root.querySelectorAll('.segmented').forEach((group) => {
    group.addEventListener('click', (e) => {
      const btn = e.target.closest('.segmented__item');
      if (!btn) return;
      group.querySelectorAll('.segmented__item').forEach((b) => b.setAttribute('aria-pressed', b === btn));
      onChange?.(btn.dataset.value, group);
    });
  });
}
