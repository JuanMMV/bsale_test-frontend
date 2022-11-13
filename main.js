//categorias del navbar
const dropdownCategories = document.getElementById("dropdown-categories");
const templateDropdownCategories = document.getElementById("template-dropdowncategories").content;
//categorias del "sidebar"
const sidebarCategories = document.getElementById("sidebar-categories");
const templateSidebarCategories = document.getElementById("template-sidebarcategories").content;
//cardProductos
const containerCard = document.getElementById("container-card");
const templateCard = document.getElementById("template-card").content;
//logo
const logo = document.getElementById("logo");
//input buscar
const inputSearch = document.getElementById("input-search");
//boton Buscar
const buttonSearch = document.getElementById("button-search");
//descripción busqueda
const titlePage = document.getElementById("title-page");
//sidebar
const sidebar = document.getElementById("sidebar");
//fragment
const fragment = document.createDocumentFragment();
//eventos
dropdownCategories.addEventListener("click", (e) => {
  if (e.target.classList.contains("dropdown-item")) {
    selectCategory(e);
  } else {
    e.stopPropagation();
  }
});

sidebarCategories.addEventListener("click", (e) => {
  selectCategory(e);
});

logo.addEventListener("click", (e) => {
  dataInCard();
  e.stopPropagation();
});

inputSearch.addEventListener('keypress',(e)=>{
  if(e.key === "Enter"){
    if(e.target.value){
      searchProduct(e.target.value)
    }
  }
  e.stopPropagation();
})

buttonSearch.addEventListener('click',(e)=>{
  let nameProduct = ''
  nameProduct = inputSearch.value
  if(nameProduct){
    searchProduct(nameProduct)
  }
  e.stopPropagation();
})

// Conexiones API
const getCategories = async () => {
  try {
    const res = await fetch("https://bsaletest-backend-production.up.railway.app/api/categories");
    if (res.status === 200) {
      const data = await res.json();
      return data;
    } else {
      console.log("Error...");
    }
  } catch (error) {
    console.log(error);
  }
};

const getProducts = async () => {
  try {
    const res = await fetch("https://bsaletest-backend-production.up.railway.app/api");
    if (res.status === 200) {
      const data = await res.json();
      return data;
    } else {
      console.log("Error...");
    }
  } catch (error) {
    console.log(error);
  }
};

const getProductsCategory = async (idCategory) => {
  try {
    const res = await fetch(`https://bsaletest-backend-production.up.railway.app/api/${idCategory}`);
    if (res.status === 200) {
      const data = await res.json();
      return data;
    } else {
      console.log("Error...");
    }
  } catch (error) {
    console.log(error);
  }
};

const getProductsName = async (nameCategory) => {
  const name = JSON.stringify({name: nameCategory})
  try {
    const res = await fetch(`https://bsaletest-backend-production.up.railway.app/api/search/name`,
    {
      method: "POST",
      headers: {
				"Content-Type": "application/json",
			},
      body: name
    });
    if (res.status === 200) {
      const data = await res.json();
      return data;
    } else {
      console.log("Item no encontrado");
    }
  } catch (error) {
    console.log(error.message);
  }
};

//Pintar Template
const paintDropdown = (data) => {
  data.forEach((category) => {
    templateDropdownCategories.querySelector("button").textContent = category.name;
    templateDropdownCategories.querySelector("button").dataset.id = category.id;
    const clone = templateDropdownCategories.cloneNode(true);
    fragment.appendChild(clone);
  });
  dropdownCategories.appendChild(fragment);
};

const paintSidebar = (data) => {
  data.forEach((category) => {
    templateSidebarCategories.querySelector("button").textContent = category.name;
    templateSidebarCategories.querySelector("button").dataset.id = category.id;
    const clone = templateSidebarCategories.cloneNode(true);
    fragment.appendChild(clone);
  });
  sidebarCategories.appendChild(fragment);
};

const paintCard = (data) => {
  containerCard.innerHTML = "";
  titlePage.innerHTML = "";

  data.forEach((product) => {
    templateCard.querySelector("h5").textContent = product.name;
    templateCard.querySelector("h6").textContent = product.category;
    if(product.discount === 0){ 
      templateCard.querySelector('[name="price-total"]').textContent = "$" + product.price;
      templateCard.querySelector('[name="price"]').textContent = "";
      templateCard.querySelector('[name="discount-rate"]').textContent = "";
    }else {
      templateCard.querySelector('[name="price-total"]').textContent = "$" + calculateDiscount(product.price, product.discount);
      templateCard.querySelector('[name="price"]').textContent = "$" + product.price;
      templateCard.querySelector('[name="discount-rate"]').textContent = product.discount + "%";
    }
    
    if (product.image === null || product.image === undefined || product.image === "") {
      templateCard.querySelector("img").setAttribute("src", "./images/sinImagen.jpg");
    } else {
      templateCard.querySelector("img").setAttribute("src", product.image);
    }
    const clone = templateCard.cloneNode(true);
    fragment.appendChild(clone);
  });

  containerCard.appendChild(fragment);
};

//Pasar datos de API a template.
const dataCategories = async () => {
  const categories = await getCategories();
  paintDropdown(categories);
  paintSidebar(categories);
  sidebar.setAttribute("class", "mx-5 d-none d-xxl-block mt-5 ms-1");
};

const dataInCard = async () => {
  const products = await getProducts();
  paintCard(products);
  titlePage.innerHTML = "Productos" + " " + products.length;
};

//funcionalidades
const selectCategory = async (e) => {
  const idCategory = e.target.dataset.id;
  const nameCategory = e.target.textContent;
  const datos = await getProductsCategory(idCategory);
  paintCard(datos);
  titlePage.innerHTML = nameCategory + " " + datos.length;
  e.stopPropagation();
};

const searchProduct = async (nameProduct) => {
  if (nameProduct === "") {
    return dataInCard();
  }
  const datos = await getProductsName(nameProduct);
  if (datos) {
    paintCard(datos);
    titlePage.innerHTML = nameProduct + " " + datos.length;
  } else {
    titlePage.innerHTML = "producto no encontrado";
    containerCard.innerHTML = "";
  }
  //e.stopPropagation();
};

//porcentaje de descuento
const calculateDiscount = (price, discount) =>{
  let calculateDiscount = 0
  let total = 0
  calculateDiscount = (price*(discount/100))
  total = Math.round(price - calculateDiscount)
  return total
}


//carga inicial
window.onload = () => {

  dataCategories();
  dataInCard();
  console.log('cargue!!!')
};
