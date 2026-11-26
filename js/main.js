// Renders projects from data/projects.json on both pages.
// Security: content is only inserted with textContent / property setters (never raw HTML strings),
// image paths must be local files under assets/img, links never come from data. No GitHub API calls.
(() => {
  'use strict';
  const el = (tag, props = {}) => Object.assign(document.createElement(tag), props);
  const safeImage = (s) => typeof s === 'string' && /^assets\/img\/[\w.\-\/]+\.(svg|png|jpe?g|webp|avif)$/i.test(s) && !s.includes('..');
  const img = (s) => (safeImage(s) ? s : 'assets/img/placeholder.svg');
  const firstSentence = (t) => { const m = t.match(/^[\s\S]*?[.!?](?=\s|$)/); return (m ? m[0] : t).trim(); };

  // ---- Enlarged view (native <dialog>: focus trap, Esc to close, focus returns to the image) ----
  let dlg, lbImg, lbTitle, lbText;
  function lightbox() {
    if (dlg) return dlg;
    dlg = el('dialog', { className: 'lightbox' });
    dlg.setAttribute('aria-labelledby', 'lb-title');
    const inner = el('div', { className: 'lb-inner' });
    const close = el('button', { type: 'button', className: 'lb-close', textContent: '×' });
    close.setAttribute('aria-label', 'Close');
    close.addEventListener('click', () => dlg.close());
    lbImg = el('img');
    const info = el('div');
    lbTitle = el('h3', { id: 'lb-title', className: 'project-title' });
    lbText = el('p', { className: 'project-text' });
    info.append(lbTitle, el('div', { className: 'bar' }), lbText);
    inner.append(close, lbImg, info);
    dlg.append(inner);
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); }); // click on backdrop
    document.body.append(dlg);
    return dlg;
  }
  function openLightbox(p, title, full) {
    const d = lightbox();
    lbImg.src = img(p.imageLarge || p.image);
    lbImg.alt = String(p.alt || '');
    lbTitle.textContent = title;
    lbText.textContent = full;
    d.showModal();
  }

  // ---- Project card ----
  function card(p) {
    const title = String(p.title || '');
    const full = String(p.description || '').trim();
    const first = p.summary ? String(p.summary).trim() : firstSentence(full);

    const art = el('article', { className: 'project' });

    const imgBtn = el('button', { type: 'button', className: 'project-img' });
    imgBtn.setAttribute('aria-label', 'Enlarge image: ' + title);
    imgBtn.append(el('img', { src: img(p.image), alt: String(p.alt || ''), loading: 'lazy', decoding: 'async' }));
    imgBtn.addEventListener('click', () => openLightbox(p, title, full));

    const body = el('div', { className: 'project-body' });
    body.append(el('h3', { className: 'project-title', textContent: title }), el('div', { className: 'bar' }));

    const para = el('p', { className: 'project-text' });
    const span = el('span', { textContent: first });
    para.append(span);
    if (full.length > first.length) {
      const btn = el('button', { type: 'button', className: 'expand', textContent: '[expand]' });
      let open = false;
      btn.setAttribute('aria-expanded', 'false');
      btn.addEventListener('click', () => {
        open = !open;
        span.textContent = open ? full : first;
        btn.textContent = open ? '[collapse]' : '[expand]';
        btn.setAttribute('aria-expanded', String(open));
      });
      para.append(' ', btn);
    }
    body.append(para);

    art.append(imgBtn, body);
    return art;
  }

  const all = document.getElementById('projects');
  const recent = document.getElementById('recent');
  if (!all && !recent) return;

  fetch('data/projects.json', { credentials: 'omit' })
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then((list) => {
      if (!Array.isArray(list)) throw new Error('bad data');
      list = list.filter((p) => p && p.draft !== true); // "draft": true hides an entry (JSON has no comments)
      if (all) all.replaceChildren(...list.map(card));
      if (recent && list.length) recent.replaceChildren(card(list[0])); // newest project = first in the file
    })
    .catch(() => {
      for (const n of [all, recent]) if (n) n.textContent = 'Projects could not be loaded.';
    });
})();
