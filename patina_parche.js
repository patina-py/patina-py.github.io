// V24 = V23 + FIX: No duplicar Carteras/Accesorios, sin iconitos solo MAYUSCULA, Modal no se corta al agregar categoria, Nueva categoria si se guarda
(function(){
  try{
    if(!document.getElementById('patina-v24-css')){
      var st=document.createElement('style'); st.id='patina-v24-css';
      st.textContent=
        'input,textarea,select{font-size:16px !important;}'+
        '#patinaFormModal input,#patinaFormModal textarea,#patinaFormModal select{font-size:16px !important;}'+
        /* MODAL: no se corta - overflow auto real, overlay permite scroll */
        '#patinaFormOverlay{overflow-y:auto !important; align-items:flex-start !important; padding:16px 12px !important;}'+
        '#patinaFormModal,.patina-form-modal{max-height:88dvh !important; overflow-y:auto !important; -webkit-overflow-scrolling:touch !important; padding-bottom:18px !important; box-sizing:border-box !important;}'+
        '#patinaFormModal .patina-foto{border:none !important; background:rgba(255,255,255,0.08) !important; border-radius:14px !important; padding:8px 10px !important; margin:0 0 10px 0 !important; height:auto !important; min-height:56px !important; max-height:none !important; overflow:hidden !important; display:flex !important; align-items:center !important; gap:10px !important; box-sizing:border-box !important;}'+
        '#patinaFormModal .patina-foto-ico{width:56px !important; height:56px !important; min-width:56px !important; min-height:56px !important; max-width:56px !important; max-height:56px !important; border-radius:10px !important; overflow:hidden !important; flex-shrink:0 !important; display:grid !important; place-items:center !important; font-size:22px !important;}'+
        '#patinaFormModal .patina-foto-ico img{width:100% !important; height:100% !important; object-fit:cover !important; display:block !important;}'+
        '#patinaFormModal #patinaFotoTxt{font-size:11px !important; letter-spacing:.14em !important; white-space:nowrap !important;}'+
        '#patinaFormModal #patinaCalc{width:100% !important; display:block !important; margin:6px 0 2px 0 !important; text-align:left !important; font-size:11px !important; line-height:1.4 !important;}'+
        '#patinaFormModal .patina-form-btns{position:relative !important; bottom:auto !important; background:transparent !important; padding:12px 0 4px 0 !important; margin-top:12px !important; z-index:10 !important;}'+
        '#patinaFormModal #patinaNuevaCatBox{position:relative !important; z-index:1 !important; margin-top:8px !important; display:block !important;}'+
        /* PILDORAS: sin iconitos, solo mayuscula, igual que originales */
        '.patina-cat-pill .patina-cat-ico{display:none !important;}'+
        '.patina-search{font-size:16px !important;}';
      document.head.appendChild(st);
    }
    var vp=document.querySelector('meta[name="viewport"]');
    if(vp && vp.content.indexOf('maximum-scale')===-1) vp.content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
  }catch(e){}

  var fotoCambiada=false;
  var ultimoStock=null;
  var categoriaPendiente=null; // categoria creada en este modal, todavia sin producto

  try{
    if(window.patinaSetQ && !window.patinaSetQ._v24orig) window.patinaSetQ._v24orig=window.patinaSetQ;
    window.patinaSetQ=function(v){
      var q=String(v||'').toLowerCase().trim();
      var visibles=0, total=0;
      document.querySelectorAll('#patinaAdminPage .patina-card').forEach(function(card){
        total++; var txt=(card.textContent||'').toLowerCase();
        var show=!q || txt.indexOf(q)!==-1; card.style.display=show?'':'none'; if(show) visibles++;
      });
      var headSpan=document.querySelector('#patinaAdminPage .patina-art-head span');
      if(headSpan) headSpan.textContent=visibles+' visibles';
      try{ sessionStorage.setItem('patina_admin_q', v||''); }catch(e){}
    };
    window.patinaSetQ._v24=true;
    if(window.patinaSetCat && !window.patinaSetCat._v24){
      var origCat=window.patinaSetCat;
      var wrappedCat=function(c){ origCat(c); setTimeout(function(){ try{ var q=sessionStorage.getItem('patina_admin_q')||''; if(q){ var inp=document.querySelector('.patina-search'); if(inp) inp.value=q; window.patinaSetQ(q); } }catch(e){} },30); };
      wrappedCat._v24=true; window.patinaSetCat=wrappedCat;
    }
    if(window.patinaNuevo && !window.patinaNuevo._v24){
      var origNuevo=window.patinaNuevo;
      var wNuevo=function(){ fotoCambiada=false; categoriaPendiente=null; try{ sessionStorage.setItem('patina_foto_cambiada','0'); sessionStorage.removeItem('patina_cat_pendiente'); }catch(e){} origNuevo(); setTimeout(function(){ try{ var ico=document.getElementById('patinaFotoIco'); if(ico) ico.innerHTML='📷'; var txt=document.getElementById('patinaFotoTxt'); if(txt) txt.textContent='Agregar foto'; }catch(e){} },50); };
      wNuevo._v24=true; window.patinaNuevo=wNuevo;
    }
    if(window.patinaPreviewFoto && !window.patinaPreviewFoto._v24){
      var origPrev=window.patinaPreviewFoto;
      var wPrev=function(e){ fotoCambiada=true; try{ sessionStorage.setItem('patina_foto_cambiada','1'); }catch(e){} return origPrev(e); };
      wPrev._v24=true; window.patinaPreviewFoto=wPrev;
    }
    if(window.patinaEditar && !window.patinaEditar._v24){
      var origEd=window.patinaEditar;
      var wEd=function(i){ fotoCambiada=false; categoriaPendiente=null; try{ sessionStorage.setItem('patina_foto_cambiada','0'); }catch(e){} return origEd(i); };
      wEd._v24=true; window.patinaEditar=wEd;
    }
    // Guardar categoria pendiente cuando se agrega desde el form
    if(window.patinaAgregarCatDesdeForm && !window.patinaAgregarCatDesdeForm._v24){
      var origAdd=window.patinaAgregarCatDesdeForm;
      var wAdd=function(){
        var inp=document.getElementById('patinaNuevaCatInput');
        var n=inp?inp.value.trim():'';
        if(n){
          categoriaPendiente=n.toLowerCase();
          try{ sessionStorage.setItem('patina_cat_pendiente', categoriaPendiente); }catch(e){}
        }
        var r=origAdd();
        // Despues de agregar, asegurar que el modal haga scroll para ver Descripcion/Visible y no quede cortado
        setTimeout(function(){
          try{
            var m=document.getElementById('patinaFormModal');
            if(m) m.scrollTop=0;
            var box=document.getElementById('patinaNuevaCatBox'); if(box) box.style.display='none';
          }catch(e){}
        }, 80);
        return r;
      };
      wAdd._v24=true; window.patinaAgregarCatDesdeForm=wAdd;
    }
    // Cerrar form: si la categoria pendiente quedo con 0 productos, borrarla (Otro cancelado)
    if(window.patinaCerrarForm && !window.patinaCerrarForm._v24){
      var origCerrar=window.patinaCerrarForm;
      var wCerrar=function(){
        // Si se cerro sin guardar, la pendiente se borra en el proximo corregir (limpiarCatsCero la va a borrar porque modal ya no esta abierto)
        // Guardamos que se cerro para que corregir la limpie
        try{ sessionStorage.removeItem('patina_cat_pendiente'); }catch(e){}
        categoriaPendiente=null;
        return origCerrar();
      };
      wCerrar._v24=true; window.patinaCerrarForm=wCerrar;
    }
    if(window.patinaMostrarNuevaCat && !window.patinaMostrarNuevaCat._v24){
      var origMostrar=window.patinaMostrarNuevaCat;
      var wMostrar=function(){
        var r=origMostrar();
        // Al abrir, hacer scroll suave para que no se corte
        setTimeout(function(){
          try{
            var m=document.getElementById('patinaFormModal');
            if(m){
              // No forzar scroll al fondo, solo asegurar que el modal puede scrollear
              m.style.overflowY='auto';
            }
            var inp=document.getElementById('patinaNuevaCatInput');
            if(inp && document.getElementById('patinaNuevaCatBox') && document.getElementById('patinaNuevaCatBox').style.display==='block') inp.focus();
          }catch(e){}
        }, 60);
        return r;
      };
      wMostrar._v24=true; window.patinaMostrarNuevaCat=wMostrar;
    }
  }catch(e){}

  document.addEventListener('click', function(e){
    try{
      var btn=e.target.closest? e.target.closest('button') : null;
      if(!btn) return;
      var t=(btn.textContent||'').trim();
      if(t.indexOf('Guardar')!==-1 || t.indexOf('Agregar')!==-1){
        var m=document.getElementById('patinaFormModal'); if(m){
          var inp=document.getElementById('patinaF_stock');
          if(inp && inp.value){ ultimoStock=parseInt(inp.value,10); try{ sessionStorage.setItem('patina_ultimo_stock', String(ultimoStock)); }catch(e){} }
          // Si guardo producto, la pendiente ya tiene producto, no borrarla
          try{ sessionStorage.removeItem('patina_cat_pendiente'); }catch(e){}
          categoriaPendiente=null;
        }
      }
    }catch(e){}
  }, true);
  document.addEventListener('change', function(e){
    try{
      var sel=e.target; if(!sel || sel.tagName!=='SELECT') return;
      if(sel.value==='__nueva__'){
        var nombre=prompt('Escribí el nombre de la nueva categoría (ej: Termos)');
        if(nombre && nombre.trim()){
          var cat=nombre.trim().toLowerCase();
          categoriaPendiente=cat;
          try{ sessionStorage.setItem('patina_cat_pendiente', cat); }catch(e){}
          var opt=document.createElement('option'); opt.value=cat; opt.textContent=nombre.trim();
          sel.insertBefore(opt, sel.querySelector('option[value="__nueva__"]'));
          sel.value=cat;
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
  function getUltimoStock(){ if(ultimoStock) return ultimoStock; try{ var v=sessionStorage.getItem('patina_ultimo_stock'); if(v) return parseInt(v,10); }catch(e){} return null; }
  function getProductos(){
    var out=[];
    try{ for(var i=0;i<localStorage.length;i++){ var k=localStorage.key(i); if(k && k.indexOf('patina')!==-1){ try{ var v=JSON.parse(localStorage.getItem(k)); if(Array.isArray(v) && v.length && (v[0].id!=null || v[0].nombre || v[0].name)) out=v; }catch(e){} } } }catch(e){}
    try{ if(window.patinaProductos && Array.isArray(window.patinaProductos) && window.patinaProductos.length) out=window.patinaProductos; if(window.__patinaProductos && Array.isArray(window.__patinaProductos) && window.__patinaProductos.length) out=window.__patinaProductos; }catch(e){}
    return out;
  }
  function tieneOferta(p){ var precio=parseFloat(p.precio||p.price||0)||0; var oferta=parseFloat(p.precio_oferta||p.oferta||p.precioOferta||p.sale_price||0)||0; if(oferta>0 && precio>0 && oferta<precio) return true; if(p.descuento && parseFloat(p.descuento)>0) return true; if(p.etiqueta && String(p.etiqueta).toUpperCase().indexOf('OFF')!==-1) return true; return false; }
  // Normalizar: cartera/carteras = mismo, accesorio/accesorios = mismo
  function normCat(c){
    var s=String(c||'').toLowerCase().trim();
    if(s==='cartera'||s==='carteras') return 'carteras';
    if(s==='accesorio'||s==='accesorios') return 'accesorios';
    if(s==='todo'||s==='todos') return 'todos';
    if(s==='oferta'||s==='ofertas') return 'ofertas';
    return s;
  }
  function mostrarCat(cat){
    var n=normCat(cat);
    if(n==='carteras') return 'CARTERAS';
    if(n==='accesorios') return 'ACCESORIOS';
    if(n==='ofertas') return 'OFERTAS';
    if(n==='todos') return 'TODOS';
    return String(cat||'').toUpperCase();
  }
  function filtrarPorCategoria(cat){
    try{
      var ps=getProductos();
      var map={}; (ps||[]).forEach(function(p){ map[String(p.id)]=(p.category||p.categoria||'').toString().toLowerCase(); });
      var view=document.getElementById('view-todos'); if(!view) return;
      view.querySelectorAll('.products-grid > *').forEach(function(card){
        var txt=card.textContent||'';
        var m=txt.match(/#(\d{4})/); var id=m?m[1].replace(/^0+/,''):null;
        var catOf=null;
        if(m){ var raw=m[1]; if(map[raw]) catOf=map[raw]; else { var found=Object.keys(map).find(function(k){ return k.replace(/^0+/,'')===id; }); if(found) catOf=map[found]; } }
        if(normCat(cat)==='ofertas'){
          var prod=null; if(m){ prod=ps.find(function(p){ return String(p.id).replace(/^0+/,'')===id; }); }
          var esOferta=prod? tieneOferta(prod): false;
          card.style.display=esOferta?'':'none';
        } else {
          // Comparar normalizado: cartera = carteras
          if(catOf && normCat(catOf)!==normCat(cat)) card.style.display='none'; else card.style.display='';
        }
      });
    }catch(e){}
  }
  function crearPildora(cat){
    var b=document.createElement('button');
    b.type='button'; b.className='patina-cat-pill'; b.setAttribute('data-cat-pill', normCat(cat));
    // SIN iconitos, solo texto en mayuscula como pediste
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
      if(estaEscribiendo()){
        var ae=document.activeElement;
        if(ae && (ae.id==='patinaF_descripcion'||ae.id==='patinaF_etiqueta'||ae.id==='patinaF_precio'||ae.id==='patinaF_desc'||ae.id==='patinaNuevaCatInput')) return;
      }
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
  function limpiarCatsCero(conteo){
    try{
      // No borrar la pendiente mientras el modal esta abierto (se esta creando)
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
            // Si es pendiente y el modal esta abierto, no borrar todavia
            if(modalAbierto && pendiente && normCat(lc)===normCat(pendiente)) return true;
            // Si es la categoria seleccionada ahora en el modal, no borrar
            try{ var sel=document.getElementById('patinaF_cat'); if(sel && sel.value && normCat(sel.value)===normCat(lc)) return true; }catch(e){}
            return (conteo[normCat(lc)]||conteo[lc]||0)>0;
          });
          if(filtrado.length!==arr.length) localStorage.setItem(k, JSON.stringify(filtrado));
        }catch(e){}
      });
    }catch(e){}
  }
  function limpiarPildorasDuplicadas(){
    // Quitar iconitos de todas las pildoras y normalizar texto a MAYUSCULA sin duplicar
    try{
      document.querySelectorAll('[data-cat-pill]').forEach(function(b){
        // Quitar iconito si tiene
        var ico=b.querySelector('.patina-cat-ico'); if(ico) ico.remove();
        // Si tiene emoji al inicio, quitarlo y dejar solo texto
        var txt=(b.textContent||'').trim();
        // Quitar emojis comunes al inicio
        txt=txt.replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}✨👜🧉🏷️]+\s*/u, '').trim();
        var norm=normCat(b.getAttribute('data-cat-pill')||txt);
        b.setAttribute('data-cat-pill', norm);
        b.textContent=mostrarCat(norm);
      });
    }catch(e){}
  }
  function corregir(){
    try{
      arreglarModal();
      formatearWhatsAppIndividual();
      limpiarPildorasDuplicadas();
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
      // Solo categorias extras (no cartera/accesorio porque ya tienen pildora original CARTERAS/ACCESORIOS)
      var catsExtras=Object.keys(conteo).filter(function(c){ return conteo[c]>0 && c!=='ofertas' && c!=='todos' && c!=='carteras' && c!=='accesorios'; });
      var homeDeseado=[];
      // HOME: 2 categorias con productos + Ofertas si hay, si no 3ra. Para HOME usamos conteo normalizado
      var catsHome=Object.keys(conteo).filter(function(c){ return conteo[c]>0 && c!=='ofertas' && c!=='todos'; });
      catsHome.sort(function(a,b){
        var order={carteras:0, accesorios:1};
        var ia=order[a]!=null?order[a]:99; var ib=order[b]!=null?order[b]:99; return ia-ib;
      });
      if(hayOferta){ homeDeseado=catsHome.slice(0,2); homeDeseado.push('ofertas'); } else { homeDeseado=catsHome.slice(0,3); }
      document.querySelectorAll('.patina-cat-pills').forEach(function(wrap){
        if(wrap.closest('#patinaFormModal')) return;
        var esTodos = wrap.closest('#view-todos') || wrap.id.indexOf('todos')!==-1;
        if(esTodos){
          // 1) Borrar duplicados: si hay CARTERAS y CARTERA, quedarse con CARTERAS
          var vistos={};
          wrap.querySelectorAll('[data-cat-pill]').forEach(function(b){
            var n=normCat(b.getAttribute('data-cat-pill')||b.textContent);
            if(vistos[n]){ b.remove(); return; }
            vistos[n]=1;
          });
          // 2) Borrar pills con 0 (excepto TODOS y OFERTAS si hay)
          wrap.querySelectorAll('[data-cat-pill]').forEach(function(b){
            var cat=normCat(b.getAttribute('data-cat-pill')||'');
            if(cat==='todos') return;
            if(cat==='ofertas' && !hayOferta){ b.remove(); return; }
            if(cat==='carteras' || cat==='accesorios') return; // originales, no borrar
            if(!conteo[cat] || conteo[cat]===0) b.remove();
          });
          // 3) Agregar solo extras que falten, ANTES de TODOS
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
          // TODOS SIEMPRE AL FINAL
          var tb=wrap.querySelector('[data-cat-pill="todos"]');
          if(tb && tb!==wrap.lastElementChild) wrap.appendChild(tb);
          // Asegurar que CARTERAS/ACCESORIOS originales no tengan iconito y esten en mayuscula
          wrap.querySelectorAll('[data-cat-pill]').forEach(function(b){
            var n=normCat(b.getAttribute('data-cat-pill')||'');
            if(b.textContent!==mostrarCat(n)) b.textContent=mostrarCat(n);
          });
        } else {
          // HOME / principal: solo homeDeseado, sin duplicar
          var vistosH={};
          wrap.querySelectorAll('[data-cat-pill]').forEach(function(b){
            var n=normCat(b.getAttribute('data-cat-pill')||b.textContent);
            if(vistosH[n]){ b.remove(); return; } vistosH[n]=1;
          });
          wrap.querySelectorAll('[data-cat-pill]').forEach(function(b){
            var cat=normCat(b.getAttribute('data-cat-pill')||'');
            if(cat==='todos') return;
            if(homeDeseado.indexOf(cat)===-1) b.remove();
          });
          homeDeseado.forEach(function(cat){
            if(wrap.querySelector('[data-cat-pill="'+cat+'"]')) return;
            var b;
            if(cat==='ofertas'){
              b=document.createElement('button'); b.type='button'; b.className='patina-cat-pill'; b.setAttribute('data-cat-pill','ofertas'); b.textContent='OFERTAS';
              b.addEventListener('click', function(){ try{ window.__patinaCatFilter='ofertas'; }catch(e){} try{ if(window.patinaIrA) window.patinaIrA('todos'); }catch(e){} setTimeout(function(){ filtrarPorCategoria('ofertas'); },250); });
            } else { b=crearPildora(cat); }
            wrap.appendChild(b);
          });
          var n2=wrap.querySelectorAll('[data-cat-pill]').length;
          if(n2===2){ wrap.style.justifyContent='center'; wrap.style.display='flex'; wrap.style.gap='10px'; } else { wrap.style.justifyContent=''; }
        }
      });
      document.querySelectorAll('#patinaFormModal select').forEach(function(sel){
        var valorActual=(sel.value||'').toLowerCase();
        var modalAbierto=true;
        sel.querySelectorAll('option').forEach(function(opt){
          var v=(opt.value||opt.textContent||'').trim().toLowerCase();
          if(v==='__nueva__') return;
          if(protegidas.indexOf(v)!==-1) return;
          if(v==='ofertas') return;
          if(normCat(v)===normCat(valorActual)) return;
          // No borrar pendiente mientras modal abierto
          var pend=null; try{ pend=sessionStorage.getItem('patina_cat_pendiente'); }catch(e){}
          if(pend && normCat(v)===normCat(pend)) return;
          if(!conteo[normCat(v)] || conteo[normCat(v)]===0) opt.remove();
        });
        var vals=[]; sel.querySelectorAll('option').forEach(function(o){ vals.push(normCat(o.value||'')); });
        Object.keys(conteo).forEach(function(cat){
          if(cat==='todos'||cat==='ofertas') return;
          if(vals.indexOf(cat)===-1){
            var o=document.createElement('option'); o.value=cat; o.textContent=mostrarCat(cat).charAt(0)+mostrarCat(cat).slice(1).toLowerCase();
            // En select mostrar Capitalizado, no todo mayuscula
            o.textContent=cat.charAt(0).toUpperCase()+cat.slice(1);
            var nueva=sel.querySelector('option[value="__nueva__"]');
            if(nueva) sel.insertBefore(o, nueva); else sel.appendChild(o);
          }
        });
        if(!sel.querySelector('option[value="__nueva__"]')){
          var on=document.createElement('option'); on.value='__nueva__'; on.textContent='+ Nueva categoría...'; sel.appendChild(on);
        }
      });
      var ficha=null;
      document.querySelectorAll('div').forEach(function(d){ if(d.textContent && d.textContent.indexOf('CANTIDAD')!==-1 && d.textContent.indexOf('Máx')!==-1 && !ficha) ficha=d; });
      if(ficha){ var s=getUltimoStock(); if(s && s>0 && ficha.innerHTML.indexOf('Máx. '+s)===-1) ficha.innerHTML=ficha.innerHTML.replace(/Máx\.\s*\d+\s*unidades/i, 'Máx. '+s+' unidades'); }
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
        // Quitar iconitos en cuanto aparezcan
        document.querySelectorAll('.patina-cat-ico').forEach(function(el){ el.remove(); });
      }catch(e){}
      arreglarModal();
    });
    mo.observe(document.documentElement, {childList:true, subtree:true});
  }catch(e){}
  document.addEventListener('click', function(){ setTimeout(corregir,150); setTimeout(corregir,500); setTimeout(corregir,900); }, true);
  setInterval(corregir, 2000);
  setTimeout(corregir, 300);
})();
