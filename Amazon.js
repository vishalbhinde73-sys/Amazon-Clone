document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // Persistent State
  let cartCount = parseInt(localStorage.getItem("amazon_clone_cart_count") || "0", 10);
  let savedPincode = localStorage.getItem("amazon_clone_pincode") || "464993";
  let savedCity = localStorage.getItem("amazon_clone_city") || "Bhopal";

  // DOM Elements
  const backdrop = document.getElementById("backdrop");
  const sidebar = document.getElementById("sidebar");
  const openSidebarBtn = document.getElementById("open-sidebar-btn");
  const mobileSidebarBtn = document.getElementById("mobile-sidebar-btn");
  const closeSidebarBtn = document.getElementById("close-sidebar-btn");

  const locationModal = document.getElementById("location-modal");
  const locationTrigger = document.getElementById("location-trigger");
  const mobileLocationTrigger = document.getElementById("mobile-location-trigger");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const applyPincodeBtn = document.getElementById("apply-pincode-btn");
  const pincodeInput = document.getElementById("pincode-input");
  const pincodeStatus = document.getElementById("pincode-status");
  const currentPincode = document.getElementById("current-pincode");
  const currentCity = document.getElementById("current-city");
  const mobilePincode = document.getElementById("mobile-pincode");
  const mobileCity = document.getElementById("mobile-city");

  const cartCountEl = document.getElementById("cart-count");
  const toast = document.getElementById("toast");
  const backToTopBtn = document.getElementById("back-to-top-btn");

  // Hydrate UI with saved values
  if (cartCountEl) cartCountEl.textContent = cartCount;
  if (currentPincode) currentPincode.textContent = savedPincode;
  if (currentCity) currentCity.textContent = savedCity;
  if (mobilePincode) mobilePincode.textContent = savedPincode;
  if (mobileCity) mobileCity.textContent = savedCity;

  // Toast Notifications
  let toastTimeout = null;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  }

  // Hero Carousel Slider
  const heroContainer = document.getElementById("hero-carousel");
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

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      startSlideShow();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      startSlideShow();
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      startSlideShow();
    });
  });

  if (heroContainer) {
    heroContainer.addEventListener("mouseenter", stopSlideShow);
    heroContainer.addEventListener("mouseleave", startSlideShow);

    // Touch Swipe Support on Mobile Screens
    let touchStartX = 0;
    let touchEndX = 0;

    heroContainer.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopSlideShow();
    }, { passive: true });

    heroContainer.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) {
        nextSlide();
      } else if (touchEndX - touchStartX > 50) {
        prevSlide();
      }
      startSlideShow();
    }, { passive: true });

    startSlideShow();
  }

  // Horizontal Shelves Scrollers
  document.querySelectorAll(".shelf-section").forEach((section) => {
    const carousel = section.querySelector(".shelf-carousel");
    const prev = section.querySelector(".shelf-prev");
    const next = section.querySelector(".shelf-next");

    if (carousel && prev && next) {
      const scrollStep = 320;
      next.addEventListener("click", () => carousel.scrollBy({ left: scrollStep, behavior: "smooth" }));
      prev.addEventListener("click", () => carousel.scrollBy({ left: -scrollStep, behavior: "smooth" }));
    }
  });

  // Sidebar Controls
  function openSidebar() {
    if (sidebar) sidebar.classList.add("active");
    if (backdrop) backdrop.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove("active");
    if (backdrop && !locationModal.classList.contains("active")) {
      backdrop.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  if (openSidebarBtn) openSidebarBtn.addEventListener("click", openSidebar);
  if (mobileSidebarBtn) mobileSidebarBtn.addEventListener("click", openSidebar);
  if (closeSidebarBtn) closeSidebarBtn.addEventListener("click", closeSidebar);

  // Location Modal Controls
  function openLocationModal() {
    if (locationModal) locationModal.classList.add("active");
    if (backdrop) backdrop.classList.add("active");
    if (pincodeInput) {
      pincodeInput.value = savedPincode;
      setTimeout(() => pincodeInput.focus(), 100);
    }
    document.body.style.overflow = "hidden";
  }

  function closeLocationModal() {
    if (locationModal) locationModal.classList.remove("active");
    if (backdrop && !sidebar.classList.contains("active")) {
      backdrop.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  if (locationTrigger) locationTrigger.addEventListener("click", openLocationModal);
  if (mobileLocationTrigger) mobileLocationTrigger.addEventListener("click", openLocationModal);
  if (closeModalBtn) closeModalBtn.addEventListener("click", closeLocationModal);

  // Close when tapping backdrop or pressing ESC
  if (backdrop) {
    backdrop.addEventListener("click", () => {
      closeSidebar();
      closeLocationModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeSidebar();
      closeLocationModal();
    }
  });

  // Pincode Update Logic
  function updatePincode() {
    const pin = pincodeInput.value.trim();
    if (/^\d{6}$/.test(pin)) {
      savedPincode = pin;
      localStorage.setItem("amazon_clone_pincode", pin);

      if (currentPincode) currentPincode.textContent = pin;
      if (mobilePincode) mobilePincode.textContent = pin;

      showToast(`Delivery location updated to PIN ${pin}`);
      closeLocationModal();
    } else if (pincodeStatus) {
      pincodeStatus.textContent = "Please enter a valid 6-digit Indian PIN code.";
      pincodeStatus.style.color = "#cc0c39";
    }
  }

  if (applyPincodeBtn && pincodeInput) {
    applyPincodeBtn.addEventListener("click", updatePincode);
    pincodeInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") updatePincode();
    });
  }

  // Add to Cart
  document.querySelectorAll(".btn-add-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const title = e.currentTarget.getAttribute("data-title") || "Item";
      const price = e.currentTarget.getAttribute("data-price") || "0";

      cartCount++;
      localStorage.setItem("amazon_clone_cart_count", cartCount.toString());

      if (cartCountEl) {
        cartCountEl.textContent = cartCount;
        cartCountEl.style.transform = "scale(1.5)";
        setTimeout(() => {
          cartCountEl.style.transform = "scale(1)";
        }, 220);
      }

      showToast(`Added "${title}" (₹${price}) to your cart!`);
    });
  });

  // Search Action
  const searchBtn = document.getElementById("search-btn");
  const searchInput = document.getElementById("search-input");
  const searchSelect = document.getElementById("search-select");

  function triggerSearch() {
    const query = searchInput ? searchInput.value.trim() : "";
    const category = searchSelect ? searchSelect.value : "all";

    if (query) {
      showToast(`Searching for "${query}" in ${category.toUpperCase()}...`);
    } else if (searchInput) {
      searchInput.focus();
    }
  }

  if (searchBtn) searchBtn.addEventListener("click", triggerSearch);
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") triggerSearch();
    });
  }

  // Smooth Back to Top
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});