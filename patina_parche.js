// V10 - Arregla DESPUES DE GUARDAR: Foto vacia, Categoria, Stock. No toca Se va a mostrar ni WhatsApp que ya estan bien.
(function(){
  var ultimoGuardado = null;
  function getAllKeys(){
    var keys=[];
    for(var i=0;i<localStorage.length;i++){
      var k=localStorage.key(i);
      if(k && k.indexOf('patina')!==-1) keys.push(k);
    }
    return keys;
  }
  function getProductos(key){
    try{
      var v=JSON.parse(localStorage.getItem(key));
      if(Array.isArray(v) && v.length && (v[0].id!=null || v[0].nombre || v[0].name)) return v;
    }catch(e){}
    return null;
  }
  function setProductos(key, arr){
    try{ localStorage.setItem(key, JSON.stringify(arr)); }catch(e){}
  }
  // Cuando tocan Guardar en Nuevo, recordar nombre + stock + categoria + si tenia foto
  document.addEventListener('click', function(e){
    try{
      var t=e.target;
      var btn=t.closest? t.closest('button') : null;
      if(!btn) return;
      var txt=(btn.textContent||'').trim().toUpperCase();
      if(txt.indexOf('GUARDAR')===-1) return;
      var m=document.getElementById('patinaFormModal');
      if(!m) return;
      var nombreEl=document.getElementById('patinaF_nombre');
      var stockEl=document.getElementById('patinaF_stock') || document.querySelector('#patinaFormModal input[name="stock"]');
      // Buscar stock por label STOCK
      if(!stockEl){
        m.querySelectorAll('label').forEach(function(l){
          if((l.textContent||'').trim().toUpperCase()==='STOCK'){
            var nxt=l.nextElementSibling;
            if(nxt && (nxt.tagName==='INPUT' || nxt.tagName==='SELECT')) stockEl=nxt;
          }
        });
      }
      var catEl=document.getElementById('patinaF_categoria') || document.querySelector('#patinaFormModal select');
      var fotoEl=document.getElementById('patinaF_foto');
      ultimoGuardado={
        nombre: nombreEl? nombreEl.value.trim() : '',
        stock: stockEl? stockEl.value : '',
        categoria: catEl? catEl.value : '',
        teniaFoto: !!(fotoEl && fotoEl.value),
        cuando: Date.now()
      };
    }catch(e){}
  }, true);
  function corregir(){
    try{
      // --- DESPUES DE GUARDAR: limpiar foto prestada, fijar categoria y stock ---
      if(ultimoGuardado && ultimoGuardado.nombre && (Date.now()-ultimoGuardado.cuando<15000)){
        var keys=getAllKeys();
        keys.forEach(function(key){
          var arr=getProductos(key);
          if(!arr) return;
          var cambio=false;
          // Foto por defecto = foto del primer producto (la Tote). Si el producto nuevo tiene esa misma foto y no tenia foto, vaciarla.
          var fotoDefault=null;
          if(arr.length>0) fotoDefault=arr[0].foto || arr[0].imagen || arr[0].image || arr[0].photo || arr[0].img;
          arr.forEach(function(p){
            var nom=String(p.nombre||p.name||'').trim();
            if(nom!==ultimoGuardado.nombre) return;
            // FOTO: si no tenia foto y tiene la foto por defecto, vaciar
            if(!ultimoGuardado.teniaFoto){
              var f=p.foto||p.imagen||p.image||p.photo||p.img;
              if(f && fotoDefault && String(f)===String(fotoDefault)){
                ['foto','imagen','image','photo','img'].forEach(function(k){ if(k in p) p[k]=''; });
                p.foto=''; p.imagen=''; p.image='';
                cambio=true;
              }
              // Si tiene foto pero es la misma que la Tote y el nombre es PRUEBA, vaciar igual (es prueba)
              if(nom.toUpperCase().indexOf('PRUEBA')!==-1 && f && fotoDefault && String(f)===String(fotoDefault)){
                p.foto=''; p.imagen=''; p.image=''; cambio=true;
              }
            }
            // CATEGORIA: guardar con todos los nombres
            if(ultimoGuardado.categoria){
              p.category=ultimoGuardado.categoria;
              p.categoria=ultimoGuardado.categoria;
              cambio=true;
            }
            // STOCK: guardar con todos los nombres, para que la ficha lo lea si o si
            if(ultimoGuardado.stock!=='' && ultimoGuardado.stock!=null){
              var s=parseInt(ultimoGuardado.stock,10);
              if(!isNaN(s)){
                p.stock=s; p.cantidad=s; p.unidades=s; p.max=s; p.disponible=s; p.stock_cantidad=s;
                cambio=true;
              }
            }
          });
          if(cambio) setProductos(key, arr);
        });
      }
      // --- Pildoras de categorias nuevas: en TODOS los lugares, no solo #todos ---
      var prods=[];
      getAllKeys().forEach(function(k){ var a=getProductos(k); if(a) prods=a; });
      var base=['cartera','accesorio','accesorios','ofertas','todos','home',''];
      var nuevas=[];
      prods.forEach(function(p){
        var c=String(p.category||p.categoria||'').trim().toLowerCase();
        if(c && base.indexOf(c)===-1 && nuevas.indexOf(c)===-1) nuevas.push(c);
      });
      nuevas.forEach(function(cat){
        // Buscar cualquier contenedor de pildoras, incluido MÁS CATEGORÍAS
        document.querySelectorAll('.patina-cat-pills, [class*="cat-pill"], [class*="categoria"]').forEach(function(wrap){
          // Solo si el wrap parece contenedor de pildoras (tiene botones)
          if(!wrap.querySelector('button')) return;
          if(wrap.querySelector('[data-cat-pill="'+cat+'"]')) return;
          // No inyectar en el modal de form
          if(wrap.closest('#patinaFormModal')) return;
          var b=document.createElement('button');
          b.type='button'; b.className='patina-cat-pill'; b.setAttribute('data-cat-pill',cat);
          b.textContent=cat.charAt(0).toUpperCase()+cat.slice(1);
          b.addEventListener('click', function(){
            try{ window.__patinaCatFilter=cat; }catch(e){}
            try{ if(window.patinaIrA) window.patinaIrA('todos'); }catch(e){}
          });
          wrap.appendChild(b);
        });
      });
      // --- Form: Etiqueta antes de Descripcion + Foto chiquita + Se va a mostrar abajo de ambas (ya estaba bien, no lo rompo) ---
      var m=document.getElementById('patinaFormModal');
      if(m){
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
        var calc=document.getElementById('patinaCalc');
        if(calc){
          var labPrecio=null, labOferta=null;
          m.querySelectorAll('label').forEach(function(l){
            var t=(l.textContent||'').trim().toUpperCase();
            if(t==='PRECIO') labPrecio=l;
            if(t.indexOf('OFERTA')!==-1) labOferta=l;
          });
          if(labPrecio && labOferta){
            var fila=null, a=labPrecio;
            while(a && a!==m){ if(a.contains(labOferta)){ fila=a; break; } a=a.parentElement; }
            if(fila && fila.parentNode){
              if(calc.parentNode!==fila.parentNode || calc.previousElementSibling!==fila){
                fila.parentNode.insertBefore(calc, fila.nextSibling);
              }
            }
          }
          calc.style.display='block'; calc.style.width='100%'; calc.style.maxWidth='100%';
          calc.style.margin='8px 0 2px 0'; calc.style.textAlign='left';
          calc.style.visibility='visible'; calc.style.opacity='1';
        }
        var fotoBox=m.querySelector('.patina-foto');
        if(fotoBox){
          fotoBox.style.display='flex'; fotoBox.style.alignItems='center'; fotoBox.style.gap='8px';
          fotoBox.style.padding='6px 10px'; fotoBox.style.minHeight='0'; fotoBox.style.height='auto'; fotoBox.style.margin='0';
        }
      }
      // --- Stock en ficha: leer de cualquier campo stock/cantidad/unidades ---
      var ficha=null;
      document.querySelectorAll('div').forEach(function(d){
        if(d.textContent && d.textContent.indexOf('CANTIDAD')!==-1 && d.textContent.indexOf('Máx')!==-1 && !ficha) ficha=d;
      });
      if(ficha){
        var mt=ficha.textContent.match(/#(\d{3,4})/);
        var idBuscado=mt?mt[1]:null;
        if(idBuscado){
          var prod=null;
          prods.forEach(function(p){
            var pid=String(p.id||'').padStart(4,'0');
            if(pid===idBuscado || String(p.id)===String(parseInt(idBuscado,10))) prod=p;
          });
          if(prod){
            var sRaw=prod.stock!=null?prod.stock:(prod.cantidad!=null?prod.cantidad:(prod.unidades!=null?prod.unidades:prod.disponible));
            if(sRaw!=null && sRaw!=='' && !isNaN(sRaw)){
              var sNum=parseInt(sRaw,10);
              if(sNum>0 && ficha.innerHTML.indexOf('Máx. '+sNum)===-1){
                ficha.innerHTML=ficha.innerHTML.replace(/Máx\.\s*\d+\s*unidades/i, 'Máx. '+sNum+' unidades');
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
