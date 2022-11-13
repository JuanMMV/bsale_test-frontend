# Bsale test - front end

Front end desarrollado con Vanillajs, bootstrap 5 para los estilos y fetch async await para la conexión con la API.

Para cargar los datos al html desde javascript se utilizó template, fragment y en menor medida innerHTML.

**Ejemplo Template**

- **HTML**:
```
  <template id="template-sidebarcategories">
    <button class="list-group-item list-group-item-action" href="#"></button>
  </template>
```
- **Javascript**
```
const sidebarCategories = document.getElementById("sidebar-categories");
const templateSidebarCategories = document.getElementById("template-sidebarcategories").content;
const fragment = document.createDocumentFragment();
...

const paintSidebar = (dataAPI) => {
  dataAPI.forEach((category) => {
    templateSidebarCategories.querySelector("button").textContent = category.name;
    templateSidebarCategories.querySelector("button").dataset.id = category.id;
    const clone = templateSidebarCategories.cloneNode(true);
    fragment.appendChild(clone);
  });
  sidebarCategories.appendChild(fragment);
};
```

**Ejemplo innerHTML**
```
const titlePage = document.getElementById("title-page");
...
titlePage.innerHTML = "producto no encontrado";
```


- ## Link deploy
  - https://bsale-test-1.netlify.app


## Partes de la aplicación
- **Tarjeta de los productos**  
Las tarjetas muestran: imagen, nombre, categoría, un botón para agregar al carro Y precio. Si el producto tiene descuento, se tachara el precio original, aparecerá el descuento y mostrara el precio con el descuento aplicado.  

  **Ejemplo tarjeta**  

  ![Alt text](https://res.cloudinary.com/dgrh1ybqq/image/upload/v1668361321/bsale-test/ProductoDescuento_2_dvpxtm.png)

  **Javascript**
  ```
  //calcula el precio con descuento
  
  const calculateDiscount = (price, discount) =>{
    let calculateDiscount = 0
    let total = 0
    calculateDiscount = (price*(discount/100))
    total = Math.round(price - calculateDiscount)
    return total
  }
  ```
  
  ```
  ...
  
    if(product.discount === 0){ 
      templateCard.querySelector('[name="price-total"]').textContent = "$" + product.price;
      templateCard.querySelector('[name="price"]').textContent = "";
      templateCard.querySelector('[name="discount-rate"]').textContent = "";
    }else {
      templateCard.querySelector('[name="price-total"]').textContent = "$" + calculateDiscount(product.price, product.discount);
      templateCard.querySelector('[name="price"]').textContent = "$" + product.price;
      templateCard.querySelector('[name="discount-rate"]').textContent = product.discount + "%";
    }
    ...
  
  ```
  - Si el producto no tiene imagen, se mostrara una imagen por defecto.  
  **Ejemplo tarjeta**  

  ![Alt text](https://res.cloudinary.com/dgrh1ybqq/image/upload/v1668356174/bsale-test/ProductoImagen_s6fx9f.png)

  **Javascript**
  ```

    ...

    if (product.image === null || product.image === undefined || product.image === "") {
      templateCard.querySelector("img").setAttribute("src", "./images/sinImagen.jpg");
    } else {
      templateCard.querySelector("img").setAttribute("src", product.image);
    }

    ...

  ```


- **Barra lateral**  
  La barra lateral muestra todas las categorías. Solo se muestra desde los 1400px.  

  ![Alt text](https://res.cloudinary.com/dgrh1ybqq/image/upload/v1668365625/bsale-test/b1_p2gt6j.png)  
  
  Por debajo de los 1400px se oculta y parece un drowpdown con las categorías, para darle todo el espacio a las tarjetas con los productos.  

  ![Alt text](https://res.cloudinary.com/dgrh1ybqq/image/upload/v1668365625/bsale-test/b2_bnh5vn.png)  

  Desde lo 992px hacia abajo se vería de la siguiente forma  
  
  ![Alt text](https://res.cloudinary.com/dgrh1ybqq/image/upload/v1668365625/bsale-test/b3_qhmsia.png)  


- **Input buscar**  
  Campo de texto para buscar productos por nombre funciona tanto presionado la tecla ENTER como con el botón de lupa.  
  
  ![Alt text](https://res.cloudinary.com/dgrh1ybqq/image/upload/v1668366152/input_ffejxy.png)    


- **Descripcion busqueda**  
  Proporciona información de lo que se está filtrando, ya si se busca por nombre o por categoría, si no encuentra elementos mostrara por pantalla el texto "producto no encontrado"  

    ![Alt text](https://res.cloudinary.com/dgrh1ybqq/image/upload/v1668366546/t1_dmmsat.png)  


- **Logo**  
  El logo tiene un evento click que le permite cargar la página por defecto(mostrando todos los productos)  

  ![Alt text](https://res.cloudinary.com/dgrh1ybqq/image/upload/v1668366152/logo_xnbk2a.png) 

## Funcionalidades
- **Primera carga**  
se mostrarán todos los productos recibidos desde la API  

  ![Alt text](https://res.cloudinary.com/dgrh1ybqq/image/upload/v1668356174/bsale-test/paginaCompleta_krked8.png)


- **Seleccionar categorías**  

  En esta "barra lateral" se muestran todas las categorias. Cuando se selecciona alguna de ellas, envia una solitud a la API que devuelve un json con los elementos filtrados por id de la categoria.  
**Ejemplo**  

  ![Alt text](https://res.cloudinary.com/dgrh1ybqq/image/upload/v1668356174/bsale-test/BusquedaCategoria_btuxkc.png)  

**Solicitud API**  
```
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
```
**Id categoria**
```
const selectCategory = async (e) => {
  const idCategory = e.target.dataset.id;
  const nameCategory = e.target.textContent;
  const datos = await getProductsCategory(idCategory);
  paintCard(datos);
  titlePage.innerHTML = nameCategory + " " + datos.length;
  e.stopPropagation();
};
```

- **Busqueda por nombre**  

  En el input del navbar, se puede buscar un producto por nombre. Al momento de ingresar algo en el campo y luego presionar la tecla ENTER o el botón con la lupa, enviara una solicitud POST a la API con la siguiente estructura:  
```
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

```

Retorna el siguiente json
```
[
  {
    "id": 48,
    "name": "SPRITE 1 1/2 Lts",
    "price": 1500,
    "discount": 0,
    "image": "https://dojiw2m9tvv09.cloudfront.net/11132/product/sprite-lata-33cl5575.jpg",
    "category": "bebida"
  }
]
```
Mostrará por pantalla lo siguiente  

![Alt text](https://res.cloudinary.com/dgrh1ybqq/image/upload/v1668356174/bsale-test/BusquedaNombre_b4r65h.png)  
