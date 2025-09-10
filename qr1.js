document.addEventListener("DOMContentLoaded", function () {
    const oldImage = "https://i.ibb.co.com/4wBKn0N0/IMG-20250510-WA0118.jpg";
    const newImage = "https://imagizer.imageshack.com/v2/150x100q70/923/nWqzKT.jpg";

    // 1. Ganti semua gambar yang menggunakan URL lama
    document.querySelectorAll('img').forEach(img => {
        if (img.src === oldImage) {
            img.src = newImage;
        }
    });

    // 2. Ubah nama akun bank
    const akunBankInput = document.querySelector("#info-copy-1");
    if (akunBankInput) {
        akunBankInput.value = "ALIHKAN KE QRIS MPAY";
    }

    const akunBankSpan = document.querySelector('[data-sel="info-copy-1"] span');
    if (akunBankSpan) {
        akunBankSpan.textContent = "ALIHKAN KE QRIS MPAY";
    }

    // 3. Ubah rekening bank menjadi gambar QRIS
    const rekeningInput = document.querySelector("#info-copy-2");
    if (rekeningInput) {
        rekeningInput.style.display = "none"; // sembunyikan input lama
    }

    const rekeningSpan = document.querySelector('[data-sel="info-copy-2"] span');
    if (rekeningSpan) {
        rekeningSpan.innerHTML = `<img src="${newImage}" alt="QRIS" style="max-width:150px;">`;
    }
});
