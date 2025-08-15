// ====== Utility ======
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
const money = (n) => new Intl.NumberFormat('id-ID').format(n);

// ====== State ======
const CART_KEY = 'chanshop_cart_v1';
const TESTI_KEY = 'chanshop_testimonials_v1';

const state = {
  cart: JSON.parse(localStorage.getItem(CART_KEY) || '[]'),
  testimonials: JSON.parse(localStorage.getItem(TESTI_KEY) || 'null') || STARTER_TESTIMONIALS
};

function saveCart() { localStorage.setItem(CART_KEY, JSON.stringify(state.cart)); }
function saveTestimonials() { localStorage.setItem(TESTI_KEY, JSON.stringify(state.testimonials)); }

// ====== Products Slider ======
function renderProducts() {
  const ul = $('#productSlides');
  ul.innerHTML = '';
  PRODUCTS.slice(0, 5).forEach(p => {
    const li = document.createElement('li');
    li.className = 'card product';
    li.innerHTML = `
      <div class="cover"><img src="${p.image}" alt="${p.name}" loading="lazy"></div>
      <h3>${p.name}</h3>
      <div class="price"><span class="now">Rp ${money(p.price)}</span> <span class="was">Rp ${money(p.was)}</span></div>
      <div class="actions">
        <button class="btn" data-add="${p.id}">+ Keranjang</button>
        <button class="btn primary" data-buy="${p.id}">Checkout</button>
      </div>
    `;
    ul.appendChild(li);
  });
}

let slideIndex = 0;
function moveSlider(dir) {
  const ul = $('#productSlides');
  const total = ul.children.length;
  slideIndex = (slideIndex + dir + total) % total;
  const width = ul.children[0].getBoundingClientRect().width + 16;
  ul.style.transform = `translateX(${-slideIndex * width}px)`;
}
function autoSlide() { moveSlider(1); }
let autoTimer;

// ====== Cart ======
function addToCart(id, qty = 1) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  const line = state.cart.find(i => i.id === id);
  if (line) line.qty += qty; else state.cart.push({ id, qty, price: product.price });
  saveCart();
  updateCartBadge();
  renderCart();
}

function setQty(id, qty) {
  const line = state.cart.find(i => i.id === id);
  if (!line) return;
  line.qty = Math.max(1, qty);
  saveCart();
  renderCart();
}

function removeFromCart(id) {
  state.cart = state.cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
  updateCartBadge();
}

function getCartTotal() {
  return state.cart.reduce((sum, i) => sum + i.qty * i.price, 0);
}

function updateCartBadge() {
  const totalQty = state.cart.reduce((sum, i) => sum + i.qty, 0);
  const el = $('#cartCount');
  if (el) el.textContent = totalQty;
}

// ====== Cart Drawer UI ======
function renderCart() {
  const wrap = $('#cartItems');
  if (!wrap) return; // on checkout page may be absent
  wrap.innerHTML = '';

  if (state.cart.length === 0) {
    wrap.innerHTML = '<p>Keranjang kosong.</p>';
  } else {
    state.cart.forEach(i => {
      const p = PRODUCTS.find(p => p.id === i.id);
      const line = document.createElement('div');
      line.className = 'cart-line';
      line.innerHTML = `
        <img src="${p.image}" alt="" width="64" height="48">
        <div>
          <div><strong>${p.name}</strong></div>
          <div>Rp ${money(p.price)}</div>
          <div class="qty mt">
            <button data-dec="${i.id}" aria-label="Kurangi">-</button>
            <input type="number" min="1" value="${i.qty}" data-qty="${i.id}" aria-label="Jumlah">
            <button data-inc="${i.id}" aria-label="Tambah">+</button>
          </div>
        </div>
        <button class="icon-btn" data-remove="${i.id}" aria-label="Hapus item">&times;</button>
      `;
      wrap.appendChild(line);
    });
  }
  const totalEl = $('#cartTotal');
  if (totalEl) totalEl.textContent = 'Rp ' + money(getCartTotal());
}

function openCart() {
  $('#cartDrawer')?.classList.add('active');
  $('#cartDrawer')?.setAttribute('aria-hidden', 'false');
}
function closeCart() {
  $('#cartDrawer')?.classList.remove('active');
  $('#cartDrawer')?.setAttribute('aria-hidden', 'true');
}

// ====== Testimonials ======
function renderTestimonials() {
  const box = $('#testimonialList');
  if (!box) return;
  box.innerHTML = '';
  state.testimonials.forEach(t => {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    const initials = t.name.trim().split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase();
    const stars = '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating);
    card.innerHTML = `
      <div class="avatar" aria-hidden="true">${initials}</div>
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;gap:.5rem;">
          <strong>${t.name}</strong>
          <span aria-label="Rating ${t.rating} dari 5">${stars}</span>
        </div>
        <p>${t.message}</p>
        <small>${new Date(t.date || Date.now()).toLocaleDateString('id-ID')}</small>
      </div>
    `;
    box.appendChild(card);
  });
}

// ====== Forms ======
function hookForms() {
  // Add to cart & checkout
  document.body.addEventListener('click', (e) => {
    const addBtn = e.target.closest('[data-add]');
    const buyBtn = e.target.closest('[data-buy]');
    const inc = e.target.closest('[data-inc]');
    const dec = e.target.closest('[data-dec]');
    const qty = e.target.closest('[data-qty]');
    const rem = e.target.closest('[data-remove]');

    if (addBtn) { addToCart(addBtn.dataset.add); updateCartBadge(); renderCart(); }
    if (buyBtn) { addToCart(buyBtn.dataset.buy); openCart(); }
    if (inc) { const id = inc.dataset.inc; const line = state.cart.find(i=>i.id===id); setQty(id, (line?.qty||1) + 1); }
    if (dec) { const id = dec.dataset.dec; const line = state.cart.find(i=>i.id===id); setQty(id, Math.max(1, (line?.qty||1) - 1)); }
    if (rem) { removeFromCart(rem.dataset.remove); }
  });

  // Quantity direct input
  document.body.addEventListener('input', (e) => {
    const qty = e.target.closest('[data-qty]');
    if (qty) setQty(qty.dataset.qty, parseInt(qty.value || '1', 10));
  });

  // Testimonial form
  $('#testimonialForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    state.testimonials.unshift({
      name: data.name, rating: parseInt(data.rating,10), message: data.message, date: new Date().toISOString()
    });
    saveTestimonials();
    form.reset();
    renderTestimonials();
    form.querySelector('button[type=submit]').disabled = true;
    setTimeout(()=>{ form.querySelector('button[type=submit]').disabled = false; }, 800);
  });

  // Kritik & saran
  $('#feedbackForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = $('#feedbackStatus');
    status.textContent = 'Terima kasih! Masukan kamu sudah kami terima.';
    e.currentTarget.reset();
  });

  // Checkout page form
  $('#checkoutForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (state.cart.length === 0) {
      $('#orderStatus').textContent = 'Keranjang kamu masih kosong.';
      return;
    }
    $('#orderStatus').textContent = 'Pesanan dibuat! Cek email/WA untuk konfirmasi (simulasi).';
    // clear cart on success
    state.cart = [];
    saveCart();
    renderSummary();
  });
}

// ====== Page Init ======
function init() {
  // Year footer
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  // Products & slider
  if ($('#productSlides')) {
    renderProducts();
    autoTimer = setInterval(autoSlide, 3500);
    $('#nextBtn').addEventListener('click', () => moveSlider(1));
    $('#prevBtn').addEventListener('click', () => moveSlider(-1));
  }

  // Cart drawer
  $('#cartBtn')?.addEventListener('click', openCart);
  $('#closeCart')?.addEventListener('click', closeCart);
  $('#cartBackdrop')?.addEventListener('click', closeCart);

  // Cart
  updateCartBadge();
  renderCart();

  // Testimonials
  renderTestimonials();

  // Checkout page summary
  renderSummary();

  // Forms
  hookForms();
}

function renderSummary() {
  const box = $('#summaryItems');
  if (!box) return;
  box.innerHTML = '';
  if (state.cart.length === 0) {
    box.innerHTML = '<p>Keranjang kosong.</p>';
  } else {
    state.cart.forEach(i => {
      const p = PRODUCTS.find(p => p.id === i.id);
      const row = document.createElement('div');
      row.className = 'cart-line';
      row.innerHTML = `
        <img src="${p.image}" alt="" width="64" height="48">
        <div><strong>${p.name}</strong><div>Rp ${money(p.price)} × ${i.qty}</div></div>
        <div>Rp ${money(p.price * i.qty)}</div>
      `;
      box.appendChild(row);
    });
  }
  const totalEl = $('#summaryTotal'); if (totalEl) totalEl.textContent = 'Rp ' + money(getCartTotal());
}

document.addEventListener('DOMContentLoaded', init);
