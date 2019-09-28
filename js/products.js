const ORDER_ASC_BY_PRICE = "↑";
const ORDER_DESC_BY_PRICE = "↓";
var currentProductsArray = [];
var currentSortCriteria = undefined;
var minPrice = undefined;
var maxPrice = undefined;

function sortProducts(criteria, array) {
    let result = [];
    if (criteria === ORDER_ASC_BY_PRICE) {
        result = array.sort(function (a, b) {
            if (a.cost < b.cost) { return -1; }
            if (a.cost > b.cost) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_DESC_BY_PRICE) {
        result = array.sort(function (a, b) {
            if (a.cost > b.cost) { return -1; }
            if (a.cost < b.cost) { return 1; }
            return 0;
        });
    }
    return result;
};

function showProductsList(array) {
    let htmlContentToAppend = "";
    for (let i = 0; i < array.length; i++) {
        let product = array[i];

        if (((minPrice == undefined) || (minPrice != undefined && parseInt(product.cost) >= minPrice)) &&
            ((maxPrice == undefined) || (maxPrice != undefined && parseInt(product.cost) <= maxPrice))) {

            htmlContentToAppend += `
        <div class="container-fluid">
            <div class="row">
                <div class="col-1">
                </div>
                <div class="col-10">
                    <div class="card">
                        <div class="card-body">
                            <div>
                                <img width="30%" hspace="20" class="rounded float-left img-thumbnail" src="` + product.imgSrc + `">
                            </div>
                            <div>
                                <h2>` + product.name + `</h2>
                            </div>
                            <div class="text-right">
                                <h4>` + product.currency + ` ` + product.cost + `</h4>
                            </div>
                            <div>
                                <small class="text-muted">` + product.soldCount + ` artículos vendidos</small>
                                <p>` + product.description + `</p>
                                <a class="text-info" href="product-info.html">Ver mas Informacion del producto</a>
                            </div>
                        </div>
                        <div class="card-footer">
                        <center>
                            <button type="button" class="btn btn-block">
                               <span class="glyphicon glyphicon-shopping-cart"></span> Agregar a Carrito
                            </button></center>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <br>
        `
            document.getElementById("productsList").innerHTML = htmlContentToAppend;
        }
    }
}

function sortAndShowProducts(sortCriteria, productsArray) {
    currentSortCriteria = sortCriteria;
    if(productsArray != undefined){
        currentProductsArray = productsArray;
    }
    currentProductsArray = sortProducts(currentSortCriteria, productsArray);
    showProductsList(currentProductsArray);
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            productsArray = resultObj.data;
            showProductsList(productsArray);
        }
    });

    document.getElementById("sortAsc").addEventListener("click", function () {
        sortAndShowProducts(ORDER_ASC_BY_PRICE, productsArray);
    });

    document.getElementById("sortDesc").addEventListener("click", function () {
        sortAndShowProducts(ORDER_DESC_BY_PRICE, productsArray);
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function () {
        document.getElementById("rangeFilterPriceMin").value = "";
        document.getElementById("rangeFilterPriceMax").value = "";

        minPrice = undefined;
        maxPrice = undefined;

        showProductsList(productsArray);
    });

    document.getElementById("rangeFilterPriceMin").addEventListener("change", function () {
        maxPrice = document.getElementById("rangeFilterPriceMax").value;
        minPrice = document.getElementById("rangeFilterPriceMin").value;

        if ((minPrice != undefined) && (minPrice != "") && (parseInt(minPrice)) >= 0) {
            minPrice = parseInt(minPrice);
        }
        else {
            minPrice = undefined;
        }

        if ((maxPrice != undefined) && (maxPrice != "") && (parseInt(maxPrice)) >= 0) {
            maxPrice = parseInt(maxPrice);
        }
        else {
            maxPrice = undefined;
        }

        showProductsList(productsArray);
    });

    document.getElementById("rangeFilterPriceMax").addEventListener("change", function () {
        maxPrice = document.getElementById("rangeFilterPriceMax").value;
        minPrice = document.getElementById("rangeFilterPriceMin").value;

        if ((minPrice != undefined) && (minPrice != "") && (parseInt(minPrice)) >= 0) {
            minPrice = parseInt(minPrice);
        }
        else {
            minPrice = undefined;
        }

        if ((maxPrice != undefined) && (maxPrice != "") && (parseInt(maxPrice)) >= 0) {
            maxPrice = parseInt(maxPrice);
        }
        else {
            maxPrice = undefined;
        }

        showProductsList(productsArray);
    });
});