document.addEventListener('DOMContentLoaded',()=>{
  const config=window.NAKAMA_SITE||{};
  const menuBtn=document.getElementById('menuBtn');
  const nav=document.getElementById('navLinks');
  const header=document.getElementById('header');
  const bookingForm=document.getElementById('booking');
  const backTop=document.getElementById('top');

  if(menuBtn&&nav){
    menuBtn.addEventListener('click',()=>{
      const open=nav.classList.toggle('is-open');
      header?.classList.toggle('menu-open',open);
      document.body.classList.toggle('nav-open',open);
      menuBtn.setAttribute('aria-expanded',String(open));
    });
    nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
      nav.classList.remove('is-open');header?.classList.remove('menu-open');document.body.classList.remove('nav-open');menuBtn.setAttribute('aria-expanded','false');
    }));
  }

  const trust=document.querySelector('.trust-container');
  if(trust){
    const section=trust.closest('section');
    const items=[...trust.querySelectorAll('.stat-item')];
    trust.querySelectorAll('.stat-divider').forEach(el=>el.remove());
    if(section) section.classList.add('trust-slider-section');
    trust.classList.add('trust-slider');
    trust.setAttribute('aria-label','Statistik praktek');
    items.forEach((item,index)=>item.classList.add('trust-slide',`trust-slide-${index}`));

    const style=document.createElement('style');
    style.textContent=`
      .trust-slider-section{padding:18px 0!important}
      .trust-slider{position:relative!important;display:block!important;width:min(300px,100%);height:62px;margin:0 auto;overflow:hidden;border:1px solid var(--c-border);border-radius:100px;background:#fff;box-shadow:0 8px 24px rgba(0,0,0,.05)}
      .trust-slider .stat-item{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:10px;text-align:left;opacity:0;transform:translateX(18px);animation:trustStatSlider 12s infinite ease-in-out}
      .trust-slider .stat-item h3{font-size:1.65rem;line-height:1;font-weight:500;margin:0;color:var(--c-accent)}
      .trust-slider .stat-item p{font-size:.78rem;line-height:1.2;margin:0;color:var(--c-text-muted)}
      .trust-slider .trust-slide-0{animation-delay:0s}
      .trust-slider .trust-slide-1{animation-delay:3s}
      .trust-slider .trust-slide-2{animation-delay:6s}
      .trust-slider .trust-slide-3{animation-delay:9s}
      @keyframes trustStatSlider{
        0%,20%{opacity:1;transform:translateX(0)}
        25%,100%{opacity:0;transform:translateX(-18px)}
      }
      @media(max-width:768px){
        .trust-slider{width:250px;height:56px}
        .trust-slider .stat-item h3{font-size:1.45rem}
        .trust-slider .stat-item p{font-size:.72rem}
      }
      @media(prefers-reduced-motion:reduce){
        .trust-slider .stat-item{animation:none;opacity:0;transform:none}
        .trust-slider .trust-slide-0{opacity:1}
      }
    `;
    document.head.appendChild(style);
  }

  const onScroll=()=>{header?.classList.toggle('scrolled',window.scrollY>24);backTop?.classList.toggle('show',window.scrollY>500)};
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  backTop?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

  document.querySelectorAll('a[href^="#"]').forEach(anchor=>anchor.addEventListener('click',e=>{
    const id=anchor.getAttribute('href');if(!id||id==='#')return;const target=document.querySelector(id);if(!target)return;e.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'});
  }));

  const revealItems=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('active');observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -40px 0px'});revealItems.forEach(el=>observer.observe(el));}else revealItems.forEach(el=>el.classList.add('active'));

  bookingForm?.addEventListener('submit',e=>{
    e.preventDefault();
    const data=new FormData(bookingForm);
    const name=String(data.get('name')||'').trim();
    const phone=String(data.get('phone')||'').trim();
    const service=String(data.get('service')||'Konsultasi').trim();
    const message=String(data.get('message')||'').trim();
    if(!name||!phone){bookingForm.reportValidity?.();return}
    let number=String(config.whatsapp||'081251030315').replace(/\D/g,'');
    if(number.startsWith('0'))number='62'+number.slice(1);
    const text=['Halo JIRA Dental Care / Praktek Dokter Gigi Jizel Zarra,','','Saya ingin membuat janji konsultasi.',`Nama: ${name}`,`No. WhatsApp/Telepon: ${phone}`,`Kebutuhan: ${service}`,message?`Pesan: ${message}`:''].filter(Boolean).join('\n');
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(text)}`,'_blank','noopener,noreferrer');
  });
  const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
});
