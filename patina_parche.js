// V32 = V31 corregido: buscar modal por clase, no por id. Solo iconos + sync fotos. No toca nada mas.
(function(){
  var KEY='patina_v25_admin';
  var GAS_URL="https://script.google.com/macros/s/AKfycbznKXsIvfuR_kb4UIwHk2QtjaqOlGUW9imJFjXDKfWuanUCFZOtbPLSXVlwAx8mr_I2UQ/exec";
  try{ var saved=localStorage.getItem("patina_gas_url_v1"); if(saved) GAS_URL=saved; }catch(e){}
  function leerProds(){ try{ var v=JSON.parse(localStorage.getItem(KEY)||"[]"); if(Array.isArray(v)) return v; }catch(e){} return []; }
  function guardarProds(arr){ try{ localStorage.setItem(KEY, JSON.stringify(arr)); }catch(e){} }
  function claveNombre(p){ return String(p.nombre||p.name||'').toLowerCase().trim(); }
  function esPC(){ try{ return window.innerWidth>768; }catch(e){ return true; } }

  // SYNC FOTOS - igual que V29/V31 que ya te anda: PC sube, celu solo baja
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
        if(cambio){
          guardarProds(loc);
          try{ if(window.patinaRefrescarTienda) window.patinaRefrescarTienda(); }catch(e){}
        }
      }).catch(function(){});
    }catch(e){}
  }
  setTimeout(corregirFotosDesdeGoogle, 800);
  setInterval(corregirFotosDesdeGoogle, 15000);
  document.addEventListener('visibilitychange', function(){ if(!document.hidden) corregirFotosDesdeGoogle(); });
  window.addEventListener('focus', function(){ corregirFotosDesdeGoogle(); });

  // ICONOS - CORREGIDO: buscar por .patina-form-modal y #patinaFormOverlay, no por id que no existe
  function restaurarIconos(){
    try{
      var modal = document.querySelector('.patina-form-modal');
      if(!modal){
        var overlay = document.getElementById('patinaFormOverlay');
        if(overlay) modal = overlay.querySelector('.patina-form-modal');
      }
      if(!modal) return;
      // Si el modal esta cerrado, no hacer nada
      var overlay2 = document.getElementById('patinaFormOverlay');
      if(overlay2 && !overlay2.classList.contains('open')) return;

      var btns = modal.querySelectorAll('.patina-form-btns button, button');
      btns.forEach(function(b){
        var txt = (b.textContent||'').trim();
        if(!txt) return;
        var esGuardar = b.classList.contains('patina-form-save') || txt.indexOf('Guardar')!==-1 || txt.indexOf('Agregar')!==-1 || txt.indexOf('AGREGAR')!==-1;
        var esCancelar = b.classList.contains('patina-form-cancel') || txt.indexOf('Cancelar')!==-1 || txt.indexOf('CANCELAR')!==-1;
        if(esGuardar && txt.indexOf('✓')===-1 && txt.indexOf('✔')===-1){
          // Usar innerHTML para no borrar el onclick
          b.textContent = '✓ ' + txt;
        }
        if(esCancelar && txt.indexOf('✕')===-1 && txt.indexOf('✖')===-1 && txt.indexOf('×')===-1){
          b.textContent = '✕ ' + txt;
        }
      });
    }catch(e){}
  }
  setInterval(restaurarIconos, 400);
  document.addEventListener('click', function(){ setTimeout(restaurarIconos, 100); setTimeout(restaurarIconos, 400); setTimeout(restaurarIconos, 900); }, true);
  // Tambien cuando se abre el modal
  try{
    var obs = new MutationObserver(function(){ restaurarIconos(); });
    obs.observe(document.documentElement, {childList:true, subtree:true});
  }catch(e){}
})();
