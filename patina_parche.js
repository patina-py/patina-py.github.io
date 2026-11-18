// FIX MODAL CELULAR V2 - foto chica sin encimar, etiqueta arriba, botones abajo
(function(){
  var css = ".patina-form-modal{max-height:86dvh!important;overflow-y:auto!important;padding:14px 14px calc(14px + env(safe-area-inset-bottom, 0px))!important;gap:6px!important} .patina-form-modal label{margin:5px 0 3px!important;font-size:10px!important} .patina-form-modal input,.patina-form-modal textarea,.patina-form-modal select{padding:8px 10px!important;font-size:13px!important} .patina-form-modal #patinaF_etiqueta{min-height:52px!important} .patina-form-modal #patinaF_descripcion{min-height:64px!important} .patina-foto{display:flex!important;align-items:center!important;gap:10px!important;height:52px!important;min-height:52px!important;max-height:52px!important;overflow:hidden!important;padding:6px 10px!important} .patina-foto-ico{width:36px!important;height:36px!important;min-width:36px!important;min-height:36px!important;flex-shrink:0!important} .patina-foto-ico img{width:100%!important;height:100%!important;object-fit:cover!important} .patina-foto span{line-height:1.25!important} #patinaFotoTxt{font-size:11px!important;white-space:nowrap!important} .patina-form-btns{position:sticky!important;bottom:0!important;background:#121212!important;padding-top:8px!important;z-index:10!important;margin-top:10px!important} .patina-form-btns button{padding:11px!important}";
  var s=document.createElement('style'); s.textContent=css; document.head.appendChild(s);
  setInterval(function(){
    var eti=document.getElementById('patinaF_etiqueta');
    var des=document.getElementById('patinaF_descripcion');
    if(!eti || !des) return;
    var etiLabel=null, desLabel=null;
    var labs=document.querySelectorAll('#patinaFormModal label');
    labs.forEach(function(l){ if(l.textContent.indexOf('Etiqueta')!==-1) etiLabel=l; if(l.textContent.indexOf('Descripción')!==-1) desLabel=l; });
    if(etiLabel && desLabel && (desLabel.compareDocumentPosition(etiLabel) & 4)){
      var modal=document.getElementById('patinaFormModal');
      modal.insertBefore(etiLabel, desLabel);
      modal.insertBefore(eti, desLabel);
    }
  }, 500);
})();
// PÁTINA - Parche sincronización CAVI - FIX ANTI-BUCLE
// GitHub Pages + Google Apps Script
(function(){
  "use strict";
  var GAS_URL = "https://script.google.com/macros/s/AKfycbwzKXvI5vFuR_kb4U1wHk2QtjaqO1GWm9im9FJX3DKFwuanUCFZ0bPLSXV1wAx8mr_I2UQ/exec";
  try{ var saved=localStorage.getItem("patina_gas_url_v1"); if(saved) GAS_URL=saved; }catch(e){}
  var KEY='patina_v25_admin';
  var CATS_KEY='patina_v25_cats';
  function getLocal(){
    try{
      var raw=localStorage.getItem(KEY);
      if(!raw) return [];
      var a=JSON.parse(raw);
      return Array.isArray(a)?a:[];
    }catch(e){ return []; }
  }
  function saveLocal(arr){ try{ localStorage.setItem(KEY, JSON.stringify(arr)); }catch(e){} }
  function normId(id){ return String(id||'').padStart(4,'0'); }
  function dedupe(arr){
    var seen={}, out=[];
    arr.forEach(function(d){
      var id=normId(d.id);
      if(seen[id]) return; seen[id]=1;
      d.id=id; out.push(d);
    });
    out.sort(function(a,b){ return String(a.id).localeCompare(String(b.id)); });
    return out;
  }
  function stripFoto(arr){
    return arr.map(function(d){
      var c={}; for(var k in d){ c[k]=d[k]; }
      if(typeof c.foto==='string' && c.foto.length>48000) c.foto='';
      return c;
    });
  }
  function postNow(){
    var loc=getLocal();
    if(!loc.length) return;
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
      var loc=getLocal();
      var defs=window.__patinaAdminDefaults||[];
      // Si local está vacío, usar defaults 35 y no pisar con Google roto
      if(!loc.length && defs.length){
        loc=dedupe(defs);
        saveLocal(loc);
        setTimeout(postNow, 300);
        return;
      }
      var gasClean=dedupe(gas);
      var locClean=dedupe(loc);
      // Preservar fotos locales: Google trae foto vacía, no pisar la foto local
      var fotoMap={};
      locClean.forEach(function(d){ if(d.foto) fotoMap[d.id]=d.foto; });
      gasClean.forEach(function(d){ if(fotoMap[d.id] && !d.foto) d.foto=fotoMap[d.id]; });
      if(gasClean.length < locClean.length){
        setTimeout(postNow, 300);
        setTimeout(postNow, 2000);
        return;
      }
      if(gasClean.length > locClean.length || JSON.stringify(gasClean)!==JSON.stringify(locClean)){
        saveLocal(gasClean);
        try{ if(window.patinaRefrescarTienda) window.patinaRefrescarTienda(); }catch(e){}
        try{ var ev=new Event('patina-sync'); window.dispatchEvent(ev); }catch(e){}
      }
    }).catch(function(){});
  }
  // Restaurar 35 si local quedó chico
  try{
    var l0=getLocal();
    var d0=window.__patinaAdminDefaults||[];
    if(d0.length && l0.length < d0.length){
      var merged=dedupe(l0.concat(d0));
      if(merged.length>=d0.length){ saveLocal(merged); setTimeout(postNow, 500); }
    }
  }catch(e){}
  setTimeout(getFromGAS, 1500);
  setInterval(getFromGAS, 15000);
  window.patinaPostNow=postNow;
})();