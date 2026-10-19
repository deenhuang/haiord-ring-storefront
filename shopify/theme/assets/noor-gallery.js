const instances = new Map();

export function enhanceGallery(gallery, { interval = 5000 } = {}) {
  const document = gallery.ownerDocument;
  const window = document.defaultView;
  const stage = gallery.querySelector('.main-image');
  const image = stage?.querySelector('img');
  const next = stage?.querySelector('.gallery-arrow.next');
  const previousButton = stage?.querySelector('.gallery-arrow.prev');
  if (!image || !next) return null;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = motion.matches;
  let hovered = false;
  let focused = false;
  let visible = true;
  let timer;
  let startedAt = 0;
  let elapsed = 0;
  let running = false;
  let loading = false;
  let advancing = false;
  let cycle = 0;
  let fadeTimer;
  let outgoing;
  let revision = 0;
  let destroyed = false;
  let previous = image.cloneNode();
  const thumbnails = () => [...gallery.querySelectorAll('.thumbnails button:not(.video-thumb)')];
  const selectedIndex = () => Math.max(0, thumbnails().findIndex(button => button.getAttribute('aria-pressed') === 'true' || button.classList.contains('selected')));
  let activeIndex = selectedIndex();
  const controls = document.createElement('div');
  controls.className = 'noor-gallery-controls';
  controls.setAttribute('role', 'group');
  const previousControl = (previousButton || next).cloneNode(true);
  previousControl.className = 'noor-gallery-nav noor-gallery-prev';
  previousControl.removeAttribute('id');
  const nextControl = next.cloneNode(true);
  nextControl.className = 'noor-gallery-nav noor-gallery-next';
  nextControl.removeAttribute('id');
  const pagination = document.createElement('div');
  pagination.className = 'noor-gallery-pagination';
  const dots = thumbnails().map((button, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'noor-gallery-dot';
    const track = document.createElement('span');
    track.className = 'noor-gallery-dot-track';
    const fill = document.createElement('span');
    fill.className = 'noor-gallery-progress';
    track.append(fill);
    dot.append(track);
    dot.addEventListener('click', () => { thumbnails()[index]?.click(); schedule(true); });
    pagination.append(dot);
    return dot;
  });
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'noor-gallery-toggle';
  controls.append(previousControl, pagination, nextControl, toggle);
  stage.append(controls);
  gallery.classList.add('noor-gallery-enhanced');
  const onPrevious = () => previousButton?.click();
  const onNext = () => next.click();
  previousControl.addEventListener('click', onPrevious);
  nextControl.addEventListener('click', onNext);

  function label() {
    const chinese = document.documentElement.lang.startsWith('zh');
    const text = paused ? (chinese ? '播放轮播' : 'Play slideshow') : (chinese ? '暂停轮播' : 'Pause slideshow');
    toggle.setAttribute('aria-label', text);
    toggle.title = text;
    const visibleText = paused ? (chinese ? '播放' : 'Play') : (chinese ? '暂停' : 'Pause');
    if (toggle.textContent !== visibleText) toggle.textContent = visibleText;
    controls.setAttribute('aria-label', chinese ? '产品图片轮播' : 'Product image slideshow');
    previousControl.setAttribute('aria-label', chinese ? '上一张产品图' : 'Previous product image');
    nextControl.setAttribute('aria-label', chinese ? '下一张产品图' : 'Next product image');
    dots.forEach((dot, index) => {
      dot.setAttribute('aria-label', chinese ? `查看第 ${index + 1} 张产品图，共 ${dots.length} 张` : `View product image ${index + 1} of ${dots.length}`);
      dot.setAttribute('aria-current', String(index === activeIndex));
    });
  }

  function blocked() {
    return destroyed || paused || hovered || focused || loading || advancing || !visible || document.hidden || !!document.querySelector('.modal-backdrop, [role="dialog"][aria-modal="true"]');
  }

  function paintProgress() {
    const fill = dots[activeIndex]?.querySelector('.noor-gallery-progress');
    if (!fill) return;
    fill.style.transition = 'none';
    fill.style.transform = `scaleX(${Math.min(1, elapsed / interval)})`;
    if (running) {
      fill.getBoundingClientRect();
      fill.style.transition = `transform ${Math.max(0, interval - elapsed)}ms linear`;
      fill.style.transform = 'scaleX(1)';
    }
    controls.dataset.playing = String(running);
  }

  function stopClock() {
    if (running) elapsed = Math.min(interval, elapsed + window.performance.now() - startedAt);
    running = false;
    window.clearTimeout(timer);
    paintProgress();
  }

  function schedule(reset = false) {
    stopClock();
    if (reset) { elapsed = 0; cycle++; }
    label();
    if (blocked()) { paintProgress(); return; }
    const scheduledCycle = cycle;
    startedAt = window.performance.now();
    running = true;
    timer = window.setTimeout(async () => {
      running = false;
      elapsed = interval;
      advancing = true;
      paintProgress();
      const buttons = thumbnails();
      const target = buttons[(activeIndex + 1) % buttons.length]?.querySelector('img');
      if (target) {
        const preload = new window.Image();
        preload.src = target.currentSrc || target.src;
        try { await preload.decode(); } catch { advancing = false; schedule(true); return; }
      }
      advancing = false;
      if (destroyed || scheduledCycle !== cycle) return;
      if (!blocked()) next.click();
      schedule();
    }, Math.max(0, interval - elapsed));
    paintProgress();
  }

  async function transition() {
    if (image.getAttribute('src') === previous.getAttribute('src') && image.getAttribute('srcset') === previous.getAttribute('srcset')) return;
    const current = ++revision;
    loading = true;
    schedule(true);
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
    try { await image.decode(); } catch { if (current === revision) { loading = false; schedule(true); } return; }
    if (destroyed || current !== revision) return;
    loading = false;
    previous = image.cloneNode();
    if (motion.matches) overlay.remove();
    else {
      window.requestAnimationFrame(() => {
        if (destroyed || current !== revision) return;
        overlay.classList.add('noor-gallery-fading');
        fadeTimer = window.setTimeout(() => overlay.remove(), 750);
      });
    }
    schedule(true);
  }

  const onEnter = event => { if (event.pointerType === 'touch') return; hovered = true; schedule(); };
  const onLeave = () => { hovered = false; schedule(); };
  const onFocus = event => { focused = event.target !== toggle; schedule(); };
  const onBlur = event => { focused = event.relatedTarget !== toggle && gallery.contains(event.relatedTarget); schedule(); };
  const onToggle = () => { paused = !paused; label(); schedule(); };
  const onMotion = () => { if (motion.matches) paused = true; label(); schedule(); };
  const onClick = event => { if (event.target.closest('.thumbnails button, .gallery-arrow')) schedule(true); };
  const onVisibility = () => schedule();
  gallery.addEventListener('pointerenter', onEnter);
  gallery.addEventListener('pointerleave', onLeave);
  gallery.addEventListener('focusin', onFocus);
  gallery.addEventListener('focusout', onBlur);
  gallery.addEventListener('click', onClick);
  toggle.addEventListener('click', onToggle);
  document.addEventListener('visibilitychange', onVisibility);
  motion.addEventListener('change', onMotion);
  const observer = new window.MutationObserver(transition);
  observer.observe(image, { attributes: true, attributeFilter: ['src', 'srcset'] });
  const selectionObserver = new window.MutationObserver(() => {
    const index = selectedIndex();
    if (index !== activeIndex) { activeIndex = index; schedule(true); }
  });
  const thumbnailRow = gallery.querySelector('.thumbnails');
  if (thumbnailRow) selectionObserver.observe(thumbnailRow, { subtree: true, attributes: true, attributeFilter: ['class', 'aria-pressed'] });
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
      selectionObserver.disconnect();
      intersection?.disconnect();
      motion.removeEventListener('change', onMotion);
      document.removeEventListener('visibilitychange', onVisibility);
      gallery.removeEventListener('pointerenter', onEnter);
      gallery.removeEventListener('pointerleave', onLeave);
      gallery.removeEventListener('focusin', onFocus);
      gallery.removeEventListener('focusout', onBlur);
      gallery.removeEventListener('click', onClick);
      toggle.removeEventListener('click', onToggle);
      previousControl.removeEventListener('click', onPrevious);
      nextControl.removeEventListener('click', onNext);
      outgoing?.remove();
      controls.remove();
      gallery.classList.remove('noor-gallery-enhanced');
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
