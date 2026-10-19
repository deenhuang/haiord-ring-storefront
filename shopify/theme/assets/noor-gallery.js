const instances = new Map();

export function enhanceGallery(gallery, { interval = 5000 } = {}) {
  const document = gallery.ownerDocument;
  const window = document.defaultView;
  const stage = gallery.querySelector('.main-image');
  const image = stage?.querySelector('img');
  const next = stage?.querySelector('.gallery-arrow.next');
  if (!image || !next) return null;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = motion.matches;
  let hovered = false;
  let focused = false;
  let visible = true;
  let timer;
  let fadeTimer;
  let outgoing;
  let revision = 0;
  let destroyed = false;
  let previous = image.cloneNode();
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'noor-gallery-toggle';
  stage.append(toggle);

  function label() {
    const chinese = document.documentElement.lang.startsWith('zh');
    const text = paused ? (chinese ? '播放轮播' : 'Play slideshow') : (chinese ? '暂停轮播' : 'Pause slideshow');
    toggle.setAttribute('aria-label', text);
    toggle.title = text;
    toggle.textContent = paused ? '▶' : 'Ⅱ';
  }

  function blocked() {
    return destroyed || paused || hovered || focused || !visible || document.hidden || !!document.querySelector('.modal-backdrop, [role="dialog"][aria-modal="true"]');
  }

  function schedule() {
    window.clearTimeout(timer);
    if (!blocked()) timer = window.setTimeout(async () => {
      const buttons = [...gallery.querySelectorAll('.thumbnails button:not(.video-thumb)')];
      const active = buttons.findIndex(button => button.getAttribute('aria-pressed') === 'true' || button.classList.contains('selected'));
      const target = buttons[(active + 1) % buttons.length]?.querySelector('img');
      if (target) {
        const preload = new window.Image();
        preload.src = target.currentSrc || target.src;
        try { await preload.decode(); } catch { schedule(); return; }
      }
      if (!blocked()) next.click();
      schedule();
    }, interval);
  }

  async function transition() {
    if (image.getAttribute('src') === previous.getAttribute('src') && image.getAttribute('srcset') === previous.getAttribute('srcset')) return;
    const current = ++revision;
    window.clearTimeout(fadeTimer);
    outgoing?.remove();
    outgoing = previous.cloneNode();
    outgoing.removeAttribute('id');
    outgoing.classList.add('noor-gallery-outgoing');
    outgoing.setAttribute('aria-hidden', 'true');
    outgoing.alt = '';
    outgoing.removeAttribute('loading');
    stage.append(outgoing);
    const overlay = outgoing;
    try { await image.decode(); } catch { schedule(); return; }
    if (destroyed || current !== revision) return;
    previous = image.cloneNode();
    if (motion.matches) overlay.remove();
    else {
      window.requestAnimationFrame(() => {
        if (destroyed || current !== revision) return;
        overlay.classList.add('noor-gallery-fading');
        fadeTimer = window.setTimeout(() => overlay.remove(), 750);
      });
    }
    schedule();
  }

  const onEnter = event => { if (event.pointerType === 'touch') return; hovered = true; schedule(); };
  const onLeave = () => { hovered = false; schedule(); };
  const onFocus = () => { focused = true; schedule(); };
  const onBlur = event => { focused = gallery.contains(event.relatedTarget); schedule(); };
  const onToggle = () => { paused = !paused; label(); schedule(); };
  const onMotion = () => { if (motion.matches) paused = true; label(); schedule(); };
  const onClick = () => schedule();
  gallery.addEventListener('pointerenter', onEnter);
  gallery.addEventListener('pointerleave', onLeave);
  gallery.addEventListener('focusin', onFocus);
  gallery.addEventListener('focusout', onBlur);
  gallery.addEventListener('click', onClick);
  toggle.addEventListener('click', onToggle);
  document.addEventListener('visibilitychange', schedule);
  motion.addEventListener('change', onMotion);
  const observer = new window.MutationObserver(transition);
  observer.observe(image, { attributes: true, attributeFilter: ['src', 'srcset'] });
  const intersection = window.IntersectionObserver ? new window.IntersectionObserver(entries => {
    visible = entries[0].isIntersecting; schedule();
  }) : null;
  intersection?.observe(gallery);
  label();
  schedule();
  return {
    refresh() { label(); schedule(); },
    destroy() {
      destroyed = true;
      revision++;
      window.clearTimeout(timer);
      window.clearTimeout(fadeTimer);
      observer.disconnect();
      intersection?.disconnect();
      motion.removeEventListener('change', onMotion);
      document.removeEventListener('visibilitychange', schedule);
      gallery.removeEventListener('pointerenter', onEnter);
      gallery.removeEventListener('pointerleave', onLeave);
      gallery.removeEventListener('focusin', onFocus);
      gallery.removeEventListener('focusout', onBlur);
      gallery.removeEventListener('click', onClick);
      toggle.removeEventListener('click', onToggle);
      outgoing?.remove();
      toggle.remove();
    }
  };
}

export function startProductGalleries(document) {
  let modalOpen = false;
  function sync() {
    for (const [gallery, controller] of instances) {
      if (!gallery.isConnected) { controller.destroy(); instances.delete(gallery); }
    }
    document.querySelectorAll('.product-gallery').forEach(gallery => {
      if (!instances.has(gallery)) {
        const controller = enhanceGallery(gallery);
        if (controller) instances.set(gallery, controller);
      }
    });
    const open = !!document.querySelector('.modal-backdrop, [role="dialog"][aria-modal="true"]');
    if (open !== modalOpen) {
      modalOpen = open;
      instances.forEach(controller => controller.refresh());
    }
  }
  const observer = new document.defaultView.MutationObserver(sync);
  observer.observe(document.body, { childList: true, subtree: true });
  const languageObserver = new document.defaultView.MutationObserver(() => instances.forEach(controller => controller.refresh()));
  languageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  sync();
  return () => {
    observer.disconnect(); languageObserver.disconnect();
    instances.forEach(controller => controller.destroy()); instances.clear();
  };
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => startProductGalleries(document), { once: true });
  else startProductGalleries(document);
}

