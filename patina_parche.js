// V23 = V22 + FIX 6 bugs reportados: Buscador sin cerrar teclado (no redibujar), Nueva cat no esconde campos, Foto vacia en nuevo, Termos filtra, TODOS siempre ultimo, Otro cancelado con 0 se borra
(function(){
  try{
    if(!document.getElementById('patina-v23-css')){
      var st=document.createElement('style'); st.id='patina-v23-css';
      st.textContent=
        'input,textarea,select{font-size:16px !important;}'+
        '#patinaFormModal input,#patinaFormModal textarea,#patinaFormModal select{font-size:16px !important;}'+
        '#patinaFormModal .patina-foto{border:none !important; background:rgba(255,255,255,0.08) !important; border-radius:14px !important; padding:8px 10px !important; margin:0 0 10px 0 !important; height:auto !important; min-height:56px !important; max-height:none !important; overflow:hidden !important; display:flex !important; align-items:center !important; gap:10px !important; box-sizing:border-box !important;}'+
        '#patinaFormModal .patina-foto-ico{width:56px !important; height:56px !important; min-width:56px !important; min-height:56px !important; max-width:56px !important; max-height:56px !important; border-radius:10px !important; overflow:hidden !important; flex-shrink:0 !important; display:grid !important; place-items:center !important; font-size:22px !important;}'+
        '#patinaFormModal .patina-foto-ico img{width:100% !important; height:100% !important; object-fit:cover !important; display:block !important;}'+
        '#patinaFormModal #patinaFotoTxt{font-size:11px !important; letter-spacing:.14em !important; white-space:nowrap !important;}'+
        '#patinaFormModal #patinaCalc{width:100% !important; display:block !important; margin:6px 0 2px 0 !important; text-align:left !important; font-size:11px !important; line-height:1.4 !important;}'+
        /* Botones NO sticky: el sticky tapaba Descripcion/Visible cuando se abria Nueva categoria */
        '#patinaFormModal .patina-form-btns{position:relative !important; bottom:auto !important; background:transparent !important; padding:12px 0 4px 0 !important; margin-top:12px !important; z-index:10 !important;}'+
        '#patinaFormModal{max-height:88dvh !important; overflow-y:auto !important; padding-bottom:18px !important;}'+
        '#patinaFormModal #patinaNuevaCatBox{position:relative !important; z-index:1 !important; margin-top:8px !important;}'+
        '.patina-search{font-size:16px !important;}';
      document.head.appendChild(st);
    }
    var vp=document.querySelector('meta[name="viewport"]');
    if(vp && vp.content.indexOf('maximum-scale')===-1) vp.content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
  }catch(e){}

  var fotoCambiada=false;
  var ultimoStock=null;

  // --- 1) BUSCADOR ADMIN: NO redibujar lista, solo filtrar tarjetas. Asi el teclado NO se cierra ni se reabre ---
  try{
    // Guardar original por si se necesita para cambiar de categoria
    if(window.patinaSetQ && !window.patinaSetQ._v23orig) window.patinaSetQ._v23orig=window.patinaSetQ;
    window.patinaSetQ=function(v){
      var q=String(v||'').toLowerCase().trim();
      // Filtrar solo DOM, sin recrear el input
      var visibles=0, total=0;
      document.querySelectorAll('#patinaAdminPage .patina-card').forEach(function(card){
        total++;
        var txt=(card.textContent||'').toLowerCase();
        var show = !q || txt.indexOf(q)!==-1;
        card.style.display = show ? '' : 'none';
        if(show) visibles++;
      });
      var headSpan=document.querySelector('#patinaAdminPage .patina-art-head span');
      if(headSpan) headSpan.textContent=visibles+' visibles';
      // No llamar a renderList, no tocar el foco, el teclado queda abierto
      // Guardar q en session para que al cambiar de categoria se reaplique
      try{ sessionStorage.setItem('patina_admin_q', v||''); }catch(e){}
    };
    window.patinaSetQ._v23=true;
    // Al cambiar de categoria, el renderList original recrea todo y pierde el buscador. Reaplicar filtro despues.
    if(window.patinaSetCat && !window.patinaSetCat._v23){
      var origCat=window.patinaSetCat;
      var wrappedCat=function(c){
        origCat(c);
        setTimeout(function(){
          try{
            var q=sessionStorage.getItem('patina_admin_q')||'';
            if(q){
              var inp=document.querySelector('.patina-search');
              if(inp) inp.value=q;
              window.patinaSetQ(q);
            }
          }catch(e){}
        }, 30);
      };
      wrappedCat._v23=true; window.patinaSetCat=wrappedCat;
    }
    // patinaNuevo: limpiar foto
    if(window.patinaNuevo && !window.patinaNuevo._v23){
      var origNuevo=window.patinaNuevo;
      var wNuevo=function(){
        fotoCambiada=false;
        try{ sessionStorage.setItem('patina_foto_cambiada','0'); }catch(e){}
        origNuevo();
        setTimeout(function(){
          try{
            var ico=document.getElementById('patinaFotoIco');
            if(ico) ico.innerHTML='📷';
            var txt=document.getElementById('patinaFotoTxt');
            if(txt) txt.textContent='Agregar foto';
          }catch(e){}
        }, 50);
      };
      wNuevo._v23=true; window.patinaNuevo=wNuevo;
    }
    // patinaPreviewFoto: marcar que si cambio foto
    if(window.patinaPreviewFoto && !window.patinaPreviewFoto._v23){
      var origPrev=window.patinaPreviewFoto;
      var wPrev=function(e){
        fotoCambiada=true;
        try{ sessionStorage.setItem('patina_foto_cambiada','1'); }catch(e){}
        return origPrev(e);
      };
      wPrev._v23=true; window.patinaPreviewFoto=wPrev;
    }
    // patinaEditar: marcar que la foto actual es del producto, no es nueva
    if(window.patinaEditar && !window.patinaEditar._v23){
      var origEd=window.patinaEditar;
      var wEd=function(i){
        fotoCambiada=false;
        try{ sessionStorage.setItem('patina_foto_cambiada','0'); }catch(e){}
        return origEd(i);
      };
      wEd._v23=true; window.patinaEditar=wEd;
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
          if(inp && inp.value) { ultimoStock=parseInt(inp.value,10); try{ sessionStorage.setItem('patina_ultimo_stock', String(ultimoStock)); }catch(e){} }
        }
      }
      // Si cancela un producto nuevo con categoria nueva sin guardar, esa categoria queda con 0 y se limpia en corregir()
    }catch(e){}
  }, true);
  document.addEventListener('change', function(e){
    try{
      var sel=e.target;
      if(!sel || sel.tagName!=='SELECT') return;
      if(sel.value==='__nueva__'){
        var nombre=prompt('Escribí el nombre de la nueva categoría (ej: Termos)');
        if(nombre && nombre.trim()){
          var cat=nombre.trim().toLowerCase();
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
  function getUltimoStock(){
    if(ultimoStock) return ultimoStock;
    try{ var v=sessionStorage.getItem('patina_ultimo_stock'); if(v) return parseInt(v,10); }catch(e){}
    return null;
  }
  function getProductos(){
    var out=[];
    try{
      for(var i=0;i<localStorage.length;i++){
        var k=localStorage.key(i);
        if(k && k.indexOf('patina')!==-1){
          try{ var v=JSON.parse(localStorage.getItem(k)); if(Array.isArray(v) && v.length && (v[0].id!=null || v[0].nombre || v[0].name)) out=v; }catch(e){}
        }
      }
    }catch(e){}
    try{
      if(window.patinaProductos && Array.isArray(window.patinaProductos) && window.patinaProductos.length) out=window.patinaProductos;
      if(window.__patinaProductos && Array.isArray(window.__patinaProductos) && window.__patinaProductos.length) out=window.__patinaProductos;
    }catch(e){}
    return out;
  }
  function tieneOferta(p){
    var precio=parseFloat(p.precio||p.price||0)||0;
    var oferta=parseFloat(p.precio_oferta||p.oferta||p.precioOferta||p.sale_price||0)||0;
    if(oferta>0 && precio>0 && oferta<precio) return true;
    if(p.descuento && parseFloat(p.descuento)>0) return true;
    if(p.etiqueta && String(p.etiqueta).toUpperCase().indexOf('OFF')!==-1) return true;
    return false;
  }
  function iconoPara(cat){
    var c=(cat||'').toLowerCase();
    if(c.indexOf('cartera')!==-1) return '👜';
    if(c.indexOf('accesorio')!==-1) return '✨';
    if(c.indexOf('termo')!==-1) return '🧉';
    if(c.indexOf('mate')!==-1) return '🧉';
    if(c.indexOf('oferta')!==-1) return '🏷️';
    return (cat||'•').charAt(0).toUpperCase();
  }
  function filtrarPorCategoria(cat){
    // Igual que el script original: filtrar tarjetas de #view-todos por id -> categoria
    try{
      var ps=getProductos();
      var map={}; (ps||[]).forEach(function(p){ map[String(p.id)]=(p.category||p.categoria||'').toString().toLowerCase(); });
      var view=document.getElementById('view-todos'); if(!view) return;
      view.querySelectorAll('.products-grid > *').forEach(function(card){
        var txt=card.textContent||'';
        var m=txt.match(/#(\d{4})/); var id=m?m[1].replace(/^0+/,''):null;
        var catOf=null;
        if(m){ var raw=m[1]; if(map[raw]) catOf=map[raw]; else { var found=Object.keys(map).find(function(k){ return k.replace(/^0+/,'')===id; }); if(found) catOf=map[found]; } }
        if(cat==='ofertas'){
          // Ofertas: mostrar solo con descuento - buscar en ps
          var prod=null;
          if(m){ prod=ps.find(function(p){ return String(p.id).replace(/^0+/,'')===id; }); }
          var esOferta=prod? tieneOferta(prod): false;
          card.style.display = esOferta ? '' : 'none';
        } else {
          if(catOf && catOf!==cat) card.style.display='none'; else card.style.display='';
        }
      });
    }catch(e){}
  }
  function crearPildora(cat){
    var b=document.createElement('button');
    b.type='button'; b.className='patina-cat-pill'; b.setAttribute('data-cat-pill',cat);
    var ico=document.createElement('span'); ico.className='patina-cat-ico'; ico.textContent=iconoPara(cat);
    ico.style.cssText='display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;min-width:22px;font-size:13px;margin-right:6px;';
    var txt=document.createElement('span'); txt.textContent=cat.charAt(0).toUpperCase()+cat.slice(1);
    b.appendChild(ico); b.appendChild(txt);
    b.addEventListener('click', function(){
      try{ window.__patinaCatFilter=cat; }catch(e){}
      try{ if(window.patinaIrA) window.patinaIrA('todos'); }catch(e){}
      setTimeout(function(){ filtrarPorCategoria(cat); }, 250);
      setTimeout(function(){ filtrarPorCategoria(cat); }, 600);
    });
    return b;
  }
  function estaEscribiendo(){
    try{ var a=document.activeElement; if(!a) return false; var t=(a.tagName||'').toUpperCase(); return t==='INPUT'||t==='TEXTAREA'||t==='SELECT'||a.isContentEditable; }catch(e){ return false; }
  }
  function nuevaCatAbierta(){
    try{
      var box=document.getElementById('patinaNuevaCatBox');
      return box && box.style.display!=='none' && box.style.display!=='';
    }catch(e){ return false; }
  }
  function arreglarModal(){
    try{
      var modal=document.getElementById('patinaFormModal'); if(!modal) return;
      if(modal.innerText.indexOf('Nueva categoría')!==-1) return;
      if(modal.innerText.indexOf('¿Eliminar')!==-1) return;
      // Si Nueva categoria esta abierta, NO mover nada para no esconder Descripcion/Visible
      if(nuevaCatAbierta()) return;
      // Si estas escribiendo en Descripcion/Etiqueta/Precio, no mover para no perder foco
      if(estaEscribiendo()){
        var ae=document.activeElement;
        if(ae && (ae.id==='patinaF_descripcion' || ae.id==='patinaF_etiqueta' || ae.id==='patinaF_precio' || ae.id==='patinaF_desc' || ae.id==='patinaNuevaCatInput')) return;
      }
      var calc=document.getElementById('patinaCalc');
      if(calc){
        var row=calc.closest('.patina-row');
        if(row && row.contains(calc)) row.parentNode.insertBefore(calc, row.nextSibling);
      }
      var eti=document.getElementById('patinaF_etiqueta');
      var des=document.getElementById('patinaF_descripcion');
      if(eti && des){
        var etiLabel=null, desLabel=null;
        modal.querySelectorAll('label').forEach(function(l){
          var t=(l.textContent||'').trim().toUpperCase();
          if(t.indexOf('ETIQUETA')!==-1) etiLabel=l;
          if(t.indexOf('DESCRIPCI')!==-1) desLabel=l;
        });
        if(etiLabel && desLabel){
          var desAntes=(desLabel.compareDocumentPosition(etiLabel) & 4)!==0;
          if(desAntes){ modal.insertBefore(etiLabel, desLabel); modal.insertBefore(eti, desLabel); }
        }
      }
      modal.querySelectorAll('.patina-form-btns button').forEach(function(b){
        var txt=(b.textContent||'').trim();
        if(b.classList.contains('patina-form-save') && txt.indexOf('✓')===-1 && txt.indexOf('✔')===-1) b.textContent='✓ '+txt;
        if(b.classList.contains('patina-form-cancel') && txt.indexOf('✕')===-1 && txt.indexOf('✖')===-1) b.textContent='✕ '+txt;
      });
      // Foto vacia en nuevo: si es Agregar y no se cambio foto, forzar 📷
      try{
        var h3=modal.querySelector('h3');
        var esNuevo=h3 && h3.textContent.indexOf('Agregar')!==-1;
        var cambiada=false; try{ cambiada=sessionStorage.getItem('patina_foto_cambiada')==='1'; }catch(e){ cambiada=fotoCambiada; }
        if(esNuevo && !cambiada){
          var ico=document.getElementById('patinaFotoIco');
          if(ico && ico.querySelector('img')){
            // Si el modal de nuevo tiene una img que viene del producto anterior, limpiarla
            // Solo si la img no fue puesta por preview (preview pone cambiada=1)
            ico.innerHTML='📷';
            var txt2=document.getElementById('patinaFotoTxt'); if(txt2) txt2.textContent='Agregar foto';
          }
        }
      }catch(e){}
    }catch(e){}
  }
  function limpiarCatsCero(conteo){
    try{
      var keys=['patina_v25_cats','patina_cats_v1'];
      keys.forEach(function(k){
        try{
          var raw=localStorage.getItem(k); if(!raw) return;
          var arr=JSON.parse(raw); if(!Array.isArray(arr)) return;
          var filtrado=arr.filter(function(c){
            var lc=String(c).toLowerCase().trim();
            if(lc==='cartera'||lc==='accesorio'||lc==='carteras'||lc==='accesorios') return true;
            if(lc==='todos'||lc==='ofertas') return false;
            return (conteo[lc]||0)>0;
          });
          if(filtrado.length!==arr.length) localStorage.setItem(k, JSON.stringify(filtrado));
        }catch(e){}
      });
    }catch(e){}
  }
  function corregir(){
    try{
      arreglarModal();
      formatearWhatsAppIndividual();
      if(estaEscribiendo()){
        // Si estas en buscador, no tocar pills para no cerrar teclado. Modal ya se arreglo arriba (con guard).
        // Pero si estas en buscador, tampoco mover categorias
        var ae=document.activeElement;
        if(ae && ae.classList && ae.classList.contains('patina-search')) return;
        // Si estas en otro input, seguir pero sin tocar pills que quitan foco? Seguimos, pero con cuidado
      }
      var prods=getProductos();
      var hayPildoras=document.querySelectorAll('[data-cat-pill]').length>0;
      var hayTarjetas=document.querySelectorAll('[data-product-id], .patina-card, .patina-product').length>0;
      var productosCargados = prods.length>0 && (hayPildoras || hayTarjetas || document.body.innerText.indexOf('#00')!==-1);
      if(!productosCargados) return;
      var protegidas=['todos','home',''];
      var conteo={};
      prods.forEach(function(p){ var c=String(p.category||p.categoria||'').trim().toLowerCase(); if(!c) return; conteo[c]=(conteo[c]||0)+1; });
      // Limpiar categorias con 0, incluido Otro cancelado
      limpiarCatsCero(conteo);
      var hayOferta=prods.some(function(p){ return tieneOferta(p); });
      var catsConProductos=Object.keys(conteo).filter(function(c){ return conteo[c]>0 && c!=='ofertas' && c!=='todos'; });
      var ordenPref=['cartera','carteras','accesorio','accesorios'];
      catsConProductos.sort(function(a,b){ var ia=ordenPref.indexOf(a); var ib=ordenPref.indexOf(b); if(ia===-1) ia=99; if(ib===-1) ib=99; return ia-ib; });
      var homeDeseado=[];
      if(hayOferta){ homeDeseado=catsConProductos.slice(0,2); homeDeseado.push('ofertas'); } else { homeDeseado=catsConProductos.slice(0,3); }
      document.querySelectorAll('.patina-cat-pills').forEach(function(wrap){
        if(wrap.closest('#patinaFormModal')) return;
        var esTodos = wrap.closest('#view-todos') || wrap.id.indexOf('todos')!==-1;
        if(esTodos){
          // Quitar pills con 0
          wrap.querySelectorAll('[data-cat-pill]').forEach(function(b){
            var cat=(b.getAttribute('data-cat-pill')||'').toLowerCase().trim();
            if(cat==='todos') return;
            if(cat==='ofertas' && !hayOferta){ b.remove(); return; }
            if(protegidas.indexOf(cat)!==-1) return;
            if(!conteo[cat] || conteo[cat]===0) b.remove();
          });
          // Agregar faltantes ANTES de TODOS
          var todosBtn=wrap.querySelector('[data-cat-pill="todos"]');
          catsConProductos.forEach(function(cat){
            if(!conteo[cat] || conteo[cat]===0) return;
            if(wrap.querySelector('[data-cat-pill="'+cat+'"]')) return;
            var b=crearPildora(cat);
            if(todosBtn) wrap.insertBefore(b, todosBtn); else wrap.appendChild(b);
          });
          if(hayOferta && !wrap.querySelector('[data-cat-pill="ofertas"]')){
            var bo=document.createElement('button'); bo.type='button'; bo.className='patina-cat-pill'; bo.setAttribute('data-cat-pill','ofertas'); bo.textContent='Ofertas';
            bo.addEventListener('click', function(){ try{ window.__patinaCatFilter='ofertas'; }catch(e){} try{ if(window.patinaIrA) window.patinaIrA('todos'); }catch(e){} setTimeout(function(){ filtrarPorCategoria('ofertas'); },250); });
            if(todosBtn) wrap.insertBefore(bo, todosBtn); else wrap.appendChild(bo);
          }
          // TODOS SIEMPRE AL FINAL, despues de agregar todo
          var tb=wrap.querySelector('[data-cat-pill="todos"]');
          if(tb && tb!==wrap.lastElementChild) wrap.appendChild(tb);
        } else {
          wrap.querySelectorAll('[data-cat-pill]').forEach(function(b){
            var cat=(b.getAttribute('data-cat-pill')||'').toLowerCase().trim();
            if(cat==='todos') return;
            if(homeDeseado.indexOf(cat)===-1) b.remove();
          });
          homeDeseado.forEach(function(cat){
            if(wrap.querySelector('[data-cat-pill="'+cat+'"]')) return;
            var b;
            if(cat==='ofertas'){
              b=document.createElement('button'); b.type='button'; b.className='patina-cat-pill'; b.setAttribute('data-cat-pill','ofertas'); b.textContent='Ofertas';
              b.addEventListener('click', function(){ try{ window.__patinaCatFilter='ofertas'; }catch(e){} try{ if(window.patinaIrA) window.patinaIrA('todos'); }catch(e){} setTimeout(function(){ filtrarPorCategoria('ofertas'); },250); });
            } else { b=crearPildora(cat); }
            wrap.appendChild(b);
          });
          var n=wrap.querySelectorAll('[data-cat-pill]').length;
          if(n===2){ wrap.style.justifyContent='center'; wrap.style.display='flex'; wrap.style.gap='10px'; } else { wrap.style.justifyContent=''; }
        }
      });
      // Select de categoria en modal: quitar 0, excepto la que estas eligiendo ahora
      document.querySelectorAll('#patinaFormModal select').forEach(function(sel){
        var valorActual=(sel.value||'').toLowerCase();
        sel.querySelectorAll('option').forEach(function(opt){
          var v=(opt.value||opt.textContent||'').trim().toLowerCase();
          if(v==='__nueva__') return;
          if(protegidas.indexOf(v)!==-1) return;
          if(v==='ofertas') return;
          if(v===valorActual) return; // no borrar la que estas usando
          if(!conteo[v] || conteo[v]===0) opt.remove();
        });
        var vals=[]; sel.querySelectorAll('option').forEach(function(o){ vals.push((o.value||'').toLowerCase()); });
        catsConProductos.forEach(function(cat){
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
      var ficha=null;
      document.querySelectorAll('div').forEach(function(d){ if(d.textContent && d.textContent.indexOf('CANTIDAD')!==-1 && d.textContent.indexOf('Máx')!==-1 && !ficha) ficha=d; });
      if(ficha){
        var s=getUltimoStock();
        if(s && s>0 && ficha.innerHTML.indexOf('Máx. '+s)===-1) ficha.innerHTML=ficha.innerHTML.replace(/Máx\.\s*\d+\s*unidades/i, 'Máx. '+s+' unidades');
      }
    }catch(e){}
  }
  // Observer liviano: solo mover TODOS al final y arreglar modal, sin redibujar
  try{
    var mo=new MutationObserver(function(){
      try{
        document.querySelectorAll('.patina-cat-pills').forEach(function(wrap){
          if(wrap.closest('#view-todos')){
            var tb=wrap.querySelector('[data-cat-pill="todos"]');
            if(tb && tb!==wrap.lastElementChild) wrap.appendChild(tb);
          }
        });
      }catch(e){}
      arreglarModal();
    });
    mo.observe(document.documentElement, {childList:true, subtree:true});
  }catch(e){}
  document.addEventListener('click', function(){ setTimeout(corregir,150); setTimeout(corregir,500); setTimeout(corregir,900); }, true);
  setInterval(corregir, 2000);
  setTimeout(corregir, 300);
})();
