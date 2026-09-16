window.NAKAMA_SITE = {
  businessName: 'Praktek Dokter Gigi Jizel Zarra', customerName: 'Daniel', category: 'Dentist', email: '', whatsapp: '081251030315', city: 'Luwuk',
  address: 'Jl. Imam Bonjol No.Kilo 1, Bungin, Luwuk, Kabupaten Banggai, Sulawesi Tengah 94712',
  tagline: 'Pelayanan maksimal untuk senyum sehat dan nyaman',
  description: 'Praktek dokter gigi Jizel Zarra di Luwuk dengan pelayanan yang ramah, nyaman, profesional, dan personal untuk pasien dan keluarga.',
  rating: '5.0', reviewCount: '21', instagram: 'https://www.instagram.com/praktek_drg.jizelzarra/', facebook: '',
  maps: 'https://www.google.com/maps/search/?api=1&query=Jl.+Imam+Bonjol+No.Kilo+1%2C+Bungin%2C+Luwuk%2C+Kabupaten+Banggai%2C+Sulawesi+Tengah+94712',
  contentBase: './content/',
  cms: { siteType: 'dental', config: './cms-config.json', schema: './cms-schema.json' },
  hours: { monday:'09:00–21:00', tuesday:'09:00–21:00', wednesday:'09:00–21:00', thursday:'09:00–21:00', friday:'09:00–21:00', saturday:'09:00–21:00', sunday:'Tutup' },
  assets: {}, theme: 'clarity'
};

// Load CMS-managed content without changing the existing page markup.
const cmsContentScript = document.createElement('script');
cmsContentScript.defer = true;
cmsContentScript.src = './js/nakama-cms-content.js?v=20260916-1';
document.head.appendChild(cmsContentScript);
