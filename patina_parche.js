// FIX FINAL V2 - sin cuadrado negro, sin zoom iOS, preview ancho completo, scroll ok, etiqueta arriba
(function(){
  var css = ".patina-form-modal{max-height:88dvh!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch!important;padding:14px 14px 16px!important;gap:6px!important;border-radius:20px!important} .patina-form-modal label{margin:5px 0 3px!important;font-size:11px!important} .patina-form-modal input,.patina-form-modal textarea,.patina-form-modal select{padding:9px 10px!important;font-size:16px!important} .patina-form-modal #patinaF_etiqueta{min-height:52px!important;font-size:16px!important} .patina-form-modal #patinaF_descripcion{min-height:64px!important;font-size:16px!important} .patina-foto{display:flex!important;align-items:center!important;gap:10px!important;height:52px!important;min-height:52px!important;max-height:52px!important;overflow:hidden!important;padding:6px 10px!important} .patina-foto-ico{width:36px!important;height:36px!important;min-width:36px!important;min-height:36px!important;flex-shrink:0!important} .patina-foto-ico img{width:100%!important;height:100%!important;object-fit:cover!important} .patina-foto span{line-height:1.25!important} #patinaFotoTxt{font-size:11px!important;white-space:nowrap!important} .patina-form-btns{position:sticky!important;bottom:0!important;background:transparent!important;background-color:transparent!important;padding:10px 0 0!important;z-index:10!important;margin-top:10px!important;box-shadow:none!important;border-radius:0 0 20px 20px!important} .patina-form-btns button{padding:11px!important} .patina-visible-row,.patina-form-modal .visible-row{margin-bottom:12px!important} .patina-cat-new{width:100%!important}";
  var s=document.createElement('style'); s.textContent=css; document.head.appendChild(s);
  function fixAll(){
    // 1. Etiqueta arriba de Descripcion - siempre
    try{
      var eti=document.getElementById('patinaF_etiqueta');
      var des=document.getElementById('patinaF_descripcion');
      if(eti && des){
        var labs=document.querySelectorAll('#patinaFormModal label');
        var etiLabel=null, desLabel=null;
        labs.forEach(function(l){ if(l.textContent.indexOf('Etiqueta')!==-1) etiLabel=l; if(l.textContent.indexOf('Descripci')!==-1) desLabel=l; });
        if(etiLabel && desLabel && etiLabel.compareDocumentPosition(desLabel) & 4){
          var modal=document.getElementById('patinaFormModal');
          modal.insertBefore(etiLabel, desLabel);
          modal.insertBefore(eti, desLabel);
        }
      }
    }catch(e){}
    // 2. Preview "Se va a mostrar" a ancho completo abajo de los 2 precios
    try{
      var all=document.querySelectorAll('#patinaFormModal *');
      all.forEach(function(el){
        if(el.children.length===0 && el.textContent.indexOf('Se va a mostrar')!==-1){
          el.style.display='block';
          el.style.width='100%';
          el.style.maxWidth='100%';
          el.style.gridColumn='1 / -1';
          el.style.fontSize='11px';
          el.style.lineHeight='1.35';
          el.style.margin='4px 0 2px';
          el.style.whiteSpace='normal';
          el.style.textAlign='left';
          // Si esta dentro de una columna, subirlo al contenedor del modal para que agarre todo el ancho
          var p=el.parentElement;
          if(p && p!==document.getElementById('patinaFormModal')){
            var modal=document.getElementById('patinaFormModal');
            var des2=document.getElementById('patinaF_descripcion');
            var desLabel2=null;
            var labs2=document.querySelectorAll('#patinaFormModal label');
            labs2.forEach(function(l){ if(l.textContent.indexOf('Descripci')!==-1) desLabel2=l; });
            if(modal && desLabel2 && el.parentElement!==modal){
              modal.insertBefore(el, desLabel2);
            }
          }
        }
      });
    }catch(e){}
    // 3. Sin zoom iOS: asegurar font-size 16 en todos los inputs del modal
    try{
      var inputs=document.querySelectorAll('#patinaFormModal input, #patinaFormModal textarea, #patinaFormModal select');
      inputs.forEach(function(i){ i.style.fontSize='16px'; });
    }catch(e){}
  }
  setInterval(fixAll, 400);
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
