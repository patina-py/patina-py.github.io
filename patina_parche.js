// V31 = V29 sync fotos PC->celu (que ya anda) + RESTAURAR ICONOS ✓ / ✕ en modal Agregar/Editar
// NO toca pildoras, visibilidad, HOME, stock, categorias, ni nada mas.
(function(){
  var KEY='patina_v25_admin';
  var GAS_URL="https://script.google.com/macros/s/AKfycbznKXsIvfuR_kb4UIwHk2QtjaqOlGUW9imJFjXDKfWuanUCFZOtbPLSXVlwAx8mr_I2UQ/exec";
  try{ var saved=localStorage.getItem("patina_gas_url_v1"); if(saved) GAS_URL=saved; }catch(e){}
  function leerProds(){ try{ var v=JSON.parse(localStorage.getItem(KEY)||"[]"); if(Array.isArray(v)) return v; }catch(e){} return []; }
  function guardarProds(arr){ try{ localStorage.setItem(KEY, JSON.stringify(arr)); }catch(e){} }
  function claveNombre(p){ return String(p.nombre||p.name||'').toLowerCase().trim(); }
  function esPC(){ try{ return window.innerWidth>768; }catch(e){ return true; } }

  // SYNC FOTOS - igual que V29 que ya te anda: PC sube, celu solo baja
  function corregirFotosDesdeGoogle(){
    try{
      if(document.activeElement && (document.activeElement.tagName==='INPUT' || document.activeElement.tagName==='TEXTAREA')) return;
      // Si es PC, primero subir lo local a Google para que el celu lo baje despues
      if(esPC()){
        try{ if(window.patinaSyncNow) window.patinaSyncNow(); }catch(e){}
      }
      fetch(GAS_URL).then(function(r){ return r.json(); }).then(function(gas){
        if(!gas) return;
        var gasProds=Array.isArray(gas) ? gas : (gas.productos||[]);
        if(!gasProds.length) return;
        // En celu, nunca subir fotos, solo bajar. En PC, tampoco pisar local con Google si local ya tiene foto buena.
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

  // RESTAURAR ICONOS - SOLO esto, sin tocar nada mas del modal
  function restaurarIconos(){
    try{
      var modal=document.getElementById('patinaFormModal');
      if(!modal) return;
      // Buscar botones de Guardar / Agregar / Cancelar dentro del modal de form
      var btns=modal.querySelectorAll('.patina-form-btns button, button');
      btns.forEach(function(b){
        var txt=(b.textContent||'').trim();
        var esGuardar = b.classList.contains('patina-form-save') || txt.indexOf('Guardar')!==-1 || txt.indexOf('Agregar')!==-1;
        var esCancelar = b.classList.contains('patina-form-cancel') || txt.indexOf('Cancelar')!==-1;
        if(esGuardar){
          if(txt.indexOf('✓')===-1 && txt.indexOf('✔')===-1){
            // Mantener el texto original, solo agregar el icono adelante
            b.textContent='✓ '+txt;
          }
        }
        if(esCancelar){
          if(txt.indexOf('✕')===-1 && txt.indexOf('✖')===-1 && txt.indexOf('×')===-1){
            b.textContent='✕ '+txt;
          }
        }
      });
      // Tambien los botones de la parte de categoria dentro del modal
      modal.querySelectorAll('button').forEach(function(b){
        var t=(b.textContent||'').trim();
        if(t==='AGREGAR CATEGORÍA' && t.indexOf('✓')===-1) b.textContent='✓ '+t;
      });
    }catch(e){}
  }
  setInterval(restaurarIconos, 600);
  document.addEventListener('click', function(){ setTimeout(restaurarIconos, 100); setTimeout(restaurarIconos, 500); }, true);
})();
