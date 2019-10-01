let productUnitCost = 0;
let productCurrency = "";
let subtotal = 0;
let shippingPercentage = 0.15;
let total = 0;
let paymentTypeSelected = false;
const CREDIT_CARD_PAYMENT = "Tarjeta de crédito";
const BANKING_PAYMENT = "Transferencia bancaria";
let ERROR_MSG = "Ha habido un error :(, verifica qué pasó.";

//Función que se utiliza para actualizar los costos de publicación
function updateTotalCosts() {

}

function updateSubtotal(array) {
    for (let i = 0; i < array.length; i++)
        newArticleCount = document.getElementById(`articleCount` + i).value;
    article = array[0]
    article.count.value = newArticleCount;
    alert("Nueva cantidad: " + newArticleCount);
    showArticles(array);
}

function showPaymentTypeNotSelected() {

}

function hidePaymentTypeNotSelected() {

}

function showArticles(array) {
    let htmlContentToAppend = "";
    let subtotal = 0;
    for (let i = 0; i < array.length; i++) {
        let article = array[i];
        htmlContentToAppend += `
            <div class="row">
                <div class="col-3">
                    <img class="rounded float-left img-thumbnail" src="` + article.src + `">
                </div>
                <div class="col-7">
                    <div class="text-left">
                        <h5>` + article.name + `</h5>
                        <p> Precio unitario: ` + article.currency + ` ` + article.unitCost + `</p>
                        
                        <div class="form-row">
                        <p>Cantidad: </p>
                        <div class="col-2">
                                <input class="form-control form-control-sm" id="articleCount`+ i +`" type="number" value="` + article.count + `" size="5">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <h5>Subtotal: ` + article.currency + ` ` + article.unitCost * article.count + `</h5>
                </div>
            </div>
            <hr>

        `
        subtotal += article.unitCost * article.count;
    }
    htmlContentToAppend += `
    <div align="right">
        <h3>Total: ` + subtotal + `</h3>
    </div>
    `
    document.getElementById("articlesInCart").innerHTML = htmlContentToAppend;
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(CART_INFO_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            articles = resultObj.data;
            articlesArray = articles.articles;
            showArticles(articlesArray);
        }
    });

    for (let i = 0; i < articlesArray.length; i++) {
        document.getElementById(`articleCount` + i).addEventListener("change", function () {
            let article = articlesArray[i];
            newArticleCount = document.getElementById(`articleCount` + i).value;
            article.count = newArticleCount;
            updateSubtotal(articlesArray);
        });
    };
});