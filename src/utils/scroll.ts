/** Прокручивает страницу в начало (окно и корневые элементы документа). */
export function scrollToTop(): void {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  const root = document.getElementById('root');
  if (root instanceof HTMLElement && root.scrollTop > 0) {
    root.scrollTop = 0;
  }
}
