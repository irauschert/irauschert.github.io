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

function onSignIn() {
    alert("has entrado correctamente con Google, bien yo!");
    
    var auth2 = gapi.auth2.init();
    var profile = auth2.currentUser.get().getBasicProfile();
    console.log('ID: ' + profile.getId());
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());

    usernameToShow = profile.getName()
    localStorage.setItem("username", usernameToShow);

    alert(usernameToShow);

    window.location = "http://irauschert.github.io/portada.html"

}