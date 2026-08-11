/* ===== Apostila Bling · JS compartilhado ===== */
(function () {
  'use strict';
  const STORE_THEME = 'apostila:theme';
  const STORE_CHECK = 'apostila:checks';

  /* ---------- Tema ---------- */
  const savedTheme = localStorage.getItem(STORE_THEME);
  if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);

  function toggleTheme() {
    const now = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', now);
    localStorage.setItem(STORE_THEME, now);
    syncThemeBtn();
  }
  function syncThemeBtn() {
    const btn = document.getElementById('theme-btn');
    if (btn) btn.textContent = document.documentElement.getAttribute('data-theme') === 'light' ? '🌙' : '☀️';
  }

  /* ---------- Checklist persistente ---------- */
  const loadChecks = () => JSON.parse(localStorage.getItem(STORE_CHECK) || '{}');
  const saveChecks = (o) => localStorage.setItem(STORE_CHECK, JSON.stringify(o));

  function initChecklist() {
    const state = loadChecks();
    document.querySelectorAll('.check input[type=checkbox]').forEach((cb) => {
      if (!cb.id) return;
      cb.checked = !!state[cb.id];
      cb.closest('li').classList.toggle('done', cb.checked);
      cb.addEventListener('change', () => {
        const s = loadChecks();
        s[cb.id] = cb.checked;
        saveChecks(s);
        cb.closest('li').classList.toggle('done', cb.checked);
        renderProgress();
        renderIndexProgress();
      });
    });
    renderProgress();
  }

  /* Progresso do módulo atual */
  function renderProgress() {
    const box = document.getElementById('mod-progress');
    if (!box) return;
    const all = document.querySelectorAll('.check input[type=checkbox]');
    const done = document.querySelectorAll('.check input[type=checkbox]:checked').length;
    const pct = all.length ? Math.round((done / all.length) * 100) : 0;
    box.querySelector('.txt').textContent = `${done} de ${all.length} concluídos · ${pct}%`;
    box.querySelector('.bar span').style.width = pct + '%';
  }

  /* Progresso global (INDEX.html) — usa data-checks="id1,id2,..." nos cards */
  function renderIndexProgress() {
    const state = loadChecks();
    let total = 0, done = 0;
    document.querySelectorAll('.mod-card[data-checks]').forEach((card) => {
      const ids = card.dataset.checks.split(',').filter(Boolean);
      const d = ids.filter((i) => state[i]).length;
      total += ids.length; done += d;
      const el = card.querySelector('.card-progress');
      if (el) el.textContent = `${d}/${ids.length}`;
    });
    const g = document.getElementById('global-progress');
    if (g) {
      const pct = total ? Math.round((done / total) * 100) : 0;
      g.querySelector('.txt').textContent = `${done} de ${total} exercícios · ${pct}% da apostila`;
      g.querySelector('.bar span').style.width = pct + '%';
    }
  }

  function resetAll() {
    if (!confirm('Apagar todo o progresso salvo?')) return;
    localStorage.removeItem(STORE_CHECK);
    location.reload();
  }

  /* ---------- Botão copiar código ---------- */
  function initCopy() {
    document.querySelectorAll('pre').forEach((pre) => {
      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.type = 'button';
      btn.textContent = 'copiar';
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(pre.querySelector('code').innerText).then(() => {
          btn.textContent = 'copiado!';
          setTimeout(() => (btn.textContent = 'copiar'), 1500);
        });
      });
      pre.appendChild(btn);
    });
  }

  /* ---------- Sumário automático + scrollspy ---------- */
  function initToc() {
    const toc = document.querySelector('.toc');
    if (!toc) return;
    const heads = document.querySelectorAll('main h2[id]');
    if (!heads.length) { toc.style.display = 'none'; return; }
    const list = document.createElement('div');
    heads.forEach((h) => {
      const a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent.replace(/^\d+(\.\d+)*\s*/, '');
      list.appendChild(a);
    });
    toc.appendChild(list);

    const links = toc.querySelectorAll('a');
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((l) => l.classList.toggle('active', l.hash === '#' + e.target.id));
      });
    }, { rootMargin: '-80px 0px -70% 0px' });
    heads.forEach((h) => spy.observe(h));
  }

  /* ---------- Barra de progresso de leitura ---------- */
  function initReadBar() {
    const bar = document.getElementById('progress');
    if (!bar) return;
    const upd = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    };
    document.addEventListener('scroll', upd, { passive: true });
    upd();
  }

  /* ---------- Navegação por teclado (← →) ---------- */
  function initKeys() {
    document.addEventListener('keydown', (e) => {
      if (e.target.matches('input,textarea')) return;
      const prev = document.querySelector('.pager a[rel=prev]');
      const next = document.querySelector('.pager a[rel=next]');
      if (e.key === 'ArrowLeft' && prev) location.href = prev.href;
      if (e.key === 'ArrowRight' && next) location.href = next.href;
    });
  }

  /* ---------- Link ativo na topbar ---------- */
  function initActiveNav() {
    const file = location.pathname.split('/').pop() || 'INDEX.html';
    document.querySelectorAll('.topbar nav a').forEach((a) => {
      if (a.getAttribute('href') === file) a.classList.add('active');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    syncThemeBtn(); initChecklist(); initCopy(); initToc();
    initReadBar(); initKeys(); initActiveNav(); renderIndexProgress();
    const t = document.getElementById('theme-btn');  if (t) t.addEventListener('click', toggleTheme);
    const r = document.getElementById('reset-btn');  if (r) r.addEventListener('click', resetAll);
  });
})();
