 // FIX MODAL CELULAR - foto chica, botones abajo, etiqueta arriba
(function(){
  var css = ".patina-form-modal{max-height:86dvh!important;overflow-y:auto!important;padding:14px 14px calc(14px + env(safe-area-inset-bottom, 0px))!important;gap:6px!important} .patina-form-modal label{margin:5px 0 3px!important;font-size:10px!important} .patina-form-modal input,.patina-form-modal textarea,.patina-form-modal select{padding:8px 10px!important;font-size:13px!important} .patina-form-modal #patinaF_etiqueta{min-height:52px!important} .patina-form-modal #patinaF_descripcion{min-height:64px!important} .patina-foto{padding:8px 10px!important;gap:10px!important;min-height:48px!important} .patina-foto-ico{width:36px!important;height:36px!important;min-width:36px!important;min-height:36px!important;font-size:16px!important} .patina-form-btns{position:sticky!important;bottom:0!important;background:#121212!important;padding-top:8px!important;z-index:10!important;margin-top:10px!important} .patina-form-btns button{padding:11px!important}";
  var s=document.createElement('style'); s.textContent=css; document.head.appendChild(s);
  setInterval(function(){
    var eti=document.getElementById('patinaF_etiqueta');
    var des=document.getElementById('patinaF_descripcion');
    if(!eti || !des) return;
    var etiLabel=null, desLabel=null;
    var labs=document.querySelectorAll('#patinaFormModal label');
    labs.forEach(function(l){ if(l.textContent.indexOf('Etiqueta')!==-1) etiLabel=l; if(l.textContent.indexOf('Descripción')!==-1) desLabel=l; });
    if(etiLabel && desLabel && etiLabel.compareDocumentPosition(desLabel) & 4){
      var modal=document.getElementById('patinaFormModal');
      modal.insertBefore(etiLabel, desLabel);
      modal.insertBefore(eti, desLabel);
    }
  }, 500);
})();// PÁTINA - Parche sincronización CAVI - FIX ANTI-BUCLE
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
      var payload = { action:"save_all", productos: JSON.parse(loc.products).map(function(d){ var c={}; for(var k in d){ c[k]=d[k]; } if(typeof c.foto==="string" && c.foto.length>48000) c.foto=""; return c; }), categorias: loc.cats ? JSON.parse(loc.cats) : [], password:"PATINA2026" };
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
      var payload = { action:"save_all", productos: JSON.parse(loc.products).map(function(d){ var c={}; for(var k in d){ c[k]=d[k]; } if(typeof c.foto==="string" && c.foto.length>48000) c.foto=""; return c; }), categorias: loc.cats ? JSON.parse(loc.cats) : [], password:"PATINA2026" };
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

  function showUpdateBanner(){ /* Silencioso: no mostrar nada al cliente */ }

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
        // Si Google trae menos productos que los que tenés (ej: 24 vs 35), NO pisar. Es pérdida de datos, mejor subir lo local a Google.
        try{
          var gasCount = data.length;
          var locArr = JSON.parse(loc.products||"[]");
          if(gasCount < locArr.length){ setTimeout(postNow, 300); setTimeout(postNow, 2000); return; }
        }catch(e){}
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
        // SILENCIOSO: solo guardar en localStorage. No recargar, no mostrar icono, no mover al cliente de donde está mirando.
        // El cambio se va a ver cuando el cliente cambie de categoría o vuelva a abrir el link, sin que se entere.
        return;
      })
      .catch(function(){});
  }

  // PROTECCIÓN ANTI-PÉRDIDA: si local tiene menos que los 35 de V25 (ej: 24 por un sync viejo), restaurar desde defaults y subir a GAS
  try{
    var loc0 = getLocal();
    var localCount = 0;
    try{ localCount = JSON.parse(loc0.products||"[]").length; }catch(e){}
    var defCount = (window.__patinaAdminDefaults||[]).length;
    if(defCount===35 && localCount>0 && localCount<defCount){
      var restored = JSON.stringify(window.__patinaAdminDefaults);
      setLocal(restored, null);
      lastLocalHash = hashStr(restored+"|"+loc0.cats);
      setTimeout(postNow, 500);
    } else if(defCount===35 && !loc0.products){
      var restored2 = JSON.stringify(window.__patinaAdminDefaults);
      setLocal(restored2, null);
      lastLocalHash = hashStr(restored2+"|"+loc0.cats);
      setTimeout(postNow, 500);
    }
  }catch(e){}
  lastLocalHash = getLocal().hash;
  setInterval(function(){ postToGAS(); getFromGAS(); }, SYNC_MS);
  setTimeout(getFromGAS, 1500);
  window.patinaSetGasUrl = function(url){ try{ localStorage.setItem("patina_gas_url_v1", url); GAS_URL = url; window.PATINA_GAS_URL = url; }catch(e){} };
})();
