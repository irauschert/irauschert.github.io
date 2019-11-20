let productUnitCost = 0;
let productCurrency = "";
let subtotalUYU = 0;
let subtotalUSD = 0;
let shippingCostUYU = 0;
let shippingCostUSD = 0;
let shippingPercentage = 0.15;
let total = 0;
let currentArticlesArray = [];
let productUnitCostUYUArray = [];
let productUnitCostUSDArray = [];
let productUnitCountArray = [];

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

function showArticles(array) {
    let articlesHTMLtoAppend = '<div class="row">';
    for (let i = 0; i < array.length; i++) {
        let article = array[i];
        articlesHTMLtoAppend += `
            <div class="col-6 col-sm-4 col-md-4 col-lg-3 col-xl-2">
                <div class="card shadow-sm">
                    <img src=" ${article.src}" class="p-2 card-img-top">
                    <div class="card-body">
                        <h5> ${article.name} </h5>
                        <small class="text-muted"> Precio unitario: ${article.currency} ${article.unitCost} </small>
                        <form>
                            <label for="articleCount">Cantidad</label>
                            <input id="articleCount" class="form-control" type="number" min="0" value="` + article.count + `">
                            <button type="submit" disabled style="display: none" aria-hidden="true"></button>
                        </form>
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
            showSubtotal(currentArticlesArray);
            updateShippingCost(0.15);
        }
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

    let formularioDireccionHTML = document.getElementById("adressForm");
    document.getElementById("errorInputStreet").style.display = 'none';
    document.getElementById("errorInputStreetNumber").style.display = 'none';
    document.getElementById("errorInputCorner").style.display = 'none';
    document.getElementById("errorInputCP").style.display = 'none';
    document.getElementById("errorInputCountry").style.display = 'none';
    document.getElementById("errorInputState").style.display = 'none';

    formularioDireccionHTML.addEventListener('submit', function (evento) {
        evento.preventDefault();

        let inputStreetNameHTML = formularioDireccionHTML.inputStreetName;
        let errorInputStreetHTML = document.getElementById('errorInputStreet');
        if (inputStreetNameHTML.value.length < 1) {
            errorInputStreetHTML.style.display = 'block'
            errorInputStreetHTML.innerHTML = `<small class="ml-3"> Debe ingresar el nombre de una calle</small>`
            inputStreetNameHTML.classList.add('validated')
            inputStreetNameHTML.classList.replace('validated', 'error')
            inputStreetNameHTML.validity.valid = 'false';
        } else {
            errorInputStreetHTML.style.display = 'none'
            inputStreetNameHTML.classList.add('error')
            inputStreetNameHTML.classList.replace('error', 'validated')
            inputStreetNameHTML.validity.valid = 'true';
        }

        let inputStreetNumberHTML = formularioDireccionHTML.inputStreetNumber;
        let errorInputStreetNumberHTML = document.getElementById('errorInputStreetNumber');
        if (inputStreetNumberHTML.value == 0 || inputStreetNumberHTML.value > 10000) {
            errorInputStreetNumberHTML.style.display = 'block'
            errorInputStreetNumberHTML.innerHTML = `<small class="ml-3"> Debe ingresar un numero de puerta de hasta 4 digitos </small>`
            inputStreetNumberHTML.classList.add('validated')
            inputStreetNumberHTML.classList.replace('validated', 'error')
        } else {
            errorInputStreetNumberHTML.style.display = 'none'
            inputStreetNumberHTML.classList.add('error')
            inputStreetNumberHTML.classList.replace('error', 'validated')
        }

        let inputCornerNameHTML = formularioDireccionHTML.inputCornerName;
        let errorInputCornerHTML = document.getElementById('errorInputCorner');
        if (inputCornerNameHTML.value.length < 1) {
            errorInputCornerHTML.style.display = 'block'
            errorInputCornerHTML.innerHTML = `<small class="ml-3"> Debe ingresar el nombre de una calle</small>`
            inputCornerNameHTML.classList.add('validated')
            inputCornerNameHTML.classList.replace('validated', 'error')
        } else {
            errorInputCornerHTML.style.display = 'none'
            inputCornerNameHTML.classList.add('error')
            inputCornerNameHTML.classList.replace('error', 'validated')
        }

        let inputCPHTML = formularioDireccionHTML.inputZIPCode;
        let errorInputCP = document.getElementById('errorInputCP');
        if (inputCPHTML.value < 1 || inputCPHTML.value > 100000) {
            errorInputCP.style.display = 'block'
            errorInputCP.innerHTML = `<small class="ml-3"> Debe ingresar un numero de 5 cifras</small>`
            inputCPHTML.classList.add('validated')
            inputCPHTML.classList.replace('validated', 'error')
        } else {
            errorInputCP.style.display = 'none'
            inputCPHTML.classList.add('error')
            inputCPHTML.classList.replace('error', 'validated')
        }

        let inputCountryHTML = formularioDireccionHTML.country;
        let errorInputCountry = document.getElementById('errorInputCountry');
        if (inputCountryHTML.value == -1) {
            errorInputCountry.style.display = 'block'
            errorInputCountry.innerHTML = `<small class="ml-3"> Debe seleccionar un Pais</small>`
            inputCountryHTML.classList.add('validated')
            inputCountryHTML.classList.replace('validated', 'error')
        } else {
            errorInputCountry.style.display = 'none'
            inputCountryHTML.classList.add('error')
            inputCountryHTML.classList.replace('error', 'validated')
        }

        let inputStateHTML = formularioDireccionHTML.state;
        let errorInputState = document.getElementById('errorInputState');
        if (inputStateHTML.value == 0) {
            errorInputState.style.display = 'block'
            errorInputState.innerHTML = `<small class="ml-3"> Debe seleccionar un Departamento </small>`
            inputStateHTML.classList.add('validated')
            inputStateHTML.classList.replace('validated', 'error')
        } else {
            errorInputState.style.display = 'none'
            inputStateHTML.classList.add('error')
            inputStateHTML.classList.replace('error', 'validated')
        }

        if (inputStreetNameHTML.validity.valid == true) {
            AdressHTML = `Recibira su compra en ${inputStreetNameHTML.value} ${inputStreetNumberHTML.value}, Codigo Postal ${inputCPHTML.value}.`;
            document.getElementById('adressToShow').innerHTML = AdressHTML;
        }
    })


    let formularioPagoHTML = document.getElementById("paymentTypeForm");
    document.getElementById("errorCardNumber").style.display = 'none';
    document.getElementById("errorCardCVV").style.display = 'none';
    document.getElementById("errorCardExpDate").style.display = 'none';
    document.getElementById("errorBankAccountNumber").style.display = 'none';

    formularioPagoHTML.addEventListener('submit', function (evento) {
        evento.preventDefault();

        let inputCreditCardNumberHTML = formularioPagoHTML.creditCardNumber;
        let errorCreditCardNumberHTML = document.getElementById('errorCardNumber');
        if (inputCreditCardNumberHTML.value > 10000000000000000 || inputCreditCardNumberHTML.value < 100000000000000) {
            errorCreditCardNumberHTML.style.display = 'block'
            errorCreditCardNumberHTML.innerHTML = `<small class="ml-3"> El numero ingresado no es valido</small>`
            inputCreditCardNumberHTML.classList.add('validated')
            inputCreditCardNumberHTML.classList.replace('validated', 'error')
            inputCreditCardNumberHTML.validity.valid = 'false';
        } else {
            errorCreditCardNumberHTML.style.display = 'none'
            inputCreditCardNumberHTML.classList.add('error')
            inputCreditCardNumberHTML.classList.replace('error', 'validated')
            inputCreditCardNumberHTML.validity.valid = 'true';
        }

        let inputCreditCardCVVHTML = formularioPagoHTML.creditCardCVV;
        let errorCreditCardCVVHTML = document.getElementById('errorCardCVV');
        if (inputCreditCardCVVHTML.value > 999 || inputCreditCardNumberHTML.value < 100) {
            errorCreditCardCVVHTML.style.display = 'block'
            errorCreditCardCVVHTML.innerHTML = `<small class="ml-3"> El numero ingresado no es valido</small>`
            inputCreditCardCVVHTML.classList.add('validated')
            inputCreditCardCVVHTML.classList.replace('validated', 'error')
            inputCreditCardCVVHTML.validity.valid = 'false';
        } else {
            errorCreditCardCVVHTML.style.display = 'none'
            inputCreditCardCVVHTML.classList.add('error')
            inputCreditCardCVVHTML.classList.replace('error', 'validated')
            inputCreditCardCVVHTML.validity.valid = 'true';
        }
    })

});