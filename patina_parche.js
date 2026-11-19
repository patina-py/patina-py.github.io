// FIX FINAL V8 - ETIQUETA arriba + TRANSICION PILDORAS universal + verifica version en consola
(function(){
  console.log('PATINA V8 CARGADO - si ves esto, el archivo nuevo si esta activo');
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
  // TRANSICION UNIVERSAL EN PILDORAS: agarra cualquier boton de categorias, no importa el nombre de la clase
  + "button{ transition:transform .25s ease, background-color .25s ease, opacity .25s ease!important }"
  + "button:active{ transform:scale(.96)!important }"
  // Grilla de productos con fade - busca por varias clases posibles
  + "#patinaGrid, .patina-grid, .patina-products, [class*='product'], [class*='grid']{ transition:opacity .22s ease, transform .22s ease!important }"
  + ".patina-grid-cambiando{ opacity:0!important; transform:translateY(6px)!important }"
  + "#patinaFormOverlay:not(.open):not([class*='open']){ display:none!important; visibility:hidden!important; pointer-events:none!important }"
  + "#patinaFormOverlay.open, #patinaFormOverlay[class*='open']{ display:flex!important; visibility:visible!important; pointer-events:auto!important; position:fixed!important; inset:0!important; align-items:center!important; justify-content:center!important; padding:8px!important; overflow:hidden!important }"
  + ".patina-form-modal{width:100%!important;max-width:520px!important;height:auto!important;max-height:calc(100dvh - 16px)!important;overflow:hidden!important;overflow-y:hidden!important;padding:10px 12px 10px!important;gap:0!important;border-radius:20px!important;display:flex!important;flex-direction:column!important}"
  + ".patina-form-modal label{margin:4px 0 2px!important;font-size:9px!important;letter-spacing:.08em!important;line-height:1!important;flex-shrink:0!important}"
  + ".patina-form-modal input,.patina-form-modal textarea,.patina-form-modal select{padding:7px 10px!important;font-size:16px!important;line-height:1.2!important;flex-shrink:0!important;border-radius:12px!important}"
  + ".patina-form-modal #patinaF_nombre{height:38px!important;min-height:38px!important}"
  + ".patina-form-modal #patinaF_etiqueta{height:40px!important;min-height:40px!important;max-height:40px!important;overflow:hidden!important;font-size:16px!important}"
  + ".patina-form-modal #patinaF_descripcion{height:48px!important;min-height:48px!important;max-height:48px!important;overflow:hidden!important;font-size:16px!important;resize:none!important;white-space:pre-wrap!important}"
  + ".patina-form-modal #patinaF_precio,.patina-form-modal #patinaF_precioOferta{height:38px!important;min-height:38px!important}"
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
  // TRANSICION PILDORAS UNIVERSAL: cualquier boton que este fuera del modal y que cambie la grilla
  try{
    document.addEventListener('click', function(e){
      var btn=e.target.closest('button, [role="button"], a');
      if(!btn) return;
      if(btn.closest('#patinaFormModal')) return;
      // Si el boton esta en la zona de categorias o tiene texto de categoria, animar
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
    // ETIQUETA ARRIBA - version universal: busca por texto, no por ID
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
        // Buscar inputs por placeholder o por cercania al label
        var inputs=modal.querySelectorAll('input, textarea');
        inputs.forEach(function(inp){
          var ph=(inp.placeholder||'').toUpperCase();
          if(ph.indexOf('IMAGEN ILUSTRATIVA')!==-1 || ph.indexOf('ETIQUETA')!==-1) etiInput=inp;
          if(ph.indexOf('DESCRIPCION')!==-1 || ph.indexOf('DESCRIPCI')!==-1) desInput=inp;
        });
        if(!etiInput) etiInput=document.getElementById('patinaF_etiqueta');
        if(!desInput) desInput=document.getElementById('patinaF_descripcion');
        if(etiLabel && desLabel && etiInput && desInput){
          // Si DESCRIPCION esta antes que ETIQUETA, mover ETIQUETA (label+input) antes de DESCRIPCION
          if(desLabel.compareDocumentPosition(etiLabel) & 4){
            // Caso wrappers: si comparten padre distinto al modal, mover wrappers
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
      var all=document.querySelectorAll('#patinaFormModal *');
      all.forEach(function(el){
        if(el.children.length===0 && el.textContent.indexOf('Se va a mostrar')!==-1){
          el.style.display='block'; el.style.width='100%'; el.style.maxWidth='100%'; el.style.gridColumn='1 / -1';
          el.style.fontSize='10px'; el.style.lineHeight='1.2'; el.style.margin='3px 0 0'; el.style.whiteSpace='nowrap'; el.style.overflow='hidden'; el.style.textOverflow='ellipsis'; el.style.textAlign='left'; el.style.flexShrink='0';
          el.classList.add('patina-preview-line');
          var modal2=document.getElementById('patinaFormModal');
          var desLabel2=null;
          var labs2=document.querySelectorAll('#patinaFormModal label');
          labs2.forEach(function(l){ if(l.textContent.indexOf('Descripci')!==-1) desLabel2=l; });
          if(modal2 && desLabel2 && el.parentElement!==modal2){ modal2.insertBefore(el, desLabel2); }
        }
      });
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
// PATINA - Parche sincronizacion - GitHub Pages + Google Apps Script
(function(){
  "use strict";
  var GAS_URL = "https://script.google.com/macros/s/AKfycbznKXsIvfuR_kb4UIwHk2QtjaqOlGUW9imJFjXDKfWuanUCFZOtbPLSXVlwAx8mr_I2UQ/exec";
  try{ var saved=localStorage.getItem("patina_gas_url_v1"); if(saved) GAS_URL=saved; }catch(e){}
  var KEY='patina_v25_admin';
  var CATS_KEY='patina_v25_cats';
  function getLocal(){ try{ var raw=localStorage.getItem(KEY); if(!raw) return []; var a=JSON.parse(raw); return Array.isArray(a)?a:[]; }catch(e){ return []; } }
  function saveLocal(arr){ try{ localStorage.setItem(KEY, JSON.stringify(arr)); }catch(e){} }
  function normId(id){ return String(id||'').padStart(4,'0'); }
  function dedupe(arr){ var seen={}, out=[]; arr.forEach(function(d){ var id=normId(d.id); if(seen[id]) return; seen[id]=1; d.id=id; out.push(d); }); out.sort(function(a,b){ return String(a.id).localeCompare(String(b.id)); }); return out; }
  function stripFoto(arr){ return arr.map(function(d){ var c={}; for(var k in d){ c[k]=d[k]; } if(typeof c.foto==='string' && c.foto.length>48000) c.foto=''; return c; }); }
  function postNow(){
    var loc=getLocal(); if(!loc.length) return;
    var payload={action:'save_all', productos: stripFoto(loc), categorias: [], password:'PATINA2026'};
    try{ var cats=localStorage.getItem(CATS_KEY); if(cats) payload.categorias=JSON.parse(cats); }catch(e){}
    fetch(GAS_URL,{method:'POST', body: JSON.stringify(payload)}).catch(function(){});
  }
  function getFromGAS(){
    if(document.getElementById('patinaAdminOverlay') && document.getElementById('patinaAdminOverlay').classList.contains('open')) return;
    if(document.getElementById('patinaFormOverlay') && document.getElementById('patinaFormOverlay').classList.contains('open')) return;
    if(document.activeElement && (document.activeElement.tagName==='INPUT' || document.activeElement.tagName==='TEXTAREA')) return;
    fetch(GAS_URL).then(function(r){ return r.json(); }).then(function(gas){
      if(!Array.isArray(gas) || !gas.length) return;
      var loc=getLocal(); var defs=window.__patinaAdminDefaults||[];
      if(!loc.length && defs.length){ loc=dedupe(defs); saveLocal(loc); setTimeout(postNow, 300); return; }
      var gasClean=dedupe(gas); var locClean=dedupe(loc);
      var fotoMap={}; locClean.forEach(function(d){ if(d.foto) fotoMap[d.id]=d.foto; });
      gasClean.forEach(function(d){ if(fotoMap[d.id] && !d.foto) d.foto=fotoMap[d.id]; });
      if(gasClean.length < locClean.length){ setTimeout(postNow, 300); setTimeout(postNow, 2000); return; }
      if(gasClean.length > locClean.length || JSON.stringify(gasClean)!==JSON.stringify(locClean)){
        saveLocal(gasClean);
        try{ if(window.patinaRefrescarTienda) window.patinaRefrescarTienda(); }catch(e){}
      }
    }).catch(function(){});
  }
  try{ var l0=getLocal(); var d0=window.__patinaAdminDefaults||[]; if(d0.length && l0.length < d0.length){ var merged=dedupe(l0.concat(d0)); if(merged.length>=d0.length){ saveLocal(merged); setTimeout(postNow, 500); } } }catch(e){}
  setTimeout(getFromGAS, 1500);
  setInterval(getFromGAS, 15000);
  window.patinaPostNow=postNow;
})();
