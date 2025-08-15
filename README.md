
# Chanshop — Toko Sepatu (Static Site)

Stack: HTML + CSS + JavaScript murni (siap untuk GitHub Pages).  
Fitur:
- Slider produk terlaris (maks 5 item)
- Tombol "Tambah ke Keranjang" dan "Checkout"
- Alamat toko: jl pertambana nomor 12
- Input & daftar testimoni pelanggan (disimpan di localStorage)
- Desain responsif, skema warna baby blue & broken white

## Struktur Folder
.
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── img/
│   │   ├── sneaker-1.svg … sneaker-5.svg
│   │   └── sneaker-hero.svg
│   └── js/
│       └── app.js
└── index.html

## Cara Jalankan Lokal
Cukup buka `index.html` di browser.

## Deploy ke GitHub Pages
1. Buat repository baru bernama `chanshop` (atau nama lain).
2. Upload semua file/folder ini ke repository tersebut.
3. Di Settings → Pages → pilih **Deploy from a branch**, lalu branch `main`, folder `/ (root)`.
4. Tunggu hingga Pages aktif, situs akan tersedia di `https://USERNAME.github.io/REPO`.

## Catatan
- Ubah nomor WhatsApp untuk checkout di `assets/js/app.js` (cari `wa.me/6281234567890`).
- Semua gambar adalah SVG ringan sehingga mudah di-host di Pages.
