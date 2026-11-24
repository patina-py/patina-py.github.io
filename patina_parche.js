// V37 COMPLETO = V36 + FIX DISEÑO NUEVA CATEGORIA: campo ancho completo, boton ancho completo
// No toca nada mas: ni visibilidad, ni HOME, ni stock, ni precios, ni fotos, ni WhatsApp.
(function(){
  try{
    if(!document.getElementById('patina-v37-css')){
      var st=document.createElement('style'); st.id='patina-v37-css';
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
        // NUEVA CATEGORIA - DISEÑO CORREGIDO: campo ancho completo arriba, boton ancho completo abajo
        '#patinaNuevaCatBox{display:none; margin:6px 0 2px 0 !important; padding:8px !important; background:rgba(255,255,255,.07) !important; border-radius:10px !important; box-sizing:border-box !important; width:100% !important;}'+
        '#patinaNuevaCatBox[style*="block"]{display:block !important;}'+
        '#patinaNuevaCatInput{display:block !important; width:100% !important; box-sizing:border-box !important; margin:0 0 6px 0 !important; padding:8px 10px !important; font-size:14px !important; border-radius:8px !important;}'+
        '#patinaNuevaCatBox button{display:block !important; width:100% !important; box-sizing:border-box !important; margin:0 !important; padding:8px !important; font-size:12px !important; font-weight:700 !important; letter-spacing:.06em !important; white-space:normal !important; text-align:center !important;}'+
        // Boton + NUEVA CATEGORIA
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

  function instalarBuscador(){
    try{
      if(!window.patinaSetQ) return;
      if(window.patinaSetQ._v37) return;
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
      window.patinaSetQ._v37 = true;
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
            if(window.patinaSetQ && window.patinaSetQ._v37) return;
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
      // Nueva categoria: asegurar que quede en bloque, no en flex row
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
