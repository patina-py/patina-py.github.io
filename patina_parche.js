// PÁTINA - Parche sincronización CAVI - FIX BUG VISIBLE
// GitHub Pages + Google Apps Script (conexión por proyecto)
// Flujo: Admin guarda -> POST a GAS (exec URL de Pátina) ANTES de recargar -> clientes ven cambio en máximo 15s, sync cada 15s.
// Respaldo en localStorage para que la tienda ande aunque Google falle un momento.
(function(){
  "use strict";
  var GAS_URL = "https://script.google.com/macros/s/AKfycbznKXsIvfuR_kb4UIwHk2QtjaqOlGUW9imJFjXDKfWuanUCFZOtbPLSXVlwAx8mr_I2UQ/exec";
  try{ var saved = localStorage.getItem("patina_gas_url_v1"); if(saved) GAS_URL = saved; }catch(e){}
  window.PATINA_GAS_URL = GAS_URL;
  var LS_PRODUCTS = "patina_v25_admin";
  var LS_CATS = "patina_v25_cats";
  var LS_LAST_SYNC = "patina_last_sync_v1";
  var SYNC_MS = 15000;
  var syncing = false;
  var lastLocalHash = "";
  var lastPostAt = 0; // para no pisar con dato viejo de Google justo después de guardar

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

  // POST inmediato, llamado desde Admin ANTES de recargar (window.patinaSyncNow)
  // Usa keepalive para que el envío no se corte con el reload.
  function postNow(){
    if(!GAS_URL) return;
    var loc = getLocal();
    if(!loc.products) return;
    lastLocalHash = loc.hash;
    lastPostAt = Date.now();
    try{
      var payload = { action:"save_all", productos: JSON.parse(loc.products), categorias: loc.cats ? JSON.parse(loc.cats) : [], password:"PATINA2026" };
      var body = JSON.stringify(payload);
      // keepalive + no-cors: sobrevive al reload
      fetch(GAS_URL, { method:"POST", mode:"no-cors", keepalive:true, headers:{ "Content-Type":"text/plain;charset=utf-8" }, body: body }).catch(function(){});
      // Respaldo con sendBeacon si el navegador lo soporta
      try{ if(navigator.sendBeacon) navigator.sendBeacon(GAS_URL, new Blob([body], {type:"text/plain"})); }catch(e){}
    }catch(e){}
  }
  window.patinaSyncNow = postNow;

  function postToGAS(){
    if(!GAS_URL || syncing) return;
    var loc = getLocal();
    if(!loc.products) return;
    if(loc.hash === lastLocalHash) return;
    syncing = true;
    try{
      var payload = { action:"save_all", productos: JSON.parse(loc.products), categorias: loc.cats ? JSON.parse(loc.cats) : [], password:"PATINA2026" };
      fetch(GAS_URL, { method:"POST", mode:"no-cors", keepalive:true, headers:{ "Content-Type":"text/plain;charset=utf-8" }, body: JSON.stringify(payload) })
        .then(function(){ lastLocalHash = loc.hash; lastPostAt = Date.now(); syncing=false; })
        .catch(function(){ syncing=false; });
    }catch(e){ syncing=false; }
  }

  function getFromGAS(){
    if(!GAS_URL) return;
    // Si acabamos de guardar (menos de 20s), NO pisar con dato viejo de Google. Es el bug que hacía que volver a tildar no funcione.
    if(Date.now() - lastPostAt < 20000) return;
    fetch(GAS_URL + (GAS_URL.indexOf("?")!==-1 ? "&" : "?") + "t=" + Date.now())
      .then(function(r){ return r.json(); })
      .then(function(data){
        if(!data || !Array.isArray(data) || !data.length) return;
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
          var editing = document.querySelector(".patina-overlay.open, #patinaFormOverlay.open");
          if(!editing) location.reload();
        }
      })
      .catch(function(){});
  }

  lastLocalHash = getLocal().hash;
  setInterval(function(){ postToGAS(); getFromGAS(); }, SYNC_MS);
  setTimeout(getFromGAS, 1500);
  window.patinaSetGasUrl = function(url){ try{ localStorage.setItem("patina_gas_url_v1", url); GAS_URL = url; window.PATINA_GAS_URL = url; }catch(e){} };
})();
