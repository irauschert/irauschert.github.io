function showUsername(){
    var usernameToShow = `Bienvenida ` + localStorage.getItem("username") + `!`;

    document.getElementById("usernameFromLogin").innerHTML = usernameToShow;
}

showUsername();

function logout(){
    alert("Estás a punto de abandonar el sitio, ¿Estás seguro?")
    window.location.replace("index.html");
}