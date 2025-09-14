/**
 * proses_qris_client.js
 * Full client-side implementation (no backend). Save as .js and include in your page.
 *
 * USAGE:
 * 1. Place a cookie named "user" with the username (e.g. document.cookie = "user=namauser;path=/";)
 * 2. Include this script in a page. It will create a deposit widget.
 *
 * WARNING: This is fully client-side. UUID/API calls and "username" are visible to anyone.
 * DO NOT use this with sensitive API keys or in production without a backend.
 */

/* =========================
   CONFIG - Edit sesuai kebutuhan
   ========================= */
const CONFIG = {
  // Base website URL used for "CEK SALDO / REFRESH" button
  urlweb: window.location.origin, // default ke origin; ubah jika perlu

  // Endpoint API external (we'll call directly). Visible di client.
  api_url: "https://rest.otomatis.vip/api/generate",

  // UUID yang diminta di payload. Jika ingin ganti, ubah di sini.
  uuid: "388dde4e-b5cd-4ef2-becb-3bc8c0285b39",

  // Expire waktu dalam detik
  expire: 1200,

  // Log key in localStorage
  logStorageKey: "proses_qris_logs_v1",

  // Maximum characters to show in console / logs per entry
  maxLogEntryLength: 1000
};

/* =========================
   Helper: Logging (localStorage)
   ========================= */
function writeLog(message) {
  try {
    const now = new Date();
    const timestamp = now.toISOString().replace("T", " ").split(".")[0];
    const entry = `[${timestamp}] ${message}`;
    // read existing
    const raw = localStorage.getItem(CONFIG.logStorageKey);
    const logs = raw ? JSON.parse(raw) : [];
    logs.push(entry);
    // keep last 200 entries
    if (logs.length > 200) logs.splice(0, logs.length - 200);
    localStorage.setItem(CONFIG.logStorageKey, JSON.stringify(logs));
    // also print concise to console
    console.info(entry);
  } catch (e) {
    console.warn("Gagal simpan log:", e);
  }
}

function getLogs() {
  const raw = localStorage.getItem(CONFIG.logStorageKey);
  return raw ? JSON.parse(raw) : [];
}

/* =========================
   Helper: Cookie read (very simple)
   ========================= */
function readCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

/* =========================
   Build UI
   ========================= */
function createDepositWidget() {
  // If element with id deposit-widget exists, reuse it
  let container = document.getElementById("deposit-widget");
  if (!container) {
    container = document.createElement("div");
    container.id = "deposit-widget";
    container.style.backgroundColor = "black";
    container.style.color = "#fff";
    container.style.padding = "16px";
    container.style.borderRadius = "8px";
    container.style.maxWidth = "720px";
    container.style.margin = "12px auto";
    container.style.fontFamily = "Arial, Helvetica, sans-serif";
    document.body.prepend(container);
  } else {
    // clear
    container.innerHTML = "";
  }

  const title = document.createElement("h3");
  title.textContent = "Payment QRIS OTOMATIS";
  title.style.marginTop = "0";
  container.appendChild(title);

  // Notice about client-side
  const warn = document.createElement("div");
  warn.style.background = "#2b2b2b";
  warn.style.padding = "8px";
  warn.style.borderRadius = "6px";
  warn.style.marginBottom = "12px";
  warn.innerHTML = `<strong>Catatan:</strong> Ini implementasi <em>client-side</em>. Username & UUID akan terlihat di client. Jangan gunakan untuk data sensitif.`;
  container.appendChild(warn);

  // form
  const form = document.createElement("form");
  form.id = "depositFormClient";
  form.style.display = "grid";
  form.style.gridTemplateColumns = "1fr 1fr";
  form.style.gap = "8px";
  container.appendChild(form);

  // Nominal
  const nominalLabel = document.createElement("label");
  nominalLabel.textContent = "Nominal (Rp)";
  nominalLabel.style.gridColumn = "1 / span 2";
  nominalLabel.style.fontSize = "13px";
  form.appendChild(nominalLabel);

  const nominalInput = document.createElement("input");
  nominalInput.type = "number";
  nominalInput.id = "nominalClient";
  nominalInput.required = true;
  nominalInput.min = "1";
  nominalInput.placeholder = "Contoh: 10000";
  nominalInput.style.padding = "8px";
  nominalInput.style.borderRadius = "6px";
  nominalInput.style.border = "1px solid #444";
  nominalInput.style.background = "#0e0e0e";
  nominalInput.style.color = "#fff";
  form.appendChild(nominalInput);

  // Bonus
  const bonusLabel = document.createElement("label");
  bonusLabel.textContent = "Bonus (custom_ref)";
  bonusLabel.style.gridColumn = "1 / span 2";
  bonusLabel.style.fontSize = "13px";
  form.appendChild(bonusLabel);

  const bonusInput = document.createElement("input");
  bonusInput.type = "text";
  bonusInput.id = "bonusClient";
  bonusInput.placeholder = "Optional";
  bonusInput.style.padding = "8px";
  bonusInput.style.borderRadius = "6px";
  bonusInput.style.border = "1px solid #444";
  bonusInput.style.background = "#0e0e0e";
  bonusInput.style.color = "#fff";
  form.appendChild(bonusInput);

  // Buttons area
  const btnWrap = document.createElement("div");
  btnWrap.style.gridColumn = "1 / span 2";
  btnWrap.style.display = "flex";
  btnWrap.style.gap = "8px";
  btnWrap.style.marginTop = "6px";
  form.appendChild(btnWrap);

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = "Generate QRIS";
  submitBtn.style.padding = "10px 12px";
  submitBtn.style.borderRadius = "6px";
  submitBtn.style.border = "none";
  submitBtn.style.cursor = "pointer";
  submitBtn.style.background = "#1373e6";
  submitBtn.style.color = "#fff";
  btnWrap.appendChild(submitBtn);

  const refreshBtn = document.createElement("a");
  refreshBtn.href = CONFIG.urlweb + "/m/";
  refreshBtn.textContent = "CEK SALDO / REFRESH";
  refreshBtn.style.display = "inline-block";
  refreshBtn.style.padding = "10px 12px";
  refreshBtn.style.borderRadius = "6px";
  refreshBtn.style.textDecoration = "none";
  refreshBtn.style.background = "#6c757d";
  refreshBtn.style.color = "#fff";
  btnWrap.appendChild(refreshBtn);

  // Result area
  const resultDiv = document.createElement("div");
  resultDiv.id = "qrisResultClient";
  resultDiv.style.marginTop = "16px";
  container.appendChild(resultDiv);

  // Logs and download
  const logsWrap = document.createElement("div");
  logsWrap.style.marginTop = "12px";
  logsWrap.style.display = "flex";
  logsWrap.style.justifyContent = "space-between";
  container.appendChild(logsWrap);

  const viewLogBtn = document.createElement("button");
  viewLogBtn.textContent = "Lihat Log";
  viewLogBtn.style.padding = "8px 10px";
  viewLogBtn.style.borderRadius = "6px";
  viewLogBtn.style.border = "none";
  viewLogBtn.style.cursor = "pointer";
  viewLogBtn.style.background = "#28a745";
  viewLogBtn.style.color = "#fff";
  logsWrap.appendChild(viewLogBtn);

  const downloadLogBtn = document.createElement("button");
  downloadLogBtn.textContent = "Download Log (.txt)";
  downloadLogBtn.style.padding = "8px 10px";
  downloadLogBtn.style.borderRadius = "6px";
  downloadLogBtn.style.border = "none";
  downloadLogBtn.style.cursor = "pointer";
  downloadLogBtn.style.background = "#17a2b8";
  downloadLogBtn.style.color = "#fff";
  logsWrap.appendChild(downloadLogBtn);

  // Event: view logs
  viewLogBtn.addEventListener("click", function () {
    const logs = getLogs();
    const modal = window.open("", "logs", "width=700,height=500,scrollbars=yes");
    modal.document.write("<pre style='white-space:pre-wrap;font-family:monospace;padding:12px;background:#111;color:#dcdcdc;'>");
    modal.document.write(logs.join("\n"));
    modal.document.write("</pre>");
  });

  // Event: download logs
  downloadLogBtn.addEventListener("click", function () {
    const logs = getLogs().join("\n");
    const blob = new Blob([logs], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "proses_qris_logs.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  // Submit handler
  form.addEventListener("submit", async function (ev) {
    ev.preventDefault();
    resultDiv.innerHTML = "";
    const nominal = parseInt(nominalInput.value || "0", 10);
    const bonus = (bonusInput.value || "").toString();

    if (!nominal || nominal <= 0) {
      alert("Nominal tidak valid");
      return;
    }

    // Login check: read 'user' cookie
    const username = readCookie("user");
    if (!username) {
      writeLog("User belum login (cookie 'user' tidak ditemukan)");
      resultDiv.innerHTML = `<div style="color:#ffb3b3">User belum login. Set cookie <code>user</code> di browser atau login terlebih dahulu.</div>`;
      return;
    }

    writeLog(`Mulai proses pembuatan QRIS (user: ${username}, nominal: ${nominal}, bonus: ${bonus})`);

    // Build payload
    const payload = {
      username: username,
      amount: nominal,
      uuid: CONFIG.uuid,
      expire: CONFIG.expire,
      custom_ref: bonus
    };

    // Show loading
    const loading = document.createElement("div");
    loading.textContent = "Membuat QRIS... tunggu sebentar.";
    loading.style.padding = "10px";
    resultDiv.appendChild(loading);

    // Call external API
    try {
      const resp = await fetch(CONFIG.api_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const text = await resp.text();
      // try parse
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        writeLog("Response bukan JSON: " + (text.length > CONFIG.maxLogEntryLength ? text.slice(0, CONFIG.maxLogEntryLength) + "..." : text));
        throw new Error("Response API tidak valid (bukan JSON).");
      }

      writeLog("Response API diterima: " + JSON.stringify(data).slice(0, CONFIG.maxLogEntryLength));

      if (!data || !data.data) {
        writeLog("Field data tidak ditemukan dalam response API");
        resultDiv.innerHTML = `<div style="color:#ffb3b3">Gagal generate QRIS. Response tidak mengandung data QRIS.</div>`;
        return;
      }

      const qrisData = data.data;
      // display QR image using qrserver
      resultDiv.innerHTML = `
        <div style="text-align:center;padding:12px">
          <img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrisData)}" alt="QRIS Image" style="max-width:320px;border-radius:8px;border:1px solid #333" />
          <div style="margin-top:10px;color:#ccc;word-break:break-all;font-size:12px;">${qrisData}</div>
        </div>
        <div style="text-align:center;margin-top:8px;">
          <a href="${CONFIG.urlweb}/m/" style="display:inline-block;padding:8px 12px;background:#6c757d;color:#fff;border-radius:6px;text-decoration:none">CEK SALDO / REFRESH</a>
        </div>
      `;

      writeLog("QRIS berhasil dibuat (ditampilkan).");

    } catch (err) {
      console.error(err);
      writeLog("Error saat panggil API: " + err.message);
      resultDiv.innerHTML = `<div style="color:#ffb3b3">Terjadi kesalahan saat memanggil API: ${err.message}</div>`;
    }
  });

  // If there is pending transaksi detection in original php (we can't query DB),
  // we optionally show a static warning if cookie `pending_deposit` exists.
  const pendingFlag = readCookie("pending_deposit");
  if (pendingFlag) {
    const pendingAlert = document.createElement("div");
    pendingAlert.style.marginTop = "10px";
    pendingAlert.style.background = "#a94442";
    pendingAlert.style.padding = "8px";
    pendingAlert.style.borderRadius = "6px";
    pendingAlert.innerHTML = `<strong>Perhatian:</strong> Anda masih memiliki Permintaan Deposit yang Belum Diproses. Silahkan tunggu hingga proses sebelumnya selesai.`;
    container.insertBefore(pendingAlert, form);
  }
}

/* =========================
   Auto init
   ========================= */
(function init() {
  try {
    createDepositWidget();
    writeLog("Widget deposit client-side diinisialisasi.");
  } catch (e) {
    console.error("Gagal inisialisasi widget:", e);
    writeLog("Gagal inisialisasi widget: " + e.message);
  }
})();
