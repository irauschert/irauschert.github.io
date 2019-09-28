function login() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    localStorage.setItem("username", username);

    if (username == "ines" && password == "12345678") {
        window.location = "portada.html"
        return false;
    }
    else {
        alert("Usuario o contraseña incorectos, aunque te vamos a dejar entrar igual :)");
        window.location = "portada.html"
        return false;
    }
}