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
  const stats=document.querySelectorAll('.trust-container .stat-item');
  if(stats.length){
    let current=0;
    stats.forEach((item,index)=>item.classList.toggle('is-active',index===0));
    const reduceMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if(!reduceMotion&&stats.length>1){
      setInterval(()=>{
        stats[current].classList.remove('is-active');
        current=(current+1)%stats.length;
        stats[current].classList.add('is-active');
      },2800);
    }
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
