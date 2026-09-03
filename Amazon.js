document.addEventListener("DOMContentLoaded", () => {
  let cartCount = 0;

  // Modals & Sidebar
  const backdrop = document.getElementById("backdrop");
  const sidebar = document.getElementById("sidebar");
  const openSidebarBtn = document.getElementById("open-sidebar-btn");
  const closeSidebarBtn = document.getElementById("close-sidebar-btn");
  const locationModal = document.getElementById("location-modal");
  const locationTrigger = document.getElementById("location-trigger");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const applyPincodeBtn = document.getElementById("apply-pincode-btn");
  const pincodeInput = document.getElementById("pincode-input");
  const currentPincode = document.getElementById("current-pincode");

  const cartCountEl = document.getElementById("cart-count");
  const toast = document.getElementById("toast");
  const backToTopBtn = document.getElementById("back-to-top-btn");

  // Hero Carousel
  const slides = document.querySelectorAll(".carousel-slide");
  const dots = document.querySelectorAll(".carousel-dots .dot");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");
  let currentSlideIndex = 0;
  let slideInterval = null;

  function showSlide(index) {
    slides.forEach((slide, i) => slide.classList.toggle("current-slide", i === index));
    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
    currentSlideIndex = index;
  }

  function nextSlide() {
    showSlide((currentSlideIndex + 1) % slides.length);
  }

  function prevSlide() {
    showSlide((currentSlideIndex - 1 + slides.length) % slides.length);
  }

  function startSlideShow() {
    stopSlideShow();
    slideInterval = setInterval(nextSlide, 5000);
  }

  function stopSlideShow() {
    if (slideInterval) clearInterval(slideInterval);
  }

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener("click", () => { nextSlide(); startSlideShow(); });
    prevBtn.addEventListener("click", () => { prevSlide(); startSlideShow(); });
    dots.forEach((dot, idx) => dot.addEventListener("click", () => { showSlide(idx); startSlideShow(); }));
    startSlideShow();
  }

  // Shelf Scroller
  document.querySelectorAll(".shelf-section").forEach((section) => {
    const carousel = section.querySelector(".shelf-carousel");
    const prev = section.querySelector(".shelf-prev");
    const next = section.querySelector(".shelf-next");
    if (carousel && prev && next) {
      next.addEventListener("click", () => carousel.scrollBy({ left: 300, behavior: "smooth" }));
      prev.addEventListener("click", () => carousel.scrollBy({ left: -300, behavior: "smooth" }));
    }
  });

  // Sidebar Controls
  if (openSidebarBtn) {
    openSidebarBtn.addEventListener("click", () => {
      sidebar.classList.add("active");
      backdrop.classList.add("active");
    });
  }

  if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener("click", () => {
      sidebar.classList.remove("active");
      backdrop.classList.remove("active");
    });
  }

  // Location Modal
  if (locationTrigger) {
    locationTrigger.addEventListener("click", () => {
      locationModal.classList.add("active");
      backdrop.classList.add("active");
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      locationModal.classList.remove("active");
      backdrop.classList.remove("active");
    });
  }

  if (backdrop) {
    backdrop.addEventListener("click", () => {
      sidebar?.classList.remove("active");
      locationModal?.classList.remove("active");
      backdrop.classList.remove("active");
    });
  }

  if (applyPincodeBtn && pincodeInput) {
    applyPincodeBtn.addEventListener("click", () => {
      const pin = pincodeInput.value.trim();
      if (pin.length === 6 && !isNaN(pin)) {
        currentPincode.textContent = pin;
        showToast(`Delivery location updated to ${pin}`);
        locationModal.classList.remove("active");
        backdrop.classList.remove("active");
      }
    });
  }

  // Add to Cart
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
  }

  document.querySelectorAll(".btn-add-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const title = e.currentTarget.getAttribute("data-title") || "Item";
      const price = e.currentTarget.getAttribute("data-price") || "0";
      cartCount++;
      if (cartCountEl) cartCountEl.textContent = cartCount;
      showToast(`Added "${title}" (₹${price}) to cart!`);
    });
  });

  // Back to Top
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});