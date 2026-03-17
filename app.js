document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('nav a');
  const pages = document.querySelectorAll('.page');

  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();

      // Active classlarni tozalash
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Sahifalarni yashirish va ochish
      const pageId = link.getAttribute('data-page');
      pages.forEach(p => p.classList.remove('active'));

      const targetPage = document.getElementById(pageId);
      if (targetPage) {
        targetPage.classList.add('active');
      } else {
        console.warn(`Sahifa topilmadi: ${pageId}`);
      }
    });
  });
});