// V42 = V41 + SOLO PROTECCION DE FOTOS. No toca modal, pildoras, HOME, stock, sync base, WhatsApp, ni nada mas.
// Regla nueva: NUNCA pisar una foto buena con una vacia. Si local tiene foto y Google viene sin foto, se queda la local y se sube la local.
// Si Google trae foto y local no tiene, se toma la de Google. Si las dos tienen foto distinta, manda la de la PC (que es la que sube las fotos buenas).
(function(){
  try{
    if(!document.getElementById('patina-v42-css')){
      var st=document.createElement('style'); st.id='patina-v42-css';
      st.textContent=
        'input,textarea,select{font-size:16px !important;}'+
        '#patinaFormOverlay{overflow-y:auto !important; align-items:flex-start !important; padding:6px 6px !important;}'+
        '.patina-form-modal{max-height:96dvh !important; overflow-y:auto !important; -webkit-overflow-scrolling:touch !important; padding:8px 10px 8px 10px !important; gap:2px !important; box-sizing:border-box !important;}'+
        '.patina-form-modal h3{margin:0 0 2px 0 !important; font-size:17px !important; line-height:1.2 !important;}'+
        '.patina-form-modal p{margin:0 0 4px 0 !important; font-size:10px !important; line-height:1.2 !important;}'+
        '.patina-form-modal label{margin:3px 0 1px !important; font-size:8px !important; letter-spacing:.1em !important; line-height:1.2 !important;}'+
        '.patina-form-modal input,.patina-form-modal textarea,.patina-form-modal select{font-size:16px !important; padding:6px 8px !important; line-height:1.2 !important;}'+
        '.patina-form-modal .patina-foto, #patinaFormOverlay .patina-foto{border:1px dashed rgba(245,236,224,.35) !important; background:transparent !important; border-radius:8px !important; padding:4px 6px !important; margin:0 0 4px 0 !important; height:auto !important; min-height:36px !important; max-height:42px !important; overflow:hidden !important; display:flex !important; align-items:center !important; gap:6px !important; box-sizing:border-box !important;}'+
        '.patina-form-modal .patina-foto-ico, #patinaFormOverlay .patina-foto-ico{width:28px !important; height:28px !important; min-width:28px !important; min-height:28px !important; max-width:28px !important; max-height:28px !important; border-radius:6px !important; overflow:hidden !important; flex-shrink:0 !important; display:grid !important; place-items:center !important; font-size:14px !important;}'+
        '.patina-form-modal .patina-foto-ico img{width:100% !important; height:100% !important; object-fit:cover !important; display:block !important;}'+
        '#patinaFotoTxt{font-size:9px !important; line-height:1.1 !important;}'+
        '.patina-form-modal .patina-row{display:flex !important; gap:6px !important; width:100% !important; margin:0 !important;}'+
        '.patina-form-modal .patina-row > div{flex:1 !important; min-width:0 !important;}'+
        '.patina-form-modal .patina-row input{width:100% !important; box-sizing:border-box !important;}'+
        '#patinaF_etiqueta{min-height:32px !important; max-height:36px !important; height:32px !important; padding:6px 8px !important; overflow-y:auto !important;}'+
        '#patinaF_descripcion{min-height:36px !important; max-height:44px !important; height:36px !important; padding:6px 8px !important; overflow-y:auto !important;}'+
        '#patinaCalc{width:100% !important; display:block !important; margin:2px 0 1px 0 !important; text-align:left !important; font-size:10px !important; line-height:1.2 !important;}'+
        '#patinaNuevaCatBox{display:none; margin:6px 0 2px 0 !important; padding:8px !important; background:rgba(255,255,255,.07) !important; border-radius:10px !important; box-sizing:border-box !important; width:100% !important;}'+
        '#patinaNuevaCatBox[style*="block"]{display:block !important;}'+
        '#patinaNuevaCatInput{display:block !important; width:100% !important; box-sizing:border-box !important; margin:0 0 6px 0 !important; padding:8px 10px !important; font-size:14px !important; border-radius:8px !important;}'+
        '#patinaNuevaCatBox button{display:block !important; width:100% !important; box-sizing:border-box !important; margin:0 !important; padding:8px !important; font-size:12px !important; font-weight:700 !important; letter-spacing:.06em !important; white-space:normal !important; text-align:center !important;}'+
        '.patina-form-modal button[onclick*="NuevaCat"], .patina-form-modal button[onclick*="MostrarNueva"]{padding:5px !important; font-size:10px !important; margin:2px 0 1px 0 !important; width:100% !important; box-sizing:border-box !important;}'+
        '.patina-form-modal label:has(#patinaF_visible){display:flex !important; gap:6px !important; align-items:center !important; margin:5px 0 6px 0 !important; padding:5px 6px !important; border-radius:8px !important; background:rgba(255,255,255,.06) !important; font-size:11px !important; letter-spacing:0 !important; text-transform:none !important; line-height:1.2 !important;}'+
        '.patina-form-modal #patinaF_visible{width:30px !important; height:18px !important; flex-shrink:0 !important; margin:0 !important;}'+
        '.patina-form-modal .patina-form-btns{position:relative !important; bottom:auto !important; background:transparent !important; padding:6px 0 0 0 !important; margin:4px 0 0 0 !important; z-index:1 !important; display:flex !important; gap:6px !important;}'+
        '.patina-form-modal .patina-form-btns button{flex:1 !important; padding:9px !important; font-size:13px !important; line-height:1.2 !important;}'+
        '#patinaAdminPage .patina-search{font-size:16px !important;}'+
        '.patina-cat-pill .patina-cat-ico{display:none !important;}'+
        '.patina-cat-pill.active{background:#2f3a2a !important; color:#F5ECDC !important;}'+
        '.patina-stock-msg{font-size:11px !important; color:#F5ECDC !important; opacity:.9 !important; margin:4px 0 0 0 !important; text-align:center !important;}'+
        '.patina-sin-foto{display:grid !important; place-items:center !important; background:#3a443a !important; color:#F5ECDC !important; font-size:11px !important; letter-spacing:.08em !important; text-align:center !important; min-height:110px !important; border-radius:10px !important; padding:10px !important; box-sizing:border-box !important;}';
      document.head.appendChild(st);
    }
    var vp=document.querySelector('meta[name="viewport"]');
    if(vp && vp.content.indexOf('maximum-scale')===-1) vp.content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
  }catch(e){}

  var KEY='patina_v25_admin';
  var CATS_KEY='patina_v25_cats';
  var GAS_URL="https://script.google.com/macros/s/AKfycbznKXsIvfuR_kb4UIwHk2QtjaqOlGUW9imJFjXDKfWuanUCFZOtbPLSXVlwAx8mr_I2UQ/exec";
  try{ var saved=localStorage.getItem("patina_gas_url_v1"); if(saved) GAS_URL=saved; }catch(e){}
  function leerProds(){ try{ var v=JSON.parse(localStorage.getItem(KEY)||"[]"); if(Array.isArray(v)) return v; }catch(e){} return []; }
  function guardarProds(arr){ try{ localStorage.setItem(KEY, JSON.stringify(arr)); }catch(e){} }
  function claveNombre(p){ return String(p.nombre||p.name||'').toLowerCase().trim(); }
  function claveId(p){ var id=String(p.id||'').trim(); if(id) return 'id:'+id.padStart(4,'0'); return 'n:'+claveNombre(p); }
  function normCat(c){ var s=String(c||'').toLowerCase().trim(); if(s==='cartera'||s==='carteras') return 'carteras'; if(s==='accesorio'||s==='accesorios') return 'accesorios'; if(s==='todo'||s==='todos') return 'todos'; if(s==='oferta'||s==='ofertas') return 'ofertas'; return s; }
  function mostrarCat(cat){ var n=normCat(cat); if(n==='carteras') return 'CARTERAS'; if(n==='accesorios') return 'ACCESORIOS'; if(n==='ofertas') return 'OFERTAS'; if(n==='todos') return 'TODOS'; return String(cat||'').toUpperCase(); }
  function tieneOferta(p){ var precio=parseFloat(p.precio||p.price||0)||0; var oferta=parseFloat(p.precio_oferta||p.oferta||p.precioOferta||p.precioDescuento||p.sale_price||0)||0; if(oferta>0 && precio>0 && oferta<precio) return true; if(p.descuento && parseFloat(p.descuento)>0) return true; if(p.etiqueta && String(p.etiqueta).toUpperCase().indexOf('OFF')!==-1) return true; return false; }
  function stockDe(p){ if(!p) return null; var v=p.stock; if(v===undefined||v===null||v===''||String(v).toLowerCase()==='sin límite'||String(v).toLowerCase()==='sin limite') return null; var n=parseInt(v,10); if(isNaN(n)) return null; return n; }
  function tieneFoto(p){ return !!(p && p.foto && String(p.foto).trim()!=='' && String(p.foto)!=='null' && String(p.foto)!=='undefined'); }
  function estaEditando(){ try{ if(document.activeElement && (document.activeElement.tagName==='INPUT'||document.activeElement.tagName==='TEXTAREA')) return true; if(document.getElementById('patinaFormOverlay') && document.getElementById('patinaFormOverlay').classList.contains('open')) return true; }catch(e){} return false; }
  function esVisible(p){ if(p.visible===undefined||p.visible===null) return true; if(p.visible===true||p.visible===1||p.visible==='1'||String(p.visible).toLowerCase()==='true'||String(p.visible).toLowerCase()==='visible') return true; if(p.visible===false||p.visible===0||p.visible==='0'||String(p.visible).toLowerCase()==='false'||String(p.visible).toLowerCase()==='oculto'||String(p.visible).toLowerCase()==='hidden') return false; return true; }
  function esPC(){ try{ return window.innerWidth>768; }catch(e){ return true; } }

  // Backup de fotos buenas en este dispositivo, para no perderlas nunca mas
  function backupFotos(){
    try{
      var loc=leerProds();
      var bak={}; try{ bak=JSON.parse(localStorage.getItem('patina_fotos_backup_v1')||"{}"); if(typeof bak!=='object') bak={}; }catch(e){ bak={}; }
      var cambio=false;
      loc.forEach(function(p){
        if(tieneFoto(p)){
          var k=claveId(p);
          if(bak[k]!==p.foto){ bak[k]=p.foto; cambio=true; }
        }
      });
      if(cambio){ try{ localStorage.setItem('patina_fotos_backup_v1', JSON.stringify(bak)); }catch(e){} }
    }catch(e){}
  }
  function restaurarFotoDesdeBackup(p){
    try{
      var bak=JSON.parse(localStorage.getItem('patina_fotos_backup_v1')||"{}");
      var f=bak[claveId(p)] || bak['n:'+claveNombre(p)];
      if(f && !tieneFoto(p)){ p.foto=f; return true; }
    }catch(e){}
    return false;
  }
  setInterval(backupFotos, 5000);
  setTimeout(backupFotos, 1000);

  function corregir4SinFoto(){
    try{
      var loc=leerProds();
      if(!loc.length) return false;
      var cambio=false;
      loc.forEach(function(p){
        if(restaurarFotoDesdeBackup(p)) cambio=true;
        var idNum=parseInt(String(p.id||'').replace(/\D/g,''),10);
        var esOriginal = !isNaN(idNum) && idNum>=1 && idNum<=35;
        if(esOriginal && !tieneFoto(p) && !esVisible(p)){ p.visible=true; cambio=true; }
        if(esOriginal && (p.foto===undefined || p.foto===null)){ p.foto=''; cambio=true; }
      });
      if(cambio){ guardarProds(loc); try{ if(window.patinaRefrescarTienda) window.patinaRefrescarTienda(); }catch(e){} return true; }
    }catch(e){}
    return false;
  }
  function mostrarSinFotoEnTienda(){
    try{
      var tarjetas = document.querySelectorAll('#view-todos .product-card-compact, #view-todos [class*="product-card"], .products-grid > *');
      tarjetas.forEach(function(card){
        if(card.closest('#patinaAdminPage')) return;
        var img = card.querySelector('img');
        if(img){
          var src = img.getAttribute('src')||'';
          if(!src || src==='null' || src==='undefined'){
            if(!card.querySelector('.patina-sin-foto')){
              var div=document.createElement('div'); div.className='patina-sin-foto'; div.textContent='SIN FOTO';
              if(img.parentNode) img.parentNode.insertBefore(div, img);
              img.style.display='none';
            }
            if(card.style.display==='none'){
              var txt=(card.textContent||'').toLowerCase();
              var prods=leerProds();
              var encontrado=null;
              prods.forEach(function(p){ if(txt.indexOf(claveNombre(p))!==-1) encontrado=p; });
              if(encontrado && esVisible(encontrado)) card.style.display='';
            }
          }
        } else {
          if(card.style.display==='none'){
            var txt2=(card.textContent||'').toLowerCase();
            var prods2=leerProds();
            var enc2=null;
            prods2.forEach(function(p){ if(txt2.indexOf(claveNombre(p))!==-1) enc2=p; });
            if(enc2 && esVisible(enc2)) card.style.display='';
          }
        }
      });
      var adminCards = document.querySelectorAll('#patinaAdminPage .patina-card');
      adminCards.forEach(function(card){
        var imgA = card.querySelector('img');
        if(imgA){
          var srcA=imgA.getAttribute('src')||'';
          if(!srcA && !card.querySelector('.patina-sin-foto')){
            var d=document.createElement('div'); d.className='patina-sin-foto'; d.textContent='SIN FOTO';
            if(imgA.parentNode) imgA.parentNode.insertBefore(d, imgA);
            imgA.style.display='none';
          }
        }
      });
    }catch(e){}
  }
  setInterval(mostrarSinFotoEnTienda, 1200);
  setTimeout(mostrarSinFotoEnTienda, 800);

  function restaurarFaltantes(){
    try{
      var defs = window.__patinaAdminDefaults || [];
      if(!defs.length) return false;
      var loc = leerProds();
      if(loc.length>=35) return false;
      var porId={}; loc.forEach(function(p){ porId[claveId(p)]=1; porId['n:'+claveNombre(p)]=1; });
      var agregados=0;
      defs.forEach(function(d){
        if(!porId[claveId(d)] && !porId['n:'+claveNombre(d)]){
          var copia={}; for(var k in d){ copia[k]=d[k]; }
          copia.visible=true;
          loc.push(copia); porId[claveId(copia)]=1; porId['n:'+claveNombre(copia)]=1; agregados++;
        }
      });
      if(agregados){
        loc.sort(function(a,b){ return String(a.id||'').localeCompare(String(b.id||'')); });
        guardarProds(loc);
        try{ if(window.patinaRefrescarTienda) window.patinaRefrescarTienda(); }catch(e){}
        return true;
      }
    }catch(e){}
    return false;
  }

  var syncEnCurso=false;
  var ultimoSyncOk=0;
  function subirAhora(){
    try{
      backupFotos();
      var loc=leerProds(); if(!loc.length) return;
      var cats=[]; try{ var c=JSON.parse(localStorage.getItem(CATS_KEY)||"[]"); if(Array.isArray(c)) cats=c; }catch(e){}
      loc.forEach(function(p){ var cc=normCat(p.categoria||p.category||''); if(cc && cc!=='todos' && cc!=='ofertas' && cats.indexOf(cc)===-1) cats.push(cc); });
      // NO CORTAR LAS FOTOS: subirlas completas. Si Google las rechaza por peso, el backup local las guarda igual.
      var payload={action:'save_all', productos: loc.map(function(d){ var cp={}; for(var k in d){ cp[k]=d[k]; } return cp; }), categorias: cats, password:'PATINA2026'};
      fetch(GAS_URL,{method:'POST', body: JSON.stringify(payload)}).catch(function(){}).then(function(){ ultimoSyncOk=Date.now(); });
      try{ if(window.patinaSyncNow) window.patinaSyncNow(); }catch(e){}
    }catch(e){}
  }
  function bajarDeGoogle(forzado){
    try{
      if(syncEnCurso) return;
      if(!forzado && estaEditando()) return;
      syncEnCurso=true;
      fetch(GAS_URL).then(function(r){ return r.json(); }).then(function(gas){
        syncEnCurso=false;
        if(!gas) return;
        var gasProds=Array.isArray(gas) ? gas : (gas.productos||[]);
        var gasCats=Array.isArray(gas) ? [] : (gas.categorias||[]);
        if(!gasProds.length) return;
        var loc=leerProds();
        if(gasProds.length < loc.length && !forzado){
          var faltan = loc.filter(function(p){ return !gasProds.some(function(g){ return claveId(g)===claveId(p) || claveNombre(g)===claveNombre(p); }); });
          if(faltan.length){ subirAhora(); return; }
        }
        var porClave={}; loc.forEach(function(p){ porClave[claveId(p)]=p; porClave['n:'+claveNombre(p)]=p; });
        var cambio=false;
        var hayQueSubirFoto=false;
        gasProds.forEach(function(g){
          var clave=claveId(g);
          var l=porClave[clave] || porClave['n:'+claveNombre(g)];
          if(!l){
            var copiaG={}; for(var k in g){ copiaG[k]=g[k]; }
            if(copiaG.visible===undefined || copiaG.visible===null) copiaG.visible=true;
            // Si Google trae sin foto pero tenemos backup de esa foto, usar el backup
            if(!tieneFoto(copiaG)){ restaurarFotoDesdeBackup(copiaG); }
            loc.push(copiaG); cambio=true;
            var c=normCat(g.categoria||g.category||'');
            if(c && c!=='todos' && c!=='ofertas'){
              try{ var cats=JSON.parse(localStorage.getItem(CATS_KEY)||"[]"); if(!Array.isArray(cats)) cats=[]; if(cats.indexOf(c)===-1){ cats.push(c); localStorage.setItem(CATS_KEY, JSON.stringify(cats)); } }catch(e){}
            }
          } else {
            var campos=['nombre','name','precio','price','precio_oferta','oferta','precioOferta','categoria','category','stock','visible','descripcion','description','etiqueta'];
            campos.forEach(function(f){ if(g[f]!==undefined && g[f]!==null && String(g[f])!==String(l[f])){ l[f]=g[f]; cambio=true; } });
            // FOTO: NUNCA pisar una foto buena con una vacia
            if(!tieneFoto(g) && tieneFoto(l)){
              // Google viene sin foto, local tiene foto buena: NO tocar, y marcar para subir la foto buena a Google
              hayQueSubirFoto=true;
            } else if(tieneFoto(g) && !tieneFoto(l)){
              l.foto=g.foto; cambio=true;
            } else if(tieneFoto(g) && tieneFoto(l) && g.foto!==l.foto){
              // Las dos tienen foto distinta: manda la de la PC, porque la PC es la que sube las fotos buenas
              if(esPC()){
                // En PC: no pisar, subir la de PC
                hayQueSubirFoto=true;
              } else {
                // En celu: tomar la de Google (que viene de la PC)
                l.foto=g.foto; cambio=true;
              }
            }
            if(l.id!==g.id && g.id){ l.id=g.id; cambio=true; }
          }
        });
        try{
          var locCats=JSON.parse(localStorage.getItem(CATS_KEY)||"[]"); if(!Array.isArray(locCats)) locCats=[];
          var setC={}; locCats.forEach(function(c){ setC[String(c).toLowerCase()]=1; });
          var cc=false;
          gasCats.forEach(function(c){ var lc=String(c).toLowerCase(); if(!setC[lc]){ locCats.push(lc); setC[lc]=1; cc=true; } });
          loc.forEach(function(p){ var c2=normCat(p.categoria||p.category||''); if(c2 && c2!=='todos' && c2!=='ofertas' && !setC[c2]){ locCats.push(c2); setC[c2]=1; cc=true; } });
          if(cc) localStorage.setItem(CATS_KEY, JSON.stringify(locCats));
        }catch(e){}
        if(cambio){
          guardarProds(loc);
          backupFotos();
          try{ if(window.patinaRefrescarTienda) window.patinaRefrescarTienda(); }catch(e){}
          setTimeout(function(){ corregirPildoras(); }, 400);
        }
        if(hayQueSubirFoto){ setTimeout(subirAhora, 800); }
        if(corregir4SinFoto()){ setTimeout(subirAhora, 800); }
        if(restaurarFaltantes()){ setTimeout(subirAhora, 800); }
        ultimoSyncOk=Date.now();
      }).catch(function(){ syncEnCurso=false; });
    }catch(e){ syncEnCurso=false; }
  }
  setTimeout(function(){ backupFotos(); if(restaurarFaltantes()) subirAhora(); if(corregir4SinFoto()) subirAhora(); bajarDeGoogle(true); }, 600);
  setInterval(function(){ bajarDeGoogle(false); }, 10000);
  document.addEventListener('visibilitychange', function(){ if(!document.hidden) bajarDeGoogle(false); });
  window.addEventListener('focus', function(){ bajarDeGoogle(false); });
  window.addEventListener('pageshow', function(){ bajarDeGoogle(false); });
  document.addEventListener('click', function(e){
    try{
      var btn=e.target.closest? e.target.closest('button') : null;
      if(!btn) return;
      var t=(btn.textContent||'').trim();
      var esGuardar = t.indexOf('Guardar')!==-1 || t.indexOf('Agregar')!==-1;
      var esBorrar = t.indexOf('Borrar')!==-1 || t.indexOf('Eliminar')!==-1;
      if(esGuardar || esBorrar){
        setTimeout(subirAhora, 500);
        setTimeout(subirAhora, 1500);
        setTimeout(function(){ bajarDeGoogle(true); }, 2500);
        setTimeout(function(){ corregirPildoras(); }, 1200);
      }
    }catch(e){}
  }, true);

  function buscarProductoDetalle(){
    try{
      var modales = Array.prototype.slice.call(document.querySelectorAll('[class*="modal"], [class*="overlay"], [class*="detalle"], [class*="detail"]'));
      var detalle=null;
      modales.forEach(function(m){ if(m.id && (m.id.indexOf('Admin')!==-1 || m.id.indexOf('Form')!==-1 || m.id.indexOf('Login')!==-1)) return; if(m.offsetParent===null && m.style.display!=='flex') return; if(m.textContent && (m.textContent.indexOf('+')!==-1) && m.querySelector('button')) detalle=m; });
      if(!detalle) return null;
      var titulo = detalle.querySelector('h1,h2,h3');
      var nombre = titulo ? titulo.textContent.trim().toLowerCase() : '';
      if(!nombre) return null;
      var prods = leerProds();
      var encontrado=null;
      prods.forEach(function(p){ if(claveNombre(p)===nombre) encontrado=p; });
      if(!encontrado){ prods.forEach(function(p){ if(nombre.indexOf(claveNombre(p))!==-1 || claveNombre(p).indexOf(nombre)!==-1) encontrado=p; }); }
      return {detalle:detalle, producto:encontrado, nombre:nombre};
    }catch(e){ return null; }
  }
  function aplicarStockDetalle(){
    try{
      var info = buscarProductoDetalle();
      if(!info || !info.producto) return;
      var stock = stockDe(info.producto);
      if(stock===null) return;
      var detalle=info.detalle;
      var botones = Array.prototype.slice.call(detalle.querySelectorAll('button'));
      var btnMas=null, btnMenos=null, cantEl=null;
      botones.forEach(function(b){ var t=(b.textContent||'').trim(); if(t==='+') btnMas=b; if(t==='-' || t==='–') btnMenos=b; });
      if(!btnMas) return;
      var parent = btnMas.parentNode;
      if(parent){ var spans = parent.querySelectorAll('span, div, p'); spans.forEach(function(s){ var txt=(s.textContent||'').trim(); if(/^\d+$/.test(txt) && s!==btnMas && s!==btnMenos) cantEl=s; }); }
      var cantActual = cantEl ? parseInt(cantEl.textContent.trim(),10) : 1;
      if(isNaN(cantActual)) cantActual=1;
      if(cantActual>stock){ if(cantEl) cantEl.textContent=String(stock); try{ if(window.patinaCantidad!==undefined) window.patinaCantidad=stock; }catch(e){} }
      var msg = detalle.querySelector('.patina-stock-msg');
      if(!msg){ msg=document.createElement('div'); msg.className='patina-stock-msg'; if(parent && parent.parentNode) parent.parentNode.insertBefore(msg, parent.nextSibling); else detalle.appendChild(msg); }
      if(stock<=5){ msg.textContent = 'Solo quedan '+stock+' unidades'; } else { msg.textContent = 'Máx. '+stock+' unidades'; }
      msg.style.display='block';
      if(cantActual>=stock){ btnMas.style.opacity='0.4'; btnMas.style.pointerEvents='auto'; } else { btnMas.style.opacity='1'; }
    }catch(e){}
  }
  document.addEventListener('click', function(e){
    try{
      var btn = e.target.closest ? e.target.closest('button') : null;
      if(!btn) return;
      if((btn.textContent||'').trim()!=='+') return;
      if(btn.closest('#patinaFormModal') || btn.closest('#patinaAdminPage')) return;
      var info = buscarProductoDetalle();
      if(!info || !info.producto) return;
      var stock = stockDe(info.producto);
      if(stock===null) return;
      setTimeout(function(){
        try{
          var info2 = buscarProductoDetalle();
          if(!info2) return;
          var detalle=info2.detalle;
          var parent = btn.parentNode;
          var cantEl=null;
          if(parent){ parent.querySelectorAll('span, div, p').forEach(function(s){ var txt=(s.textContent||'').trim(); if(/^\d+$/.test(txt)) cantEl=s; }); }
          var cantActual = cantEl ? parseInt(cantEl.textContent.trim(),10) : 1;
          if(cantActual>stock){ if(cantEl) cantEl.textContent=String(stock); try{ if(window.patinaCantidad!==undefined) window.patinaCantidad=stock; }catch(e){} var msg = detalle.querySelector('.patina-stock-msg'); if(msg) msg.textContent='Máx. '+stock+' unidades'; }
          aplicarStockDetalle();
        }catch(e){}
      }, 50);
    }catch(e){}
  }, true);
  setInterval(aplicarStockDetalle, 800);

  function crearPildora(cat, activa){
    var b=document.createElement('button');
    b.type='button'; b.className='patina-cat-pill'+(activa?' active':''); b.setAttribute('data-cat-pill', normCat(cat));
    b.textContent=mostrarCat(cat);
    b.addEventListener('click', function(){
      try{ window.__patinaCatFilter=normCat(cat); }catch(e){}
      document.querySelectorAll('#view-todos .patina-cat-pill').forEach(function(x){ x.classList.remove('active'); });
      document.querySelectorAll('#view-todos [data-cat-pill="'+normCat(cat)+'"]').forEach(function(x){ x.classList.add('active'); });
      try{ if(window.patinaIrA) window.patinaIrA('todos'); }catch(e){}
      setTimeout(function(){ filtrarPorCategoria(cat); }, 200);
    });
    return b;
  }
  function filtrarPorCategoria(cat){
    try{
      var ncat=normCat(cat);
      var view=document.getElementById('view-todos');
      if(!view) return;
      var grid=view.querySelector('.products-grid');
      if(!grid) return;
      var ps=leerProds();
      var porNombre={}; ps.forEach(function(p){ porNombre[claveNombre(p)]=normCat(p.categoria||p.category||''); });
      var cards=grid.querySelectorAll(':scope > *');
      if(!cards.length) cards=grid.querySelectorAll('.product-card-compact, [class*="product-card"]');
      cards.forEach(function(card){
        if(ncat==='todos'){ card.style.display=''; return; }
        var txt=(card.textContent||'').trim();
        var h=card.querySelector('h1,h2,h3,h4,p,b,strong');
        var nombreCard=h? h.textContent.trim().toLowerCase() : '';
        var catOf=porNombre[nombreCard];
        if(!catOf){ Object.keys(porNombre).forEach(function(n){ if(txt.toLowerCase().indexOf(n)!==-1) catOf=porNombre[n]; }); }
        if(ncat==='ofertas'){ var tieneOff=txt.toUpperCase().indexOf('OFF')!==-1 || !!card.querySelector('s, del'); card.style.display=tieneOff?'':'none'; }
        else { if(!catOf){ card.style.display=''; return; } card.style.display=(catOf===ncat)?'':'none'; }
      });
    }catch(e){}
  }
  function corregirPildoras(){
    try{
      var prods=leerProds();
      if(!prods.length) return;
      var conteo={};
      prods.forEach(function(p){ var c=normCat(p.categoria||p.category||''); if(!c) return; conteo[c]=(conteo[c]||0)+1; });
      var hayOferta=prods.some(function(p){ return tieneOferta(p); });
      var activa='todos';
      try{ var cur=document.querySelector('#view-todos .patina-cat-pill.active'); if(cur) activa=normCat(cur.getAttribute('data-cat-pill')||cur.textContent); else if(window.__patinaCatFilter) activa=normCat(window.__patinaCatFilter); }catch(e){}
      if(activa!=='todos' && activa!=='ofertas' && (!conteo[activa] || conteo[activa]===0)) activa='todos';
      var wrapTodos=document.querySelector('#view-todos .patina-cat-pills');
      if(wrapTodos){
        var catsOrden=[];
        if((conteo['carteras']||0)>0) catsOrden.push('carteras');
        if((conteo['accesorios']||0)>0) catsOrden.push('accesorios');
        var extras=[]; Object.keys(conteo).forEach(function(c){ if(c==='carteras'||c==='accesorios'||c==='todos'||c==='ofertas') return; if(conteo[c]>0) extras.push(c); });
        extras.sort(); extras.forEach(function(c){ catsOrden.push(c); });
        if(hayOferta) catsOrden.push('ofertas');
        catsOrden.push('todos');
        var actuales=[]; wrapTodos.querySelectorAll('[data-cat-pill]').forEach(function(b){ actuales.push(normCat(b.getAttribute('data-cat-pill')||b.textContent)); });
        var igual=actuales.length===catsOrden.length && actuales.every(function(v,i){ return v===catsOrden[i]; });
        if(!igual){ wrapTodos.innerHTML=''; catsOrden.forEach(function(cat){ var b=crearPildora(cat, cat===activa); wrapTodos.appendChild(b); }); setTimeout(function(){ filtrarPorCategoria(activa); }, 300); }
        else {
          wrapTodos.querySelectorAll('[data-cat-pill]').forEach(function(b){ var n=normCat(b.getAttribute('data-cat-pill')||b.textContent); if(b.textContent!==mostrarCat(n)) b.textContent=mostrarCat(n); if(n===activa) b.classList.add('active'); else b.classList.remove('active'); });
          var tb=wrapTodos.querySelector('[data-cat-pill="todos"]'); if(tb && tb!==wrapTodos.lastElementChild) wrapTodos.appendChild(tb);
        }
      }
      document.querySelectorAll('.patina-cat-pills').forEach(function(wrap){
        if(wrap===wrapTodos) return;
        if(wrap.closest('#patinaFormModal')) return;
        var vistos={}; wrap.querySelectorAll('[data-cat-pill]').forEach(function(b){ var n=normCat(b.getAttribute('data-cat-pill')||b.textContent); if(vistos[n]){ b.remove(); return; } vistos[n]=1; if(b.querySelector('.patina-cat-ico')) b.querySelector('.patina-cat-ico').remove(); if(b.textContent!==mostrarCat(n)) b.textContent=mostrarCat(n); });
      });
      document.querySelectorAll('#patinaFormModal select, #patinaFormOverlay select').forEach(function(sel){
        var vals=[]; sel.querySelectorAll('option').forEach(function(o){ vals.push(normCat(o.value||'')); });
        Object.keys(conteo).forEach(function(cat){ if(cat==='todos'||cat==='ofertas') return; if(vals.indexOf(cat)===-1){ var o=document.createElement('option'); o.value=cat; o.textContent=cat.charAt(0).toUpperCase()+cat.slice(1); var nueva=sel.querySelector('option[value="__nueva__"]'); if(nueva) sel.insertBefore(o, nueva); else sel.appendChild(o); } });
        if(!sel.querySelector('option[value="__nueva__"]')){ var on=document.createElement('option'); on.value='__nueva__'; on.textContent='+ Nueva categoría...'; sel.appendChild(on); }
      });
    }catch(e){}
  }
  setInterval(function(){ try{ var detalleAbierto=false; document.querySelectorAll('[class*="modal"], [class*="overlay"]').forEach(function(o){ if(o.offsetParent!==null && o.id && o.id.indexOf('Admin')===-1 && o.id.indexOf('Form')===-1 && o.id.indexOf('Login')===-1) detalleAbierto=true; }); if(detalleAbierto) return; var prods=leerProds(); if(!prods.length) return; corregirPildoras(); }catch(e){} }, 4000);
  setTimeout(corregirPildoras, 800);

  function instalarBuscador(){
    try{
      if(!window.patinaSetQ) return;
      if(window.patinaSetQ._v42) return;
      window.patinaSetQ = function(v){
        var q = String(v||'').toLowerCase().trim();
        try{ sessionStorage.setItem('patina_admin_q', v||''); }catch(e){}
        var cards = document.querySelectorAll('#patinaAdminPage .patina-card');
        if(!cards.length) return;
        var visibles = 0;
        cards.forEach(function(card){ var txt = (card.textContent||'').toLowerCase(); var show = !q || txt.indexOf(q)!==-1; card.style.display = show ? '' : 'none'; if(show) visibles++; });
        var headSpan = document.querySelector('#patinaAdminPage .patina-art-head span');
        if(headSpan) headSpan.textContent = visibles + ' visibles';
      };
      window.patinaSetQ._v42 = true;
    }catch(e){}
  }
  setInterval(instalarBuscador, 500);
  setTimeout(instalarBuscador, 300);
  document.addEventListener('input', function(e){ try{ var t=e.target; if(t && t.classList && t.classList.contains('patina-search')){ setTimeout(instalarBuscador, 50); setTimeout(function(){ try{ if(window.patinaSetQ && window.patinaSetQ._v42) return; var q=String(t.value||'').toLowerCase().trim(); var cards=document.querySelectorAll('#patinaAdminPage .patina-card'); cards.forEach(function(card){ var txt=(card.textContent||'').toLowerCase(); card.style.display=(!q||txt.indexOf(q)!==-1)?'':'none'; }); }catch(e){} }, 120); } }catch(e){} }, false);

  function arreglarModal(){
    try{
      var modal = document.querySelector('.patina-form-modal');
      if(!modal) return;
      var overlay = document.getElementById('patinaFormOverlay');
      if(overlay && !overlay.classList.contains('open')) return;
      var box = document.getElementById('patinaNuevaCatBox');
      if(box && box.style.display!=='none' && box.style.display!==''){ box.style.display='block'; box.style.flexDirection=''; }
      var eti = document.getElementById('patinaF_etiqueta');
      var des = document.getElementById('patinaF_descripcion');
      if(eti && des){
        var etiLabel=null, desLabel=null;
        modal.querySelectorAll('label').forEach(function(l){ var t=(l.textContent||'').trim().toUpperCase(); if(t.indexOf('ETIQUETA')!==-1) etiLabel=l; if(t.indexOf('DESCRIPCI')!==-1) desLabel=l; });
        if(etiLabel && desLabel){ var desAntes=(desLabel.compareDocumentPosition(etiLabel)&4)!==0; if(desAntes){ modal.insertBefore(etiLabel, desLabel); modal.insertBefore(eti, desLabel); } }
      }
      var calc = document.getElementById('patinaCalc');
      if(calc){ var row=calc.closest('.patina-row'); if(row && row.parentNode && row.contains(calc)){ row.parentNode.insertBefore(calc, row.nextSibling); } calc.style.width='100%'; calc.style.display='block'; }
      modal.querySelectorAll('.patina-form-btns button, button').forEach(function(b){
        var txt=(b.textContent||'').trim(); if(!txt) return;
        var esGuardar=b.classList.contains('patina-form-save')||txt.indexOf('Guardar')!==-1||txt.indexOf('Agregar')!==-1;
        var esCancelar=b.classList.contains('patina-form-cancel')||txt.indexOf('Cancelar')!==-1;
        if(b.classList.contains('patina-form-close')) return;
        if(esGuardar && txt.indexOf('✓')===-1 && txt.indexOf('✔')===-1){ b.textContent='✓ '+txt; }
        if(esCancelar && txt.indexOf('✕')===-1 && txt.indexOf('✖')===-1 && txt.indexOf('×')===-1){ b.textContent='✕ '+txt; }
      });
      try{ var vis=document.getElementById('patinaF_visible'); if(vis){ var visLabel=vis.closest('label'); var btns=modal.querySelector('.patina-form-btns'); if(visLabel && btns && (visLabel.compareDocumentPosition(btns)&4)===0){ modal.insertBefore(visLabel, btns); } } }catch(e){}
    }catch(e){}
  }
  setInterval(arreglarModal, 500);
  document.addEventListener('click', function(){ setTimeout(arreglarModal, 100); setTimeout(arreglarModal, 500); }, true);
  try{ var obs=new MutationObserver(function(){ arreglarModal(); }); obs.observe(document.documentElement, {childList:true, subtree:true}); }catch(e){}
})();
