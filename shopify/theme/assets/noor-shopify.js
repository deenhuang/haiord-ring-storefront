document.addEventListener('change', (event) => {
  const select = event.target.closest('[data-noor-variant]');
  if (!select) return;
  const price = document.querySelector('[data-noor-price]');
  if (price) price.textContent = select.selectedOptions[0]?.dataset.price || '';
});
