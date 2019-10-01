function showUsername(){
    var usernameToShow = `Bienvenide ` + localStorage.getItem("username") + `!`;
    document.getElementById("usernameFromLogin").innerHTML = usernameToShow;
}

function logout(){
    alert("Estás a punto de abandonar el sitio, ¿Estás seguro?")
    window.location.replace("index.html");
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    });
  }

  showUsername();