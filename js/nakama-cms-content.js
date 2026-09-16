(() => {
  const site = window.NAKAMA_SITE || {};
  const base = site.contentBase || './content/';
  const esc = (value) => String(value ?? '').replace(/[&<>'"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
  const load = async (path, fallback) => {
    try {
      const response = await fetch(`${base}${path}`, {cache:'no-store'});
      if (!response.ok) return fallback;
      return await response.json();
    } catch (_) { return fallback; }
  };
  const setText = (selector, value) => { const el=document.querySelector(selector); if(el && value!=null) el.textContent=String(value); };
  const stars = (rating) => '★'.repeat(Math.max(0, Math.min(5, Number(rating)||5)));
  const init = async () => {
    const [settings, seo, doctors, services, testimonials, faq, facilities] = await Promise.all([
      load('settings/site.json', {}), load('seo/seo.json', {}), load('doctors/items.json', []),
      load('services/items.json', []), load('testimonials/items.json', []), load('faq/items.json', []), load('facilities/items.json', [])
    ]);

    if (seo.title) document.title = seo.title;
    const description = document.querySelector('meta[name="description"]');
    if (description && seo.description) description.setAttribute('content', seo.description);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && seo.ogTitle) ogTitle.setAttribute('content', seo.ogTitle);
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription && seo.ogDescription) ogDescription.setAttribute('content', seo.ogDescription);

    setText('.hero-label', 'PRAKTEK DOKTER GIGI · ' + (settings.contact?.city || 'LUWUK').toUpperCase());
    setText('.hero-desc', settings.story);
    setText('#about .section-title', 'Profesional, tenang, dan berorientasi pada pasien.');
    setText('#about .section-desc', settings.story);
    const phone = settings.contact?.whatsapp || settings.contact?.phone || '';
    setText('.emergency-contact', phone ? `WhatsApp ${phone}` : 'WhatsApp');
    setText('.method strong', phone);
    setText('#location .section-desc', settings.contact?.address);
    setText('.footer-desc', settings.story);

    const hours = document.querySelector('.trust-container .stat-item:nth-of-type(3) p');
    if (hours) hours.textContent = settings.hours?.[0]?.days || 'Senin–Sabtu';
    const hourValue = document.querySelector('.trust-container .stat-item:nth-of-type(3) h3');
    if (hourValue) hourValue.textContent = (settings.hours?.[0]?.time || '09:00–21:00').replace(/:00/g,'');

    const featureList = document.querySelector('#about .feature-list');
    if (featureList) featureList.innerHTML = ['Konsultasi yang jelas dan mudah dipahami','Perawatan disesuaikan dengan kebutuhan pasien','Mengutamakan kenyamanan selama kunjungan'].map(item=>`<li>✓ ${esc(item)}</li>`).join('');

    const serviceGrid = document.querySelector('#services .services-grid');
    if (serviceGrid && services.length) serviceGrid.innerHTML = services.map((item,i)=>`<article class="service-card reveal ${i===1?'reveal-delay':''} ${i===2?'reveal-delay-2':''}"><div class="service-icon">${esc(item.icon || '✦')}</div><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p><a class="link-arrow" href="#appointment">Konsultasikan →</a></article>`).join('');

    const doctorGrid = document.querySelector('#doctor .doctors-grid');
    if (doctorGrid && doctors.length) doctorGrid.innerHTML = doctors.map((doc,i)=>`<article class="doctor-card reveal ${i?'reveal-delay':''}"><div class="doctor-img"><img src="${esc(doc.photo || '')}" alt="${esc(doc.name)}" loading="lazy"></div><div class="doctor-info"><h3>${esc(doc.name)}</h3><p class="specialty">${esc(doc.specialty || '')}</p><a class="link-arrow" href="#appointment">Buat konsultasi →</a></div></article>`).join('');

    const reviewGrid = document.querySelector('#reviews .reviews-grid');
    if (reviewGrid && testimonials.length) reviewGrid.innerHTML = testimonials.map((review,i)=>`<article class="review-card reveal ${i===1?'reveal-delay':''} ${i===2?'reveal-delay-2':''}"><div class="review-top"><span class="review-source">Google Review</span><span class="review-stars">${stars(review.rating)}</span></div><p>“${esc(review.quote)}”</p><span class="google-badge">★ ${(Number(review.rating)||5).toFixed(1).replace('.',',')} · Google</span></article>`).join('');

    const facilityGallery = document.querySelector('#facilities .facilities-gallery');
    if (facilityGallery && facilities.length) {
      const [first,...rest] = facilities;
      facilityGallery.innerHTML = `<div class="gallery-item large"><img src="${esc(first.image||'')}" alt="${esc(first.title)}" loading="lazy"></div><div class="gallery-column">${rest.slice(0,2).map(item=>`<div class="gallery-item"><img src="${esc(item.image||'')}" alt="${esc(item.title)}" loading="lazy"></div>`).join('')}</div>`;
    }

    const serviceSelect = document.getElementById('service');
    if (serviceSelect && services.length) {
      serviceSelect.innerHTML = services.map(item=>`<option>${esc(item.title)}</option>`).join('');
      serviceSelect.insertAdjacentHTML('beforeend','<option>Lainnya</option>');
    }

    const faqWrap = document.querySelector('#faq .mt-lg');
    if (faqWrap && faq.length) faqWrap.innerHTML = [...faq].sort((a,b)=>(a.order||0)-(b.order||0)).map(item=>`<details class="form-group"><summary>${esc(item.question)}</summary><p class="section-desc mt-sm">${esc(item.answer)}</p></details>`).join('');

    const footerContact = document.querySelectorAll('.footer-links a');
    footerContact.forEach(a=>{ if(a.textContent.trim()===phone || a.getAttribute('href')?.includes('wa.me')) { a.textContent=phone; a.href=`https://wa.me/${String(phone).replace(/\D/g,'')}`; } });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true}); else init();
})();
