/**
 * AMAZON CLONE CLIENT-SIDE INTERACTION SUITE
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroCarousel();
  initSearchAutocomplete();
  initSidebarDrawer();
  initLiveStreamSimulator();
  initBackToTop();
});

// 1. Hero Carousel
let currentHeroIndex = 0;
let heroTimer = null;

function initHeroCarousel() {
  const slides = document.querySelectorAll('.hero-slide');
  const prevBtn = document.getElementById('heroPrevBtn');
  const nextBtn = document.getElementById('heroNextBtn');
  const carousel = document.getElementById('heroCarousel');

  if (!slides.length) return;

  function showSlide(index) {
    slides.forEach((s, idx) => s.classList.toggle('active', idx === index));
    currentHeroIndex = index;
  }

  function nextSlide() {
    showSlide((currentHeroIndex + 1) % slides.length);
  }

  function prevSlide() {
    showSlide((currentHeroIndex - 1 + slides.length) % slides.length);
  }

  function startAutoPlay() {
    stopAutoPlay();
    heroTimer = setInterval(nextSlide, 5000);
  }

  function stopAutoPlay() {
    if (heroTimer) clearInterval(heroTimer);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoPlay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoPlay(); });

  if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
  }

  startAutoPlay();
}

// 2. Horizontal Sliders Scroll
function scrollSlider(sliderId, offset) {
  const track = document.getElementById(sliderId);
  if (track) {
    track.scrollBy({ left: offset, behavior: 'smooth' });
  }
}

// 3. Cart & Toast
let cartCount = 0;
let toastTimeout = null;

function addToCartItem(productName, price) {
  cartCount++;
  const cartBadge = document.getElementById('cartCount');
  if (cartBadge) {
    cartBadge.textContent = cartCount;
    cartBadge.style.transform = 'scale(1.3)';
    setTimeout(() => { cartBadge.style.transform = 'scale(1)'; }, 200);
  }
  triggerToast(`Added: ${productName} (₹${price.toLocaleString('en-IN')})`);
}

function triggerToast(message) {
  const toast = document.getElementById('amazonToast');
  const toastText = document.getElementById('toastText');
  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

// 4. Sidebar Drawer
function initSidebarDrawer() {
  const openBtn = document.getElementById('openSidebarBtn');
  const closeBtn = document.getElementById('closeSidebarBtn');
  const overlay = document.getElementById('sidebarOverlay');
  const sidebar = document.getElementById('sidebarMenu');

  function openMenu() {
    sidebar?.classList.add('active');
    overlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    sidebar?.classList.remove('active');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  openBtn?.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);
  overlay?.addEventListener('click', closeMenu);
}

// 5. Modals & Location Update
const locationBtn = document.getElementById('locationBtn');
const locationModal = document.getElementById('locationModal');
const loginModal = document.getElementById('loginModal');

locationBtn?.addEventListener('click', () => locationModal?.classList.add('active'));

function closeLocationModal() {
  locationModal?.classList.remove('active');
}

function applyPincode() {
  const pin = document.getElementById('pincodeInput').value.trim();
  if (pin.length === 6 && !isNaN(pin)) {
    const deliveringLabel = document.getElementById('deliveringTo');
    if (deliveringLabel) deliveringLabel.textContent = `Delivering to Indore ${pin}`;
    triggerToast(`Location updated to Indore ${pin}`);
    closeLocationModal();
  }
}

function openLoginModal() {
  loginModal?.classList.add('active');
}

function closeLoginModal() {
  loginModal?.classList.remove('active');
}

function handleLoginSubmit() {
  const email = document.getElementById('loginEmail').value.trim();
  if (email) {
    triggerToast(`Welcome back, ${email}!`);
    closeLoginModal();
  }
}

// 6. Search Autocomplete
const searchTerms = [
  'air conditioners 1.5 ton',
  'appliances for home',
  'boat earbuds wireless bluetooth',
  'dollar polo t-shirt for men',
  'headphones zebronics jbl',
  'kitchen knife set stainless steel',
  'sneakers under 599',
  'washing machines 7kg'
];

function initSearchAutocomplete() {
  const input = document.getElementById('searchInput');
  const box = document.getElementById('searchSuggestions');
  const btn = document.getElementById('searchSubmitBtn');

  input?.addEventListener('input', () => {
    const val = input.value.trim().toLowerCase();
    if (!val) {
      box.classList.remove('active');
      return;
    }
    const matches = searchTerms.filter(t => t.includes(val));
    if (matches.length) {
      box.innerHTML = matches.map(m => `
        <div class="suggestion-item" onclick="document.getElementById('searchInput').value='${m}'; document.getElementById('searchSuggestions').classList.remove('active');">
          🔍 ${m}
        </div>
      `).join('');
      box.classList.add('active');
    } else {
      box.classList.remove('active');
    }
  });

  btn?.addEventListener('click', () => {
    if (input.value.trim()) triggerToast(`Searching: "${input.value.trim()}"`);
  });
}

// 7. Live Stream Simulator
function initLiveStreamSimulator() {
  const watchBtn = document.getElementById('liveWatchBtn');
  let streaming = false;

  watchBtn?.addEventListener('click', () => {
    streaming = !streaming;
    watchBtn.innerHTML = streaming ? '⏸ Pause Stream' : '<span class="play-triangle">▶</span> Watch now';
    triggerToast(streaming ? 'Playing: Welcome to Asian Home & Living' : 'Stream paused');
  });
}

// 8. Back to Top
function initBackToTop() {
  document.getElementById('backToTopBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}