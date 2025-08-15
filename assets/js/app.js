
const $ = (q, root=document) => root.querySelector(q);
const $$ = (q, root=document) => Array.from(root.querySelectorAll(q));

// Product data (max 5)
const products = [
  { id: "cs-01", name: "Runner Flux", price: 599000, img: "assets/img/sneaker-1.svg" },
  { id: "cs-02", name: "Street Nova", price: 749000, img: "assets/img/sneaker-2.svg" },
  { id: "cs-03", name: "Court Ace",  price: 699000, img: "assets/img/sneaker-3.svg" },
  { id: "cs-04", name: "Trail Rift",  price: 829000, img: "assets/img/sneaker-4.svg" },
  { id: "cs-05", name: "Air Glide",   price: 659000, img: "assets/img/sneaker-5.svg" },
].slice(0,5);

const rupiah = (n) => new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', maximumFractionDigits:0 }).format(n);

// Render year
$("#year").textContent = new Date().getFullYear();

// Build slides
const slider = $("#productSlider");
products.forEach(p => {
  const slide = document.createElement("article");
  slide.className = "slide card product-card";
  slide.innerHTML = `
    <img src="${p.img}" alt="${p.name}" loading="lazy" />
    <div class="product-meta">
      <div>
        <h3 style="margin:0 0 2px">${p.name}</h3>
        <div class="price">${rupiah(p.price)}</div>
      </div>
      <div class="actions">
        <button class="btn" data-add="${p.id}">Tambah ke Keranjang</button>
        <button class="btn primary" data-buy="${p.id}">Beli</button>
      </div>
    </div>
  `;
  slider.appendChild(slide);
});

// Slider controls
const nextBtn = $("#nextBtn");
const prevBtn = $("#prevBtn");
const scrollAmount = () => slider.clientWidth * 0.9;

nextBtn.addEventListener("click", () => slider.scrollBy({ left: +scrollAmount(), behavior: "smooth" }));
prevBtn.addEventListener("click", () => slider.scrollBy({ left: -scrollAmount(), behavior: "smooth" }));

// Cart state
const CART_KEY = "chanshop_cart";
const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || "[]");
const setCart = (v) => localStorage.setItem(CART_KEY, JSON.stringify(v));
const cartCount = $("#cartCount");

function refreshCartCount(){
  const count = getCart().reduce((a,b)=> a + (b.qty || 1), 0);
  cartCount.textContent = count;
}
refreshCartCount();

// Add to cart + Buy
slider.addEventListener("click", (e) => {
  const addId = e.target.closest("[data-add]")?.getAttribute("data-add");
  const buyId = e.target.closest("[data-buy]")?.getAttribute("data-buy");
  if(addId){
    const cart = getCart();
    const found = cart.find(i => i.id === addId);
    if(found){ found.qty += 1; } else { cart.push({ id: addId, qty:1 }); }
    setCart(cart);
    refreshCartCount();
  }
  if(buyId){
    // Quick add then go to checkout
    const cart = getCart();
    const found = cart.find(i => i.id === buyId);
    if(found){ found.qty += 1; } else { cart.push({ id: buyId, qty:1 }); }
    setCart(cart);
    refreshCartCount();
    checkout();
  }
});

// Floating cart and checkout
$("#cartFab").addEventListener("click", openCart);
$("#checkoutBtn").addEventListener("click", checkout);

function openCart(){
  const cart = getCart();
  if(cart.length === 0){
    alert("Keranjang kosong. Yuk tambah produk dulu!");
    return;
  }
  const lines = cart.map(item => {
    const p = products.find(x => x.id === item.id);
    return `${p.name} x${item.qty} — ${rupiah(p.price * item.qty)}`;
  });
  alert("Keranjang Anda:\n\n" + lines.join("\n"));
}

function checkout(){
  const cart = getCart();
  if(cart.length === 0){
    alert("Keranjang kosong. Tambahkan produk dulu ya.");
    return;
  }
  const total = cart.reduce((sum, item) => {
    const p = products.find(x => x.id === item.id);
    return sum + (p.price * item.qty);
  }, 0);
  const message = encodeURIComponent(
    `Halo Chanshop, saya ingin checkout:\n` +
    cart.map(i => {
      const p = products.find(x => x.id === i.id);
      return `• ${p.name} x${i.qty} = ${rupiah(p.price * i.qty)}`;
    }).join("\n") +
    `\nTotal: ${rupiah(total)}\nAlamat toko: jl pertambana nomor 12`
  );
  // WhatsApp checkout (ganti nomor berikut bila ada)
  window.location.href = `https://wa.me/6281234567890?text=${message}`;
}

// Testimonials
const TESTI_KEY = "chanshop_testi";
const getTesti = () => JSON.parse(localStorage.getItem(TESTI_KEY) || "[]");
const setTesti = (v) => localStorage.setItem(TESTI_KEY, JSON.stringify(v));
const testiList = $("#testimonialList");
const testiForm = $("#testimonialForm");

function renderTesti(){
  testiList.innerHTML = "";
  const data = getTesti();
  if(data.length === 0){
    const empty = document.createElement("div");
    empty.className = "card";
    empty.textContent = "Belum ada testimoni. Jadilah yang pertama!";
    testiList.appendChild(empty);
    return;
  }
  for(const t of data){
    const el = document.createElement("article");
    el.className = "card";
    el.innerHTML = `<strong>${t.nama}</strong><p style="margin:.25rem 0 0; color:#334155">${t.pesan}</p>`;
    testiList.appendChild(el);
  }
}
renderTesti();

testiForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(testiForm);
  const nama = String(fd.get("nama")).trim().slice(0, 48);
  const pesan = String(fd.get("pesan")).trim().slice(0, 400);
  if(!nama || !pesan){ return; }
  const data = getTesti();
  data.unshift({ nama, pesan, at: Date.now() });
  setTesti(data.slice(0, 50)); // keep last 50
  testiForm.reset();
  renderTesti();
  alert("Terima kasih atas testimoninya!");
});
