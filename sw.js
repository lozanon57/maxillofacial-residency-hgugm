/**
 * Service Worker — HGUGM Maxillofacial Surgery Residency Course
 * Cache-first strategy | CACHE_NAME must be bumped on every deploy
 */

const CACHE_NAME = 'maxillofacial-hgugm-v1';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/css/main.css',
  '/assets/js/app.js',
  '/assets/js/reader.js',
  '/assets/js/quiz.js',
  '/assets/js/progress.js',
  '/assets/js/search.js',
  '/assets/js/i18n.js',
  '/assets/js/abbreviations.js',
  '/assets/js/knowledge.js',
  '/content/i18n/en.json',
  '/content/i18n/es.json',
  '/content/pearls/daily_pearls.json',
  '/knowledge-base/index.json',

  /* ── Block A: Foundations & Principles ── */
  '/content/chapters/a1_introduction_omfs.json',
  '/content/chapters/a2_surgical_anatomy_face.json',
  '/content/chapters/a3_local_anaesthesia_omfs.json',
  '/content/chapters/a4_orthognathic_principles.json',
  '/content/chapters/a5_orthognathic_genioplasty.json',
  '/content/chapters/a6_preprosthetic_implantology.json',
  '/content/chapters/a7_reconstruction_principles.json',

  /* ── Block B: Oncological Surgery ── */
  '/content/chapters/b1_oral_cancer_staging.json',
  '/content/chapters/b2_surgical_margins_pathology.json',
  '/content/chapters/b3_mandibulectomy_reconstruction.json',
  '/content/chapters/b4_free_flap_reconstruction.json',
  '/content/chapters/b5_neck_dissection.json',

  /* ── Block C: Dentoalveolar Surgery ── */
  '/content/chapters/c1_preprosthetic_surgery.json',
  '/content/chapters/c2_bone_grafts.json',
  '/content/chapters/c3_dental_implants.json',
  '/content/chapters/c4_dentoalveolar_complications.json',

  /* ── Block D: Temporomandibular Joint ── */
  '/content/chapters/d1_tmj_disorders.json',
  '/content/chapters/d2_tmj_surgery.json',
  '/content/chapters/d3_condylar_fractures.json',

  /* ── Block E: Facial Trauma ── */
  '/content/chapters/e1_facial_fractures_general.json',
  '/content/chapters/e2_mandibular_fractures.json',
  '/content/chapters/e3_midface_fractures.json',
  '/content/chapters/e4_frontal_sinus_fractures.json',
  '/content/chapters/e5_panfacial_fractures.json',

  /* ── Block F: Craniofacial Surgery ── */
  '/content/chapters/f1_cleft_lip_palate.json',
  '/content/chapters/f2_craniosynostosis.json',
  '/content/chapters/f3_hemifacial_microsomia.json',
  '/content/chapters/f4_salivary_gland_infections.json',

  /* ── Block G: Research & Academic Surgery ── */
  '/content/chapters/g1_evidence_based_omfs.json',
  '/content/chapters/g2_clinical_trials_omfs.json',
  '/content/chapters/g3_outcomes_research.json',
  '/content/chapters/g4_scientific_writing_omfs.json'
];

/* ── Install: pre-cache all assets ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

/* ── Activate: delete stale caches ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

/* ── Fetch: cache-first strategy ── */
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      });
    })
  );
});
