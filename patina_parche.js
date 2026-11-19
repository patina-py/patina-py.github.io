// FIX FINAL V12 - GOOGLE MANDA (no resucita productos ocultos) + PILDORAS PRECIO IGUALES SOLO EN ADMIN + DETALLE INTACTO
(function(){
  console.log('PATINA V12 CARGADO - Google manda');
  try{
    var meta=document.querySelector('meta[name="viewport"]');
    if(!meta){ meta=document.createElement('meta'); meta.setAttribute('name','viewport'); document.head.appendChild(meta); }
    meta.setAttribute('content','width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover');
  }catch(e){}
  var css = ""
  + "html{ -webkit-text-size-adjust:100%!important; touch-action:manipulation!important }"
  + "body{ touch-action:manipulation!important }"
  + "input, textarea, select, [contenteditable]{ font-size:16px!important; -webkit-text-size-adjust:100%!important }"
  + "input::placeholder, textarea::placeholder{ font-size:15px!important }"
  + "html,body{overscroll-behavior:none!important}"
  + "#patinaGrid, .patina-grid, .patina-products, [class*='product'], [class*='grid']{ transition:opacity .22s ease, transform .22s ease!important }"
  + ".patina-grid-cambiando{ opacity:0!important; transform:translateY(6px)!important }"
  // PILDORAS DE PRECIO IGUALES SOLO EN LA LISTA DE ADMIN - NO TOCA DETALLE NI FORM
  + "#patinaAdminOverlay [class*='price'], #patinaAdminOverlay [class*='precio'], #patinaAdminOverlay [class*='Price'], #patinaAdminOverlay [class*='Precio']{ min-height:26px!important; height:26px!important; padding:3px 9px!important; display:inline-flex!important; align-items:center!important; justify-content:center!important; font-size:12px!important; line-height:1!important; border-radius:999px!important; white-space:nowrap!important; box-sizing:border-box!important }"
  + "#patinaFormOverlay:not(.open):not([class*='open']){ display:none!important; visibility:hidden!important; pointer-events:none!important }"
  + "#patinaFormOverlay.open, #patinaFormOverlay[class*='open']{ display:flex!important; visibility:visible!important; pointer-events:auto!important; position:fixed!important; inset:0!important; align-items:center!important; justify-content:center!important; padding:8px!important; overflow:hidden!important }"
  + ".patina-form-modal{width:100%!important;max-width:520px!important;height:auto!important;max-height:calc(100dvh - 16px)!important;overflow:hidden!important;overflow-y:hidden!important;padding:10px 12px 10px!important;gap:0!important;border-radius:20px!important;display:flex!important;flex-direction:column!important}"
  + ".patina-form-modal label{margin:4px 0 2px!important;font-size:9px!important;letter-spacing:.08em!important;line-height:1!important;flex-shrink:0!important}"
  + ".patina-form-modal input,.patina-form-modal textarea,.patina-form-modal select{padding:7px 10px!important;font-size:16px!important;line-height:1.2!important;flex-shrink:0!important;border-radius:12px!important}"
  + ".patina-form-modal #patinaF_nombre{height:38px!important;min-height:38px!important}"
  + ".patina-form-modal #patinaF_etiqueta{height:40px!important;min-height:40px!important;max-height:40px!important;overflow:hidden!important;font-size:16px!important}"
  + ".patina-form-modal #patinaF_descripcion{height:48px!important;min-height:48px!important;max-height:48px!important;overflow:hidden!important;font-size:16px!important;resize:none!important;white-space:pre-wrap!important}"
  + ".patina-form-modal #patinaF_precio, .patina-form-modal #patinaF_precioOferta{height:38px!important;min-height:38px!important;max-height:38px!important;padding:7px 10px!important;font-size:16px!important;line-height:1.2!important;border-radius:12px!important;box-sizing:border-box!important}"
  + ".patina-form-modal #patinaF_categoria,.patina-form-modal #patinaF_stock{height:38px!important;min-height:38px!important}"
  + ".patina-form-modal #patinaF_nuevaCategoria{height:38px!important;min-height:38px!important}"
  + ".patina-foto{display:flex!important;align-items:center!important;gap:8px!important;height:40px!important;min-height:40px!important;max-height:40px!important;overflow:hidden!important;padding:4px 10px!important;flex-shrink:0!important;margin:2px 0!important}"
  + ".patina-foto-ico{width:30px!important;height:30px!important;min-width:30px!important;min-height:30px!important;flex-shrink:0!important}"
  + ".patina-foto-ico img{width:100%!important;height:100%!important;object-fit:cover!important}"
  + ".patina-foto span{line-height:1.2!important;font-size:11px!important}"
  + "#patinaFotoTxt{font-size:11px!important;white-space:nowrap!important}"
  + ".patina-preview-line{font-size:10px!important;line-height:1.2!important;margin:3px 0 0!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}"
  + ".patina-form-btns{position:static!important;bottom:auto!important;background:transparent!important;background-color:transparent!important;padding:8px 0 0!important;margin-top:6px!important;box-shadow:none!important;border:none!important;display:flex!important;gap:8px!important;width:100%!important;flex-shrink:0!important}"
  + ".patina-form-btns button{flex:1 1 0!important;min-width:0!important;white-space:nowrap!important;padding:10px 6px!important;font-size:14px!important;height:42px!important;min-height:42px!important}"
  + ".patina-visible-row,.patina-form-modal .visible-row{margin:4px 0 0!important;flex-shrink:0!important}"
  + ".patina-cat-new{width:100%!important;flex-shrink:0!important}"
  + ".patina-form-modal .patina-row{display:flex!important;gap:8px!important;width:100%!important;flex-shrink:0!important}"
  + ".patina-form-modal h3,.patina-form-modal .patina-form-title{margin:0 0 2px!important;font-size:18px!important;line-height:1.1!important;flex-shrink:0!important}"
  + ".patina-form-modal .patina-form-sub{margin:0 0 4px!important;font-size:11px!important;line-height:1.2!important;flex-shrink:0!important}"
  + ".patina-form-modal #patinaBtnNuevaCat,.patina-form-modal #patinaBtnAgregarCat{height:34px!important;min-height:34px!important;padding:6px!important;font-size:12px!important;flex-shrink:0!important}";
  var s=document.createElement('style'); s.textContent=css; document.head.appendChild(s);
  try{
    document.addEventListener('click', function(e){
      var btn=e.target.closest('button, [role="button"], a');
      if(!btn) return;
      if(btn.closest('#patinaFormModal')) return;
      if(btn.closest('[class*="product-modal"], [class*="detalle"], [class*="detail"], [class*="cantidad"], [class*="qty"]')) return;
      var txt=(btn.textContent||'').trim();
      if(txt==='+' || txt==='-' || txt==='＋' || txt==='－') return;
      if(txt.toLowerCase().indexOf('agregar')!==-1 || txt.toLowerCase().indexOf('comprar')!==-1 || txt.toLowerCase().indexOf('a\u00f1adir')!==-1) return;
      var cls=(btn.className||'').toLowerCase();
      var parentCls=((btn.parentElement && btn.parentElement.className)||'').toLowerCase();
      var esPildora = cls.indexOf('cat')!==-1 || cls.indexOf('pill')!==-1 || cls.indexOf('categoria')!==-1 || parentCls.indexOf('cat')!==-1 || parentCls.indexOf('pill')!==-1 || parentCls.indexOf('categoria')!==-1 || btn.getAttribute('data-cat') || btn.getAttribute('data-categoria');
      if(!esPildora) return;
      var grids=document.querySelectorAll('#patinaGrid, .patina-grid, .patina-products');
      if(!grids.length) grids=document.querySelectorAll('[class*="grid"]');
      grids.forEach(function(g){ g.classList.add('patina-grid-cambiando'); setTimeout(function(){ g.classList.remove('patina-grid-cambiando'); }, 260); });
    }, true);
  }catch(e){}
  try{
    if(window.visualViewport){
      window.visualViewport.addEventListener('resize', function(){
        var m=document.getElementById('patinaFormModal');
        if(m && document.getElementById('patinaFormOverlay') && document.getElementById('patinaFormOverlay').classList.contains('open')){
          m.style.maxHeight=(window.visualViewport.height - 16)+'px';
        }
      });
    }
  }catch(e){}
  function fixAll(){
    try{
      var modal=document.getElementById('patinaFormModal');
      if(modal){
        var labels=modal.querySelectorAll('label');
        var etiLabel=null, desLabel=null, etiInput=null, desInput=null;
        labels.forEach(function(l){
          var t=(l.textContent||'').toUpperCase();
          if(t.indexOf('ETIQUETA')!==-1) etiLabel=l;
          if(t.indexOf('DESCRIPCI')!==-1) desLabel=l;
        });
        var inputs=modal.querySelectorAll('input, textarea');
        inputs.forEach(function(inp){
          var ph=(inp.placeholder||'').toUpperCase();
          if(ph.indexOf('IMAGEN ILUSTRATIVA')!==-1 || ph.indexOf('ETIQUETA')!==-1) etiInput=inp;
          if(ph.indexOf('DESCRIPCION')!==-1 || ph.indexOf('DESCRIPCI')!==-1) desInput=inp;
        });
        if(!etiInput) etiInput=document.getElementById('patinaF_etiqueta');
        if(!desInput) desInput=document.getElementById('patinaF_descripcion');
        if(etiLabel && desLabel && etiInput && desInput){
          if(desLabel.compareDocumentPosition(etiLabel) & 4){
            var pEti=etiLabel.parentElement, pDes=desLabel.parentElement;
            if(pEti && pDes && pEti!==modal && pEti===etiInput.parentElement && pDes===desInput.parentElement && pEti!==pDes){
              pDes.parentElement.insertBefore(pEti, pDes);
            } else {
              modal.insertBefore(etiLabel, desLabel);
              modal.insertBefore(etiInput, desLabel);
            }
          }
        }
      }
    }catch(e){}
    try{
      var modal2=document.getElementById('patinaFormModal');
      if(modal2){
        var preview=null;
        var all=modal2.querySelectorAll('*');
        all.forEach(function(el){ if(el.children.length===0 && el.textContent.indexOf('Se va a mostrar')!==-1) preview=el; });
        if(preview){
          preview.style.display='block'; preview.style.width='100%'; preview.style.maxWidth='100%'; preview.style.gridColumn='1 / -1';
          preview.style.fontSize='10px'; preview.style.lineHeight='1.2'; preview.style.margin='3px 0 0'; preview.style.whiteSpace='nowrap'; preview.style.overflow='hidden'; preview.style.textOverflow='ellipsis'; preview.style.textAlign='left'; preview.style.flexShrink='0';
          preview.classList.add('patina-preview-line');
          var etiLabel2=null;
          var labs2=modal2.querySelectorAll('label');
          labs2.forEach(function(l){ if((l.textContent||'').toUpperCase().indexOf('ETIQUETA')!==-1) etiLabel2=l; });
          var precioInput=document.getElementById('patinaF_precio');
          var filaPrecios=null;
          if(precioInput){
            var padreDirecto=precioInput.parentElement;
            if(padreDirecto && padreDirecto.querySelector('#patinaF_precioOferta')) filaPrecios=padreDirecto;
          }
          if(filaPrecios && filaPrecios.parentElement===modal2){
            if(preview.parentElement!==modal2 || preview.previousSibling!==filaPrecios){
              modal2.insertBefore(preview, filaPrecios.nextSibling);
            }
          } else if(etiLabel2 && preview.compareDocumentPosition(etiLabel2) & 4){
            modal2.insertBefore(preview, etiLabel2);
          }
        }
      }
    }catch(e){}
    try{
      var inputs2=document.querySelectorAll('input, textarea, select');
      inputs2.forEach(function(i){ if(i.style.fontSize!== '16px') i.style.fontSize='16px'; });
    }catch(e){}
  }
  setInterval(fixAll, 400);
  try{
    var lastTouch=0;
    document.addEventListener('touchend', function(e){
      var now=Date.now();
      if(now-lastTouch<300){ e.preventDefault(); }
      lastTouch=now;
    }, {passive:false});
  }catch(e){}
})();
// PATINA - SINCRONIZACION V12 - GOOGLE MANDA, no resucita ocultos
(function(){
  "use strict";
  var GAS_URL = "https://script.google.com/macros/s/AKfycbznKXsIvfuR_kb4UIwHk2QtjaqOlGUW9imJFjXDKfWuanUCFZOtbPLSXVlwAx8mr_I2UQ/exec";
  try{ var saved=localStorage.getItem("patina_gas_url_v1"); if(saved) GAS_URL=saved; }catch(e){}
  var KEY='patina_v25_admin';
  var CATS_KEY='patina_v25_cats';
  function getLocal(){ try{ var raw=localStorage.getItem(KEY); if(!raw) return []; var a=JSON.parse(raw); return Array.isArray(a)?a:[]; }catch(e){ return []; } }
  function saveLocal(arr){ try{ localStorage.setItem(KEY, JSON.stringify(arr)); }catch(e){} }
  function normId(id){ return String(id||'').padStart(4,'0'); }
  function normVisible(v){ if(v===false || v==='false' || v==='FALSE' || v===0 || v==='0' || v==='no' || v==='NO') return false; return true; }
  function dedupe(arr){ var seen={}, out=[]; arr.forEach(function(d){ var id=normId(d.id); if(seen[id]) return; seen[id]=1; d.id=id; if('visible' in d) d.visible=normVisible(d.visible); out.push(d); }); out.sort(function(a,b){ return String(a.id).localeCompare(String(b.id)); }); return out; }
  function stripFoto(arr){ return arr.map(function(d){ var c={}; for(var k in d){ c[k]=d[k]; } if(typeof c.foto==='string' && c.foto.length>48000) c.foto=''; return c; }); }
  var lastPushed='';
  function postNow(){
    var loc=getLocal(); if(!loc.length) return;
    var payload={action:'save_all', productos: stripFoto(loc), categorias: [], password:'PATINA2026'};
    try{ var cats=localStorage.getItem(CATS_KEY); if(cats) payload.categorias=JSON.parse(cats); }catch(e){}
    var sig=JSON.stringify(payload.productos);
    if(sig===lastPushed) return;
    lastPushed=sig;
    fetch(GAS_URL,{method:'POST', body: JSON.stringify(payload)}).catch(function(){ lastPushed=''; });
  }
  // Vigia: si cambias algo en Admin (nombre, foto, visible, precio), lo sube solo a Google en 2 segundos
  var lastLocal='';
  setInterval(function(){
    try{
      var cur=localStorage.getItem(KEY)||'';
      if(cur && cur!==lastLocal){
        // Si es la primera vez, solo guardar referencia, no subir lo viejo del celu por encima de Google
        if(lastLocal==='' && localStorage.getItem('patina_v12_synced')!=='1'){
          lastLocal=cur;
          return;
        }
        lastLocal=cur;
        setTimeout(postNow, 1500);
      }
    }catch(e){}
  }, 2000);
  function getFromGAS(){
    if(document.getElementById('patinaAdminOverlay') && document.getElementById('patinaAdminOverlay').classList.contains('open')) return;
    if(document.getElementById('patinaFormOverlay') && document.getElementById('patinaFormOverlay').classList.contains('open')) return;
    if(document.activeElement && (document.activeElement.tagName==='INPUT' || document.activeElement.tagName==='TEXTAREA')) return;
    fetch(GAS_URL).then(function(r){ return r.json(); }).then(function(gas){
      if(!Array.isArray(gas) || !gas.length) return;
      var loc=getLocal(); var defs=window.__patinaAdminDefaults||[];
      // GOOGLE MANDA: lo que viene de Google reemplaza lo local, incluido visible=false, nombre y detalle.
      var gasClean=dedupe(gas);
      // Preservar foto local solo si Google viene sin foto (porque Google recorta fotos muy grandes)
      var fotoMap={}; dedupe(loc).forEach(function(d){ if(d.foto) fotoMap[d.id]=d.foto; });
      gasClean.forEach(function(d){ if(!d.foto && fotoMap[d.id]) d.foto=fotoMap[d.id]; });
      var locClean=dedupe(loc);
      // Si Google tiene los mismos productos pero con cambios (visible, nombre, precio), aplicarlos aunque la cantidad sea igual
      if(JSON.stringify(gasClean)!==JSON.stringify(locClean)){
        saveLocal(gasClean);
        lastLocal=JSON.stringify(gasClean);
        lastPushed=JSON.stringify(stripFoto(gasClean));
        try{ localStorage.setItem('patina_v12_synced','1'); }catch(e){}
        try{ if(window.patinaRefrescarTienda) window.patinaRefrescarTienda(); }catch(e){}
      } else {
        try{ localStorage.setItem('patina_v12_synced','1'); }catch(e){}
      }
    }).catch(function(){});
  }
  setTimeout(getFromGAS, 1500);
  setInterval(getFromGAS, 15000);
  window.patinaPostNow=postNow;
})();
