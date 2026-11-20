// V8 - 3 ARREGLOS: 1) Foto vacia en Nuevo 2) Se va a mostrar ABAJO DE AMBAS 3) Stock respeta el numero. No toca nada mas.
(function(){
  function getProductos(){
    try{
      var raw=localStorage.getItem('patina_v25_admin');
      if(raw){ var l=JSON.parse(raw); if(Array.isArray(l)) return l; }
    }catch(e){}
    try{ if(Array.isArray(window.__patinaAdminDefaults)) return window.__patinaAdminDefaults; }catch(e){}
    return [];
  }
  function corregir(){
    try{
      var m=document.getElementById('patinaFormModal');
      if(m){
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
        // --- 1b) Si es NUEVO producto, foto vacia, no foto prestada ---
        var titulo=(m.textContent||'').toUpperCase();
        var esNuevo=titulo.indexOf('NUEVO')!==-1 || titulo.indexOf('AGREGAR')!==-1;
        // Tambien si Nombre esta vacio, es nuevo
        var nombreInput=document.getElementById('patinaF_nombre');
        if(nombreInput && !nombreInput.value) esNuevo=true;
        if(esNuevo){
          var ico=m.querySelector('.patina-foto-ico');
          if(ico){
            var img=ico.querySelector('img');
            // Si el icono tiene una foto de otro producto y el campo de foto esta vacio, vaciarlo
            var fotoInput=document.getElementById('patinaF_foto');
            var fotoVacia=!fotoInput || !fotoInput.value;
            if(img && fotoVacia){
              img.removeAttribute('src');
              img.style.display='none';
              ico.textContent='📷';
            }
          }
        }
        // --- 2) Se va a mostrar ABAJO DE AMBAS - buscar fila por LABELS, no por IDs ---
        var calc=document.getElementById('patinaCalc');
        if(calc){
          // Buscar la fila que tiene los 2 labels PRECIO y PRECIO OFERTA
          var labels=m.querySelectorAll('label');
          var labPrecio=null, labOferta=null;
          labels.forEach(function(l){
            var t=(l.textContent||'').trim().toUpperCase();
            if(t==='PRECIO') labPrecio=l;
            if(t.indexOf('OFERTA')!==-1) labOferta=l;
          });
          if(labPrecio && labOferta){
            var fila=null;
            var a=labPrecio;
            while(a && a!==m){
              if(a.contains(labOferta)){ fila=a; break; }
              a=a.parentElement;
            }
            if(fila && fila.parentNode && calc.parentNode!==fila.parentNode){
              fila.parentNode.insertBefore(calc, fila.nextSibling);
            } else if(fila && fila.parentNode && calc.previousElementSibling!==fila){
              // Si ya es hijo del padre de la fila pero no esta justo despues de la fila, ponerlo ahi
              fila.parentNode.insertBefore(calc, fila.nextSibling);
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
        // --- Foto chiquita ---
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
        var ico2=m.querySelector('.patina-foto-ico');
        if(ico2 && !esNuevo){
          ico2.style.width='40px';
          ico2.style.height='40px';
          ico2.style.minWidth='40px';
          ico2.style.minHeight='40px';
          ico2.style.fontSize='16px';
          ico2.style.borderRadius='8px';
          ico2.style.overflow='hidden';
          ico2.style.flexShrink='0';
        }
      }
      // --- 3) Stock: en la ficha del cliente, respetar el stock real ---
      // Buscar ficha con CANTIDAD y Max
      var bodyText=document.body.innerText||'';
      if(bodyText.indexOf('CANTIDAD')!==-1){
        // Buscar el numero de producto #0036 etc en la ficha
        var ficha=null;
        document.querySelectorAll('div').forEach(function(d){
          if(d.textContent && d.textContent.indexOf('CANTIDAD')!==-1 && d.textContent.indexOf('Máx')!==-1){
            if(!ficha) ficha=d;
          }
        });
        if(ficha){
          // Sacar el id #XXXX de la ficha
          var mt=ficha.textContent.match(/#(\d{3,4})/);
          var idBuscado=mt?mt[1]:null;
          if(idBuscado){
            var prods=getProductos();
            var prod=null;
            prods.forEach(function(p){
              var pid=String(p.id||'').padStart(4,'0');
              if(pid===idBuscado || String(p.id)===String(parseInt(idBuscado,10))) prod=p;
            });
            if(prod && prod.stock!=null && prod.stock!=='' && !isNaN(prod.stock)){
              var stockNum=parseInt(prod.stock,10);
              if(stockNum>0){
                // Corregir texto Max
                ficha.innerHTML=ficha.innerHTML.replace(/Máx\.\s*\d+\s*unidades/i, 'Máx. '+stockNum+' unidades');
                // Buscar el numero de cantidad actual y los botones + / -
                var cantEl=null;
                ficha.querySelectorAll('*').forEach(function(el){
                  if(el.children.length===0 && /^\d+$/.test((el.textContent||'').trim())){
                    if(!cantEl) cantEl=el;
                  }
                });
                // Buscar boton + cerca de CANTIDAD
                var botones=ficha.querySelectorAll('button');
                botones.forEach(function(b){
                  if((b.textContent||'').trim()==='+'){
                    b.onclick=function(e){
                      var cur=parseInt((cantEl?cantEl.textContent:'1'),10)||1;
                      if(cur>=stockNum){ e.preventDefault(); e.stopPropagation(); return false; }
                    };
                    // Si cantidad actual ya supera stock, bajarla
                    if(cantEl && parseInt(cantEl.textContent,10)>stockNum) cantEl.textContent=String(stockNum);
                  }
                });
              }
            }
          }
        }
      }
    }catch(e){}
  }
  document.addEventListener('click', function(){ setTimeout(corregir,150); setTimeout(corregir,500); setTimeout(corregir,900); }, true);
  setInterval(corregir, 700);
})();
