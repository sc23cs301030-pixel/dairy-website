// ===============================
// AUTH CHECK
// ===============================
if ((!localStorage.getItem("userName") || !localStorage.getItem("userPassword")) && !window.location.href.includes("login.html")) {
  window.location.href = "login.html";
}

// ===============================
// GLOBAL DATA
// ===============================
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const selectedVariant = {};

// ===============================
// MOBILE MENU
// ===============================
function toggleMenu() {
  const nav = document.getElementById("mainNav");
  nav.classList.toggle("active");
}

// ===============================
// HEADER SCROLL EFFECT
// ===============================
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// ===============================
// RIPPLE EFFECT
// ===============================
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("ripple")) {
    const btn = e.target;
    const ripple = document.createElement("span");
    ripple.classList.add("ripple-effect");
    
    const size = Math.max(btn.offsetWidth, btn.offsetHeight);
    const x = e.pageX - btn.offsetLeft;
    const y = e.pageY - btn.offsetTop;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x - size / 2}px`;
    ripple.style.top = `${y - size / 2}px`;

    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }
});

// ===============================
// ADVANCED INTERSECTION OBSERVER
// ===============================
const revealOnScroll = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
}, { threshold: 0.1 });

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  renderCart();

  // Observe all reveal elements
  document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right").forEach(el => {
    revealOnScroll.observe(el);
  });

  // Observe cards specifically for staggered reveal
  const cards = document.querySelectorAll(".card");
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
    revealOnScroll.observe(card);
  });

  // Stats Counter Observer
  const statsSection = document.querySelector(".stats");
  if (statsSection) {
    const counterObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        runCounter();
        counterObserver.unobserve(statsSection);
      }
    }, { threshold: 0.5 });
    counterObserver.observe(statsSection);
  }
});

// ===============================
// PRODUCT VARIANT
// ===============================
function selectVariant(key, select) {
  const option = select.options[select.selectedIndex];
  selectedVariant[key] = {
    weight: option.value,
    price: Number(option.dataset.price)
  };
  document.getElementById("price-" + key).innerText = option.dataset.price;
}

// ===============================
// ADD TO CART
// ===============================
function addToCart(name, key) {
  const v = selectedVariant[key] || { weight: "default", price: 0 };
  const fullName = `${name} (${v.weight})`;

  const item = cart.find(i => i.name === fullName);
  if (item) {
    item.qty++;
  } else {
    cart.push({
      name: fullName,
      price: v.price,
      qty: 1
    });
  }

  saveCart();
  renderCart();
  shakeCart();
  
  // Show a small toast or feedback
  const btn = event.target;
  const originalText = btn.innerText;
  btn.innerText = "Added! ✓";
  btn.style.background = "#4CAF50";
  setTimeout(() => {
    btn.innerText = originalText;
    btn.style.background = "";
  }, 1000);
}

function shakeCart() {
  const floatingCart = document.querySelector(".floating-cart");
  floatingCart.classList.add("shake");
  setTimeout(() => floatingCart.classList.remove("shake"), 400);
}

// ===============================
// RENDER CART
// ===============================
function renderCart() {
  const box = document.getElementById("cartItems");
  const totalEl = document.getElementById("total");
  if (!box || !totalEl) return;

  let total = 0;
  box.innerHTML = "";

  cart.forEach((item, i) => {
    total += item.price * item.qty;
    box.innerHTML += `
      <div class="cart-item" style="animation-delay: ${i * 0.1}s">
        <div>
          <strong>${item.name}</strong><br>
          ₹${item.price} × ${item.qty}
        </div>
        <button onclick="removeItem(${i})">✕</button>
      </div>
    `;
  });

  totalEl.innerText = total;
}

// ===============================
// REMOVE ITEM
// ===============================
function removeItem(i) {
  const itemEl = document.querySelectorAll(".cart-item")[i];
  if (itemEl) {
    itemEl.style.transform = "translateX(50px)";
    itemEl.style.opacity = "0";
    setTimeout(() => {
      cart.splice(i, 1);
      saveCart();
      renderCart();
    }, 300);
  } else {
    cart.splice(i, 1);
    saveCart();
    renderCart();
  }
}

// ===============================
// SAVE CART
// ===============================
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ===============================
// WHATSAPP ORDER
// ===============================
function sendWhatsApp() {
  if (!cart.length) {
    alert("Cart is empty");
    return;
  }

  const name = localStorage.getItem("userName");
  const phone = localStorage.getItem("userPhone");
  const location = localStorage.getItem("userLocation");

  let total = 0;
  cart.forEach(item => total += item.price * item.qty);

  let msg = `🧾 *New Order from Krishna Dairy*\n\n`;
  msg += `*Name:* ${name}\n`;
  msg += `*Location:* ${location}\n\n`;
  msg += `*Items:*\n`;
  cart.forEach(i => {
    msg += `• ${i.name} × ${i.qty} = ₹${i.price * i.qty}\n`;
  });
  msg += `\n*Total Amount:* ₹${total}`;

  window.open(
    `https://wa.me/+919407156211?text=${encodeURIComponent(msg)}`,
    "_blank"
  );

  cart = [];
  localStorage.removeItem("cart");
  renderCart();
  toggleCart();
}

// ===============================
// UI HELPERS
// ===============================
function toggleCart() {
  const cartEl = document.querySelector(".cart");
  cartEl.classList.toggle("active");
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

// ===============================
// COUNTER ANIMATION
// ===============================
function runCounter() {
  const counters = document.querySelectorAll(".counter");
  counters.forEach(counter => {
    const target = +counter.dataset.target;
    let count = 0;
    const speed = 2000 / target;

    const updateCount = () => {
      const increment = target / 200;
      if (count < target) {
        count += increment;
        counter.innerText = Math.ceil(count);
        setTimeout(updateCount, 1);
      } else {
        counter.innerText = target;
      }
    };
    updateCount();
  });
}

function requestAICall() {
  const phone = localStorage.getItem("userPhone");
  if (!phone) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }
  const RETELL_URL = "https://dashboard.retellai.com/agents/agent_de3ac26d698d0d27fb99369c3e";
  alert("📞 हमारा AI आपको अभी कॉल करेगा");
  window.open(RETELL_URL, "_blank");
}
