/* ─────────────────────────────────────────────────────────────────────────────
   HGUGM Cirugía Oral y Maxilofacial — Curso de Residentes — Service Worker
   Servicio de Cirugía Oral y Maxilofacial — Hospital General Universitario
   Gregorio Marañón, Madrid
───────────────────────────────────────────────────────────────────────────── */

const CACHE_NAME = 'maxillofacial-hgugm-v1';

const PRECACHE_ASSETS = [
  './', './index.html', './manifest.json',
  './assets/css/main.css', './assets/js/app.js', './assets/js/reader.js',
  './assets/js/quiz.js', './assets/js/progress.js', './assets/js/search.js',
  './assets/js/knowledge.js', './assets/js/abbreviations.js', './assets/js/i18n.js',
  './content/i18n/en.json', './content/i18n/es.json', './assets/img/logo.svg',
  './content/pearls/daily_pearls.json',
  // Block A — Head & Neck Oncology
  './content/chapters/a1_oral_cavity_cancer.json',
  './content/chapters/a2_oropharyngeal_cancer.json',
  './content/chapters/a3_salivary_gland_tumors.json',
  './content/chapters/a4_neck_dissection.json',
  './content/chapters/a5_mandibular_reconstruction.json',
  './content/chapters/a6_maxillary_reconstruction.json',
  './content/chapters/a7_skin_cancer_face.json',
  // Block B — Orthognathic & Skeletal Surgery
  './content/chapters/b1_orthognathic_planning.json',
  './content/chapters/b2_lefort_i_osteotomy.json',
  './content/chapters/b3_bsso.json',
  './content/chapters/b4_genioplasty.json',
  './content/chapters/b5_distraction_osteogenesis.json',
  // Block C — Dentoalveolar & Implantology
  './content/chapters/c1_dentoalveolar_surgery.json',
  './content/chapters/c2_dental_implants.json',
  './content/chapters/c3_preprosthetic_surgery.json',
  './content/chapters/c4_dentoalveolar_complications.json',
  // Block D — Temporomandibular Joint
  './content/chapters/d1_tmj_disorders.json',
  './content/chapters/d2_tmj_surgery.json',
  './content/chapters/d3_condylar_fractures.json',
  // Block E — Facial Trauma
  './content/chapters/e1_facial_fractures_general.json',
  './content/chapters/e2_mandibular_fractures.json',
  './content/chapters/e3_midface_fractures.json',
  './content/chapters/e4_frontal_sinus_fractures.json',
  './content/chapters/e5_panfacial_fractures.json',
  // Block F — Cleft & Craniofacial
  './content/chapters/f1_cleft_lip_palate.json',
  './content/chapters/f2_craniosynostosis.json',
  './content/chapters/f3_hemifacial_microsomia.json',
  './content/chapters/f4_salivary_gland_infections.json',
  // Block G — Research
  './content/chapters/g1_evidence_based_omfs.json',
  './content/chapters/g2_clinical_trials_omfs.json',
  './content/chapters/g3_outcomes_research.json',
  './content/chapters/g4_scientific_writing_omfs.json',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') return response;
        const toCache = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, toCache));
        return response;
      }).catch(() => {
        if (event.request.mode === 'navigate') return caches.match('./index.html');
        return new Response('Sin conexión', { status: 503, statusText: 'Service Unavailable' });
      });
    })
  );
});
