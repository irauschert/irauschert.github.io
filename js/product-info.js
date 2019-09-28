var product = {};

function showImagesCarrousel(array){
    let htmlContentToAppend = "";
    let firstImageSrc = array[0];
    htmlContentToAppend += `
        <div id="myCarousel" class="carousel slide" data-ride="carousel">
            <ol class="carousel-indicators">
                <li data-target="#myCarousel" data-slide-to="0" class="active"></li>`
                for(let i = 1; i < array.length; i++){
                    htmlContentToAppend += `
                <li data-target="#myCarousel" data-slide-to="` + i + `"></li>
                    `
                };
            htmlContentToAppend +=`
            </ol> 
            <div class="carousel-inner align="center">
                <div class="item active">
                    <img src="` + firstImageSrc + `">
                </div>`;
                
                for(let i = 1; i < array.length; i++){
                    imageSrc = array[i];
                    htmlContentToAppend += `
                <div class="item">
                    <img src="` + imageSrc + `">
                </div>`
                };
            htmlContentToAppend +=`
            </div>
            <a class="left carousel-control" href="#myCarousel" data-slide="prev">
                <span class="glyphicon glyphicon-chevron-left"></span>
                <span class="sr-only">Previous</span>
            </a>
            <a class="right carousel-control" href="#myCarousel" data-slide="next">
                <span class="glyphicon glyphicon-chevron-right"></span>
                <span class="sr-only">Next</span>
            </a>
        </div>`
        document.getElementById("productImages").innerHTML = htmlContentToAppend;
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCT_INFO_URL).then(function(resultObj){
        if (resultObj.status === "ok") {
            product = resultObj.data;

            let productNameHTML = document.getElementById("productName");
            let productDescriptionHTML = document.getElementById("productDescription");
            let productCostHTML = document.getElementById("productCost");
            let productCurrencyHTML = document.getElementById("productCurrency");
            let productSoldCountHTML = document.getElementById("productSoldCount");
            let productCategoryHTML = document.getElementById("productCategory");

            productNameHTML.innerHTML = product.name;
            productDescriptionHTML.innerHTML = product.description;
            productCostHTML.innerHTML = product.cost;
            productCurrencyHTML.innerHTML = product.currency;
            productSoldCountHTML.innerHTML = product.soldCount;
            productCategoryHTML.innerHTML = product.category;

            //Muestro las imagenes en forma de carusel
            showImagesCarrousel(product.images);
        }
    });
});