// ===== PENGATURAN: ganti sesuai studi kasus / toko =====
// Nomor WhatsApp: format internasional tanpa +, spasi, atau tanda hubung (contoh '6281234567890').
const NOMOR_WA = '628813731619';
const NOMOR_CONTOH = '6281234567890'; // jangan diubah; mendeteksi nomor yang belum diisi

// Daftar produk. Foto disimpan di folder assets/images.
const produk = [
  { nama: 'Jersey Persija Spesial HUT 97',            kategori: 'Jersey',    harga: 600000,  gambar: 'assets/images/Image_Jersey1.jpeg' },
  { nama: 'Jersey Away Pendekar United 2022',         kategori: 'Jersey',    harga: 250000,  gambar: 'assets/images/Image_Jersey2.jpeg' },
  { nama: 'Jersey Spesial Edition FC Barcelona 2025', kategori: 'Jersey',    harga: 1000000, gambar: 'assets/images/Image_Jersey3.jpeg' },
  { nama: 'Jersey Retro Classic Persija 1994',        kategori: 'Jersey',    harga: 1500000, gambar: 'assets/images/Image_Jersey4.jpeg' },
  { nama: 'Jersey Home Arsenal 2025',                 kategori: 'Jersey',    harga: 400000,  gambar: 'assets/images/Image_Jersey5.jpeg' },
  { nama: 'Sepatu Futsal Zevma Veloxcis',             kategori: 'Sepatu',    harga: 200000,  gambar: 'assets/images/Image_Sepatu1.jpeg' },
  { nama: 'Sepatu Bola Lycan Thundra',                kategori: 'Sepatu',    harga: 300000,  gambar: 'assets/images/Image_Sepatu2.jpeg' },
  { nama: 'Sepatu Running Zevma Xazi Speed .1',       kategori: 'Sepatu',    harga: 199000,  gambar: 'assets/images/Image_Sepatu3.jpeg' },
  { nama: 'Deker Sepak Bola',                         kategori: 'Deker',     harga: 150000,  gambar: 'assets/images/Image_Deker1.jpeg' },
  { nama: 'Kaos Kaki Sepak Bola Soxpro Pendek',       kategori: 'Kaos Kaki', harga: 50000,   gambar: 'assets/images/Image_KaosKaki1.jpeg' }
];

// Pilihan ukuran per kategori. Kategori yang tidak tercantum memakai UKURAN_DEFAULT.
const UKURAN_DEFAULT = ['S', 'M', 'L', 'XL'];
const UKURAN_KATEGORI = {
  'Sepatu': ['39', '40', '41', '42', '43', '44', '45'],
  'Kaos Kaki': ['All size']
};

// ===== Elemen halaman =====
const wadahProduk = document.querySelector('#produk');
const wadahFilter = document.querySelector('#filter');
const kosongFilter = document.querySelector('#kosong-filter');
const daftarKeranjang = document.querySelector('#daftar-keranjang');
const kosong = document.querySelector('#kosong');
const totalEl = document.querySelector('#total');
const badge = document.querySelector('#jumlah-keranjang');
const tombolWa = document.querySelector('#kirim-wa');
const tombolKosongkan = document.querySelector('#kosongkan');
const menu = document.querySelector('#menu');
const form = document.querySelector('#form');
const inputEmail = document.querySelector('#email');
const pesan = document.querySelector('#pesan');
const modalFotoEl = document.querySelector('#modal-foto');
const fotoBesar = document.querySelector('#foto-besar');
const judulModalFoto = document.querySelector('#judul-modal-foto');

// Komponen Bootstrap yang dikontrol lewat JavaScript
const modalFoto = new bootstrap.Modal(modalFotoEl);
const collapseMenu = new bootstrap.Collapse(menu, { toggle: false });

const keranjang = [];

// ===== Fungsi bantu =====
function rupiah(angka) {
  return 'Rp ' + angka.toLocaleString('id-ID');
}

// Membuat elemen dengan kelas Bootstrap dan teks (aman: memakai textContent)
function buatEl(tag, kelas, teks) {
  const el = document.createElement(tag);
  if (kelas) el.className = kelas;
  if (teks !== undefined) el.textContent = teks;
  return el;
}

function buatTombol(teks, label, kelas, aksi) {
  const btn = buatEl('button', kelas, teks);
  btn.type = 'button';
  btn.setAttribute('aria-label', label);
  btn.addEventListener('click', aksi);
  return btn;
}

// ===== Keranjang (isi panel Offcanvas) =====
function renderKeranjang() {
  daftarKeranjang.textContent = '';
  let totalHarga = 0;
  let totalJumlah = 0;

  keranjang.forEach((item, index) => {
    totalHarga += item.harga * item.jumlah;
    totalJumlah += item.jumlah;

    const li = buatEl('li', 'list-group-item d-flex justify-content-between align-items-center gap-2 px-0');
    const info = buatEl('div');
    info.append(
      buatEl('strong', '', item.nama),
      buatEl('div', 'rincian', 'Ukuran ' + item.ukuran + ' | ' + rupiah(item.harga * item.jumlah))
    );

    const kontrol = buatEl('div', 'd-flex align-items-center gap-2');
    kontrol.append(
      buatTombol('-', 'Kurangi ' + item.nama, 'btn btn-outline-dark btn-sm', () => {
        item.jumlah--;
        if (item.jumlah === 0) keranjang.splice(index, 1);
        renderKeranjang();
      }),
      buatEl('span', '', item.jumlah),
      buatTombol('+', 'Tambah ' + item.nama, 'btn btn-outline-dark btn-sm', () => {
        item.jumlah++;
        renderKeranjang();
      })
    );

    li.append(info, kontrol);
    daftarKeranjang.appendChild(li);
  });

  badge.textContent = totalJumlah;
  totalEl.textContent = rupiah(totalHarga);
  kosong.hidden = keranjang.length > 0;
  tombolWa.disabled = keranjang.length === 0;
  tombolKosongkan.disabled = keranjang.length === 0;
}

function tambahKeKeranjang(p, ukuran) {
  const ada = keranjang.find((item) => item.nama === p.nama && item.ukuran === ukuran);
  if (ada) {
    ada.jumlah++;
  } else {
    keranjang.push({ nama: p.nama, ukuran: ukuran, harga: p.harga, jumlah: 1 });
  }
  renderKeranjang();
}

function pesanWhatsApp() {
  if (NOMOR_WA === NOMOR_CONTOH) {
    alert('Nomor WhatsApp belum diatur. Ubah NOMOR_WA di bagian atas script.js.');
    return;
  }
  let total = 0;
  const baris = keranjang.map((item, i) => {
    const subtotal = item.harga * item.jumlah;
    total += subtotal;
    return (i + 1) + '. ' + item.nama + ' (' + item.ukuran + ') x' + item.jumlah + ' = ' + rupiah(subtotal);
  });
  const teks = 'Halo, saya ingin memesan:\n' + baris.join('\n') + '\nTotal: ' + rupiah(total);
  window.open('https://wa.me/' + NOMOR_WA + '?text=' + encodeURIComponent(teks), '_blank', 'noopener');
}

// ===== Zoom foto (Bootstrap Modal) =====
function bukaFoto(p, pemicu) {
  fotoBesar.src = p.gambar;
  fotoBesar.alt = p.nama;
  judulModalFoto.textContent = p.nama;
  modalFotoEl.addEventListener('hidden.bs.modal', () => pemicu.focus(), { once: true });
  modalFoto.show();
}

// ===== Katalog + filter kategori =====
function buatKartuProduk(p) {
  const kolom = buatEl('div', 'col-6 col-md-4 col-lg-3');
  const kartu = buatEl('article', 'card produk h-100 border-0 text-center');

  const foto = buatEl('div', 'foto');
  foto.dataset.petunjuk = 'Foto belum tersedia';
  const gambar = document.createElement('img');
  gambar.src = p.gambar;
  gambar.alt = p.nama;
  gambar.loading = 'lazy';
  gambar.addEventListener('error', () => foto.classList.add('kosong'));
  foto.appendChild(gambar);
  foto.tabIndex = 0;
  foto.setAttribute('role', 'button');
  foto.setAttribute('aria-label', 'Perbesar foto ' + p.nama);
  foto.addEventListener('click', () => {
    if (!foto.classList.contains('kosong')) bukaFoto(p, foto);
  });
  foto.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !foto.classList.contains('kosong')) {
      e.preventDefault();
      bukaFoto(p, foto);
    }
  });

  const isi = buatEl('div', 'card-body d-flex flex-column gap-2 px-0');
  const judul = buatEl('h3', 'card-title mb-0', p.nama);
  const harga = buatEl('p', 'harga fw-semibold mb-0', rupiah(p.harga));

  const daftarUkuran = p.ukuran || UKURAN_KATEGORI[p.kategori] || UKURAN_DEFAULT;
  const pilih = buatEl('select', 'form-select form-select-sm');
  pilih.setAttribute('aria-label', 'Ukuran ' + p.nama);
  for (const u of daftarUkuran) {
    pilih.appendChild(buatEl('option', '', u));
  }
  pilih.value = daftarUkuran.includes('M') ? 'M' : daftarUkuran[Math.floor(daftarUkuran.length / 2)];

  const tombol = buatEl('button', 'btn btn-dark btn-sm text-uppercase', 'Tambah');
  tombol.type = 'button';
  tombol.addEventListener('click', () => {
    tambahKeKeranjang(p, pilih.value);
    tombol.textContent = 'Ditambahkan';
    setTimeout(() => { tombol.textContent = 'Tambah'; }, 900);
  });

  const aksi = buatEl('div', 'd-grid gap-2 mt-auto');
  aksi.append(pilih, tombol);
  isi.append(judul, harga, aksi);

  kartu.append(foto, isi);
  kolom.appendChild(kartu);
  return kolom;
}

function tampilkanProduk(kategori) {
  wadahProduk.textContent = '';
  let jumlahTampil = 0;
  for (const p of produk) {
    if (kategori !== 'Semua' && p.kategori !== kategori) continue;
    wadahProduk.appendChild(buatKartuProduk(p));
    jumlahTampil++;
  }
  kosongFilter.hidden = jumlahTampil > 0;
  wadahFilter.querySelectorAll('button').forEach((btn) => {
    const aktif = btn.textContent === kategori;
    btn.classList.toggle('active', aktif);
    btn.setAttribute('aria-pressed', String(aktif));
  });
}

function buatFilter() {
  const daftarKategori = ['Semua'];
  for (const p of produk) {
    if (!daftarKategori.includes(p.kategori)) daftarKategori.push(p.kategori);
  }
  for (const kategori of daftarKategori) {
    wadahFilter.appendChild(
      buatTombol(kategori, 'Tampilkan kategori ' + kategori, 'btn btn-outline-dark btn-sm text-uppercase', () => tampilkanProduk(kategori))
    );
  }
}

// ===== Validasi form info rilis (memakai kelas validasi Bootstrap) =====
function kirimForm(event) {
  event.preventDefault();
  pesan.textContent = '';
  form.classList.add('was-validated');

  if (!form.checkValidity()) {
    inputEmail.focus();
    return;
  }
  pesan.textContent = 'Terima kasih! ' + inputEmail.value.trim() + ' sudah terdaftar untuk info rilis.';
  form.reset();
  form.classList.remove('was-validated');
}

// ===== Pasang event listener =====
tombolKosongkan.addEventListener('click', () => { keranjang.length = 0; renderKeranjang(); });
tombolWa.addEventListener('click', pesanWhatsApp);
form.addEventListener('submit', kirimForm);

// Tutup menu mobile setelah link diklik (hanya jika menu sedang berbentuk dropdown)
menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
  if (menu.classList.contains('show')) collapseMenu.hide();
}));

// ===== Inisialisasi =====
buatFilter();
tampilkanProduk('Semua');
renderKeranjang();
document.querySelector('#tahun').textContent = new Date().getFullYear();
