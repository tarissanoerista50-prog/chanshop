
// ------------ Data Produk (maksimal 5) ------------
const STORE_NAME = "chanshop";
const STORE_PHONE = ""; // isi nomor WhatsApp toko, contoh: "6281234567890"
const CURRENCY = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

const PRODUCTS = [
  { id: "s1", name: "Aero Knit Runner", price: 359000, img: "assets/images/shoe1.svg" },
  { id: "s2", name: "CloudFlex 2.0", price: 419000, img: "assets/images/shoe2.svg" },
  { id: "s3", name: "Stride Pro", price: 299000, img: "assets/images/shoe3.svg" },
  { id: "s4", name: "Street Mono", price: 329000, img: "assets/images/shoe4.svg" },
  { id: "s5", name: "Volt Lite", price: 389000, img: "assets/images/shoe5.svg" },
];

// ------------ Helpers ------------
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
const ls = {
  get: (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  set: (key, val) => localStorage.setItem(key, JSON.stringify(val))
};

// ------------ Render Produk + Carousel ------------
function renderProducts(){
  const track = $("#carouselTrack");
  track.innerHTML = "";
  PRODUCTS.slice(0,5).forEach(p => {
    const card = document.createElement("article");
    card.className = "card product-card";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}"/>
      <h3 class="title">${p.name}</h3>
      <div class="muted">Ringan · Empuk · Trendy</div>
      <div class="product-actions">
        <span class="price">${CURRENCY.format(p.price)}</span>
        <button class="btn primary" data-add="${p.id}">+ Keranjang</button>
      </div>
    `;
    track.appendChild(card);
  });

  // carousel buttons
  const prev = $("#prevSlide"), next = $("#nextSlide");
  let scrollAmount = 0;
  next.onclick = () => track.scrollBy({left: track.clientWidth*0.9, behavior:"smooth"});
  prev.onclick = () => track.scrollBy({left: -track.clientWidth*0.9, behavior:"smooth"});
}
renderProducts();

// ------------ Keranjang ------------
const CART_KEY = "cart_"+STORE_NAME;
function getCart(){ return ls.get(CART_KEY, []); }
function setCart(items){ ls.set(CART_KEY, items); updateCartBadge(); renderCart(); }

function addToCart(id){
  const items = getCart();
  const found = items.find(it => it.id === id);
  if(found) found.qty += 1;
  else{
    const p = PRODUCTS.find(x => x.id === id);
    items.push({ id: p.id, name: p.name, price: p.price, img: p.img, qty: 1 });
  }
  setCart(items);
}

function removeFromCart(id){
  const items = getCart().filter(x => x.id !== id);
  setCart(items);
}

function changeQty(id, delta){
  const items = getCart();
  const it = items.find(x => x.id === id);
  if(!it) return;
  it.qty += delta;
  if(it.qty <= 0) return removeFromCart(id);
  setCart(items);
}

function cartTotal(){
  return getCart().reduce((s,x)=> s + x.price*x.qty, 0);
}

function updateCartBadge(){
  const count = getCart().reduce((s,x)=> s + x.qty, 0);
  $("#cartCount").textContent = count;
}
updateCartBadge();

function renderCart(){
  const wrap = $("#cartItems");
  wrap.innerHTML = "";
  const items = getCart();
  if(items.length === 0){
    wrap.innerHTML = `<p class="muted">Keranjang masih kosong.</p>`;
  } else {
    items.forEach(it => {
      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <img src="${it.img}" alt="${it.name}"/>
        <div class="meta">
          <div><strong>${it.name}</strong></div>
          <div class="muted">${CURRENCY.format(it.price)} × ${it.qty}</div>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <button class="btn ghost" data-dec="${it.id}">–</button>
          <button class="btn ghost" data-inc="${it.id}">+</button>
          <button class="btn ghost" data-del="${it.id}" aria-label="Hapus">🗑</button>
        </div>
      `;
      wrap.appendChild(row);
    });
  }
  $("#cartTotal").textContent = CURRENCY.format(cartTotal());
}
renderCart();

// drawer open/close
const cartDrawer = $("#cartDrawer");
$("#cartButton").onclick = () => { cartDrawer.classList.add("open"); cartDrawer.setAttribute("aria-hidden", "false"); };
$("#closeCart").onclick = () => { cartDrawer.classList.remove("open"); cartDrawer.setAttribute("aria-hidden", "true"); };

// global clicks
document.addEventListener("click", (e)=>{
  const add = e.target.closest("[data-add]");
  const inc = e.target.closest("[data-inc]");
  const dec = e.target.closest("[data-dec]");
  const del = e.target.closest("[data-del]");
  if(add){ addToCart(add.dataset.add); }
  if(inc){ changeQty(inc.dataset.inc, +1); }
  if(dec){ changeQty(dec.dataset.dec, -1); }
  if(del){ removeFromCart(del.dataset.del); }
});

// checkout
$("#checkoutBtn").onclick = () => {
  const items = getCart();
  if(items.length === 0) return alert("Keranjang kosong.");
  const lines = items.map(it => `• ${it.name} x${it.qty} = ${CURRENCY.format(it.price*it.qty)}`).join("%0A");
  const total = CURRENCY.format(cartTotal());
  const msg = `Halo ${STORE_NAME}!%0ASaya ingin checkout:%0A${lines}%0ATotal: ${total}%0ANama: (isi nama Anda)%0AAlamat: (isi alamat)%0AMetode bayar: (COD/Transfer)`;
  if(STORE_PHONE){
    const wa = `https://wa.me/${STORE_PHONE}?text=${msg}`;
    window.open(wa, "_blank");
  }else{
    alert("Link WhatsApp belum diset. Edit STORE_PHONE di assets/js/app.js untuk mengaktifkan checkout WA.\\n\\nPesan yang akan dikirim:\\n\\n" + decodeURIComponent(msg));
  }
};

// ------------ Testimoni ------------
const TESTI_KEY = "testi_"+STORE_NAME;
const defaultTestimonials = [
  { name:"Alya", rating:5, message:"Nyaman banget dipakai jalan jauh. Packing rapi." },
  { name:"Bimo", rating:4, message:"Modelnya keren, size pas. Pengiriman cepat juga." },
  { name:"Salsa", rating:5, message:"Ringan dan empuk! Worth the price." },
];

function getTestimonials(){
  return ls.get(TESTI_KEY, defaultTestimonials);
}
function setTestimonials(list){
  ls.set(TESTI_KEY, list);
  renderTestimonials();
}

function renderTestimonials(){
  const list = $("#testimonialList");
  list.innerHTML = "";
  getTestimonials().forEach(t => {
    const card = document.createElement("div");
    card.className = "card testi-card";
    const stars = "★".repeat(t.rating) + "☆".repeat(5 - t.rating);
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center">
        <strong>${t.name}</strong>
        <span class="stars" aria-label="Rating ${t.rating} dari 5">${stars}</span>
      </div>
      <p style="margin:0">${t.message}</p>
    `;
    list.appendChild(card);
  });
}
renderTestimonials();

$("#testimonialForm").addEventListener("submit", e => {
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  const entry = {
    name: fd.get("name").toString().trim(),
    rating: Math.max(1, Math.min(5, parseInt(fd.get("rating"), 10) || 5)),
    message: fd.get("message").toString().trim(),
  };
  if(!entry.name || !entry.message) return;
  const list = getTestimonials();
  list.unshift(entry);
  setTestimonials(list);
  e.currentTarget.reset();
  alert("Terima kasih! Testimoni Anda ditambahkan.");
});

// ------------ Kritik & Saran ------------
const FEEDBACK_KEY = "feedback_"+STORE_NAME;
$("#feedbackForm").addEventListener("submit", e => {
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  const entry = {
    name: fd.get("name").toString().trim(),
    email: fd.get("email").toString().trim(),
    message: fd.get("message").toString().trim(),
    at: new Date().toISOString()
  };
  const all = ls.get(FEEDBACK_KEY, []);
  all.unshift(entry);
  ls.set(FEEDBACK_KEY, all);
  e.currentTarget.reset();
  alert("Terima kasih atas masukannya!");
});

// footer year
$("#year").textContent = new Date().getFullYear();
