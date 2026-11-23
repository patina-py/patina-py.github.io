// V25 = V24 + FIX: Foto sin imagen de verdad, Pildora nueva en todas las vistas con verde activo y TODOS ultimo, Stock por producto, Sync PC <-> Celu forzado
(function(){
  try{
    if(!document.getElementById('patina-v25-css')){
      var st=document.createElement('style'); st.id='patina-v25-css';
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
        /* Pildora activa verde - igual que originales */
        '.patina-cat-pill.active{background:#2f3a2a !important; color:#F5ECDC !important; border-color:#2f3a2a !important;}'+
        '.patina-search{font-size:16px !important;}';
      document.head.appendChild(st);
    }
    var vp=document.querySelector('meta[name="viewport"]');
    if(vp && vp.content.indexOf('maximum-scale')===-1) vp.content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
  }catch(e){}

  var GAS_URL="https://script.google.com/macros/s/AKfycbznKXsIvfuR_kb4UIwHk2QtjaqOlGUW9imJFjXDKfWuanUCFZOtbPLSXVlwAx8mr_I2UQ/exec";
  try{ var saved=localStorage.getItem("patina_gas_url_v1"); if(saved) GAS_URL=saved; }catch(e){}
  var KEY='patina_v25_admin';
  var CATS_KEY='patina_v25_cats';
  var fotoCambiada=false;
  var categoriaPendiente=null;

  // --- SYNC FORZADO PC <-> CELU: traer de Google y fusionar por id, no por cantidad ---
  function syncDesdeGoogle(force){
    try{
      // No traer mientras estas escribiendo en Admin para no perder lo que escribis
      if(document.activeElement && (document.activeElement.tagName==='INPUT' || document.activeElement.tagName==='TEXTAREA')) return;
      fetch(GAS_URL).then(function(r){ return r.json(); }).then(function(gas){
        if(!Array.isArray(gas) || !gas.length) return;
        // gas puede venir como {productos:[], categorias:[]} o como array directo
        var gasProds=gas;
        var gasCats=[];
        if(gas.productos){ gasProds=gas.productos; gasCats=gas.categorias||[]; }
        // Si gas trae categorias en otro formato, ignorar
        var loc=[];
        try{ loc=JSON.parse(localStorage.getItem(KEY)||"[]"); if(!Array.isArray(loc)) loc=[]; }catch(e){ loc=[]; }
        var map={}; loc.forEach(function(p){ map[String(p.id)]=p; });
        var cambio=false;
        gasProds.forEach(function(g){
          var id=String(g.id||'').padStart(4,'0');
          if(!map[id]){
            // Nuevo desde otro dispositivo - agregarlo
            g.id=id; loc.push(g); cambio=true;
          } else {
            // Si el de Google es distinto (precio, foto, stock, categoria), quedarse con el de Google si el local no fue editado hace poco
            // Comparamos sin foto para no pisar foto local que aun no subio
            var l=map[id];
            if(JSON.stringify(l)!==JSON.stringify(g)){
              // Si el local tiene foto y Google no, mantener foto local
              var fotoLocal=l.foto;
              map[id]=g;
              if(fotoLocal && !g.foto) map[id].foto=fotoLocal;
              cambio=true;
            }
          }
        });
        if(cambio){
          loc.sort(function(a,b){ return String(a.id).localeCompare(String(b.id)); });
          try{ localStorage.setItem(KEY, JSON.stringify(loc)); }catch(e){}
          // Si hay categorias nuevas en Google, agregarlas
          try{
            var locCats=JSON.parse(localStorage.getItem(CATS_KEY)||"[]"); if(!Array.isArray(locCats)) locCats=[];
            var setCats={}; locCats.forEach(function(c){ setCats[String(c).toLowerCase()]=1; });
            var cambioCat=false;
            gasCats.forEach(function(c){ var lc=String(c).toLowerCase(); if(!setCats[lc]){ locCats.push(lc); setCats[lc]=1; cambioCat=true; } });
            // Tambien sacar categorias de los productos nuevos
            loc.forEach(function(p){ var c=String(p.categoria||p.category||'').toLowerCase(); if(c && !setCats[c] && c!=='cartera' && c!=='accesorio'){ locCats.push(c); setCats[c]=1; cambioCat=true; } });
            if(cambioCat) localStorage.setItem(CATS_KEY, JSON.stringify(locCats));
          }catch(e){}
          // Recargar vista si no estas en Admin editando
          try{
            if(window.patinaRefrescarTienda) window.patinaRefrescarTienda();
            else {
              // Si estas en tienda, recargar suave solo si no estas en modal
              var modalAbierto=document.getElementById('patinaFormOverlay') && document.getElementById('patinaFormOverlay').classList.contains('open');
              if(!modalAbierto && !force){
                // No recargar automatico para no cortar lo que estas viendo, solo avisar en consola
              }
            }
          }catch(e){}
        }
      }).catch(function(){});
    }catch(e){}
  }
  // Al abrir la pagina, traer de Google enseguida y cada 10s
  setTimeout(function(){ syncDesdeGoogle(true); }, 800);
  setInterval(function(){ syncDesdeGoogle(false); }, 10000);

  try{
    if(window.patinaSetQ && !window.patinaSetQ._v25orig) window.patinaSetQ._v25orig=window.patinaSetQ;
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
    window.patinaSetQ._v25=true;
    if(window.patinaSetCat && !window.patinaSetCat._v25){
      var origCat=window.patinaSetCat;
      var wrappedCat=function(c){ origCat(c); setTimeout(function(){ try{ var q=sessionStorage.getItem('patina_admin_q')||''; if(q){ var inp=document.querySelector('.patina-search'); if(inp) inp.value=q; window.patinaSetQ(q); } }catch(e){} },30); };
      wrappedCat._v25=true; window.patinaSetCat=wrappedCat;
    }
    if(window.patinaNuevo && !window.patinaNuevo._v25){
      var origNuevo=window.patinaNuevo;
      var wNuevo=function(){ fotoCambiada=false; categoriaPendiente=null; try{ sessionStorage.setItem('patina_foto_cambiada','0'); sessionStorage.removeItem('patina_cat_pendiente'); }catch(e){} origNuevo(); setTimeout(function(){ try{ var ico=document.getElementById('patinaFotoIco'); if(ico) ico.innerHTML='📷'; var txt=document.getElementById('patinaFotoTxt'); if(txt) txt.textContent='Agregar foto'; }catch(e){} },50); };
      wNuevo._v25=true; window.patinaNuevo=wNuevo;
    }
    if(window.patinaPreviewFoto && !window.patinaPreviewFoto._v25){
      var origPrev=window.patinaPreviewFoto;
      var wPrev=function(e){ fotoCambiada=true; try{ sessionStorage.setItem('patina_foto_cambiada','1'); }catch(e){} return origPrev(e); };
      wPrev._v25=true; window.patinaPreviewFoto=wPrev;
    }
    if(window.patinaEditar && !window.patinaEditar._v25){
      var origEd=window.patinaEditar;
      var wEd=function(i){ fotoCambiada=false; try{ sessionStorage.setItem('patina_foto_cambiada','0'); }catch(e){} return origEd(i); };
      wEd._v25=true; window.patinaEditar=wEd;
    }
    // Guardar: si es nuevo y no cambio foto, marcar para limpiar foto despues
    if(window.patinaGuardar && !window.patinaGuardar._v25){
      var origGuardar=window.patinaGuardar;
      var wGuardar=function(){
        try{
          var h3=document.querySelector('#patinaFormModal h3');
          var esNuevo=h3 && h3.textContent.indexOf('Agregar')!==-1;
          var cambiada=false; try{ cambiada=sessionStorage.getItem('patina_foto_cambiada')==='1'; }catch(e){ cambiada=fotoCambiada; }
          if(esNuevo && !cambiada){
            // Marcar que el ultimo producto debe quedar SIN foto
            try{ sessionStorage.setItem('patina_limpiar_foto_ultimo','1'); }catch(e){}
          } else {
            try{ sessionStorage.removeItem('patina_limpiar_foto_ultimo'); }catch(e){}
          }
        }catch(e){}
        var r=origGuardar();
        // Antes de que recargue (900ms), limpiar foto del ultimo si corresponde y forzar sync
        setTimeout(function(){
          try{
            if(sessionStorage.getItem('patina_limpiar_foto_ultimo')==='1'){
              var loc=JSON.parse(localStorage.getItem(KEY)||"[]");
              if(Array.isArray(loc) && loc.length){
                // El ultimo por id es el recien creado
                loc.sort(function(a,b){ return String(a.id).localeCompare(String(b.id)); });
                var ultimo=loc[loc.length-1];
                if(ultimo) ultimo.foto='';
                localStorage.setItem(KEY, JSON.stringify(loc));
                // Subir sin foto a Google para que en PC no aparezca foto vieja
                try{ if(window.patinaSyncNow) window.patinaSyncNow(); }catch(e){}
                // Tambien subir directo
                try{
                  fetch(GAS_URL,{method:'POST', body: JSON.stringify({action:'save_all', productos: loc.map(function(d){ var c={}; for(var k in d){ c[k]=d[k]; } if(typeof c.foto==='string' && c.foto.length>48000) c.foto=''; return c; }), categorias: JSON.parse(localStorage.getItem(CATS_KEY)||"[]"), password:'PATINA2026'})}).catch(function(){});
                }catch(e){}
              }
              sessionStorage.removeItem('patina_limpiar_foto_ultimo');
            }
          }catch(e){}
        }, 300);
        return r;
      };
      wGuardar._v25=true; window.patinaGuardar=wGuardar;
    }
    // Al cargar, si quedo pendiente limpiar foto (porque recargo antes), limpiarlo
    try{
      if(sessionStorage.getItem('patina_limpiar_foto_ultimo')==='1'){
        var loc2=JSON.parse(localStorage.getItem(KEY)||"[]");
        if(Array.isArray(loc2) && loc2.length){
          loc2.sort(function(a,b){ return String(a.id).localeCompare(String(b.id)); });
          loc2[loc2.length-1].foto='';
          localStorage.setItem(KEY, JSON.stringify(loc2));
        }
        sessionStorage.removeItem('patina_limpiar_foto_ultimo');
      }
    }catch(e){}
    if(window.patinaAgregarCatDesdeForm && !window.patinaAgregarCatDesdeForm._v25){
      var origAdd=window.patinaAgregarCatDesdeForm;
      var wAdd=function(){
        var inp=document.getElementById('patinaNuevaCatInput'); var n=inp?inp.value.trim():'';
        if(n){ categoriaPendiente=n.toLowerCase(); try{ sessionStorage.setItem('patina_cat_pendiente', categoriaPendiente); }catch(e){} }
        var r=origAdd();
        setTimeout(function(){ try{ var m=document.getElementById('patinaFormModal'); if(m) m.scrollTop=0; var box=document.getElementById('patinaNuevaCatBox'); if(box) box.style.display='none'; }catch(e){} },80);
        return r;
      };
      wAdd._v25=true; window.patinaAgregarCatDesdeForm=wAdd;
    }
    if(window.patinaCerrarForm && !window.patinaCerrarForm._v25){
      var origCerrar=window.patinaCerrarForm;
      var wCerrar=function(){ try{ sessionStorage.removeItem('patina_cat_pendiente'); }catch(e){} categoriaPendiente=null; return origCerrar(); };
      wCerrar._v25=true; window.patinaCerrarForm=wCerrar;
    }
    if(window.patinaMostrarNuevaCat && !window.patinaMostrarNuevaCat._v25){
      var origMostrar=window.patinaMostrarNuevaCat;
      var wMostrar=function(){ var r=origMostrar(); setTimeout(function(){ try{ var m=document.getElementById('patinaFormModal'); if(m) m.style.overflowY='auto'; var inp=document.getElementById('patinaNuevaCatInput'); if(inp && document.getElementById('patinaNuevaCatBox') && document.getElementById('patinaNuevaCatBox').style.display==='block') inp.focus(); }catch(e){} },60); return r; };
      wMostrar._v25=true; window.patinaMostrarNuevaCat=wMostrar;
    }
    // Guardar nueva categoria desde Admin: tambien forzar sync
    if(window.patinaGuardarNuevaCat && !window.patinaGuardarNuevaCat._v25){
      var origGuardarCat=window.patinaGuardarNuevaCat;
      var wGuardarCat=function(){
        var r=origGuardarCat();
        setTimeout(function(){ try{ if(window.patinaSyncNow) window.patinaSyncNow(); syncDesdeGoogle(true); }catch(e){} }, 400);
        return r;
      };
      wGuardarCat._v25=true; window.patinaGuardarNuevaCat=wGuardarCat;
    }
  }catch(e){}

  document.addEventListener('click', function(e){
    try{
      var btn=e.target.closest? e.target.closest('button') : null;
      if(!btn) return;
      var t=(btn.textContent||'').trim();
      // Pildoras: verde activo en todas las vistas
      if(btn.classList && btn.classList.contains('patina-cat-pill')){
        var wrap=btn.closest('.patina-cat-pills');
        if(wrap){
          wrap.querySelectorAll('.patina-cat-pill').forEach(function(b){ b.classList.remove('active'); });
          btn.classList.add('active');
          // Tambien marcar la misma categoria en los otros wraps
          var norm=btn.getAttribute('data-cat-pill');
          document.querySelectorAll('.patina-cat-pills').forEach(function(w2){
            w2.querySelectorAll('.patina-cat-pill').forEach(function(b2){
              if(b2.getAttribute('data-cat-pill')===norm) b2.classList.add('active'); else b2.classList.remove('active');
            });
          });
        }
      }
      if(t.indexOf('Guardar')!==-1 || t.indexOf('Agregar')!==-1){
        try{ sessionStorage.removeItem('patina_cat_pendiente'); }catch(e){} categoriaPendiente=null;
        // Forzar sync despues de guardar
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
  function getProductos(){
    var out=[];
    try{ for(var i=0;i<localStorage.length;i++){ var k=localStorage.key(i); if(k && k.indexOf('patina')!==-1){ try{ var v=JSON.parse(localStorage.getItem(k)); if(Array.isArray(v) && v.length && (v[0].id!=null || v[0].nombre || v[0].name)) out=v; }catch(e){} } } }catch(e){}
    try{ if(window.patinaProductos && Array.isArray(window.patinaProductos) && window.patinaProductos.length) out=window.patinaProductos; if(window.__patinaProductos && Array.isArray(window.__patinaProductos) && window.__patinaProductos.length) out=window.__patinaProductos; }catch(e){}
    return out;
  }
  function tieneOferta(p){ var precio=parseFloat(p.precio||p.price||0)||0; var oferta=parseFloat(p.precio_oferta||p.oferta||p.precioOferta||p.sale_price||0)||0; if(oferta>0 && precio>0 && oferta<precio) return true; if(p.descuento && parseFloat(p.descuento)>0) return true; if(p.etiqueta && String(p.etiqueta).toUpperCase().indexOf('OFF')!==-1) return true; return false; }
  function normCat(c){ var s=String(c||'').toLowerCase().trim(); if(s==='cartera'||s==='carteras') return 'carteras'; if(s==='accesorio'||s==='accesorios') return 'accesorios'; if(s==='todo'||s==='todos') return 'todos'; if(s==='oferta'||s==='ofertas') return 'ofertas'; return s; }
  function mostrarCat(cat){ var n=normCat(cat); if(n==='carteras') return 'CARTERAS'; if(n==='accesorios') return 'ACCESORIOS'; if(n==='ofertas') return 'OFERTAS'; if(n==='todos') return 'TODOS'; return String(cat||'').toUpperCase(); }
  function filtrarPorCategoria(cat){
    try{
      var ps=getProductos();
      var map={}; (ps||[]).forEach(function(p){ map[String(p.id)]=(p.category||p.categoria||'').toString().toLowerCase(); });
      var view=document.getElementById('view-todos'); if(!view) return;
      view.querySelectorAll('.products-grid > *').forEach(function(card){
        var txt=card.textContent||''; var m=txt.match(/#(\d{4})/); var id=m?m[1].replace(/^0+/,''):null; var catOf=null;
        if(m){ var raw=m[1]; if(map[raw]) catOf=map[raw]; else { var found=Object.keys(map).find(function(k){ return k.replace(/^0+/,'')===id; }); if(found) catOf=map[found]; } }
        if(normCat(cat)==='ofertas'){ var prod=null; if(m){ prod=ps.find(function(p){ return String(p.id).replace(/^0+/,'')===id; }); } var esOferta=prod? tieneOferta(prod): false; card.style.display=esOferta?'':'none'; }
        else { if(catOf && normCat(catOf)!==normCat(cat)) card.style.display='none'; else card.style.display=''; }
      });
    }catch(e){}
  }
  function crearPildora(cat){
    var b=document.createElement('button');
    b.type='button'; b.className='patina-cat-pill'; b.setAttribute('data-cat-pill', normCat(cat));
    b.textContent=mostrarCat(cat);
    b.addEventListener('click', function(){
      try{ window.__patinaCatFilter=normCat(cat); }catch(e){}
      try{ if(window.patinaIrA) window.patinaIrA('todos'); }catch(e){}
      setTimeout(function(){ filtrarPorCategoria(cat); },250);
      setTimeout(function(){ filtrarPorCategoria(cat); },600);
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
      // Foto: si es nuevo y no cambio foto, forzar 📷 y no mostrar foto vieja
      try{
        var h3=modal.querySelector('h3'); var esNuevo=h3 && h3.textContent.indexOf('Agregar')!==-1;
        var cambiada=false; try{ cambiada=sessionStorage.getItem('patina_foto_cambiada')==='1'; }catch(e){ cambiada=fotoCambiada; }
        if(esNuevo && !cambiada){ var ico=document.getElementById('patinaFotoIco'); if(ico && ico.querySelector('img')){ ico.innerHTML='📷'; var txt2=document.getElementById('patinaFotoTxt'); if(txt2) txt2.textContent='Agregar foto'; } }
      }catch(e){}
    }catch(e){}
  }
  // --- STOCK: leer stock real por producto y bloquear + ---
  function arreglarStock(){
    try{
      // Buscar ficha de producto abierta: tiene "Máx." o "CANTIDAD"
      var ficha=null;
      document.querySelectorAll('div').forEach(function(d){
        if(d.textContent && d.textContent.indexOf('Máx')!==-1 && d.textContent.indexOf('unidades')!==-1 && !ficha) ficha=d;
      });
      if(!ficha){
        // Buscar por CANTIDAD
        document.querySelectorAll('div').forEach(function(d){
          if(d.textContent && d.textContent.toUpperCase().indexOf('CANTIDAD')!==-1 && !ficha) ficha=d;
        });
      }
      if(!ficha) return;
      // Sacar id del producto de la ficha (#0002)
      var txtFicha=document.body.innerText||'';
      var idMatch=null;
      // Buscar en el modal de producto abierto (no Admin)
      var modals=document.querySelectorAll('[class*="modal"], [id*="modal"]');
      var idEnModal=null;
      modals.forEach(function(m){
        var t=m.textContent||''; var mm=t.match(/#(00\d+)/); if(mm && m.offsetParent!==null) idEnModal=mm[1];
      });
      // Tambien buscar en URL o en el titulo del producto visible
      var prods=getProductos();
      var prod=null;
      if(idEnModal){
        prod=prods.find(function(p){ return String(p.id)===idEnModal || String(p.id).replace(/^0+/,'')===idEnModal.replace(/^0+/,''); });
      }
      if(!prod){
        // Buscar por nombre visible en ficha
        var nombreFicha='';
        document.querySelectorAll('h1,h2,h3').forEach(function(h){ if(h.offsetParent!==null && h.textContent && h.textContent.length>2 && h.textContent.length<60) nombreFicha=h.textContent.trim(); });
        if(nombreFicha) prod=prods.find(function(p){ return (p.nombre||p.name||'')===nombreFicha; });
      }
      if(!prod) return;
      var stockRaw=prod.stock;
      var stock=null;
      if(stockRaw===undefined || stockRaw===null || String(stockRaw).trim()==='' || String(stockRaw).toLowerCase().indexOf('sin')!==-1) stock=99;
      else { stock=parseInt(stockRaw,10); if(isNaN(stock)) stock=99; }
      // Actualizar texto Máx.
      if(ficha.innerHTML.indexOf('Máx.')!==-1){
        var nuevoTxt='Máx. '+stock+' unidades';
        if(stock>=99) nuevoTxt='Sin límite';
        ficha.innerHTML=ficha.innerHTML.replace(/Máx\.\s*\d+\s*unidades/i, nuevoTxt);
        if(stock>=99) ficha.innerHTML=ficha.innerHTML.replace(/Máx\.\s*Sin límite/i, 'Sin límite');
      }
      // Bloquear + si llega a stock
      // Buscar botones + y - cerca de ficha y el numero de cantidad
      var container=ficha.parentElement || document.body;
      var btns=container.querySelectorAll('button');
      btns.forEach(function(b){
        var bt=(b.textContent||'').trim();
        if(bt==='+' || bt==='+'){
          b.addEventListener('click', function(ev){
            try{
              // Leer cantidad actual en el hermano
              var qtyEl=b.parentElement.querySelector('span, div');
              var qty=1;
              if(qtyEl){ var n=parseInt(qtyEl.textContent,10); if(!isNaN(n)) qty=n; }
              if(qty>=stock){
                ev.preventDefault(); ev.stopPropagation();
                b.style.opacity='0.4';
                return false;
              }
            }catch(e){}
          }, true);
        }
      });
      // Si la cantidad ya esta en stock, deshabilitar + visualmente
      // Guardar stock actual para que el click handler de la tienda lo use
      try{ window.__patinaStockActual=stock; window.__patinaProdActual=prod.id; }catch(e){}
    }catch(e){}
  }
  // Interceptar clicks en + de cantidad en toda la pagina para respetar stock
  document.addEventListener('click', function(e){
    try{
      var btn=e.target.closest? e.target.closest('button') : null;
      if(!btn) return;
      if((btn.textContent||'').trim()!=='+') return;
      // Solo si estamos en ficha de producto (hay Máx. o CANTIDAD)
      if(document.body.innerText.indexOf('Máx.')===-1 && document.body.innerText.toUpperCase().indexOf('CANTIDAD')===-1) return;
      var stock=window.__patinaStockActual;
      if(!stock || stock>=99) return;
      // Buscar cantidad actual en el mismo contenedor
      var cont=btn.parentElement;
      if(!cont) return;
      var qtyEl=cont.querySelector('span');
      var qty=qtyEl? parseInt(qtyEl.textContent,10): 1;
      if(!isNaN(qty) && qty>=stock){
        e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
        // Mostrar aviso
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
  function limpiarPildorasDuplicadas(){
    try{
      document.querySelectorAll('[data-cat-pill]').forEach(function(b){
        var ico=b.querySelector('.patina-cat-ico'); if(ico) ico.remove();
        var txt=(b.textContent||'').trim();
        txt=txt.replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}✨👜🧉🏷️]+\s*/u, '').trim();
        var norm=normCat(b.getAttribute('data-cat-pill')||txt);
        b.setAttribute('data-cat-pill', norm);
        if(b.textContent!==mostrarCat(norm)) b.textContent=mostrarCat(norm);
      });
    }catch(e){}
  }
  function corregir(){
    try{
      arreglarModal();
      formatearWhatsAppIndividual();
      limpiarPildorasDuplicadas();
      arreglarStock();
      if(estaEscribiendo()){
        var ae=document.activeElement;
        if(ae && ae.classList && ae.classList.contains('patina-search')) return;
      }
      var prods=getProductos();
      var hayPildoras=document.querySelectorAll('[data-cat-pill]').length>0;
      var hayTarjetas=document.querySelectorAll('[data-product-id], .patina-card, .patina-product').length>0;
      var productosCargados = prods.length>0 && (hayPildoras || hayTarjetas || document.body.innerText.indexOf('#00')!==-1);
      if(!productosCargados) return;
      var protegidas=['todos','home',''];
      var conteo={};
      prods.forEach(function(p){ var c=String(p.category||p.categoria||'').trim().toLowerCase(); if(!c) return; var n=normCat(c); conteo[n]=(conteo[n]||0)+1; });
      limpiarCatsCero(conteo);
      var hayOferta=prods.some(function(p){ return tieneOferta(p); });
      var catsExtras=Object.keys(conteo).filter(function(c){ return conteo[c]>0 && c!=='ofertas' && c!=='todos' && c!=='carteras' && c!=='accesorios'; });
      // En TODOS: mostrar todas las categorias con productos + TODOS al final
      document.querySelectorAll('.patina-cat-pills').forEach(function(wrap){
        if(wrap.closest('#patinaFormModal')) return;
        var esTodos = wrap.closest('#view-todos') || wrap.id.indexOf('todos')!==-1;
        // Dedup en todos los wraps
        var vistos={};
        wrap.querySelectorAll('[data-cat-pill]').forEach(function(b){
          var n=normCat(b.getAttribute('data-cat-pill')||b.textContent);
          if(vistos[n]){ b.remove(); return; } vistos[n]=1;
        });
        if(esTodos){
          wrap.querySelectorAll('[data-cat-pill]').forEach(function(b){
            var cat=normCat(b.getAttribute('data-cat-pill')||'');
            if(cat==='todos') return;
            if(cat==='ofertas' && !hayOferta){ b.remove(); return; }
            if(cat==='carteras' || cat==='accesorios') return;
            if(!conteo[cat] || conteo[cat]===0) b.remove();
          });
          var todosBtn=wrap.querySelector('[data-cat-pill="todos"]');
          catsExtras.forEach(function(cat){
            if(!conteo[cat] || conteo[cat]===0) return;
            if(wrap.querySelector('[data-cat-pill="'+cat+'"]')) return;
            var b=crearPildora(cat);
            if(todosBtn) wrap.insertBefore(b, todosBtn); else wrap.appendChild(b);
          });
          if(hayOferta && !wrap.querySelector('[data-cat-pill="ofertas"]')){
            var bo=document.createElement('button'); bo.type='button'; bo.className='patina-cat-pill'; bo.setAttribute('data-cat-pill','ofertas'); bo.textContent='OFERTAS';
            bo.addEventListener('click', function(){ try{ window.__patinaCatFilter='ofertas'; }catch(e){} try{ if(window.patinaIrA) window.patinaIrA('todos'); }catch(e){} setTimeout(function(){ filtrarPorCategoria('ofertas'); },250); });
            if(todosBtn) wrap.insertBefore(bo, todosBtn); else wrap.appendChild(bo);
          }
          // TODOS SIEMPRE AL FINAL en TODOS
          var tb=wrap.querySelector('[data-cat-pill="todos"]');
          if(tb && tb!==wrap.lastElementChild) wrap.appendChild(tb);
          wrap.querySelectorAll('[data-cat-pill]').forEach(function(b){ var n=normCat(b.getAttribute('data-cat-pill')||''); if(b.textContent!==mostrarCat(n)) b.textContent=mostrarCat(n); });
        } else {
          // OTRAS VISTAS (CARTERAS, ACCESORIOS, HOME): tambien mostrar categorias extras, no solo homeDeseado
          // Para que la pildora nueva no se oculte al cambiar de vista
          var catsParaEsteWrap=[];
          // Si es vista de Carteras o Accesorios, mostrar: CARTERAS, ACCESORIOS, OFERTAS + extras
          catsParaEsteWrap=['carteras','accesorios'];
          if(hayOferta) catsParaEsteWrap.push('ofertas');
          catsExtras.forEach(function(c){ if(catsParaEsteWrap.indexOf(c)===-1) catsParaEsteWrap.push(c); });
          // Borrar las que ya no tienen productos (excepto carteras/accesorios que son vistas)
          wrap.querySelectorAll('[data-cat-pill]').forEach(function(b){
            var cat=normCat(b.getAttribute('data-cat-pill')||'');
            if(cat==='todos') return;
            if(cat==='carteras'||cat==='accesorios'||cat==='ofertas') return;
            if(!conteo[cat] || conteo[cat]===0) b.remove();
          });
          catsParaEsteWrap.forEach(function(cat){
            if(cat==='todos') return;
            if(wrap.querySelector('[data-cat-pill="'+cat+'"]')) return;
            var b;
            if(cat==='ofertas'){
              b=document.createElement('button'); b.type='button'; b.className='patina-cat-pill'; b.setAttribute('data-cat-pill','ofertas'); b.textContent='OFERTAS';
              b.addEventListener('click', function(){ try{ window.__patinaCatFilter='ofertas'; }catch(e){} try{ if(window.patinaIrA) window.patinaIrA('todos'); }catch(e){} setTimeout(function(){ filtrarPorCategoria('ofertas'); },250); });
            } else { b=crearPildora(cat); }
            // En vistas que no son TODOS, no hay TODOS al final, agregar al final
            wrap.appendChild(b);
          });
        }
      });
      document.querySelectorAll('#patinaFormModal select').forEach(function(sel){
        var valorActual=(sel.value||'').toLowerCase();
        sel.querySelectorAll('option').forEach(function(opt){
          var v=(opt.value||opt.textContent||'').trim().toLowerCase();
          if(v==='__nueva__') return;
          if(protegidas.indexOf(v)!==-1) return;
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
  try{
    var mo=new MutationObserver(function(){
      try{
        document.querySelectorAll('.patina-cat-pills').forEach(function(wrap){
          if(wrap.closest('#view-todos')){
            var tb=wrap.querySelector('[data-cat-pill="todos"]');
            if(tb && tb!==wrap.lastElementChild) wrap.appendChild(tb);
          }
        });
        document.querySelectorAll('.patina-cat-ico').forEach(function(el){ el.remove(); });
      }catch(e){}
      arreglarModal();
      arreglarStock();
    });
    mo.observe(document.documentElement, {childList:true, subtree:true});
  }catch(e){}
  document.addEventListener('click', function(){ setTimeout(corregir,150); setTimeout(corregir,500); setTimeout(corregir,900); }, true);
  setInterval(corregir, 2000);
  setTimeout(corregir, 300);
  // Limpiar fotos de productos sin foto que muestran foto vieja en Admin: si un producto tiene foto vacia pero la tarjeta muestra img, reemplazar por letra
  setInterval(function(){
    try{
      var prods=getProductos();
      var map={}; prods.forEach(function(p){ map[String(p.id)]=p; });
      document.querySelectorAll('#patinaAdminPage .patina-card').forEach(function(card){
        var txt=card.textContent||''; var m=txt.match(/#(00\d+)/); if(!m) return;
        var prod=map[m[1]]; if(!prod) return;
        if(!prod.foto){
          var letterEl=card.querySelector('.patina-letter');
          if(letterEl && letterEl.querySelector('img')){
            var letra=(prod.nombre||'?').charAt(0).toUpperCase();
            letterEl.innerHTML=letra;
          }
        }
      });
    }catch(e){}
  }, 1500);
})();
