// PÁTINA - Parche sincronización CAVI - FIX ANTI-BUCLE
// GitHub Pages + Google Apps Script (conexión por proyecto)
// Admin guarda -> POST a GAS ANTES de recargar -> clientes ven cambio en máximo 15s, sync cada 15s.
// NO recargar en bucle: solo si cambió algo real, y nunca si estás escribiendo o en Admin.
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
  var lastPostAt = 0;
  var lastAutoReloadAt = 0;

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
  // Comparación semántica: solo lo que se ve en tienda (id, nombre, precio, oferta, visible, categoria)
  // Ignora foto, descripción larga y formato, que es lo que hacía que el hash nunca coincida y recargue en bucle.
  function essential(list){
    try{
      var arr = typeof list === "string" ? JSON.parse(list) : list;
      if(!Array.isArray(arr)) return "";
      return JSON.stringify(arr.map(function(d){
        return [ String(d.id||""), String(d.nombre||d.name||""), Number(d.precio||d.price||0), (d.precioDescuento==null||d.precioDescuento==="")?null:Number(d.precioDescuento), String(d.categoria||d.category||""), (d.visible===false)?"0":"1" ];
      }));
    }catch(e){ return ""; }
  }

  function postNow(){
    if(!GAS_URL) return;
    var loc = getLocal();
    if(!loc.products) return;
    lastLocalHash = loc.hash;
    lastPostAt = Date.now();
    try{
      var payload = { action:"save_all", productos: JSON.parse(loc.products), categorias: loc.cats ? JSON.parse(loc.cats) : [], password:"PATINA2026" };
      var body = JSON.stringify(payload);
      fetch(GAS_URL, { method:"POST", mode:"no-cors", keepalive:true, headers:{ "Content-Type":"text/plain;charset=utf-8" }, body: body }).catch(function(){});
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

  function isBusy(){
    try{
      // Estás escribiendo la clave o en Admin -> NO recargar
      var ae = document.activeElement;
      if(ae && (ae.tagName==="INPUT" || ae.tagName==="TEXTAREA" || ae.tagName==="SELECT")) return true;
      if(document.querySelector(".patina-overlay.open, #patinaFormOverlay.open, .patina-admin, [id*='admin'][class*='open']")) return true;
      // Si la URL o la vista es Admin, no recargar
      if(location.hash.indexOf("admin")!==-1) return true;
      // Si hay un modal de contraseña abierto
      if(document.querySelector("input[type='password']")) return true;
    }catch(e){}
    return false;
  }

  function showUpdateBanner(){
    try{
      if(document.getElementById("patina-update-banner")) return;
      var b = document.createElement("div");
      b.id = "patina-update-banner";
      b.textContent = "Hay cambios nuevos en Pátina  •  Tocar para actualizar";
      b.style.cssText = "position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:99999;background:#F5ECDC;color:#121212;padding:10px 16px;border-radius:999px;font-size:13px;font-weight:700;box-shadow:0 8px 30px rgba(0,0,0,.4);cursor:pointer;font-family:Inter,sans-serif;";
      b.onclick = function(){ try{ history.replaceState(null,"", location.pathname+"?v=2026"); }catch(e){} location.reload(); };
      document.body.appendChild(b);
    }catch(e){}
  }

  function getFromGAS(){
    if(!GAS_URL) return;
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
        var loc = getLocal();
        // Comparar solo lo esencial, no el string completo
        var localEss = essential(loc.products);
        var gasEss = essential(norm);
        if(localEss === gasEss) { lastLocalHash = loc.hash; return; } // nada real cambió -> no tocar nada, no recargar
        // Sí cambió algo real: guardar en localStorage
        // Preservar fotos locales si Google las trajo vacías (Google Sheets corta fotos largas)
        try{
          var localArr = JSON.parse(loc.products);
          var byId = {};
          localArr.forEach(function(x){ byId[String(x.id)] = x; });
          norm.forEach(function(n){
            var old = byId[String(n.id)];
            if(old && (!n.foto) && old.foto) n.foto = old.foto;
            if(old && (!n.descripcion) && old.descripcion) n.descripcion = old.descripcion;
            if(old && (!n.etiqueta) && old.etiqueta) n.etiqueta = old.etiqueta;
          });
        }catch(e){}
        var newRaw = JSON.stringify(norm);
        setLocal(newRaw, null);
        lastLocalHash = hashStr(newRaw+"|"+loc.cats);
        // NO recargar si estás ocupado. Mostrar aviso para actualizar cuando quieras.
        if(isBusy()){ showUpdateBanner(); return; }
        // Recargar como máximo 1 vez cada 60s, para no entrar en bucle
        if(Date.now() - lastAutoReloadAt < 60000){ showUpdateBanner(); return; }
        lastAutoReloadAt = Date.now();
        try{ history.replaceState(null,'', location.pathname+'?v=2026'); }catch(e){} location.reload();
      })
      .catch(function(){});
  }

  lastLocalHash = getLocal().hash;
  setInterval(function(){ postToGAS(); getFromGAS(); }, SYNC_MS);
  setTimeout(getFromGAS, 1500);
  window.patinaSetGasUrl = function(url){ try{ localStorage.setItem("patina_gas_url_v1", url); GAS_URL = url; window.PATINA_GAS_URL = url; }catch(e){} };
})();
