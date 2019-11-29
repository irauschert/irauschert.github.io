function showUsername(){
    var usernameToShow = `Bienvenide ` + localStorage.getItem("username") + `!`;
    document.getElementById("usernameFromLogin").innerHTML = usernameToShow;
}

function signOut() {
    alert("Estás a punto de abandonar el sitio, ¿Estás seguro?")
    window.location.replace("index.html");
}

function onLoad() {
    gapi.load('auth2', function() {
        gapi.auth2.init();
    });
}