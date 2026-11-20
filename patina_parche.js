// CORREGIR V26 v5 - NO MUEVE NADA. Solo: 1) Etiqueta antes de Descripcion 2) Se va a mostrar a lo ancho SIN MOVERLO 3) Foto chiquita. No toca productos.
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
      // --- 2) Se va a mostrar a lo ancho, SIN MOVERLO DE LUGAR ---
      // NO hacemos insertBefore. Solo hacemos que su cajita padre ocupe todo el ancho y baje a la siguiente fila.
      var calc=document.getElementById('patinaCalc');
      if(calc){
        calc.style.display='block';
        calc.style.width='100%';
        calc.style.maxWidth='100%';
        calc.style.margin='8px 0 2px 0';
        calc.style.textAlign='left';
        calc.style.visibility='visible';
        calc.style.opacity='1';
        // Su padre directo es la columna de Precio Oferta. Hacer que esa columna ocupe las 2 columnas y baje abajo.
        var padreCalc=calc.parentElement;
        if(padreCalc){
          padreCalc.style.gridColumn='1 / -1';
          padreCalc.style.width='100%';
          padreCalc.style.display='block';
        }
      }
      // --- 3) FOTO CHIQUITA - caja bajita ---
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
      var img=m.querySelector('.patina-foto-ico img, .patina-foto img');
      if(img){
        img.style.width='100%';
        img.style.height='100%';
        img.style.objectFit='cover';
        img.style.display='block';
      }
    }catch(e){}
  }
  document.addEventListener('click', function(){ setTimeout(corregir,150); setTimeout(corregir,500); setTimeout(corregir,900); }, true);
  setInterval(corregir, 800);
})();
