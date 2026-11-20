// V7 - Se va a mostrar ABAJO DE AMBAS pildoras, sin tocar Precio / Precio Oferta. Solo mueve el texto, no las pildoras.
(function(){
  function corregir(){
    try{
      var m=document.getElementById('patinaFormModal'); if(!m) return;
      // --- 1) Etiqueta antes de Descripcion ---
      var et=document.getElementById('patinaF_etiqueta');
      var des=document.getElementById('patinaF_descripcion');
      if(et&&des){
        var etLabel=null, desLabel=null;
        m.querySelectorAll('label').forEach(function(l){
          var t=(l.textContent||'').trim().toUpperCase();
          if(t.indexOf('ETIQUETA')!==-1) etLabel=l;
          if(t.indexOf('DESCRIPCI')!==-1) desLabel=l;
        });
        if(etLabel&&desLabel){
          if(!(etLabel.nextElementSibling===des || et.nextElementSibling===desLabel)){
            var padre=desLabel.parentNode;
            if(padre){ padre.insertBefore(etLabel, desLabel); padre.insertBefore(et, desLabel); }
          }
        }
      }
      // --- 2) Se va a mostrar ABAJO DE AMBAS, sin tocar las pildoras ---
      var calc=document.getElementById('patinaCalc');
      if(calc && !calc.dataset.yaAbajo){
        // Buscar los 2 inputs de precio para encontrar su fila comun
        var inputs=m.querySelectorAll('input');
        var precioInput=null, ofertaInput=null;
        inputs.forEach(function(inp){
          var id=(inp.id||'').toLowerCase();
          if(id.indexOf('oferta')!==-1) ofertaInput=inp;
          else if(id.indexOf('precio')!==-1) precioInput=inp;
        });
        if(precioInput && ofertaInput){
          // Subir desde Precio hasta encontrar el ancestro que tambien contiene a Oferta = la fila de precios
          var fila=null;
          var a=precioInput;
          while(a && a!==m){
            if(a.contains(ofertaInput)){ fila=a; break; }
            a=a.parentElement;
          }
          // La fila es el ancestro mas chico que contiene a los 2. Ese es el .patina-row de precios.
          // Mover SOLO calc justo despues de esa fila, dentro del mismo padre de la fila.
          // No tocamos fila, no tocamos sus columnas, no tocamos gridColumn de nadie.
          if(fila && fila.parentNode){
            fila.parentNode.insertBefore(calc, fila.nextSibling);
            calc.dataset.yaAbajo='1';
          }
        }
        calc.style.display='block';
        calc.style.width='100%';
        calc.style.maxWidth='100%';
        calc.style.margin='8px 0 2px 0';
        calc.style.textAlign='left';
        calc.style.visibility='visible';
        calc.style.opacity='1';
      }
      // --- 3) FOTO CHIQUITA ---
      var fotoBox=m.querySelector('.patina-foto');
      if(fotoBox){
        fotoBox.style.display='flex';
        fotoBox.style.alignItems='center';
        fotoBox.style.gap='8px';
        fotoBox.style.padding='6px 10px';
        fotoBox.style.minHeight='0';
        fotoBox.style.height='auto';
        fotoBox.style.margin='0';
      }
      var ico=m.querySelector('.patina-foto-ico');
      if(ico){
        ico.style.width='40px';
        ico.style.height='40px';
        ico.style.minWidth='40px';
        ico.style.minHeight='40px';
        ico.style.fontSize='16px';
        ico.style.borderRadius='8px';
        ico.style.overflow='hidden';
        ico.style.flexShrink='0';
      }
    }catch(e){}
  }
  document.addEventListener('click', function(){ setTimeout(corregir,150); setTimeout(corregir,500); setTimeout(corregir,900); }, true);
  setInterval(corregir, 800);
})();
