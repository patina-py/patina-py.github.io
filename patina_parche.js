// V29 = V28 SIN TOCAR PILDORAS / VISIBILIDAD / MODAL / HOME / STOCK
// SOLO FIX SYNC FOTOS: Google es la verdad para la foto. Si el celu tiene foto cruzada, la corrige con la de Google.
(function(){
  var KEY='patina_v25_admin';
  var GAS_URL="https://script.google.com/macros/s/AKfycbznKXsIvfuR_kb4UIwHk2QtjaqOlGUW9imJFjXDKfWuanUCFZOtbPLSXVlwAx8mr_I2UQ/exec";
  try{ var saved=localStorage.getItem("patina_gas_url_v1"); if(saved) GAS_URL=saved; }catch(e){}

  function leerProds(){ try{ var v=JSON.parse(localStorage.getItem(KEY)||"[]"); if(Array.isArray(v)) return v; }catch(e){} return []; }
  function guardarProds(arr){ try{ localStorage.setItem(KEY, JSON.stringify(arr)); }catch(e){} }
  function claveNombre(p){ return String(p.nombre||p.name||'').toLowerCase().trim(); }

  // FIX SOLO FOTOS: si Google tiene foto y local tiene otra distinta o vacia, usar la de Google.
  // Esto corrige el celu que quedo con fotos cruzadas por las versiones viejas que reasignaban ID.
  function corregirFotosDesdeGoogle(){
    try{
      if(document.activeElement && (document.activeElement.tagName==='INPUT' || document.activeElement.tagName==='TEXTAREA')) return;
      fetch(GAS_URL).then(function(r){ return r.json(); }).then(function(gas){
        if(!gas) return;
        var gasProds=Array.isArray(gas) ? gas : (gas.productos||[]);
        if(!gasProds.length) return;
        var loc=leerProds();
        if(!loc.length) return;
        var porNombre={}; loc.forEach(function(p){ porNombre[claveNombre(p)]=p; });
        var cambio=false;
        var faltantes=[];
        gasProds.forEach(function(g){
          var clave=claveNombre(g);
          var l=porNombre[clave];
          if(!l){
            // Producto que esta en Google y no en este dispositivo: agregarlo tal cual, con su ID de Google
            loc.push(g); porNombre[clave]=g; cambio=true; faltantes.push(g.nombre);
          } else {
            // SOLO FOTO: si Google tiene foto y es distinta a la local, corregirla. Google manda.
            if(g.foto && l.foto!==g.foto){
              l.foto=g.foto; cambio=true;
            }
            // Si local no tiene foto y Google si, copiarla
            if(!l.foto && g.foto){ l.foto=g.foto; cambio=true; }
            // NO tocamos nada mas: ni precio, ni categoria, ni visibilidad, ni stock, ni ID
          }
        });
        if(cambio){
          guardarProds(loc);
          // Refrescar tienda para que se vean las fotos corregidas sin tener que cerrar la pagina
          try{ if(window.patinaRefrescarTienda) window.patinaRefrescarTienda(); }catch(e){}
          console.log('PATRINA V29: fotos corregidas desde Google. Productos agregados:', faltantes);
        }
      }).catch(function(){});
    }catch(e){}
  }

  // Al abrir, corregir enseguida y cada 15s. No tocar nada mientras escribis en Admin.
  setTimeout(corregirFotosDesdeGoogle, 800);
  setInterval(corregirFotosDesdeGoogle, 15000);
  document.addEventListener('visibilitychange', function(){ if(!document.hidden) corregirFotosDesdeGoogle(); });
  window.addEventListener('focus', function(){ corregirFotosDesdeGoogle(); });

  // Cuando guardas en Admin, subir a Google para que el otro dispositivo lo tome
  document.addEventListener('click', function(e){
    try{
      var btn=e.target.closest? e.target.closest('button') : null;
      if(!btn) return;
      var t=(btn.textContent||'').trim();
      if(t.indexOf('Guardar')!==-1 || t.indexOf('Agregar')!==-1){
        setTimeout(function(){ try{ if(window.patinaSyncNow) window.patinaSyncNow(); }catch(e){} }, 800);
        setTimeout(corregirFotosDesdeGoogle, 2500);
      }
    }catch(e){}
  }, true);
})();
