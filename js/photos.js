/* ============================================
   MEET THE SICKOS — photos.js
   Gallery · Download protection · Email claim
   ============================================ */

// --- RIGHT-CLICK / DRAG PROTECTION ---
// Discourages casual saving — can't stop screenshots,
// but makes the clean download button the path of least resistance.
document.addEventListener('contextmenu', e => {
  if (e.target.tagName === 'IMG') {
    e.preventDefault();
  }
});

document.addEventListener('dragstart', e => {
  if (e.target.tagName === 'IMG') {
    e.preventDefault();
  }
});

// --- PHOTO COUNT ---
function updatePhotoCount() {
  const items = document.querySelectorAll('.gallery-item');
  const countEl = document.getElementById('photoCount');
  const emptyEl = document.getElementById('galleryEmpty');

  if (countEl) {
    countEl.textContent = items.length === 0
      ? '0 photos'
      : `${items.length} photo${items.length !== 1 ? 's' : ''}`;
  }

  if (emptyEl) {
    emptyEl.style.display = items.length > 0 ? 'none' : 'flex';
  }
}

// --- DOWNLOAD VIA CANVAS ---
// Pulls the image through canvas to serve as a download,
// bypassing the browser's default "open in new tab" behavior.
function downloadPhoto(btn) {
  const src = btn.getAttribute('data-src');
  if (!src) return;

  const filename = src.split('/').pop() || 'mts-premiere-photo.jpg';

  const img = new Image();
  img.crossOrigin = 'anonymous';

  img.onload = function () {
    const canvas = document.createElement('canvas');
    canvas.width  = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'MeetTheSickos-Premiere-' + filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/jpeg', 1.0);
  };

  img.onerror = function () {
    // Fallback — direct link if canvas fails (e.g. CORS)
    const a = document.createElement('a');
    a.href = src;
    a.download = 'MeetTheSickos-Premiere-' + filename;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  img.src = src;
}

// --- EMAIL CLAIM ---
// Simple frontend gate. For a real backend, wire this to
// EmailJS or a Netlify/Vercel serverless function that
// looks up the email in a spreadsheet and emails a link.
function handleClaim() {
  const input  = document.getElementById('claimEmail');
  const note   = document.getElementById('claimNote');
  const btn    = document.getElementById('claimBtn');
  if (!input || !note) return;

  const email = input.value.trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    note.textContent = 'Please enter a valid email address.';
    note.className = 'claim-note claim-error';
    return;
  }

  btn.textContent = 'Searching...';
  btn.disabled = true;

  // Simulate async — replace with real lookup
  setTimeout(() => {
    btn.textContent = 'Find My Photo';
    btn.disabled = false;

    // TODO: replace this block with real backend call
    // For now, scroll to gallery and show a message
    note.textContent = 'Check the gallery below — your photo may already be there. If you can\'t find it, email us at hello@xlnzproductions.com.';
    note.className = 'claim-note claim-success';

    document.getElementById('galleryGrid')?.scrollIntoView({ behavior: 'smooth' });
  }, 1200);
}

// --- LIGHTBOX (basic) ---
// Click a gallery image to see it full size
function initLightbox() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  // Create lightbox elements
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-hidden', 'true');
  lb.innerHTML = `
    <div class="lb-backdrop"></div>
    <div class="lb-inner">
      <img class="lb-img" src="" alt="">
      <button class="lb-close" aria-label="Close photo">&times;</button>
      <button class="lb-dl" id="lbDownload">Download &darr;</button>
    </div>
  `;
  document.body.appendChild(lb);

  const lbImg = lb.querySelector('.lb-img');
  const lbDl  = lb.querySelector('.lb-dl');

  function openLightbox(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || '';
    lbDl.setAttribute('data-src', src);
    lb.setAttribute('aria-hidden', 'false');
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 300);
  }

  lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
  lb.querySelector('.lb-backdrop').addEventListener('click', closeLightbox);
  lbDl.addEventListener('click', function () { downloadPhoto(this); });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lb.classList.contains('open')) closeLightbox();
  });

  // Delegate click on gallery images
  grid.addEventListener('click', e => {
    const img = e.target.closest('.gallery-item img');
    if (!img) return;
    openLightbox(img.src, img.alt);
  });
}

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
  updatePhotoCount();
  initLightbox();
});
