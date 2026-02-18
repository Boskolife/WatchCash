export function updateCurrentYear() {
  const year = new Date().getFullYear();
  const yearElement = document.querySelector('.year-current');
  if (!yearElement) return;
  yearElement.textContent = year;
}
