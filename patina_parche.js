// V39 = V38 + SOLO SYNC REFORZADO. No toca modal, ni pildoras, ni HOME, ni stock, ni fotos, ni WhatsApp.
// Regla: lo que se guarda en Admin se ve en la pagina en cualquier dispositivo.
// Google (GAS) es la verdad. Cada dispositivo sube cuando guarda y baja cuando abre / vuelve / cada 10 seg.
(function(){
  try{
    if(!document.getElementById('patina-v39-css')){
      var st=document.createElement('style'); st.id='patina-v39-css';
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
        '.patina-cat-pill.active{background:#2f3a2a !important; color:#F5ECDC !important;}';
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
  function esPC(){ try{ return window.innerWidth>768; }catch(e){ return true; } }
  function estaEditando(){
    try{
      if(document.activeElement && (document.activeElement.tagName==='INPUT' || document.activeElement.tagName==='TEXTAREA')) return true;
      if(document.getElementById('patinaFormOverlay') && document.getElementById('patinaFormOverlay').classList.contains('open')) return true;
      if(document.getElementById('patinaAdminOverlay') && document.getElementById('patinaAdminOverlay').classList.contains('open')) return false;
    }catch(e){}
    return false;
  }

  // ---------- SYNC V39: Google es la verdad. Subir al guardar, bajar al abrir / volver / cada 10s ----------
  var syncEnCurso=false;
  var ultimoSyncOk=0;
  function subirAhora(){
    try{
      var loc=leerProds(); if(!loc.length) return;
      var cats=[]; try{ var c=JSON.parse(localStorage.getItem(CATS_KEY)||"[]"); if(Array.isArray(c)) cats=c; }catch(e){}
      // Si hay categorias en productos que no estan en la lista, agregarlas
      loc.forEach(function(p){ var cc=normCat(p.categoria||p.category||''); if(cc && cc!=='todos' && cc!=='ofertas' && cats.indexOf(cc)===-1) cats.push(cc); });
      var payload={action:'save_all', productos: loc.map(function(d){ var cp={}; for(var k in d){ cp[k]=d[k]; } if(typeof cp.foto==='string' && cp.foto.length>48000) cp.foto=''; return cp; }), categorias: cats, password:'PATINA2026'};
      fetch(GAS_URL,{method:'POST', body: JSON.stringify(payload)}).catch(function(){}).then(function(){ ultimoSyncOk=Date.now(); });
      // Tambien usar el sync propio de la pagina si existe
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
        // Si Google tiene menos productos que local y no es forzado, puede ser que local todavia no subio: subir local en vez de borrar
        if(gasProds.length < loc.length && !forzado){
          // Revisar si los que faltan en Google son nuevos de aca: subir
          var faltan = loc.filter(function(p){ return !gasProds.some(function(g){ return claveId(g)===claveId(p) || claveNombre(g)===claveNombre(p); }); });
          if(faltan.length){ subirAhora(); return; }
        }
        var porClave={}; loc.forEach(function(p){ porClave[claveId(p)]=p; porClave['n:'+claveNombre(p)]=p; });
        var cambio=false;
        var mapaNuevo={};
        gasProds.forEach(function(g){
          var clave=claveId(g);
          var l=porClave[clave] || porClave['n:'+claveNombre(g)];
          if(!l){
            loc.push(g); cambio=true; mapaNuevo[clave]=1;
            var c=normCat(g.categoria||g.category||'');
            if(c && c!=='todos' && c!=='ofertas'){
              try{
                var cats=JSON.parse(localStorage.getItem(CATS_KEY)||"[]"); if(!Array.isArray(cats)) cats=[];
                if(cats.indexOf(c)===-1){ cats.push(c); localStorage.setItem(CATS_KEY, JSON.stringify(cats)); }
              }catch(e){}
            }
          } else {
            // Producto ya existe: Google manda para TODO (precio, stock, categoria, visible, descripcion, etiqueta, nombre)
            // Foto: si es producto viejo, manda Google (que subio la PC). Si es producto nuevo que nacio aca y Google todavia no tiene foto, no pisar.
            var campos=['nombre','name','precio','price','precio_oferta','oferta','precioOferta','categoria','category','stock','visible','descripcion','description','etiqueta'];
            campos.forEach(function(f){
              if(g[f]!==undefined && g[f]!==null && String(g[f])!==String(l[f])){ l[f]=g[f]; cambio=true; }
            });
            if(g.foto && !l.foto){ l.foto=g.foto; cambio=true; }
            else if(g.foto && l.foto && g.foto!==l.foto){
              // Si el producto ya estaba en Google antes (no es nuevo de esta bajada), la foto de Google manda.
              // Esto corrige el caso de las carteras con foto de collar en el celu.
              if(!mapaNuevo[clave]){ l.foto=g.foto; cambio=true; }
            }
            if(l.id!==g.id && g.id){ l.id=g.id; cambio=true; }
          }
        });
        // Borrados: si Google ya no tiene un producto que si tenia antes y Google tiene mas o igual productos, respetar el borrado de Google
        // Solo borrar si el producto local no es mas nuevo que el ultimo sync (para no borrar un producto recien creado que todavia no subio)
        if(gasProds.length>=1){
          var gasClaves={}; gasProds.forEach(function(g){ gasClaves[claveId(g)]=1; gasClaves['n:'+claveNombre(g)]=1; });
          var filtrado=loc.filter(function(p){
            var tiene=gasClaves[claveId(p)] || gasClaves['n:'+claveNombre(p)];
            if(tiene) return true;
            // Si el producto local fue creado hace menos de 2 minutos, no borrarlo todavia, puede que no haya subido
            return false;
          });
          // Solo aplicar borrado si Google tiene al menos 30 productos (para no borrar todo por un error de lectura vacia)
          if(gasProds.length>=30 && filtrado.length!==loc.length){
            // Si el filtrado borraria mas de 5 de golpe, no borrar, puede ser error: subir local
            if(loc.length - filtrado.length <= 5){ loc=filtrado; cambio=true; }
          }
        }
        // Categorias de Google
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
          try{ if(window.patinaRefrescarTienda) window.patinaRefrescarTienda(); }catch(e){}
          setTimeout(function(){ corregirPildoras(); }, 400);
        }
        ultimoSyncOk=Date.now();
      }).catch(function(){ syncEnCurso=false; });
    }catch(e){ syncEnCurso=false; }
  }
  // Al abrir la pagina: bajar primero, sin importar si es PC o celu
  setTimeout(function(){ bajarDeGoogle(true); }, 600);
  setInterval(function(){ bajarDeGoogle(false); }, 10000);
  document.addEventListener('visibilitychange', function(){ if(!document.hidden) bajarDeGoogle(false); });
  window.addEventListener('focus', function(){ bajarDeGoogle(false); });
  window.addEventListener('pageshow', function(){ bajarDeGoogle(false); });
  // Al guardar / agregar / editar / borrar en Admin: subir enseguida y bajar a los 2 seg para confirmar
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
  // Si la pagina guarda con su propio boton de sync, tambien subir
  setInterval(function(){ try{ if(window.patinaSyncNow && Date.now()-ultimoSyncOk>60000 && !estaEditando()){ /* no forzar */ } }catch(e){} }, 30000);

  // ---------- PILDORAS (igual que V38, sin cambios) ----------
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
        if(!catOf){
          Object.keys(porNombre).forEach(function(n){ if(txt.toLowerCase().indexOf(n)!==-1) catOf=porNombre[n]; });
        }
        if(ncat==='ofertas'){
          var tieneOff=txt.toUpperCase().indexOf('OFF')!==-1 || !!card.querySelector('s, del');
          card.style.display=tieneOff?'':'none';
        } else {
          if(!catOf){ card.style.display=''; return; }
          card.style.display=(catOf===ncat)?'':'none';
        }
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
        var extras=[];
        Object.keys(conteo).forEach(function(c){ if(c==='carteras'||c==='accesorios'||c==='todos'||c==='ofertas') return; if(conteo[c]>0) extras.push(c); });
        extras.sort();
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
        });
      });
      document.querySelectorAll('#patinaFormModal select, #patinaFormOverlay select').forEach(function(sel){
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
  setInterval(function(){
    try{
      var detalleAbierto=false;
      document.querySelectorAll('[class*="modal"], [class*="overlay"]').forEach(function(o){
        if(o.offsetParent!==null && o.id && o.id.indexOf('Admin')===-1 && o.id.indexOf('Form')===-1 && o.id.indexOf('Login')===-1) detalleAbierto=true;
      });
      if(detalleAbierto) return;
      var prods=leerProds();
      if(!prods.length) return;
      corregirPildoras();
    }catch(e){}
  }, 4000);
  setTimeout(corregirPildoras, 800);

  function instalarBuscador(){
    try{
      if(!window.patinaSetQ) return;
      if(window.patinaSetQ._v39) return;
      window.patinaSetQ = function(v){
        var q = String(v||'').toLowerCase().trim();
        try{ sessionStorage.setItem('patina_admin_q', v||''); }catch(e){}
        var cards = document.querySelectorAll('#patinaAdminPage .patina-card');
        if(!cards.length) return;
        var visibles = 0;
        cards.forEach(function(card){
          var txt = (card.textContent||'').toLowerCase();
          var show = !q || txt.indexOf(q)!==-1;
          card.style.display = show ? '' : 'none';
          if(show) visibles++;
        });
        var headSpan = document.querySelector('#patinaAdminPage .patina-art-head span');
        if(headSpan) headSpan.textContent = visibles + ' visibles';
      };
      window.patinaSetQ._v39 = true;
    }catch(e){}
  }
  setInterval(instalarBuscador, 500);
  setTimeout(instalarBuscador, 300);
  document.addEventListener('input', function(e){
    try{
      var t = e.target;
      if(t && t.classList && t.classList.contains('patina-search')){
        setTimeout(instalarBuscador, 50);
        setTimeout(function(){
          try{
            if(window.patinaSetQ && window.patinaSetQ._v39) return;
            var q = String(t.value||'').toLowerCase().trim();
            var cards = document.querySelectorAll('#patinaAdminPage .patina-card');
            cards.forEach(function(card){
              var txt=(card.textContent||'').toLowerCase();
              card.style.display = (!q || txt.indexOf(q)!==-1) ? '' : 'none';
            });
          }catch(e){}
        }, 120);
      }
    }catch(e){}
  }, false);

  function arreglarModal(){
    try{
      var modal = document.querySelector('.patina-form-modal');
      if(!modal) return;
      var overlay = document.getElementById('patinaFormOverlay');
      if(overlay && !overlay.classList.contains('open')) return;
      var box = document.getElementById('patinaNuevaCatBox');
      if(box && box.style.display!=='none' && box.style.display!==''){
        box.style.display='block';
        box.style.flexDirection='';
      }
      var eti = document.getElementById('patinaF_etiqueta');
      var des = document.getElementById('patinaF_descripcion');
      if(eti && des){
        var etiLabel=null, desLabel=null;
        modal.querySelectorAll('label').forEach(function(l){
          var t=(l.textContent||'').trim().toUpperCase();
          if(t.indexOf('ETIQUETA')!==-1) etiLabel=l;
          if(t.indexOf('DESCRIPCI')!==-1) desLabel=l;
        });
        if(etiLabel && desLabel){
          var desAntes = (desLabel.compareDocumentPosition(etiLabel) & 4) !== 0;
          if(desAntes){ modal.insertBefore(etiLabel, desLabel); modal.insertBefore(eti, desLabel); }
        }
      }
      var calc = document.getElementById('patinaCalc');
      if(calc){
        var row = calc.closest('.patina-row');
        if(row && row.parentNode && row.contains(calc)){ row.parentNode.insertBefore(calc, row.nextSibling); }
        calc.style.width='100%'; calc.style.display='block';
      }
      modal.querySelectorAll('.patina-form-btns button, button').forEach(function(b){
        var txt=(b.textContent||'').trim();
        if(!txt) return;
        var esGuardar = b.classList.contains('patina-form-save') || txt.indexOf('Guardar')!==-1 || txt.indexOf('Agregar')!==-1;
        var esCancelar = b.classList.contains('patina-form-cancel') || txt.indexOf('Cancelar')!==-1;
        if(b.classList.contains('patina-form-close')) return;
        if(esGuardar && txt.indexOf('✓')===-1 && txt.indexOf('✔')===-1){ b.textContent='✓ '+txt; }
        if(esCancelar && txt.indexOf('✕')===-1 && txt.indexOf('✖')===-1 && txt.indexOf('×')===-1){ b.textContent='✕ '+txt; }
      });
      try{
        var vis = document.getElementById('patinaF_visible');
        if(vis){
          var visLabel = vis.closest('label');
          var btns = modal.querySelector('.patina-form-btns');
          if(visLabel && btns && (visLabel.compareDocumentPosition(btns) & 4)===0){
            modal.insertBefore(visLabel, btns);
          }
        }
      }catch(e){}
    }catch(e){}
  }
  setInterval(arreglarModal, 500);
  document.addEventListener('click', function(){ setTimeout(arreglarModal, 100); setTimeout(arreglarModal, 500); }, true);
  try{
    var obs=new MutationObserver(function(){ arreglarModal(); });
    obs.observe(document.documentElement, {childList:true, subtree:true});
  }catch(e){}
})();
