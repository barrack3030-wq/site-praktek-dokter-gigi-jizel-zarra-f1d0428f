document.addEventListener('DOMContentLoaded', () => {
  const config = window.NAKAMA_SITE || {};
  const menuBtn = document.getElementById('menuBtn') || document.querySelector('.menu-toggle');
  const nav = document.getElementById('navLinks') || document.querySelector('.nav-links');
  const header = document.getElementById('header') || document.querySelector('.navbar');
  const bookingForm = document.getElementById('bookingForm');
  const backTop = document.getElementById('backTop');

  // Mobile navigation
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      document.body.classList.toggle('nav-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        document.body.classList.remove('nav-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Sticky header + back to top
  const onScroll = () => {
    header?.classList.toggle('scrolled', window.scrollY > 24);
    backTop?.classList.toggle('show', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Smooth anchor navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', event => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Scroll reveal
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealItems.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('active'));
  }

  // Appointment -> WhatsApp
  bookingForm?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(bookingForm);
    const name = String(data.get('name') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const service = String(data.get('service') || 'Konsultasi').trim();
    const message = String(data.get('message') || '').trim();
    const number = String(config.whatsapp || '081251030315').replace(/\D/g, '');
    const intlNumber = number.startsWith('0') ? `62${number.slice(1)}` : number;

    if (!name || !phone) {
      bookingForm.reportValidity?.();
      return;
    }

    const text = [
      'Halo JIRA Dental Care / Praktek Dokter Gigi Jizel Zarra,',
      '',
      'Saya ingin membuat janji konsultasi.',
      `Nama: ${name}`,
      `No. WhatsApp/Telepon: ${phone}`,
      `Kebutuhan: ${service}`,
      message ? `Pesan: ${message}` : ''
    ].filter(Boolean).join('\n');

    window.open(`https://wa.me/${intlNumber}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  });

  // Current year
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});
