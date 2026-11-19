// PATINA RESTAURAR - UNA SOLA VEZ - Sube los productos de fabrica a Google y NO baja lo de Google
(function(){
  console.log('PATINA RESTAURAR CARGADO');
  var GAS_URL = "https://script.google.com/macros/s/AKfycbznKXsIvfuR_kb4UIwHk2QtjaqOlGUW9imJFjXDKfWuanUCFZOtbPLSXVlwAx8mr_I2UQ/exec";
  try{ var s=localStorage.getItem("patina_gas_url_v1"); if(s) GAS_URL=s; }catch(e){}
  var KEY='patina_v25_admin';
  function normId(id){ return String(id||'').padStart(4,'0'); }
  function normName(n){ return String(n||'').toLowerCase().trim().replace(/\s+/g,' '); }
  function cleanByName(arr){
    var map={}; var order=[];
    arr.forEach(function(d){
      var k=normName(d.nombre||d.name||'');
      if(!k) return;
      if(!map[k]){ var c={}; for(var x in d) c[x]=d[x]; c.id=normId(c.id); map[k]=c; order.push(k); }
      else { var keep=map[k]; if(!keep.foto && d.foto) keep.foto=d.foto; if(!keep.descripcion && d.descripcion) keep.descripcion=d.descripcion; }
    });
    var out=order.map(function(k){ return map[k]; });
    out.sort(function(a,b){ return String(a.id).localeCompare(String(b.id)); });
    return out;
  }
  function stripFoto(arr){ return arr.map(function(d){ var c={}; for(var k in d){ c[k]=d[k]; } if(typeof c.foto==='string' && c.foto.length>48000) c.foto=''; return c; }); }
  // Esperar a que la pagina cargue los productos de fabrica
  setTimeout(function(){
    var defs = window.__patinaAdminDefaults || [];
    console.log('PATINA RESTAURAR: fabrica tiene', defs.length, 'productos');
    if(!defs.length || defs.length < 5){
      console.log('PATINA RESTAURAR: fabrica tiene menos de 5, NO subo nada. Avisar a Pedro.');
      alert('Restaurar: la fabrica tiene solo ' + defs.length + ' productos. No subi nada. Sacale foto a esto y pasamela.');
      return;
    }
    var limpios = cleanByName(defs);
    console.log('PATINA RESTAURAR: limpios', limpios.length);
    try{ localStorage.setItem(KEY, JSON.stringify(limpios)); }catch(e){}
    var payload={action:'save_all', productos: stripFoto(limpios), categorias: [], password:'PATINA2026'};
    try{ var cats=localStorage.getItem('patina_v25_cats'); if(cats) payload.categorias=JSON.parse(cats); }catch(e){}
    fetch(GAS_URL,{method:'POST', body: JSON.stringify(payload)}).then(function(){
      console.log('PATINA RESTAURAR: subido a Google, recargando en 3s');
      alert('Restaurado: subi ' + limpios.length + ' productos a Google. Ahora voy a recargar y tiene que decir Todas (' + limpios.length + ').');
      setTimeout(function(){ location.href = location.origin + location.pathname + '?v=105'; }, 3000);
    }).catch(function(){ alert('Error subiendo a Google. Intentar de nuevo.'); });
  }, 2500);
})();
