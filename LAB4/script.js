window.onload = function () {
  fetch("product.json")
    .then(function(response){
      return response.json();
    })
    .then(function(json){
      product(json);
    })

  function product(json) {
    const category = document.getElementById('category');
    const search = document.getElementById('search');
    const sort = document.getElementById('sort');
    const submit = document.getElementById('filter-submit');
    let updated_category;
    let updated_search;
    let updated_sort = json;

    flex();
    submit.addEventListener("click", update);

    function update(){
      if(category.value == "ALL") updated_category = json;
      else{
        updated_category = json.filter(function(product){
          return product.category == category.value;
        })
      }

      if(search.value == "") updated_search = updated_category;
      else{
        updated_search = json.filter(function(product){
          return (product.category == search.value || product.name == search.value);
        })
      }

      let arr=[];
      for(let i in updated_search){
        arr.push(updated_search[i]);
      }
      if(sort.value == "UP"){
        arr.sort(function(i, j){
          return i["price"] - j["price"];
        });
      }
      else if(sort.value == "DOWN"){
        arr.sort(function(j, i){
          return i["price"] - j["price"];
        });
      }
      updated_sort = arr;
      
      flex();
    }

    function flex(){
      var cnt = 0;
      var imageContainer = document.getElementById('flex-image');
      imageContainer.innerHTML="";

      loadProducts(4);
      window.addEventListener('scroll', function() {
        if ((window.innerHeight + window.pageYOffset) >= (document.body.offsetHeight - 100)) {
          loadProducts(2);
        }
      });

      function loadProducts(loadCnt){
        for(var i=cnt ; i<Math.min(cnt+loadCnt, updated_sort.length) ; i++){
          const div = document.createElement("div");
          const img = document.createElement("img");
          const product = updated_sort[i];
          div.className = "flex-divide";
          div.addEventListener("click", function(event){
            event.preventDefault();
            loadInfo(product, div);
          });
          img.src = `images/${product.jpg}`;
          img.alt = `${product.name}`;
          div.appendChild(img);
          imageContainer.appendChild(div);
        }
        cnt = cnt+loadCnt;
      }
  
      function loadInfo(product, div){
        div.className = "flex-clicked";
        const name = document.createElement("p");
        const price = document.createElement("p");
        const div2 = document.createElement("div");
        name.innerText = product.name;
        price.innerText = "Price: " + product.price;
        div2.className = "detailname";
        div2.appendChild(name);
        div2.appendChild(price);
        div.appendChild(div2);
      }
    } 
  }
};


