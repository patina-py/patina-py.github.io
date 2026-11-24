// V34 COMPLETO = V33 + MODAL COMPACTO PARA QUE ENTRE TODO, INCLUIDO VISIBLE
// Solo achica el modal de Agregar/Editar. No toca visibilidad, categorias, HOME, stock, precios, fotos, ni nada mas.
(function(){
  try{
    if(!document.getElementById('patina-v34-css')){
      var st=document.createElement('style'); st.id='patina-v34-css';
      st.textContent=
        'input,textarea,select{font-size:16px !important;}'+
        '#patinaFormOverlay{overflow-y:auto !important; align-items:flex-start !important; padding:8px 8px !important;}'+
        // MODAL COMPACTO: todo entra, sin que botones tapen Visible
        '.patina-form-modal{max-height:94dvh !important; overflow-y:auto !important; -webkit-overflow-scrolling:touch !important; padding:10px 12px 10px !important; gap:4px !important; box-sizing:border-box !important;}'+
        '.patina-form-modal h3{margin:0 0 4px 0 !important; font-size:18px !important;}'+
        '.patina-form-modal p{margin:0 0 6px 0 !important; font-size:11px !important;}'+
        '.patina-form-modal label{margin:4px 0 2px !important; font-size:9px !important; letter-spacing:.1em !important;}'+
        '.patina-form-modal input,.patina-form-modal textarea,.patina-form-modal select{font-size:16px !important; padding:7px 9px !important;}'+
        // Foto chica
        '.patina-form-modal .patina-foto, #patinaFormOverlay .patina-foto{border:1px dashed rgba(245,236,224,.35) !important; background:transparent !important; border-radius:10px !important; padding:6px 8px !important; margin:0 0 6px 0 !important; height:auto !important; min-height:44px !important; max-height:52px !important; overflow:hidden !important; display:flex !important; align-items:center !important; gap:8px !important; box-sizing:border-box !important;}'+
        '.patina-form-modal .patina-foto-ico, #patinaFormOverlay .patina-foto-ico{width:36px !important; height:36px !important; min-width:36px !important; min-height:36px !important; max-width:36px !important; max-height:36px !important; border-radius:7px !important; overflow:hidden !important; flex-shrink:0 !important; display:grid !important; place-items:center !important; font-size:18px !important;}'+
        '.patina-form-modal .patina-foto-ico img{width:100% !important; height:100% !important; object-fit:cover !important; display:block !important;}'+
        '#patinaFotoTxt{font-size:10px !important; line-height:1.2 !important;}'+
        // Filas compactas
        '.patina-form-modal .patina-row{display:flex !important; gap:8px !important; width:100% !important; margin:0 !important;}'+
        '.patina-form-modal .patina-row > div{flex:1 !important; min-width:0 !important;}'+
        '.patina-form-modal .patina-row input{width:100% !important; box-sizing:border-box !important;}'+
        // Textareas mas chicas para que entre todo
        '#patinaF_etiqueta{min-height:40px !important; max-height:48px !important; padding:7px 9px !important;}'+
        '#patinaF_descripcion{min-height:48px !important; max-height:64px !important; padding:7px 9px !important;}'+
        // Preview compacto
        '#patinaCalc{width:100% !important; display:block !important; margin:4px 0 2px 0 !important; text-align:left !important; font-size:11px !important; line-height:1.3 !important;}'+
        // VISIBLE: siempre visible, nunca tapado por botones
        '.patina-form-modal label:has(#patinaF_visible), .patina-form-modal label[style*="flex"]{display:flex !important; gap:8px !important; align-items:center !important; margin:8px 0 10px 0 !important; padding:6px 8px !important; border-radius:10px !important; background:rgba(255,255,255,.06) !important; font-size:12px !important; letter-spacing:0 !important; text-transform:none !important;}'+
        '.patina-form-modal #patinaF_visible{width:36px !important; height:20px !important; flex-shrink:0 !important;}'+
        // Botones: NO fijos que tapen, van al final del flujo, siempre visibles despues de Visible
        '.patina-form-modal .patina-form-btns{position:relative !important; bottom:auto !important; background:transparent !important; padding:8px 0 2px 0 !important; margin-top:6px !important; z-index:1 !important; display:flex !important; gap:8px !important;}'+
        '.patina-form-modal .patina-form-btns button{flex:1 !important; padding:10px !important; font-size:14px !important;}'+
        // Boton + Nueva categoria mas chico
        '.patina-form-modal .patina-row + button, .patina-form-modal button[onclick*="NuevaCat"]{padding:6px !important; font-size:11px !important; margin:4px 0 2px 0 !important;}'+
        '#patinaAdminPage .patina-search{font-size:16px !important;}'+
        '.patina-cat-pill .patina-cat-ico{display:none !important;}'+
        '.patina-cat-pill.active{background:#2f3a2a !important; color:#F5ECDC !important;}';
      document.head.appendChild(st);
    }
    var vp=document.querySelector('meta[name="viewport"]');
    if(vp && vp.content.indexOf('maximum-scale')===-1) vp.content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
  }catch(e){}

  var KEY='patina_v25_admin';
  var GAS_URL="https://script.google.com/macros/s/AKfycbznKXsIvfuR_kb4UIwHk2QtjaqOlGUW9imJFjXDKfWuanUCFZOtbPLSXVlwAx8mr_I2UQ/exec";
  try{ var saved=localStorage.getItem("patina_gas_url_v1"); if(saved) GAS_URL=saved; }catch(e){}
  function leerProds(){ try{ var v=JSON.parse(localStorage.getItem(KEY)||"[]"); if(Array.isArray(v)) return v; }catch(e){} return []; }
  function guardarProds(arr){ try{ localStorage.setItem(KEY, JSON.stringify(arr)); }catch(e){} }
  function claveNombre(p){ return String(p.nombre||p.name||'').toLowerCase().trim(); }
  function esPC(){ try{ return window.innerWidth>768; }catch(e){ return true; } }

  function corregirFotosDesdeGoogle(){
    try{
      if(document.activeElement && (document.activeElement.tagName==='INPUT' || document.activeElement.tagName==='TEXTAREA')) return;
      if(esPC()){ try{ if(window.patinaSyncNow) window.patinaSyncNow(); }catch(e){} }
      fetch(GAS_URL).then(function(r){ return r.json(); }).then(function(gas){
        if(!gas) return;
        var gasProds=Array.isArray(gas) ? gas : (gas.productos||[]);
        if(!gasProds.length) return;
        if(esPC()) return;
        var loc=leerProds();
        if(!loc.length) return;
        var porNombre={}; loc.forEach(function(p){ porNombre[claveNombre(p)]=p; });
        var cambio=false;
        gasProds.forEach(function(g){
          var clave=claveNombre(g);
          var l=porNombre[clave];
          if(!l){ loc.push(g); porNombre[clave]=g; cambio=true; }
          else if(g.foto && l.foto!==g.foto){ l.foto=g.foto; cambio=true; }
        });
        if(cambio){ guardarProds(loc); try{ if(window.patinaRefrescarTienda) window.patinaRefrescarTienda(); }catch(e){} }
      }).catch(function(){});
    }catch(e){}
  }
  setTimeout(corregirFotosDesdeGoogle, 900);
  setInterval(corregirFotosDesdeGoogle, 15000);
  document.addEventListener('visibilitychange', function(){ if(!document.hidden) corregirFotosDesdeGoogle(); });
  window.addEventListener('focus', function(){ corregirFotosDesdeGoogle(); });

  try{
    if(window.patinaSetQ && !window.patinaSetQ._v34){
      window.patinaSetQ = function(v){
        var q = String(v||'').toLowerCase().trim();
        try{ sessionStorage.setItem('patina_admin_q', v||''); }catch(e){}
        var cards = document.querySelectorAll('#patinaAdminPage .patina-card');
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
      window.patinaSetQ._v34 = true;
    }
    document.addEventListener('input', function(e){
      try{
        var t = e.target;
        if(t && t.classList && t.classList.contains('patina-search')){ e.stopPropagation(); }
      }catch(e){}
    }, true);
  }catch(e){}

  function arreglarModal(){
    try{
      var modal = document.querySelector('.patina-form-modal');
      if(!modal) return;
      var overlay = document.getElementById('patinaFormOverlay');
      if(overlay && !overlay.classList.contains('open')) return;
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
      // Asegurar que el toggle Visible no quede tapado: si esta, ponerlo antes de los botones
      try{
        var vis = document.getElementById('patinaF_visible');
        if(vis){
          var visLabel = vis.closest('label');
          var btns = modal.querySelector('.patina-form-btns');
          if(visLabel && btns && visLabel.compareDocumentPosition(btns) & 4){
            // Ya esta antes, bien
          } else if(visLabel && btns){
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
