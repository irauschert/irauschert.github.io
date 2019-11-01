let productUnitCost = 0;
let productCurrency = "";
let subtotalUYU = 0;
let subtotalUSD = 0;
let shippingCostUYU = 0;
let shippingCostUSD = 0;
let shippingPercentage = 0.15;
let total = 0;
let paymentTypeSelected = false;
const CREDIT_CARD_PAYMENT = "Tarjeta de crédito";
const BANKING_PAYMENT = "Transferencia bancaria";
let ERROR_MSG = "Ha habido un error :(, verifica qué pasó.";
currentArticlesArray = [];

//Función que se utiliza para actualizar los costos de publicación
function updateTotalCosts() {
    totalUYU = subtotalUYU + shippingCostUYU;
    totalUSD = subtotalUSD + shippingCostUSD;

    totalHTMLtoAppend = `
    <h4 class="text-center">Total a pagar: UYU ` + totalUYU + ` y USD ` + totalUSD + ` </h4>`

    document.getElementById("total").innerHTML = totalHTMLtoAppend;
}

function updateShippingCost(shippingPercentage) {
    shippingCostUYU = Math.round(shippingPercentage * subtotalUYU * 100) / 100;
    shippingCostUSD = Math.round(shippingPercentage * subtotalUSD * 100) / 100;

    shippingCostHTMLtoAppend = `
        <p> UYU ` + shippingCostUYU + `</p><p>USD ` + shippingCostUSD + ` </p>
     `
    document.getElementById("shippingCost").innerHTML = shippingCostHTMLtoAppend;
    updateTotalCosts();
}

function updateSubtotal(array) {
    newArticleCount = document.getElementById("articleCount").value;
    for (let i = 0; i < array.length; i++) {
        let article = array[i];
        article.count = newArticleCount;
    }

    showArticles(array);
}

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

    document.getElementById("ETA").innerHTML = `Recibelo entre el ` + dia + ` ` + dd + ` de ` + mm + ` y el ` + otroDia + ` ` + DD + ` de ` + MM;
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
    let articlesHTMLtoAppend = "";
    let subtotalHTMLtoAppend = "";
    subtotalUYU = 0;
    subtotalUSD = 0;

    for (let i = 0; i < array.length; i++) {
        let article = array[i];
        articlesHTMLtoAppend = `
            <div class="media">
                <img src="` + article.src + `" class="align-self-center mr-3">
                <div class="media-body">
                    <div class="row">
                        <div class="col">
                            <h4>` + article.name + `</h4>
                            <p> Precio unitario: ` + article.currency + ` ` + article.unitCost + `</p>
                        </div>
                        <div class="col-2">    
                            <form>
                                <label for="articleCount">Cantidad</label>
                                <input id="articleCount" class="form-control form-control-sm" id="articleCount" type="number" min="0" value="` + article.count + `">
                            </form>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <p class="text-right">Subtotal del Item: ` + article.currency + ` ` + article.unitCost * article.count + `</p>
                        </div>
                    </div>
                </div>
            </div>
        `
        if (article.currency == "UYU") {
            subtotalUYU += article.unitCost * article.count;
        } else {
            subtotalUSD += article.unitCost * article.count;
        }
    }

    subtotalHTMLtoAppend = `
        <div class ="container">
        <hr>
            <div align="right">
                <h6>Subtotal en UYU ` + subtotalUYU + `</h6>
                <h6>Subtotal en USD ` + subtotalUSD + `</h6>
                <hr>
            </div>
        </div>
         `
    document.getElementById("articlesHTML").innerHTML = articlesHTMLtoAppend;
    document.getElementById("subtotalHTML").innerHTML = subtotalHTMLtoAppend;

    document.getElementById("articleCount").addEventListener("change", function () {
        document.getElementById('goldradio').checked = false;
        document.getElementById('premiumradio').checked = false;
        document.getElementById('standardradio').checked = false;
        updateSubtotal(currentArticlesArray);
    });
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(CART_INFO_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            articles = resultObj.data;
            currentArticlesArray = articles.articles;
            showArticles(currentArticlesArray);
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
});