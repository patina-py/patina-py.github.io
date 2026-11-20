// PATINA V24 - V23 + BOTONES ABAJO + NUMERACION #0001-#0035 SIN #0000. Solo CSS/order fix, sin mover nodos.
(function(){
  console.log('PATINA V24 CARGADO');
  try{
    var meta=document.querySelector('meta[name="viewport"]');
    if(!meta){ meta=document.createElement('meta'); meta.setAttribute('name','viewport'); document.head.appendChild(meta); }
    meta.setAttribute('content','width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover');
  }catch(e){}
  var css=""
  + "html{-webkit-text-size-adjust:100%!important;touch-action:manipulation!important}"
  + "input,textarea,select{font-size:16px!important}"
  + ".patina-stock-msg{font-size:11px!important;color:#E8D5B5!important;margin-top:4px!important;text-align:center!important}"
  + "#patinaFormModal [style*='dashed'], #patinaFormModal [class*='foto'], #patinaFormModal [class*='Foto']{max-height:44px!important;min-height:44px!important;height:44px!important;overflow:hidden!important;padding:4px 10px!important;display:flex!important;align-items:center!important;gap:8px!important}"
  + "#patinaFormModal #patinaF_etiqueta{height:40px!important;max-height:40px!important}"
  + "#patinaFormModal #patinaF_descripcion{height:48px!important;max-height:48px!important}";
  var s=document.createElement('style'); s.textContent=css; document.head.appendChild(s);
  function normName(n){ return String(n||'').toLowerCase().trim().replace(/\s+/g,' '); }
  function getAdmin(){ try{ var r=localStorage.getItem('patina_v25_admin'); if(!r) return []; var a=JSON.parse(r); return Array.isArray(a)?a:[]; }catch(e){ return []; } }
  function getDeleted(){ try{ var r=localStorage.getItem('patina_deleted_v1'); if(!r) return []; var a=JSON.parse(r); return Array.isArray(a)?a:[]; }catch(e){ return []; } }
  function markDeleted(nombre){ try{ var arr=getDeleted(); var n=normName(nombre); arr=arr.filter(function(x){ return normName(x.nombre)!==n; }); arr.push({nombre:n, ts:Date.now()}); localStorage.setItem('patina_deleted_v1', JSON.stringify(arr.slice(-20))); }catch(e){} }
  function isDeleted(nombre){ var arr=getDeleted(); var n=normName(nombre); var now=Date.now(); for(var i=0;i<arr.length;i++){ if(normName(arr[i].nombre)===n && (now-(arr[i].ts||0))<10*60*1000) return true; } return false; }
  try{
    document.addEventListener('click', function(e){
      var btn=e.target.closest('button, [role="button"], a'); if(!btn) return;
      var txt=(btn.textContent||'').trim().toLowerCase();
      if(txt.indexOf('borrar')===-1 && txt.indexOf('eliminar')===-1) return;
      var card=btn.closest('[class*="product"], [class*="card"], [class*="item"], tr, li, div');
      if(card){ var heads=card.querySelectorAll('h1,h2,h3,h4,[class*="name"],[class*="title"],strong,b'); for(var i=0;i<heads.length;i++){ var t=(heads[i].textContent||'').trim(); if(t && t.length>1 && t.length<80){ markDeleted(t); break; } } }
    }, true);
  }catch(e){}
  function stockDe(nombre){
    var arr=getAdmin(); var n=normName(nombre);
    for(var i=0;i<arr.length;i++){ if(normName(arr[i].nombre||arr[i].name)===n){ var st=arr[i].stock; if(st===null||st===undefined||st===''||String(st).toLowerCase().indexOf('sin')!==-1) return 999; var num=parseInt(st,10); if(isNaN(num)) return 999; return num; } }
    return 999;
  }
  function igualarPorTexto(){
    try{
      var labels=document.querySelectorAll('label, span, div, p');
      var l1=null, l2=null;
      labels.forEach(function(l){ if(l.children.length>0) return; var t=(l.textContent||'').trim().toUpperCase(); if(t==='PRECIO') l1=l; if(t==='PRECIO OFERTA') l2=l; });
      if(!l1||!l2) return;
      function inputDe(label){
        var fid=label.getAttribute('for'); if(fid){ var el=document.getElementById(fid); if(el) return el; }
        var sib=label.nextElementSibling; while(sib){ if(sib.tagName==='INPUT'||sib.tagName==='SELECT') return sib; if(sib.querySelector){ var inner=sib.querySelector('input, select'); if(inner) return inner; } sib=sib.nextElementSibling; }
        var padre=label.parentElement; if(padre){ var inp=padre.querySelector('input, select'); if(inp) return inp; }
        return null;
      }
      var p1=inputDe(l1), p2=inputDe(l2); if(!p1||!p2) return;
      [p1,p2].forEach(function(el){
        el.style.setProperty('width','100%','important');
        el.style.setProperty('height','38px','important');
        el.style.setProperty('min-height','38px','important');
        el.style.setProperty('max-height','38px','important');
        el.style.setProperty('padding','0 10px','important');
        el.style.setProperty('font-size','16px','important');
        el.style.setProperty('line-height','38px','important');
        el.style.setProperty('border-radius','12px','important');
        el.style.setProperty('box-sizing','border-box','important');
        var padre=el.parentElement;
        if(padre){
          padre.style.setProperty('flex','1 1 0','important');
          padre.style.setProperty('min-width','0','important');
          padre.style.setProperty('width','50%','important');
          padre.style.setProperty('max-width','50%','important');
          padre.style.setProperty('box-sizing','border-box','important');
          padre.style.setProperty('padding','0','important');
          var fila=padre.parentElement;
          if(fila){ fila.style.setProperty('display','flex','important'); fila.style.setProperty('gap','8px','important'); fila.style.setProperty('width','100%','important'); }
        }
      });
    }catch(e){}
  }
  // V24 FIX BOTONES: ETIQUETA 7-8, DESCRIPCION 9-10, BOTONES 20-21 (abajo de todo). Sin mover nodos.
  function ordenarVisual(){
    try{
      var modal=document.getElementById('patinaFormModal');
      if(!modal) return;
      if(getComputedStyle(modal).display!=='flex'){
        modal.style.setProperty('display','flex','important');
        modal.style.setProperty('flex-direction','column','important');
      }
      var labels=modal.querySelectorAll('label, span, div, p');
      var etiLabel=null, desLabel=null;
      labels.forEach(function(l){
        if(l.children.length>0) return;
        var t=(l.textContent||'').trim().toUpperCase();
        if(t.indexOf('ETIQUETA')!==-1) etiLabel=l;
        if(t.indexOf('DESCRIPCI')!==-1) desLabel=l;
      });
      if(!etiLabel || !desLabel) return;
      function inputDe(label){
        var fid=label.getAttribute('for'); if(fid){ var el=document.getElementById(fid); if(el) return el; }
        var sib=label.nextElementSibling; while(sib){ if(sib.tagName==='INPUT'||sib.tagName==='TEXTAREA') return sib; if(sib.querySelector){ var inner=sib.querySelector('input, textarea'); if(inner) return inner; } sib=sib.nextElementSibling; }
        return null;
      }
      var etiInput=inputDe(etiLabel);
      var desInput=inputDe(desLabel);
      if(etiLabel){ etiLabel.style.setProperty('order','7','important'); }
      if(etiInput){ etiInput.style.setProperty('order','8','important'); }
      if(desLabel){ desLabel.style.setProperty('order','9','important'); }
      if(desInput){ desInput.style.setProperty('order','10','important'); }
      // Botones abajo de todo
      modal.querySelectorAll('button').forEach(function(b){
        var t=(b.textContent||'').trim().toLowerCase();
        if(t==='agregar' || t==='guardar' || t==='cancelar'){
          b.style.setProperty('order','20','important');
          var padre=b.parentElement;
          if(padre){ padre.style.setProperty('order','20','important'); padre.style.setProperty('display','flex','important'); padre.style.setProperty('gap','8px','important'); }
        }
        if(t==='x' || t==='×'){ b.style.setProperty('order','0','important'); }
      });
      // Visible switch queda antes de botones
      var visibleEls=modal.querySelectorAll('*');
      visibleEls.forEach(function(el){
        if(el.children.length===0 && (el.textContent||'').indexOf('Visible en la tienda')!==-1){
          var p=el.parentElement; if(p) p.style.setProperty('order','6','important');
          el.style.setProperty('order','6','important');
        }
      });
    }catch(e){}
  }
  function clampDetalle(){
    try{
      var modales=document.querySelectorAll('[class*="modal"], [class*="Modal"], [id*="modal"], [id*="Modal"]');
      modales.forEach(function(modal){
        if(!modal || !modal.offsetHeight) return;
        if(modal.id && (modal.id.toLowerCase().indexOf('form')!==-1 || modal.id.toLowerCase().indexOf('admin')!==-1)) return;
        if(modal.className && (String(modal.className).toLowerCase().indexOf('form')!==-1 || String(modal.className).toLowerCase().indexOf('admin')!==-1)) return;
        var btnMas=null, qtyEl=null;
        modal.querySelectorAll('button, [role="button"]').forEach(function(b){ if((b.textContent||'').trim()==='+') btnMas=b; });
        if(!btnMas) return;
        var parent=btnMas.parentElement;
        if(parent){ parent.querySelectorAll('span, div, input').forEach(function(n){ var v=(n.tagName==='INPUT'? n.value : n.textContent||'').trim(); if(/^\d+$/.test(v) && n!==btnMas) qtyEl=n; }); }
        if(!qtyEl) return;
        var titulo=modal.querySelector('h1,h2,h3,[class*="title"],[class*="name"]');
        var nombre=titulo ? titulo.textContent.trim() : ''; if(!nombre) return;
        var stock=stockDe(nombre); if(stock>=999) return;
        var qty=parseInt(qtyEl.tagName==='INPUT'? qtyEl.value : qtyEl.textContent,10); if(isNaN(qty)) qty=1;
        if(qty>stock){ if(qtyEl.tagName==='INPUT') qtyEl.value=stock; else qtyEl.textContent=String(stock); qty=stock; }
        if(qty>=stock){ btnMas.style.setProperty('opacity','0.35','important'); btnMas.style.setProperty('pointer-events','none','important'); }
        else { btnMas.style.setProperty('opacity','1','important'); btnMas.style.setProperty('pointer-events','auto','important'); }
        var msg=modal.querySelector('.patina-stock-msg');
        if(!msg && parent){ msg=document.createElement('div'); msg.className='patina-stock-msg'; parent.parentElement.appendChild(msg); }
        if(msg){ msg.textContent = stock<=0 ? 'Sin stock' : 'Solo quedan ' + stock + ' unidades'; msg.style.display='block'; }
      });
    }catch(e){}
  }
  var scrollGuardado=0, modalAbierto=false;
  try{
    document.addEventListener('click', function(e){
      var card=e.target.closest('[class*="product"], [class*="card"], [data-id]');
      var cierre=e.target.closest('button, [role="button"], a');
      var txtCierre=cierre ? (cierre.textContent||'').trim().toLowerCase() : '';
      var esX=cierre && (txtCierre==='x' || txtCierre==='×' || txtCierre.indexOf('cerrar')!==-1 || txtCierre.indexOf('volver')!==-1);
      if(card && !e.target.closest('#patinaAdminOverlay') && !e.target.closest('#patinaFormModal')){ scrollGuardado=window.scrollY||0; modalAbierto=true; }
      if(esX && modalAbierto){ setTimeout(function(){ window.scrollTo(0, scrollGuardado); modalAbierto=false; }, 80); }
    }, true);
  }catch(e){}
  setInterval(function(){ igualarPorTexto(); ordenarVisual(); clampDetalle(); }, 400);
})();
(function(){
  "use strict";
  var GAS_URL="https://script.google.com/macros/s/AKfycbznKXsIvfuR_kb4UIwHk2QtjaqOlGUW9imJFjXDKfWuanUCFZOtbPLSXVlwAx8mr_I2UQ/exec";
  try{ var saved=localStorage.getItem("patina_gas_url_v1"); if(saved) GAS_URL=saved; }catch(e){}
  var KEY='patina_v25_admin';
  function getLocal(){ try{ var r=localStorage.getItem(KEY); if(!r) return []; var a=JSON.parse(r); return Array.isArray(a)?a:[]; }catch(e){ return []; } }
  function saveLocal(arr){ try{ localStorage.setItem(KEY, JSON.stringify(arr)); }catch(e){} }
  function normName(n){ return String(n||'').toLowerCase().trim().replace(/\s+/g,' '); }
  function normVisible(v){ if(v===false||v==='false'||v===0||v==='0'||v==='no') return false; return true; }
  function getDeleted(){ try{ var r=localStorage.getItem('patina_deleted_v1'); if(!r) return []; var a=JSON.parse(r); return Array.isArray(a)?a:[]; }catch(e){ return []; } }
  function isDeleted(nombre){ var arr=getDeleted(); var n=normName(nombre); var now=Date.now(); for(var i=0;i<arr.length;i++){ if(normName(arr[i].nombre)===n && (now-(arr[i].ts||0))<10*60*1000) return true; } return false; }
  // V24 FIX NUMERACION: si id viene vacio o 0000, renumerar 0001..0035 por orden. Si viene valido, respetarlo.
  function cleanByName(arr){
    var map={}; var order=[];
    arr.forEach(function(d){
      var key=normName(d.nombre||d.name||''); if(!key) return; if(isDeleted(key)) return;
      if(!map[key]){ var c={}; for(var k in d) c[k]=d[k]; if('visible' in c) c.visible=normVisible(c.visible); map[key]=c; order.push(key); }
      else { var keep=map[key]; var dup=d; if(!keep.foto&&dup.foto) keep.foto=dup.foto; if(!keep.descripcion&&dup.descripcion) keep.descripcion=dup.descripcion; if(normVisible(dup.visible)) keep.visible=true; if(dup.stock!==undefined&&dup.stock!=='') keep.stock=dup.stock; }
    });
    var result=order.map(function(k){ return map[k]; });
    // Renumerar solo los que estan en 0000 o vacios
    var maxValid=0;
    result.forEach(function(d){ var n=parseInt(d.id,10); if(!isNaN(n) && n>0) maxValid=Math.max(maxValid,n); });
    var next=maxValid+1;
    // Si todos son 0000, empezar de 1
    var allZero=result.every(function(d){ return !d.id || String(d.id)==='0000' || parseInt(d.id,10)===0; });
    if(allZero) next=1;
    result.forEach(function(d){
      var n=parseInt(d.id,10);
      if(!d.id || String(d.id)==='0000' || isNaN(n) || n===0){
        d.id=String(next).padStart(4,'0'); next++;
      } else {
        d.id=String(n).padStart(4,'0');
      }
    });
    return result;
  }
  function stripFoto(arr){ return arr.map(function(d){ var c={}; for(var k in d) c[k]=d[k]; if(typeof c.foto==='string'&&c.foto.length>48000) c.foto=''; return c; }); }
  var lastPushed='';
  function postNow(force){
    var loc=cleanByName(getLocal()); if(!loc.length) return;
    var payload={action:'save_all', productos: stripFoto(loc), categorias: [], password:'PATINA2026'};
    try{ var cats=localStorage.getItem('patina_v25_cats'); if(cats) payload.categorias=JSON.parse(cats); }catch(e){}
    var sig=JSON.stringify(payload.productos); if(!force && sig===lastPushed) return; lastPushed=sig;
    fetch(GAS_URL,{method:'POST', body: JSON.stringify(payload)}).catch(function(){ lastPushed=''; });
  }
  var lastLocal=''; try{ lastLocal=JSON.stringify(cleanByName(getLocal())); }catch(e){}
  setInterval(function(){ try{ var cur=JSON.stringify(cleanByName(getLocal())); if(cur && cur!==lastLocal){ lastLocal=cur; setTimeout(function(){ postNow(false); }, 2000); } }catch(e){} }, 2000);
  function getFromGAS(){
    if(document.getElementById('patinaAdminOverlay') && document.getElementById('patinaAdminOverlay').classList.contains('open')) return;
    if(document.getElementById('patinaFormOverlay') && document.getElementById('patinaFormOverlay').classList.contains('open')) return;
    if(document.activeElement && (document.activeElement.tagName==='INPUT'||document.activeElement.tagName==='TEXTAREA')) return;
    fetch(GAS_URL).then(function(r){ return r.json(); }).then(function(gas){
      if(!Array.isArray(gas)||!gas.length) return;
      var loc=getLocal(); var gasClean=cleanByName(gas);
      var fotoMap={}; cleanByName(loc).forEach(function(d){ if(d.foto) fotoMap[normName(d.nombre)]=d.foto; });
      gasClean.forEach(function(d){ if(!d.foto&&fotoMap[normName(d.nombre)]) d.foto=fotoMap[normName(d.nombre)]; });
      var locClean=cleanByName(loc);
      if(JSON.stringify(gasClean)!==JSON.stringify(locClean)){
        var gasSolo=gasClean.filter(function(g){ return !locClean.some(function(l){ return normName(l.nombre||l.name)===normName(g.nombre||g.name); }); });
        var todoBorrado=gasSolo.length>0 && gasSolo.every(function(g){ return isDeleted(g.nombre||g.name); });
        if(todoBorrado){ setTimeout(function(){ postNow(true); }, 1000); return; }
        if(gasClean.length>locClean.length && locClean.length>=30){ setTimeout(function(){ postNow(true); }, 1000); return; }
        saveLocal(gasClean); lastLocal=JSON.stringify(gasClean); lastPushed=JSON.stringify(stripFoto(gasClean));
        try{ if(window.patinaRefrescarTienda) window.patinaRefrescarTienda(); }catch(e){}
      }
    }).catch(function(){});
  }
  setTimeout(getFromGAS, 1500); setInterval(getFromGAS, 15000);
  window.patinaPostNow=function(){ postNow(true); };
})();
