// PÁTINA - Parche sincronización CAVI
// GitHub Pages + Google Apps Script (conexión por proyecto)
// Cada página tiene SU propio proyecto de Apps Script, con SU propia URL exec.
// Flujo: Admin guarda -> POST a GAS (exec URL de Pátina) -> todos los clientes ven el cambio en máximo 15 segundos, con sincronización automática cada 15 segundos.
// También guarda en localStorage como respaldo, para que la tienda ande aunque Google falle un momento.
// Archivos en GitHub: index.html + patina_parche.js
(function(){
  "use strict";
  // ===== CONFIG PÁTINA - PEGA AQUÍ TU EXEC URL DE PÁTINA (NO la de CAVI) =====
  var GAS_URL = "https://script.google.com/macros/s/AKfycbznKXsIvfuR_kb4UIwHk2QtjaqOlGUW9imJFjXDKfWuanUCFZOtbPLSXVlwAx8mr_I2UQ/exec"; // <-- PEGA AQUÍ TU URL exec de Pátina, ej: https://script.google.com/macros/s/XXXX/exec
  // Si ya guardaste la URL en Admin, se usa esa (localStorage tiene prioridad)
  try{ var saved = localStorage.getItem("patina_gas_url_v1"); if(saved) GAS_URL = saved; }catch(e){}
  window.PATINA_GAS_URL = GAS_URL;

  var LS_PRODUCTS = "patina_v25_admin";
  var LS_CATS = "patina_v25_cats";
  var LS_LAST_SYNC = "patina_last_sync_v1";
  var SYNC_MS = 15000; // 15 segundos
  var syncing = false;
  var lastLocalHash = "";

  function hashStr(s){ var h=0; s=String(s||""); for(var i=0;i<s.length;i++){ h=(h*31 + s.charCodeAt(i))|0; } return String(h); }
  function getLocal(){
    try{
      var raw = localStorage.getItem(LS_PRODUCTS) || "";
      var cats = localStorage.getItem(LS_CATS) || "";
      return { products: raw, cats: cats, hash: hashStr(raw+"|"+cats) };
    }catch(e){ return {products:"",cats:"",hash:""}; }
  }
  function setLocal(products, cats){
    try{
      if(products!=null) localStorage.setItem(LS_PRODUCTS, products);
      if(cats!=null) localStorage.setItem(LS_CATS, cats);
      localStorage.setItem(LS_LAST_SYNC, String(Date.now()));
    }catch(e){}
  }

  // --- POST a GAS cuando Admin guarda (detecta cambio en localStorage) ---
  function postToGAS(){
    if(!GAS_URL) return;
    if(syncing) return;
    var loc = getLocal();
    if(!loc.products) return;
    if(loc.hash === lastLocalHash) return; // sin cambios, no enviar
    syncing = true;
    try{
      var payload = { action:"save_all", productos: JSON.parse(loc.products), categorias: loc.cats ? JSON.parse(loc.cats) : [], password:"PATINA2026" };
      fetch(GAS_URL, { method:"POST", mode:"no-cors", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(payload) })
        .then(function(){ lastLocalHash = loc.hash; syncing=false; })
        .catch(function(){ syncing=false; });
    }catch(e){ syncing=false; }
  }

  // --- GET de GAS cada 15s para clientes ---
  function getFromGAS(){
    if(!GAS_URL) return;
    fetch(GAS_URL + (GAS_URL.indexOf("?")!==-1 ? "&" : "?") + "t=" + Date.now())
      .then(function(r){ return r.json(); })
      .then(function(data){
        if(!data || !Array.isArray(data) || !data.length) return;
        // data viene como array de productos desde GAS (formato Apps Script)
        // Convertir a formato Admin: nombre, precio, precioDescuento, categoria, stock, descripcion, etiqueta, visible, foto
        var norm = data.map(function(d, idx){
          return {
            id: String(d.id || (idx+1)).padStart(4,"0"),
            nombre: d.nombre || d.name || "",
            precio: Number(d.precio || d.price || 0),
            precioDescuento: (d.precioDescuento===""||d.precioDescuento==null) ? null : Number(d.precioDescuento),
            categoria: d.categoria || d.category || "accesorio",
            stock: d.stock!=null ? String(d.stock) : "",
            descripcion: d.descripcion || d.desc || "",
            etiqueta: d.etiqueta || "",
            visible: String(d.visible).toLowerCase()!=="false" && String(d.visible).toLowerCase()!=="oculto" && String(d.visible).toLowerCase()!=="0",
            foto: d.foto || d.img || ""
          };
        });
        var newRaw = JSON.stringify(norm);
        var loc = getLocal();
        if(hashStr(newRaw+"|"+loc.cats) !== loc.hash){
          setLocal(newRaw, null);
          lastLocalHash = hashStr(newRaw+"|"+loc.cats);
          // Si no está editando en Admin, recargar para mostrar cambio en máximo 15s
          var editing = document.querySelector(".patina-overlay.open, #patinaFormOverlay.open");
          if(!editing) location.reload();
        }
      })
      .catch(function(){ /* Google falló un momento, se sigue con localStorage */ });
  }

  // Inicializar hash
  lastLocalHash = getLocal().hash;

  // Detectar guardado en Admin: Admin hace saveAdmin() -> localStorage + location.reload()
  // El parche detecta el cambio en el próximo ciclo de 15s y lo envía por POST.
  // Además, enganchar patinaGuardar si existe, para enviar al instante sin esperar 15s.
  function hookGuardar(){
    try{
      if(window.patinaGuardar && !window.patinaGuardar._parche){
        var orig = window.patinaGuardar;
        var wrapped = function(){
          var r = orig.apply(this, arguments);
          setTimeout(postToGAS, 300);
          return r;
        };
        wrapped._parche = true;
        window.patinaGuardar = wrapped;
      }
    }catch(e){}
  }
  hookGuardar();
  setInterval(hookGuardar, 2000);

  // Ciclo cada 15 segundos: POST si hay cambios locales + GET para clientes
  setInterval(function(){
    postToGAS();
    getFromGAS();
  }, SYNC_MS);

  // Primera carga: intentar traer de GAS para tener lo último
  setTimeout(getFromGAS, 1500);

  // Exponer para Admin: guardar URL exec desde Admin si hace falta
  window.patinaSetGasUrl = function(url){
    try{ localStorage.setItem("patina_gas_url_v1", url); GAS_URL = url; window.PATINA_GAS_URL = url; }catch(e){}
  };
})();
