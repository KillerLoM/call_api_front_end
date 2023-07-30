
var productApi = 'http://localhost:8080/get/products';
var saveApi = "http://localhost:8080/save/products"
var deleteApi = "http://localhost:8080/delete/products";
var updateApi = "http://localhost:8080/update/products";
function start(){
    getProducts(function(products){
        handleGetProducts(products,renderProduct);
    });
    handleCreate();
    handleDelete();
    handleUpdateProduct();
}
start();
function getProducts(callback){
    
    fetch(productApi)
        .then(function(response){
            return response.json();
        })
        .then(callback);

}
function handleGetProducts(product, callback){
    var temp_1 = []; 
    for (var i = 0; i < product.length; ++i){
        var temp = product[i].code;
         temp_1.push(parseInt(temp[1]+ temp[2] + temp[3])) ;
    }
    for(var i = 0; i < product.length-1;++i){
        for(var j = i+1; j < product.length;++j){
            if(temp_1[j] < temp_1[i]){
              var temp_2 = product[j];
              product[j] = product[i];
              product[i] = temp_2;
              console.log(product)    
            }
        }
    }
    callback(product);
}
function createProduct(data, callback){
    var options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }
    fetch(saveApi, options)
    .then(function(response){
            response.json();
            console.log(response);
          })
    .then(callback)
}
function deleteProduct(code) {
    var options = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        },
    };
    fetch(deleteApi + "/" + code, options)
        .then(function(response){
            response.json();
        })
        .then(function(){
            var codeItem = document.querySelector(".code-item-" + code);
            if(codeItem){
                codeItem.remove();
            } 
        });
}


function handleDelete() {
    var deleteBtn = document.querySelector("#delete");
    deleteBtn.onclick = function () {
        var buttons = document.querySelectorAll(".delete-btn");
        for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].style.display == "none")
            {buttons[i].style.display = "block";}
            else buttons[i].style.display = "none";
        }
    };
}

function renderProduct(products) {
    var listProductsBlock = document.querySelector("#post-block");

    var htmls = "<div>";
    for (var i = 0; i < products.length; i++) {
        var product = products[i];
        if (i % 4 === 0) {
            htmls += `<div class="row">`;
        }
        htmls += `
            <li class ="code-item-${product.code}">
                <h2>${product.code} </h2>
                <h3>     ${product.name}</h3>
                <p>Loại: ${product.category} </p>
                <p>Thương hiệu: ${product.brand}</p>
                <br><button class="details-btn">Xem chi tiết</button>
                <div class="details" style="display: none;">
                    <br><p>Mô tả: ${product.description} </p>
                    Kiểu: ${product.type} 
                </div>
                <div class="delete-btn" style="display: none;">
                    <button data-code="${product.code}">Xóa</button>
                </div>
                <div class="update-btn" style="display: none;">
                    <button data-code="${product.code}">Cập nhật</button>
                </div>
            </li>
            `;
    }
    listProductsBlock.innerHTML = htmls;

    var detailsBtns = document.querySelectorAll(".details-btn");
    for (var i = 0; i < detailsBtns.length; i++) {
        detailsBtns[i].addEventListener("click", function () {
            var details = this.nextElementSibling;
            if (details.style.display === "none") {
                details.style.display = "block";
            } else {
                details.style.display = "none";
            }
        });
    }

    var deleteBtns = document.querySelectorAll(".delete-btn button");
    for (var i = 0; i < deleteBtns.length; i++) {
        deleteBtns[i].addEventListener("click", function () {
            var code = this.getAttribute("data-code");
            deleteProduct(code);
        });
    }

    var updateBtns = document.querySelectorAll(".update-btn button");
    for (var i = 0; i < updateBtns.length; i++) {
        updateBtns[i].addEventListener("click", function () {
            var code = this.getAttribute("data-code");      
            getData(code);
        });
    }
}

function getData(code) {
    var name1 = document.querySelector('input[name="nameu"]').value;
    var description1 = document.querySelector('input[name="descriptionu"]').value;
    var type1 = document.querySelector('input[name="typeu"]').value;
    var brand1 = document.querySelector('input[name="brandu"]').value;
    var category1 = document.querySelector('input[name="categoryu"]').value;
    var form = {
        code : code,
        name: name1,
        description: description1,
        type: type1,
        brand: brand1,
        category: category1,
    }
    // Pass the product code as a second argument to the updateProduct function
    updateProduct(form, code, function() {
        start();
        console.log(form);
    });
}

// Update the updateProduct function to accept a second argument code
function updateProduct(data, code, callback) {
    var options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }
    fetch(updateApi + '/' + code, options)
        .then(function(response) {
            response.json();
            console.log(response);
        })
        .then(callback)
}

function handleUpdateProduct(){

    var updateProductForm = document.querySelector('#update-product-form');
    var updateBtn = document.querySelector('#update-product-button');
    updateBtn.onclick = function(){
        if (updateProductForm.style.display == 'none'){
            var buttonsudate = document.querySelectorAll(".update-btn");
            for (var i = 0; i < buttonsudate.length; i++) {
                if (buttonsudate[i].style.display == "none" )
                {buttonsudate[i].style.display = "block";
                updateProductForm.style.display = "block";}
        
        else  
            updateProductForm.style.display = 'none';
    }
        }
}
}
function handleCreate(){
    var createProductForm = document.querySelector('#create-product-form');
    var createBtn = document.querySelector('#create-product-button');
    
    createBtn.onclick = function(){
        if (createProductForm.style.display == 'none'){
            createProductForm.style.display = 'block';
        }
        else  
            createProductForm.style.display = 'none';
        console.log('hello');
    }
    var okButton = document.querySelector('#ok-button');
    okButton.addEventListener('click', function() {
        createProductForm.style.display = 'none';
        var code = document.querySelector('input[name="code"]').value;
        var name = document.querySelector('input[name="name"]').value;
        var description = document.querySelector('input[name="description"]').value;
        var type = document.querySelector('input[name="type"]').value;
        var brand = document.querySelector('input[name="brand"]').value;
        var category = document.querySelector('input[name="category"]').value;
        var formData = {
            code: code,
            name: name,
            description: description,
            type: type,
            brand: brand,
            category: category,
        };
        createProduct(formData, function(){
            start();
        });
    });
}      

