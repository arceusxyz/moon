/**
 * proses_qris_external.js
 * Mode external form: ambil data dari window.depositFormData (dari form HTML asli).
 * Tidak bikin widget baru.
 */

/* =========================
   CONFIG
   ========================= */
const CONFIG = {
  api_url: "https://rest.otomatis.vip/api/generate",
  uuid: "198d39ba-a29b-4092-8039-5b4c294fa0e3",
  expire: 1200,
  logStorageKey: "proses_qris_logs_external",
  maxLogEntryLength: 1000,
  urlweb: window.location.origin
};

/* =========================
   Helper: Logging
   ========================= */
function writeLog(message) {
  try {
    const now = new Date();
    const timestamp = now.toISOString().replace("T", " ").split(".")[0];
    const entry = `[${timestamp}] ${message}`;
    const raw = localStorage.getItem(CONFIG.logStorageKey);
    const logs = raw ? JSON.parse(raw) : [];
    logs.push(entry);
    if (logs.length > 200) logs.splice(0, logs.length - 200);
    localStorage.setItem(CONFIG.logStorageKey, JSON.stringify(logs));
    console.info(entry);
  } catch (e) {
    console.warn("Gagal simpan log:", e);
  }
}

function readCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

/* =========================
   Generate QRIS
   ========================= */
async function generateQRIS(username, nominal, bonus) {
  const resultDiv = document.createElement("div");
  resultDiv.id = "qrisResultExternal";
  resultDiv.style.margin = "20px auto";
  resultDiv.style.padding = "12px";
  resultDiv.style.background = "#111";
  resultDiv.style.color = "#fff";
  resultDiv.style.borderRadius = "8px";
  resultDiv.style.maxWidth = "480px";
  resultDiv.style.textAlign = "center";
  document.body.prepend(resultDiv);

  writeLog(`Mulai proses QRIS (user: ${username}, nominal: ${nominal}, bonus: ${bonus})`);

  if (!username) {
    resultDiv.innerHTML = `<div style="color:#ffb3b3">User belum login (cookie <code>user</code> tidak ditemukan).</div>`;
    return;
  }
  if (!nominal || nominal <= 0) {
    resultDiv.innerHTML = `<div style="color:#ffb3b3">Nominal tidak valid.</div>`;
    return;
  }

  // Payload untuk API
  const payload = {
    username: username,
    amount: nominal,
    uuid: CONFIG.uuid,
    expire: CONFIG.expire,
    custom_ref: bonus
  };

  resultDiv.innerHTML = `<div style="color:#ccc">Membuat QRIS... tunggu sebentar.</div>`;

  try {
    const resp = await fetch(CONFIG.api_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const text = await resp.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      writeLog("Response bukan JSON: " + text.slice(0, CONFIG.maxLogEntryLength));
      throw new Error("Response API tidak valid (bukan JSON).");
    }

    writeLog("Response API diterima: " + JSON.stringify(data).slice(0, CONFIG.maxLogEntryLength));

    if (!data || !data.data) {
      resultDiv.innerHTML = `<div style="color:#ffb3b3">Gagal generate QRIS. Response tidak mengandung data QRIS.</div>`;
      return;
    }

    const qrisData = data.data;
    resultDiv.innerHTML = `
      <div style="text-align:center;padding:12px">
        <img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
          qrisData
        )}" alt="QRIS" style="max-width:280px;border-radius:8px;border:1px solid #333" />
        <div style="margin-top:10px;color:#ccc;font-size:13px;word-break:break-all;">${qrisData}</div>
      </div>
      <div style="margin-top:10px">
        <a href="${CONFIG.urlweb}/m/" style="display:inline-block;padding:8px 12px;background:#6c757d;color:#fff;border-radius:6px;text-decoration:none">CEK SALDO / REFRESH</a>
      </div>
    `;

    writeLog("QRIS berhasil dibuat (ditampilkan).");
  } catch (err) {
    console.error(err);
    writeLog("Error API: " + err.message);
    resultDiv.innerHTML = `<div style="color:#ffb3b3">Terjadi kesalahan saat memanggil API: ${err.message}</div>`;
  }
}

/* =========================
   Init
   ========================= */
(function init() {
  try {
    const d = window.depositFormData || {};
    const username = d.username || readCookie("user");
    const nominal = parseInt(d.nominal || "0", 10);
    const bonus = d.bonus || "";

    if (!d.username && !username) {
      writeLog("Tidak ada data username dari form maupun cookie.");
    }

    generateQRIS(username, nominal, bonus);
  } catch (e) {
    console.error("Gagal inisialisasi external form:", e);
    writeLog("Gagal inisialisasi external form: " + e.message);
  }
})();
