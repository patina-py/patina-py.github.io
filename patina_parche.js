// V28 = V27 + FIX MODAL COLGADO + FOTOS CRUZADAS + CATALOGO DUPLICADO EN HOME + SYNC VERIFICADO
(function(){
  try{
    if(!document.getElementById('patina-v28-css')){
      var st=document.createElement('style'); st.id='patina-v28-css';
      st.textContent=
        'input,textarea,select{font-size:16px !important;}'+
        '#patinaFormModal input,#patinaFormModal textarea,#patinaFormModal select{font-size:16px !important;}'+
        '#patinaFormOverlay{overflow-y:auto !important; align-items:flex-start !important; padding:16px 12px !important;}'+
        '#patinaFormModal,.patina-form-modal{max-height:88dvh !important; overflow-y:auto !important; -webkit-overflow-scrolling:touch !important; padding-bottom:18px !important; box-sizing:border-box !important;}'+
        '#patinaFormModal .patina-foto{border:none !important; background:rgba(255,255,255,0.08) !important; border-radius:14px !important; padding:8px 10px !important; margin:0 0 10px 0 !important; height:auto !important; min-height:56px !important; max-height:none !important; overflow:hidden !important; display:flex !important; align-items:center !important; gap:10px !important; box-sizing:border-box !important;}'+
        '#patinaFormModal .patina-foto-ico{width:56px !important; height:56px !important; min-width:56px !important; min-height:56px !important; max-width:56px !important; max-height:56px !important; border-radius:10px !important; overflow:hidden !important; flex-shrink:0 !important; display:grid !important; place-items:center !important; font-size:22px !important;}'+
        '#patinaFormModal .patina-foto-ico img{width:100% !important; height:100% !important; object-fit:cover !important; display:block !important;}'+
        '#patinaFormModal #patinaFotoTxt{font-size:11px !important; letter-spacing:.14em !important; white-space:nowrap !important;}'+
        '#patinaFormModal #patinaCalc{width:100% !important; display:block !important; margin:6px 0 2px 0 !important; text-align:left !important; font-size:11px !important; line-height:1.4 !important;}'+
        '#patinaFormModal .patina-form-btns{position:relative !important; bottom:auto !important; background:transparent !important; padding:12px 0 4px 0 !important; margin-top:12px !important; z-index:10 !important;}'+
        '#patinaFormModal #patinaNuevaCatBox{position:relative !important; z-index:1 !important; margin-top:8px !important; display:block !important;}'+
        '.patina-cat-pill .patina-cat-ico{display:none !important;}'+
        '.patina-cat-pill{background:transparent !important; color:#2f3a2a !important; border:1px solid rgba(47,58,42,.25) !important;}'+
        '.patina-cat-pill.active{background:#2f3a2a !important; color:#F5ECDC !important; border-color:#2f3a2a !important;}'+
        '.patina-search{font-size:16px !important;}';
      document.head.appendChild(st);
    }
    var vp=document.querySelector('meta[name="viewport"]');
    if(vp && vp.content.indexOf('maximum-scale')===-1) vp.content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
  }catch(e){}

  var KEY='patina_v25_admin';
  var CATS_KEY='patina_v25_cats';
  var GAS_URL="https://script.google.com/macros/s/AKfycbznKXsIvfuR_kb4UIwHk2QtjaqOlGUW9imJFjXDKfWuanUCFZOtbPLSXVlwAx8mr_I2UQ/exec";
  try{ var saved=localStorage.getItem("patina_gas_url_v1"); if(saved) GAS_URL=saved; }catch(e){}
  var fotoCambiada=false;
  var categoriaPendiente=null;
  var yaLimpio=false;

  function leerProds(){ try{ var v=JSON.parse(localStorage.getItem(KEY)||"[]"); if(Array.isArray(v)) return v; }catch(e){} return []; }
  function guardarProds(arr){ try{ localStorage.setItem(KEY, JSON.stringify(arr)); }catch(e){} }
  function claveProd(p){ var n=String(p.nombre||p.name||'').toLowerCase().trim(); return n; } // Solo por nombre, para no duplicar por precio
  function claveFull(p){ var n=String(p.nombre||p.name||'').toLowerCase().trim(); var c=String(p.categoria||p.category||'').toLowerCase().trim(); var pr=String(p.precio||p.price||'').trim(); return n+'|'+c+'|'+pr; }

  // LIMPIAR DUPLICADOS SIN REASIGNAR ID - clave: NO tocar p.id, para no cruzar fotos
  function limpiarDuplicados(){
    if(yaLimpio) return; yaLimpio=true;
    try{
      var loc=leerProds(); if(!loc.length) return;
      var vistos={}; var limpios=[];
      var cambio=false;
      loc.forEach(function(p){
        var clave=claveFull(p);
        // Si hay dos con mismo nombre exacto, es duplicado aunque cambie precio (ej mismo producto guardado dos veces)
        var claveNombre=claveProd(p);
        if(!vistos[claveNombre]){
          vistos[claveNombre]=p; limpios.push(p);
        } else {
          cambio=true;
          var ex=vistos[claveNombre];
          // Mantener la foto que si existe, no pisarla con vacia
          if(!ex.foto && p.foto) ex.foto=p.foto;
          if(!ex.descripcion && p.descripcion) ex.descripcion=p.descripcion;
          if(!ex.etiqueta && p.etiqueta) ex.etiqueta=p.etiqueta;
          // NO reasignar ID, NO cambiar ex.id
        }
      });
      if(cambio){
        // NO reasignar IDs: guardar tal cual, solo sin duplicados
        guardarProds(limpios);
        try{ if(window.patinaSyncNow) window.patinaSyncNow(); }catch(e){}
      }
    }catch(e){}
  }
  setTimeout(limpiarDuplicados, 600);

  // SYNC VERIFICADO: traer de Google, fusionar por NOMBRE, nunca borrar foto local si Google no tiene
  function syncDesdeGoogle(){
    try{
      if(document.activeElement && (document.activeElement.tagName==='INPUT' || document.activeElement.tagName==='TEXTAREA')) return;
      // No sincronizar mientras el modal de detalle o de Admin esta abierto, para no colgarlo
      var modalDetalleAbierto=false;
      try{
        // Si hay un modal de producto abierto (no Admin), no tocar nada
        var overlays=document.querySelectorAll('[class*="overlay"], [class*="modal"]');
        overlays.forEach(function(o){
          if(o.classList && (o.classList.contains('open')||o.style.display==='flex'||o.style.display==='block')){
            if(o.id && (o.id.indexOf('Admin')!==-1 || o.id.indexOf('Form')!==-1 || o.id.indexOf('Login')!==-1)) return;
            // Cualquier otro modal abierto = detalle de producto
            if(o.offsetParent!==null) modalDetalleAbierto=true;
          }
        });
      }catch(e){}
      if(modalDetalleAbierto) return;
      fetch(GAS_URL).then(function(r){ return r.json(); }).then(function(gas){
        if(!gas) return;
        var gasProds=Array.isArray(gas) ? gas : (gas.productos||[]);
        var gasCats=Array.isArray(gas) ? [] : (gas.categorias||[]);
        if(!gasProds.length) return;
        var loc=leerProds();
        var porNombre={}; loc.forEach(function(p){ porNombre[claveProd(p)]=p; });
        var cambio=false;
        gasProds.forEach(function(g){
          var clave=claveProd(g);
          if(!porNombre[clave]){
            // Nuevo de otro dispositivo: agregarlo con su ID original de Google, no reasignar
            loc.push(g); porNombre[clave]=g; cambio=true;
          } else {
            var l=porNombre[clave];
            if(!l.foto && g.foto){ l.foto=g.foto; cambio=true; }
            // Si Google tiene categoria distinta y local esta vacia, copiar
            if(!l.categoria && g.categoria){ l.categoria=g.categoria; cambio=true; }
          }
        });
        if(cambio){
          guardarProds(loc);
          yaLimpio=false; limpiarDuplicados();
          try{
            var locCats=JSON.parse(localStorage.getItem(CATS_KEY)||"[]"); if(!Array.isArray(locCats)) locCats=[];
            var setC={}; locCats.forEach(function(c){ setC[String(c).toLowerCase()]=1; });
            var cc=false;
            gasCats.forEach(function(c){ var lc=String(c).toLowerCase(); if(!setC[lc]){ locCats.push(lc); setC[lc]=1; cc=true; } });
            loc.forEach(function(p){ var c=String(p.categoria||'').toLowerCase(); if(c && !setC[c] && c!=='cartera' && c!=='accesorio'){ locCats.push(c); setC[c]=1; cc=true; } });
            if(cc) localStorage.setItem(CATS_KEY, JSON.stringify(locCats));
          }catch(e){}
          try{ if(window.patinaRefrescarTienda) window.patinaRefrescarTienda(); }catch(e){}
        }
      }).catch(function(){});
    }catch(e){}
  }
  setTimeout(function(){ syncDesdeGoogle(); }, 900);
  setInterval(function(){ syncDesdeGoogle(); }, 15000);
  document.addEventListener('visibilitychange', function(){ if(!document.hidden) syncDesdeGoogle(); });
  window.addEventListener('focus', function(){ syncDesdeGoogle(); });

  try{
    if(window.patinaSetQ && !window.patinaSetQ._v28orig) window.patinaSetQ._v28orig=window.patinaSetQ;
    window.patinaSetQ=function(v){
      var q=String(v||'').toLowerCase().trim();
      var visibles=0;
      document.querySelectorAll('#patinaAdminPage .patina-card').forEach(function(card){
        var txt=(card.textContent||'').toLowerCase();
        var show=!q || txt.indexOf(q)!==-1; card.style.display=show?'':'none'; if(show) visibles++;
      });
      var headSpan=document.querySelector('#patinaAdminPage .patina-art-head span');
      if(headSpan) headSpan.textContent=visibles+' visibles';
      try{ sessionStorage.setItem('patina_admin_q', v||''); }catch(e){}
    };
    window.patinaSetQ._v28=true;
    if(window.patinaSetCat && !window.patinaSetCat._v28){
      var origCat=window.patinaSetCat;
      var wrappedCat=function(c){ origCat(c); setTimeout(function(){ try{ var q=sessionStorage.getItem('patina_admin_q')||''; if(q){ var inp=document.querySelector('.patina-search'); if(inp) inp.value=q; window.patinaSetQ(q); } }catch(e){} },30); };
      wrappedCat._v28=true; window.patinaSetCat=wrappedCat;
    }
    if(window.patinaNuevo && !window.patinaNuevo._v28){
      var origNuevo=window.patinaNuevo;
      var wNuevo=function(){ fotoCambiada=false; categoriaPendiente=null; try{ sessionStorage.setItem('patina_foto_cambiada','0'); sessionStorage.removeItem('patina_cat_pendiente'); }catch(e){} origNuevo(); setTimeout(function(){ try{ var ico=document.getElementById('patinaFotoIco'); if(ico) ico.innerHTML='📷'; var txt=document.getElementById('patinaFotoTxt'); if(txt) txt.textContent='Agregar foto'; }catch(e){} },50); };
      wNuevo._v28=true; window.patinaNuevo=wNuevo;
    }
    if(window.patinaPreviewFoto && !window.patinaPreviewFoto._v28){
      var origPrev=window.patinaPreviewFoto;
      var wPrev=function(e){ fotoCambiada=true; try{ sessionStorage.setItem('patina_foto_cambiada','1'); }catch(e){} return origPrev(e); };
      wPrev._v28=true; window.patinaPreviewFoto=wPrev;
    }
    if(window.patinaEditar && !window.patinaEditar._v28){
      var origEd=window.patinaEditar;
      var wEd=function(i){ fotoCambiada=false; try{ sessionStorage.setItem('patina_foto_cambiada','0'); }catch(e){} return origEd(i); };
      wEd._v28=true; window.patinaEditar=wEd;
    }
    if(window.patinaAgregarCatDesdeForm && !window.patinaAgregarCatDesdeForm._v28){
      var origAdd=window.patinaAgregarCatDesdeForm;
      var wAdd=function(){
        var inp=document.getElementById('patinaNuevaCatInput'); var n=inp?inp.value.trim():'';
        if(n){ categoriaPendiente=n.toLowerCase(); try{ sessionStorage.setItem('patina_cat_pendiente', categoriaPendiente); }catch(e){} }
        var r=origAdd();
        setTimeout(function(){ try{ var m=document.getElementById('patinaFormModal'); if(m) m.scrollTop=0; var box=document.getElementById('patinaNuevaCatBox'); if(box) box.style.display='none'; }catch(e){} },80);
        return r;
      };
      wAdd._v28=true; window.patinaAgregarCatDesdeForm=wAdd;
    }
    if(window.patinaCerrarForm && !window.patinaCerrarForm._v28){
      var origCerrar=window.patinaCerrarForm;
      var wCerrar=function(){ try{ sessionStorage.removeItem('patina_cat_pendiente'); }catch(e){} categoriaPendiente=null; return origCerrar(); };
      wCerrar._v28=true; window.patinaCerrarForm=wCerrar;
    }
    if(window.patinaMostrarNuevaCat && !window.patinaMostrarNuevaCat._v28){
      var origMostrar=window.patinaMostrarNuevaCat;
      var wMostrar=function(){ var r=origMostrar(); setTimeout(function(){ try{ var m=document.getElementById('patinaFormModal'); if(m) m.style.overflowY='auto'; var inp=document.getElementById('patinaNuevaCatInput'); if(inp && document.getElementById('patinaNuevaCatBox') && document.getElementById('patinaNuevaCatBox').style.display==='block') inp.focus(); }catch(e){} },60); return r; };
      wMostrar._v28=true; window.patinaMostrarNuevaCat=wMostrar;
    }
    if(window.patinaGuardarNuevaCat && !window.patinaGuardarNuevaCat._v28){
      var origGuardarCat=window.patinaGuardarNuevaCat;
      var wGuardarCat=function(){ var r=origGuardarCat(); setTimeout(function(){ try{ if(window.patinaSyncNow) window.patinaSyncNow(); syncDesdeGoogle(); }catch(e){} }, 400); return r; };
      wGuardarCat._v28=true; window.patinaGuardarNuevaCat=wGuardarCat;
    }
    if(window.patinaGuardar && !window.patinaGuardar._v28){
      var origGuardar=window.patinaGuardar;
      var wGuardar=function(){
        var r=origGuardar();
        setTimeout(function(){ try{ if(window.patinaSyncNow) window.patinaSyncNow(); }catch(e){} }, 600);
        setTimeout(function(){ try{ if(window.patinaSyncNow) window.patinaSyncNow(); }catch(e){} }, 2000);
        return r;
      };
      wGuardar._v28=true; window.patinaGuardar=wGuardar;
    }
  }catch(e){}

  document.addEventListener('click', function(e){
    try{
      var btn=e.target.closest? e.target.closest('button') : null;
      if(!btn) return;
      var t=(btn.textContent||'').trim();
      if(t.indexOf('Guardar')!==-1 || t.indexOf('Agregar')!==-1){
        try{ sessionStorage.removeItem('patina_cat_pendiente'); }catch(e){} categoriaPendiente=null;
        setTimeout(function(){ try{ if(window.patinaSyncNow) window.patinaSyncNow(); }catch(e){} }, 1000);
      }
    }catch(e){}
  }, true);
  document.addEventListener('change', function(e){
    try{
      var sel=e.target; if(!sel || sel.tagName!=='SELECT') return;
      if(sel.value==='__nueva__'){
        var nombre=prompt('Escribí el nombre de la nueva categoría (ej: Termos)');
        if(nombre && nombre.trim()){
          var cat=nombre.trim().toLowerCase(); categoriaPendiente=cat;
          try{ sessionStorage.setItem('patina_cat_pendiente', cat); }catch(e){}
          var opt=document.createElement('option'); opt.value=cat; opt.textContent=nombre.trim();
          sel.insertBefore(opt, sel.querySelector('option[value="__nueva__"]')); sel.value=cat;
        } else { sel.value=''; }
      }
    }catch(e){}
  }, true);

  function formatearWhatsAppIndividual(){
    try{
      document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"], a[href*="api.whatsapp"]').forEach(function(a){
        var href=a.getAttribute('href')||''; if(!href) return;
        var decoded=''; try{ decoded=decodeURIComponent(href); }catch(e){ decoded=href; }
        if(decoded.toLowerCase().indexOf('carrito')!==-1) return;
        if(decoded.toLowerCase().indexOf('pedido')!==-1) return;
        if((decoded.match(/#00/g)||[]).length>1) return;
        if(decoded.indexOf('Me interesa el item')===-1 && decoded.indexOf('Me interesa')===-1) return;
        if(decoded.indexOf('Me das')!==-1 && href.indexOf('%0A')!==-1){ var c=(href.match(/%0A/gi)||[]).length; if(c>=4) return; }
        var m=decoded.match(/#(00\d+)\s*-\s*(.+?)\s*\(([^)]+)\)/);
        var numero=null, nombre=null, precio=null;
        if(m){ numero=m[1]; nombre=m[2].trim(); precio=m[3].trim(); }
        else { var m2=decoded.match(/#(00\d+)\s+(.+)/); if(m2){ numero=m2[1]; nombre=m2[2].trim(); precio=''; } else return; }
        var lineas=['Hola Pátina!','Me interesa el item #'+numero, nombre];
        if(precio) lineas.push(precio);
        lineas.push('Me das más info?');
        var texto=lineas.join('\n');
        var base=href.split('?')[0];
        var nuevo=base+'?text='+encodeURIComponent(texto);
        if(a.getAttribute('href')!==nuevo) a.setAttribute('href', nuevo);
      });
    }catch(e){}
  }
  function getProductos(){ return leerProds(); }
  function tieneOferta(p){ var precio=parseFloat(p.precio||p.price||0)||0; var oferta=parseFloat(p.precio_oferta||p.oferta||p.precioOferta||p.sale_price||0)||0; if(oferta>0 && precio>0 && oferta<precio) return true; if(p.descuento && parseFloat(p.descuento)>0) return true; if(p.etiqueta && String(p.etiqueta).toUpperCase().indexOf('OFF')!==-1) return true; return false; }
  function normCat(c){ var s=String(c||'').toLowerCase().trim(); if(s==='cartera'||s==='carteras') return 'carteras'; if(s==='accesorio'||s==='accesorios') return 'accesorios'; if(s==='todo'||s==='todos') return 'todos'; if(s==='oferta'||s==='ofertas') return 'ofertas'; return s; }
  function mostrarCat(cat){ var n=normCat(cat); if(n==='carteras') return 'CARTERAS'; if(n==='accesorios') return 'ACCESORIOS'; if(n==='ofertas') return 'OFERTAS'; if(n==='todos') return 'TODOS'; return String(cat||'').toUpperCase(); }

  // FILTRADO SOLO EN MÁS CATEGORÍAS (view-todos). NO tocar HOME para no duplicar catalogo abajo.
  function filtrarPorCategoria(cat){
    try{
      var ncat=normCat(cat);
      var view=document.getElementById('view-todos');
      if(!view) return;
      // Si no estamos en MÁS CATEGORÍAS, no filtrar nada (HOME se queda como esta)
      if(view.style.display==='none' && view.offsetParent===null){
        // Intentar mostrar la vista todos si el usuario toco una pildora de todos
        // No forzamos, solo salimos para no tocar HOME
        // Pero si venimos de un click en pildora de todos, la vista ya deberia estar visible por patinaIrA
      }
      var grid=view.querySelector('.products-grid');
      if(!grid) return;
      var ps=getProductos();
      var porNombre={};
      ps.forEach(function(p){ var n=String(p.nombre||p.name||'').toLowerCase().trim(); if(n) porNombre[n]=normCat(p.categoria||p.category||''); });
      var cards=grid.querySelectorAll(':scope > *');
      if(!cards.length) cards=grid.querySelectorAll('.product-card-compact, [class*="product-card"]');
      cards.forEach(function(card){
        if(ncat==='todos'){ card.style.display=''; return; }
        var txt=(card.textContent||'').trim();
        var nombreCard='';
        var h=card.querySelector('h1,h2,h3,h4,p,b,strong');
        if(h) nombreCard=h.textContent.trim().toLowerCase();
        else { var lineas=txt.split('\n').map(function(s){ return s.trim(); }).filter(function(s){ return s.length>2; }); nombreCard=(lineas[0]||'').toLowerCase(); }
        var catOf=porNombre[nombreCard];
        if(!catOf){
          var encontrado=null;
          Object.keys(porNombre).forEach(function(n){ if(txt.toLowerCase().indexOf(n)!==-1) encontrado=porNombre[n]; });
          catOf=encontrado;
        }
        if(ncat==='ofertas'){
          var tieneOff=txt.toUpperCase().indexOf('OFF')!==-1 || !!card.querySelector('s, del');
          if(!tieneOff){
            var prodOff=null;
            Object.keys(porNombre).forEach(function(n){ if(txt.toLowerCase().indexOf(n)!==-1){ var pp=ps.find(function(p){ return String(p.nombre||'').toLowerCase().trim()===n; }); if(pp && tieneOferta(pp)) prodOff=pp; } });
            tieneOff=!!prodOff;
          }
          card.style.display=tieneOff?'':'none';
        } else {
          if(!catOf) { card.style.display=''; return; }
          card.style.display = (catOf===ncat) ? '' : 'none';
        }
      });
    }catch(e){}
  }
  window.__patinaFiltrar=filtrarPorCategoria;

  function crearPildora(cat, activa){
    var b=document.createElement('button');
    b.type='button'; b.className='patina-cat-pill'+(activa?' active':''); b.setAttribute('data-cat-pill', normCat(cat));
    b.textContent=mostrarCat(cat);
    b.addEventListener('click', function(){
      try{ window.__patinaCatFilter=normCat(cat); }catch(e){}
      document.querySelectorAll('#view-todos .patina-cat-pill').forEach(function(x){ x.classList.remove('active'); });
      document.querySelectorAll('#view-todos [data-cat-pill="'+normCat(cat)+'"]').forEach(function(x){ x.classList.add('active'); });
      try{ if(window.patinaIrA) window.patinaIrA('todos'); }catch(e){}
      [200, 500, 900].forEach(function(ms){ setTimeout(function(){ filtrarPorCategoria(cat); }, ms); });
    });
    return b;
  }
  function estaEscribiendo(){ try{ var a=document.activeElement; if(!a) return false; var t=(a.tagName||'').toUpperCase(); return t==='INPUT'||t==='TEXTAREA'||t==='SELECT'||a.isContentEditable; }catch(e){ return false; } }
  function nuevaCatAbierta(){ try{ var box=document.getElementById('patinaNuevaCatBox'); return box && box.style.display!=='none' && box.style.display!==''; }catch(e){ return false; } }
  function arreglarModal(){
    try{
      var modal=document.getElementById('patinaFormModal'); if(!modal) return;
      if(modal.innerText.indexOf('Nueva categoría')!==-1) return;
      if(modal.innerText.indexOf('¿Eliminar')!==-1) return;
      if(nuevaCatAbierta()) return;
      if(estaEscribiendo()){ var ae=document.activeElement; if(ae && (ae.id==='patinaF_descripcion'||ae.id==='patinaF_etiqueta'||ae.id==='patinaF_precio'||ae.id==='patinaF_desc'||ae.id==='patinaNuevaCatInput')) return; }
      var calc=document.getElementById('patinaCalc');
      if(calc){ var row=calc.closest('.patina-row'); if(row && row.contains(calc)) row.parentNode.insertBefore(calc, row.nextSibling); }
      var eti=document.getElementById('patinaF_etiqueta'); var des=document.getElementById('patinaF_descripcion');
      if(eti && des){
        var etiLabel=null, desLabel=null;
        modal.querySelectorAll('label').forEach(function(l){ var t=(l.textContent||'').trim().toUpperCase(); if(t.indexOf('ETIQUETA')!==-1) etiLabel=l; if(t.indexOf('DESCRIPCI')!==-1) desLabel=l; });
        if(etiLabel && desLabel){ var desAntes=(desLabel.compareDocumentPosition(etiLabel) & 4)!==0; if(desAntes){ modal.insertBefore(etiLabel, desLabel); modal.insertBefore(eti, desLabel); } }
      }
      modal.querySelectorAll('.patina-form-btns button').forEach(function(b){
        var txt=(b.textContent||'').trim();
        if(b.classList.contains('patina-form-save') && txt.indexOf('✓')===-1 && txt.indexOf('✔')===-1) b.textContent='✓ '+txt;
        if(b.classList.contains('patina-form-cancel') && txt.indexOf('✕')===-1 && txt.indexOf('✖')===-1) b.textContent='✕ '+txt;
      });
      try{
        var h3=modal.querySelector('h3'); var esNuevo=h3 && h3.textContent.indexOf('Agregar')!==-1;
        var cambiada=false; try{ cambiada=sessionStorage.getItem('patina_foto_cambiada')==='1'; }catch(e){ cambiada=fotoCambiada; }
        if(esNuevo && !cambiada){ var ico=document.getElementById('patinaFotoIco'); if(ico && ico.querySelector('img')){ ico.innerHTML='📷'; var txt2=document.getElementById('patinaFotoTxt'); if(txt2) txt2.textContent='Agregar foto'; } }
      }catch(e){}
    }catch(e){}
  }
  // STOCK LIVIANO: NO tocar innerHTML del modal de detalle, solo guardar stock para el +.
  // Esto evita que se cuelgue el modal al entrar a ver un producto.
  function arreglarStockLiviano(){
    try{
      // Solo si hay un modal de detalle abierto, buscar su producto por titulo y guardar su stock
      // No recorrer todos los div, no cambiar HTML
      var titulo='';
      document.querySelectorAll('h1,h2,h3').forEach(function(h){
        if(h.offsetParent!==null && h.textContent && h.textContent.length>2 && h.textContent.length<60){
          // El titulo del detalle suele estar en un modal, no en HOME
          var cerca=h.closest('[class*="modal"], [class*="overlay"], [class*="detalle"], [class*="detail"]');
          if(cerca) titulo=h.textContent.trim();
        }
      });
      if(!titulo) return;
      var prods=getProductos();
      var prod=prods.find(function(p){ return (p.nombre||p.name||'')===titulo; });
      if(!prod) return;
      var stockRaw=prod.stock;
      var stock=99;
      if(stockRaw!==undefined && stockRaw!==null && String(stockRaw).trim()!=='' && String(stockRaw).toLowerCase().indexOf('sin')===-1){ var n=parseInt(stockRaw,10); if(!isNaN(n)) stock=n; }
      window.__patinaStockActual=stock;
      window.__patinaProdActual=prod.id;
    }catch(e){}
  }
  // + con stock: solo si estamos en detalle y el + es de cantidad
  document.addEventListener('click', function(e){
    try{
      var btn=e.target.closest? e.target.closest('button') : null;
      if(!btn) return;
      if((btn.textContent||'').trim()!=='+') return;
      // Verificar que estamos en detalle: hay un modal abierto que no es Admin/Form
      var enDetalle=false;
      document.querySelectorAll('[class*="modal"], [class*="overlay"]').forEach(function(o){
        if(o.offsetParent!==null && o.id && o.id.indexOf('Admin')===-1 && o.id.indexOf('Form')===-1 && o.id.indexOf('Login')===-1) enDetalle=true;
      });
      if(!enDetalle) return;
      var stock=window.__patinaStockActual;
      if(!stock || stock>=99) return;
      var cont=btn.parentElement; if(!cont) return;
      var qtyEl=cont.querySelector('span');
      var qty=qtyEl? parseInt(qtyEl.textContent,10): 1;
      if(!isNaN(qty) && qty>=stock){
        e.preventDefault(); e.stopPropagation();
        alert('Solo quedan '+stock+' unidades de este producto');
        return false;
      }
    }catch(e){}
  }, true);

  function limpiarCatsCero(conteo){
    try{
      var modalAbierto=false; try{ var m=document.getElementById('patinaFormOverlay'); modalAbierto=m && m.classList.contains('open'); }catch(e){}
      var pendiente=null; try{ pendiente=sessionStorage.getItem('patina_cat_pendiente'); }catch(e){} if(!pendiente) pendiente=categoriaPendiente;
      var keys=['patina_v25_cats','patina_cats_v1'];
      keys.forEach(function(k){
        try{
          var raw=localStorage.getItem(k); if(!raw) return;
          var arr=JSON.parse(raw); if(!Array.isArray(arr)) return;
          var filtrado=arr.filter(function(c){
            var lc=String(c).toLowerCase().trim();
            if(lc==='cartera'||lc==='accesorio'||lc==='carteras'||lc==='accesorios') return true;
            if(lc==='todos'||lc==='ofertas') return false;
            if(modalAbierto && pendiente && normCat(lc)===normCat(pendiente)) return true;
            try{ var sel=document.getElementById('patinaF_cat'); if(sel && sel.value && normCat(sel.value)===normCat(lc)) return true; }catch(e){}
            return (conteo[normCat(lc)]||conteo[lc]||0)>0;
          });
          if(filtrado.length!==arr.length) localStorage.setItem(k, JSON.stringify(filtrado));
        }catch(e){}
      });
    }catch(e){}
  }
  function corregirPildoras(){
    try{
      var prods=getProductos();
      if(!prods.length) return;
      var conteo={};
      prods.forEach(function(p){ var c=String(p.category||p.categoria||'').trim().toLowerCase(); if(!c) return; var n=normCat(c); conteo[n]=(conteo[n]||0)+1; });
      limpiarCatsCero(conteo);
      var hayOferta=prods.some(function(p){ return tieneOferta(p); });
      var activa='todos';
      try{
        var cur=document.querySelector('#view-todos .patina-cat-pill.active');
        if(cur) activa=normCat(cur.getAttribute('data-cat-pill')||cur.textContent);
        else if(window.__patinaCatFilter) activa=normCat(window.__patinaCatFilter);
      }catch(e){}
      if(activa!=='todos' && activa!=='ofertas' && (!conteo[activa] || conteo[activa]===0)) activa='todos';
      var wrapTodos=document.querySelector('#view-todos .patina-cat-pills');
      if(wrapTodos){
        var catsOrden=[];
        if((conteo['carteras']||0)>0) catsOrden.push('carteras');
        if((conteo['accesorios']||0)>0) catsOrden.push('accesorios');
        Object.keys(conteo).forEach(function(c){ if(c==='carteras'||c==='accesorios'||c==='todos'||c==='ofertas') return; if(conteo[c]>0) catsOrden.push(c); });
        var extras=catsOrden.filter(function(c){ return c!=='carteras' && c!=='accesorios'; }).sort();
        catsOrden=[];
        if((conteo['carteras']||0)>0) catsOrden.push('carteras');
        if((conteo['accesorios']||0)>0) catsOrden.push('accesorios');
        extras.forEach(function(c){ catsOrden.push(c); });
        if(hayOferta) catsOrden.push('ofertas');
        catsOrden.push('todos');
        var actuales=[];
        wrapTodos.querySelectorAll('[data-cat-pill]').forEach(function(b){ actuales.push(normCat(b.getAttribute('data-cat-pill')||b.textContent)); });
        var igual=actuales.length===catsOrden.length && actuales.every(function(v,i){ return v===catsOrden[i]; });
        if(!igual){
          wrapTodos.innerHTML='';
          catsOrden.forEach(function(cat){ var b=crearPildora(cat, cat===activa); wrapTodos.appendChild(b); });
          setTimeout(function(){ filtrarPorCategoria(activa); }, 300);
        } else {
          wrapTodos.querySelectorAll('[data-cat-pill]').forEach(function(b){
            var n=normCat(b.getAttribute('data-cat-pill')||b.textContent);
            if(b.textContent!==mostrarCat(n)) b.textContent=mostrarCat(n);
            if(n===activa) b.classList.add('active'); else b.classList.remove('active');
          });
          var tb=wrapTodos.querySelector('[data-cat-pill="todos"]');
          if(tb && tb!==wrapTodos.lastElementChild) wrapTodos.appendChild(tb);
        }
      }
      document.querySelectorAll('.patina-cat-pills').forEach(function(wrap){
        if(wrap===wrapTodos) return;
        if(wrap.closest('#patinaFormModal')) return;
        var vistos={};
        wrap.querySelectorAll('[data-cat-pill]').forEach(function(b){
          var n=normCat(b.getAttribute('data-cat-pill')||b.textContent);
          if(vistos[n]){ b.remove(); return; } vistos[n]=1;
          if(b.querySelector('.patina-cat-ico')) b.querySelector('.patina-cat-ico').remove();
          if(b.textContent!==mostrarCat(n)) b.textContent=mostrarCat(n);
          if((!conteo[n] || conteo[n]===0) && n!=='todos' && n!=='carteras' && n!=='accesorios' && n!=='ofertas'){ b.remove(); }
        });
        var actives=wrap.querySelectorAll('[data-cat-pill].active');
        if(actives.length>1){ for(var i=1;i<actives.length;i++) actives[i].classList.remove('active'); }
      });
      document.querySelectorAll('#patinaFormModal select').forEach(function(sel){
        var valorActual=(sel.value||'').toLowerCase();
        sel.querySelectorAll('option').forEach(function(opt){
          var v=(opt.value||opt.textContent||'').trim().toLowerCase();
          if(v==='__nueva__') return;
          if(['todos','home',''].indexOf(v)!==-1) return;
          if(v==='ofertas') return;
          if(normCat(v)===normCat(valorActual)) return;
          var pend=null; try{ pend=sessionStorage.getItem('patina_cat_pendiente'); }catch(e){}
          if(pend && normCat(v)===normCat(pend)) return;
          if(!conteo[normCat(v)] || conteo[normCat(v)]===0) opt.remove();
        });
        var vals=[]; sel.querySelectorAll('option').forEach(function(o){ vals.push(normCat(o.value||'')); });
        Object.keys(conteo).forEach(function(cat){
          if(cat==='todos'||cat==='ofertas') return;
          if(vals.indexOf(cat)===-1){
            var o=document.createElement('option'); o.value=cat; o.textContent=cat.charAt(0).toUpperCase()+cat.slice(1);
            var nueva=sel.querySelector('option[value="__nueva__"]');
            if(nueva) sel.insertBefore(o, nueva); else sel.appendChild(o);
          }
        });
        if(!sel.querySelector('option[value="__nueva__"]')){
          var on=document.createElement('option'); on.value='__nueva__'; on.textContent='+ Nueva categoría...'; sel.appendChild(on);
        }
      });
    }catch(e){}
  }
  function corregir(){
    try{
      arreglarModal();
      formatearWhatsAppIndividual();
      arreglarStockLiviano();
      if(estaEscribiendo()){
        var ae=document.activeElement;
        if(ae && ae.classList && ae.classList.contains('patina-search')) return;
      }
      // No corregir pildoras si el modal de detalle esta abierto, para no colgarlo
      var detalleAbierto=false;
      try{
        document.querySelectorAll('[class*="modal"], [class*="overlay"]').forEach(function(o){
          if(o.offsetParent!==null && o.id && o.id.indexOf('Admin')===-1 && o.id.indexOf('Form')===-1 && o.id.indexOf('Login')===-1) detalleAbierto=true;
        });
      }catch(e){}
      if(detalleAbierto) return;
      var prods=getProductos();
      var hayPildoras=document.querySelectorAll('[data-cat-pill]').length>0;
      var hayTarjetas=document.querySelectorAll('[data-product-id], .patina-card, .patina-product').length>0;
      var productosCargados = prods.length>0 && (hayPildoras || hayTarjetas || document.body.innerText.indexOf('#00')!==-1);
      if(!productosCargados) return;
      corregirPildoras();
    }catch(e){}
  }
  // MutationObserver liviano: solo quitar iconos, no tocar modal de detalle
  try{
    var mo=new MutationObserver(function(){
      try{ document.querySelectorAll('.patina-cat-ico').forEach(function(el){ el.remove(); }); }catch(e){}
    });
    mo.observe(document.documentElement, {childList:true, subtree:true});
  }catch(e){}
  document.addEventListener('click', function(){ setTimeout(corregir,150); setTimeout(corregir,500); }, true);
  setInterval(corregir, 4000);
  setTimeout(corregir, 300);
  // Verificacion de sync: exponer funcion para que puedas ver en consola si hay diferencia
  window.__patinaVerificarSync=function(){
    var loc=leerProds();
    fetch(GAS_URL).then(function(r){ return r.json(); }).then(function(gas){
      var gasProds=Array.isArray(gas)? gas : (gas.productos||[]);
      console.log('LOCAL:', loc.length, loc.map(function(p){ return p.nombre; }));
      console.log('GOOGLE:', gasProds.length, gasProds.map(function(p){ return p.nombre; }));
      var soloLocal=loc.filter(function(p){ return !gasProds.some(function(g){ return String(g.nombre).toLowerCase()===String(p.nombre).toLowerCase(); }); });
      var soloGoogle=gasProds.filter(function(g){ return !loc.some(function(p){ return String(p.nombre).toLowerCase()===String(g.nombre).toLowerCase(); }); });
      console.log('Solo en este dispositivo (no subio):', soloLocal.map(function(p){ return p.nombre; }));
      console.log('Solo en Google (no bajo):', soloGoogle.map(function(p){ return p.nombre; }));
      alert('Local: '+loc.length+' | Google: '+gasProds.length+'\nSolo en este dispositivo: '+(soloLocal.map(function(p){ return p.nombre; }).join(', ')||'ninguno')+'\nSolo en Google: '+(soloGoogle.map(function(p){ return p.nombre; }).join(', ')||'ninguno'));
    });
    return 'Verificando...';
  };
})();
