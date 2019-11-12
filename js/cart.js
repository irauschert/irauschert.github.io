let productUnitCost = 0;
let productCurrency = "";
let subtotalUYU = 0;
let subtotalUSD = 0;
let shippingCostUYU = 0;
let shippingCostUSD = 0;
let shippingPercentage = 0.15;
let total = 0;
currentArticlesArray = [];

function diasCorridos(diasHabiles) {
    var businessDays = diasHabiles
    var j = 1;
    while (businessDays > 0) {
        var fecha = new Date();
        fecha.setDate(fecha.getDate() + j++);
        if (fecha.getDay() != 0 && fecha.getDay() != 6) {
            businessDays--;
        };
    }
    return fecha;
}

function showETA(menor, mayor) {
    semana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    mes = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"]

    firstETA = diasCorridos(menor);
    dia = semana[firstETA.getDay()];
    dd = firstETA.getDate();
    mm = mes[firstETA.getMonth()];

    secondETA = diasCorridos(mayor);
    otroDia = semana[secondETA.getDay()];
    DD = secondETA.getDate();
    MM = mes[secondETA.getMonth()];

    document.getElementById("ETA").innerHTML = `Recibelo entre el ${dia} ${dd} de ${mm} y el ${otroDia} ${DD} de ${MM}`;
}

function hidePaymentTypeNotSelected() {
    if (document.getElementById("creditCardPaymentRadio").ckecked) {
        document.getElementById("bankingRadio").style.visibility = "hidden";
    }
    else {
        document.getElementById("creditCardPaymentRadio").style.visibility = "hidden";
    }
}

function validateForms() {
    var forms = document.getElementsByClassName('needs-validation'); //Genera un elemento que no es un ARRAY, pero sobre el que se puede iterar.
    var validation = Array.prototype.filter.call(forms, function (form) {
        form.addEventListener('submit', function (event) {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });
};

function validateDataFromForms() {
    var adress = document.getElementById("shippingAdressForm").elements[0];
    if (adress.value == "") {
        return false;
    }

    var number = document.getElementById("shippingAdressForm").elements[1];
    alert(number.value);
    if (number.value > 10000 || number.value == 0) {
        adress.setCustomValidity("Campo Invalido");
    } else {
        adress.setCustomValidity(""); // Lo dejo vacio para indicar que esta Ok
    }

    var corner = document.getElementById("shippingAdressForm").elements[2];
    if (corner.value == "") {
        corner.setCustomValidity("Campo Invalido");
    } else {
        adress.setCustomValidity(""); // Lo dejo vacio para indicar que esta Ok
    }
    validateForms();
}

function showArticles(array) {
    let articlesHTMLtoAppend = '<div class="row">';
    for (let i = 0; i < array.length; i++) {
        let article = array[i];
        articlesHTMLtoAppend += `
            <div class="col-sm-4 col-md-4 col-lg-5 col-xl-2">
                <div class="card shadow-sm">
                    <img src=" ${article.src}" class="p-2 card-img-top">
                    <div class="card-body">
                        <h5> ${article.name} </h5>
                        <small class="text-muted"> Precio unitario: ${article.currency} ${article.unitCost} </small>
                        <form>
                            <label for="articleCount">Cantidad</label>
                            <input id="articleCount" class="form-control form-control-sm articleCount" type="number" min="0" value="` + article.count + `">
                        </form>
                        <p class="text-right">Subtotal del Item: ${article.currency} ${article.unitCost * article.count} </p>
                    </div>
                </div>
            </div>
        `
    }
    articlesHTMLtoAppend += `</div>`
    document.getElementById("articlesHTML").innerHTML = articlesHTMLtoAppend;
    showSubtotal(array);
}

function showSubtotal(array) {
    let subtotalHTMLtoAppend = "";
    subtotalUYU = 0;
    subtotalUSD = 0;

    for (let i = 0; i < array.length; i++) {
        let article = array[i];
        if (article.currency == "UYU") {
            subtotalUYU += article.unitCost * article.count;
        } else {
            subtotalUSD += article.unitCost * article.count;
        }
        subtotalHTMLtoAppend = `
        <div class ="container">
        <hr>
            <div align="right">
                <h6>Subtotal en UYU ${subtotalUYU} </h6>
                <h6>Subtotal en USD ${subtotalUSD} </h6>
                <hr>
            </div>
        </div>
         `
        document.getElementById("subtotalHTML").innerHTML = subtotalHTMLtoAppend;
    }
}

function updateSubtotal(array) {
    newArticleCount = document.getElementById("articleCount").value;
    for (let i = 0; i < array.length; i++) {
        let article = array[i];
        article.count = newArticleCount;
    }
    showSubtotal(array);
}

function updateShippingCost(shippingPercentage) {
    shippingCostUYU = Math.round(shippingPercentage * subtotalUYU * 100) / 100;
    shippingCostUSD = Math.round(shippingPercentage * subtotalUSD * 100) / 100;

    shippingCostHTMLtoAppend = `
        <p> UYU ${shippingCostUYU} </p><p>USD ${shippingCostUSD}</p>
     `
    document.getElementById("shippingCost").innerHTML = shippingCostHTMLtoAppend;
    updateTotalCosts();
}

function updateTotalCosts() {
    totalUYU = subtotalUYU + shippingCostUYU;
    totalUSD = subtotalUSD + shippingCostUSD;

    totalHTMLtoAppend = `
    <h4 class="text-center">Total a pagar: UYU ${totalUYU} y USD ${totalUSD} </h4>
    `

    document.getElementById("total").innerHTML = totalHTMLtoAppend;
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    populateCountries("country", "state");

    getJSONData(CART_INFO_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            articles = resultObj.data;
            currentArticlesArray = articles.articles;
            currentArticlesArray.push({ name: "El Propio Celular", count: 1, unitCost: 259, currency: "USD", src: "img/cellPhone1.jpg" });
            currentArticlesArray.push({ name: "Piscina para niños", count: 1, unitCost: 790, currency: "UYU", src: "img/pool1.jpg" })
            currentArticlesArray.push({ name: "Inflable con Tobogan ", count: 1, unitCost: 2390, currency: "UYU", src: "img/inflable1.jpg" })
            showArticles(currentArticlesArray);
            updateShippingCost(0.15);
        }

        var arrayByClass = document.getElementsByClassName("articleCount");

        for (var i = 0; i < arrayByClass.length; i++) {
            arrayByClass[i].addEventListener("change", function () {
                document.getElementById('goldradio').checked = true;
                updateSubtotal(currentArticlesArray);
                updateShippingCost(0.15);
            })
        };
    });

    document.getElementById("goldradio").addEventListener("change", function () {
        updateShippingCost(0.15);
        showETA(2, 5);
    });

    document.getElementById("premiumradio").addEventListener("change", function () {
        updateShippingCost(0.07);
        showETA(5, 8);
    });

    document.getElementById("standardradio").addEventListener("change", function () {
        updateShippingCost(0.05);
        showETA(12, 15);
    });

    document.getElementById("bankingRadio").addEventListener("change", function () {
        document.getElementById("tarjetaDeCredito").style.display = "none";
        document.getElementById("transferenciaBancaria").style.display = "";
    });

    document.getElementById("creditCardPaymentRadio").addEventListener("change", function () {
        document.getElementById("transferenciaBancaria").style.display = "none";
        document.getElementById("tarjetaDeCredito").style.display = "";
    });
});