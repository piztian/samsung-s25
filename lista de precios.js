<div id="product-container" style="font-family: Arial, sans-serif; background: #f7f7f7; padding: 20px; max-width: 900px; margin: auto;">

  <img src="https://piztian.github.io/samsung-s25/imagenes/Celucenter-500x260.png" style="max-width: 200px; display: block; margin: auto;" alt="Celucenter" />
  <h1 style="text-align: center; color: #222; margin-top: 20px;">Catálogo de Productos</h1>

  <!-- Filtros -->
  <div style="text-align: center; margin-top: 20px;">
    <label>Buscar producto: </label>
    <input type="text" id="busquedaNombre" placeholder="Ej. iPhone" style="padding: 5px; margin: 10px; width: 180px;">

    <label>Marca: </label>
    <select id="marcaFiltro" style="padding: 5px; margin: 10px;">
      <option value="">Todas</option>
    </select>

    <label>Precio mínimo: </label>
    <input type="number" id="precioMin" placeholder="Ej. 2000" style="padding: 5px; margin: 10px; width: 100px;">

    <label>Precio máximo: </label>
    <input type="number" id="precioFiltro" placeholder="Ej. 10000" style="padding: 5px; margin: 10px; width: 100px;">

    <button onclick="filtrarProductos()" style="padding: 5px 10px; background-color: orange; color: white; border: none; border-radius: 3px;">Aplicar Filtros</button>
    <button onclick="borrarFiltros()" style="padding: 5px 10px; margin-left: 10px; background-color: #dc3545; color: white; border: none; border-radius: 3px;">Borrar Filtros</button>
  </div>

  <div id="productos" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; margin-top: 30px;"></div>

</div>

<script>
let productosOriginales =[];

fetch("https://script.google.com/macros/s/AKfycbz992UqY5j98exfNsykOaoUOI6TEyUk_BdP_mm4haIGlXDJrx0xTgnmNqMr4Bg3suzFTQ/exec")
  .then(res => res.json())
  .then(data =>{
    productosOriginales = data;
    renderizarProductos(productosOriginales);
    cargarMarcasUnicas(productosOriginales);
  });

function cargarMarcasUnicas(data){
  const select = document.getElementById("marcaFiltro");
  const marcas =[...new Set(
    data.map(p => (p["NOMBRE CATEGORIA"]|| "").trim())
  )].filter(Boolean).sort();

  marcas.forEach(marca =>{
    const option = document.createElement("option");
    option.value = marca;
    option.textContent = marca;
    select.appendChild(option);
  });
}

function filtrarProductos(){
  const marca = document.getElementById("marcaFiltro").value.toLowerCase();
  const precioMax = parseFloat(document.getElementById("precioFiltro").value);
  const precioMin = parseFloat(document.getElementById("precioMin").value);
  const textoBusqueda = document.getElementById("busquedaNombre").value.toLowerCase();

  let filtrados = productosOriginales.filter(p =>{
    const nombre = (p["PRODUCTO"]|| "").toLowerCase();
    const precio = parseFloat(p["PRECIO PUBLICO"]);
    const marcaProd = (p["NOMBRE CATEGORIA"]|| "").trim().toLowerCase();

    return (
      (!marca || marcaProd === marca) &&
      (!isNaN(precioMin) ? precio >= precioMin : true) &&
      (!isNaN(precioMax) ? precio <= precioMax : true) &&
      (!textoBusqueda || nombre.includes(textoBusqueda))
    );
  });

  renderizarProductos(filtrados);
}

function borrarFiltros(){
  document.getElementById("busquedaNombre").value = "";
  document.getElementById("marcaFiltro").value = "";
  document.getElementById("precioMin").value = "";
  document.getElementById("precioFiltro").value = "";
  renderizarProductos(productosOriginales);
}

function renderizarProductos(lista){
  const container = document.getElementById("productos");
  container.innerHTML = "";

  lista.forEach(producto =>{
    const tarjeta = document.createElement("div");
    tarjeta.style.background = "white";
    tarjeta.style.border = "1px solid #ddd";
    tarjeta.style.borderRadius = "8px";
    tarjeta.style.padding = "15px";
    tarjeta.style.width = "260px";
    tarjeta.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";

    const nombreOriginal = producto["PRODUCTO"]|| "";
    const codigo = producto["CODIGO"]|| "";
    const precio = parseFloat(producto["PRECIO PUBLICO"]);
    const nombreBusqueda = encodeURIComponent(nombreOriginal.trim());
    const enlaceFoto = `https://www.google.com/search?tbm=isch&q=${nombreBusqueda}`;

    tarjeta.innerHTML = `
      <h3 style="color: #333; font-size: 1.1em; margin-bottom: 5px;">${nombreOriginal}</h3>
      <a href='${enlaceFoto}' target='_blank' style='font-size: 0.9em; color: #007bff;'>📸 Ver foto</a>
      <p style="color: #666; font-size: 0.9em;">Marca: ${producto["NOMBRE CATEGORIA"]|| "-"}</p>
      <p style="font-size: 1.2em; font-weight: bold; color: #28a745;">$${!isNaN(precio) ? precio.toFixed(2) : '-'}</p>
      <p style="font-size: 0.85em; color: #555;">Código: <strong>${codigo}</strong></p>
      <a href="https://wa.link/7rrk7n" target="_blank" style="display: inline-block; margin-top: 10px; padding: 8px 15px; background-color: #25d366; color: white; border-radius: 5px; text-decoration: none;">💬 Pedir</a>
    `;

    container.appendChild(tarjeta);
  });
}
</script>
