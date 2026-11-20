// CORREGIR V26 - Solo baja Etiqueta de antes de la Foto a justo antes de Descripcion. No toca nada mas.
(function(){
  function corregir(){
    try{
      var m=document.getElementById('patinaFormModal'); if(!m) return;
      var et=document.getElementById('patinaF_etiqueta'); if(!et) return;
      var des=document.getElementById('patinaF_descripcion'); if(!des) return;
      var etLabel=null, desLabel=null;
      m.querySelectorAll('label').forEach(function(l){
        var t=(l.textContent||'').trim().toUpperCase();
        if(t.indexOf('ETIQUETA')!==-1) etLabel=l;
        if(t.indexOf('DESCRIPCI')!==-1) desLabel=l;
      });
      if(!etLabel||!desLabel) return;
      // Si Etiqueta ya esta justo antes de Descripcion, ya esta bien, no tocar
      if(etLabel.nextElementSibling===des || et.nextElementSibling===desLabel) return;
      // Si Etiqueta esta antes de la Foto (error del V26) o en cualquier otro lado, moverla justo antes de Descripcion
      var padre=desLabel.parentNode;
      if(!padre) return;
      padre.insertBefore(etLabel, desLabel);
      padre.insertBefore(et, desLabel);
    }catch(e){}
  }
  document.addEventListener('click', function(){ setTimeout(corregir,150); setTimeout(corregir,500); setTimeout(corregir,900); }, true);
  setInterval(corregir, 800);
})();
