// V33 COMPLETO - TODO EN UNO. No reemplazar por parches chiquitos.
// Incluye: V28 (etiqueta arriba, preview ancho completo, sin zoom, sin scroll, botones visibles, teclado no se cierra, iconos)
// + V29/V32 sync fotos PC->celu (que ya anda). NO toca visibilidad, categorias, HOME, stock, ni precios.
(function(){
  // ---------- CSS: sin zoom, modal sin scroll raro, foto chica, precios gemelos, preview ancho completo, botones visibles ----------
  try{
    if(!document.getElementById('patina-v33-css')){
      var st=document.createElement('style'); st.id='patina-v33-css';
      st.textContent=
        'input,textarea,select{font-size:16px !important;}'+
        '#patinaFormOverlay{overflow-y:auto !important; align-items:flex-start !important; padding:14px 10px !important;}'+
        '.patina-form-modal{max-height:88dvh !important; overflow-y:auto !important; -webkit-overflow-scrolling:touch !important; padding-bottom:16px !important; box-sizing:border-box !important;}'+
        '.patina-form-modal input,.patina-form-modal textarea,.patina-form-modal select{font-size:16px !important;}'+
        '.patina-form-modal .patina-foto, #patinaFormOverlay .patina-foto{border:1px dashed rgba(245,236,224,.35) !important; background:transparent !important; border-radius:12px !important; padding:8px 10px !important; margin:0 0 10px 0 !important; height:auto !important; min-height:56px !important; max-height:70px !important; overflow:hidden !important; display:flex !important; align-items:center !important; gap:10px !important; box-sizing:border-box !important;}'+
        '.patina-form-modal .patina-foto-ico, #patinaFormOverlay .patina-foto-ico{width:44px !important; height:44px !important; min-width:44px !important; min-height:44px !important; max-width:44px !important; max-height:44px !important; border-radius:8px !important; overflow:hidden !important; flex-shrink:0 !important; display:grid !important; place-items:center !important; font-size:20px !important;}'+
        '.patina-form-modal .patina-foto-ico img{width:100% !important; height:100% !important; object-fit:cover !important; display:block !important;}'+
        '.patina-form-modal .patina-row{display:flex !important; gap:10px !important; width:100% !important;}'+
        '.patina-form-modal .patina-row > div{flex:1 !important; min-width:0 !important;}'+
        '.patina-form-modal .patina-row input{width:100% !important; box-sizing:border-box !important;}'+
        '#patinaCalc{width:100% !important; display:block !important; margin:8px 0 2px 0 !important; text-align:left !important; font-size:12px !important; line-height:1.4 !important; grid-column:1 / -1 !important;}'+
        '.patina-form-modal .patina-form-btns{position:sticky !important; bottom:0 !important; background:#2f3a2a !important; padding:12px 0 4px 0 !important; margin-top:14px !important; z-index:10 !important; display:flex !important; gap:10px !important;}'+
        '.patina-form-modal .patina-form-btns button{flex:1 !important; padding:12px !important;}'+
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

  // ---------- SYNC FOTOS PC->CELU (el que ya te anda) ----------
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

  // ---------- FIX TECLADO QUE SE CIERRA EN BUSCADOR ADMIN ----------
  // Causa: patinaSetQ original vuelve a dibujar toda la lista (innerHTML) y el input pierde foco.
  // Fix: sobrescribir patinaSetQ para que solo filtre las tarjetas ya dibujadas, sin re-dibujar, sin perder foco ni cursor.
  try{
    if(window.patinaSetQ && !window.patinaSetQ._v33){
      window.patinaSetQ = function(v){
        var q = String(v||'').toLowerCase().trim();
        try{ sessionStorage.setItem('patina_admin_q', v||''); }catch(e){}
        // No re-dibujar. Solo mostrar/ocultar tarjetas.
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
        // Devolver foco al buscador si lo tenia, sin mover cursor al final
        try{
          var inp = document.querySelector('#patinaAdminPage .patina-search');
          if(inp && document.activeElement !== inp){
            // No forzar foco si el usuario esta en otro campo
          }
          if(inp && document.activeElement === inp){
            var pos = inp.selectionStart;
            // No tocar value, ya lo tiene el usuario
            if(pos!==null) inp.setSelectionRange(pos, pos);
          }
        }catch(e){}
      };
      window.patinaSetQ._v33 = true;
    }
    // Guardar query cuando se escribe, para no perderla si se re-dibuja por otro lado
    document.addEventListener('input', function(e){
      try{
        var t = e.target;
        if(t && t.classList && t.classList.contains('patina-search')){
          // No dejar que el evento burbujee y dispare un render completo
          e.stopPropagation();
        }
      }catch(e){}
    }, true);
  }catch(e){}

  // ---------- MODAL: Etiqueta arriba de Descripcion, preview abajo de los DOS precios ancho completo, iconos, botones visibles ----------
  function arreglarModal(){
    try{
      var modal = document.querySelector('.patina-form-modal');
      if(!modal) return;
      var overlay = document.getElementById('patinaFormOverlay');
      if(overlay && !overlay.classList.contains('open')) return;

      // 1) Etiqueta arriba de Descripcion (solo esos dos, no toco nada mas)
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
          // Si Descripcion esta antes que Etiqueta, invertir solo esos dos
          var desAntes = (desLabel.compareDocumentPosition(etiLabel) & 4) !== 0;
          if(desAntes){
            // Mover Etiqueta (label + textarea) antes de Descripcion
            modal.insertBefore(etiLabel, desLabel);
            modal.insertBefore(eti, desLabel);
          }
        }
      }

      // 2) "Se va a mostrar" abajo de AMBOS precios, ancho completo
      var calc = document.getElementById('patinaCalc');
      if(calc){
        var row = calc.closest('.patina-row');
        if(row && row.parentNode){
          // Si esta dentro del row (abajo de solo oferta), sacarlo afuera, abajo de los dos
          if(row.contains(calc)){
            row.parentNode.insertBefore(calc, row.nextSibling);
          }
        }
        calc.style.width='100%';
        calc.style.display='block';
      }

      // 3) Iconos Guardar / Cancelar
      modal.querySelectorAll('.patina-form-btns button, button').forEach(function(b){
        var txt=(b.textContent||'').trim();
        if(!txt) return;
        var esGuardar = b.classList.contains('patina-form-save') || txt.indexOf('Guardar')!==-1 || txt.indexOf('Agregar')!==-1;
        var esCancelar = b.classList.contains('patina-form-cancel') || txt.indexOf('Cancelar')!==-1;
        // No tocar el boton X de cerrar arriba
        if(b.classList.contains('patina-form-close')) return;
        if(esGuardar && txt.indexOf('✓')===-1 && txt.indexOf('✔')===-1){
          b.textContent='✓ '+txt;
        }
        if(esCancelar && txt.indexOf('✕')===-1 && txt.indexOf('✖')===-1 && txt.indexOf('×')===-1){
          b.textContent='✕ '+txt;
        }
      });

      // 4) Foto chica: si el cuadro esta gigante, ya lo limita el CSS. Solo asegurar que no sea enorme.
    }catch(e){}
  }
  setInterval(arreglarModal, 500);
  document.addEventListener('click', function(){ setTimeout(arreglarModal, 100); setTimeout(arreglarModal, 500); }, true);
  try{
    var obs=new MutationObserver(function(){ arreglarModal(); });
    obs.observe(document.documentElement, {childList:true, subtree:true});
  }catch(e){}
})();
