/**
 * Initializes FAQ accordion: when one item opens, all others close.
 */
export function initFaqAccordion() {
  const faqList = document.querySelector('.faq__list');
  if (!faqList) return;

  const items = faqList.querySelectorAll('.faq__item');

  items.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        items.forEach((other) => {
          if (other !== item) {
            other.removeAttribute('open');
          }
        });
      }
    });
  });
}
