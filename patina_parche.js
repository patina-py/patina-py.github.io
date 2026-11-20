// V9 - 1) WhatsApp ordenado con saltos 2) Pildoras de categorias nuevas en MAS CATEGORIAS / #todos 3) Foto y Stock: limpia #0036 guardado mal + respeta stock. No toca precios.
(function(){
  function getProductos(){
    var out=[];
    try{
      for(var i=0;i<localStorage.length;i++){
        var k=localStorage.key(i);
        if(k && k.indexOf('patina')!==-1){
          try{
            var v=JSON.parse(localStorage.getItem(k));
            if(Array.isArray(v) && v.length && v[0] && (v[0].id || v[0].nombre || v[0].name)) out=v;
          }catch(e){}
        }
      }
    }catch(e){}
    try{ if(!out.length && Array.isArray(window.__patinaAdminDefaults)) out=window.__patinaAdminDefaults; }catch(e){}
    return out;
  }
  function corregir(){
    try{
      // --- WhatsApp ordenado ---
      // Buscar links a whatsapp / botones Mas info
      document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"], button').forEach(function(el){
        var txt=(el.textContent||'').toLowerCase();
        var esWA = (el.href && el.href.indexOf('wa.me')!==-1) || txt.indexOf('más info')!==-1 || txt.indexOf('mas info')!==-1;
        if(!esWA) return;
        // Sacar datos de la ficha visible: #XXXX, nombre, precio
        var ficha = el.closest('div');
        var titulo='', precio='', idProd='';
        // Buscar en todo el documento la ficha abierta con #XXXX
        var m=(document.body.innerText||'').match(/#(\d{3,4})/);
        if(m) idProd=m[1];
        // Nombre: primer titulo en la ficha
        var h = document.querySelector('[class*="modal"] h1, [class*="modal"] h2, [class*="modal"] h3');
        if(h) titulo=(h.textContent||'').trim();
        // Si el link ya tiene texto ordenado con %0A, no tocar
        if(el.href && el.href.indexOf('%0A')!==-1) return;
        if(el.href && el.href.indexOf('text=')!==-1){
          try{
            var url=new URL(el.href);
            var viejo=decodeURIComponent(url.searchParams.get('text')||'');
            if(viejo && viejo.indexOf('\n')===-1 && viejo.length>0){
              // Convertir "Hola Pátina! Me interesa el item #0036 - Nombre (10.000 Gs) - ..." a lineas
              var nuevo=viejo;
              // Separar por " - " en lineas
              if(viejo.indexOf(' - ')!==-1){
                var partes=viejo.split(' - ');
                // Primera parte: Hola Patina! Me interesa el item #XXXX
                nuevo=partes[0];
                for(var j=1;j<partes.length;j++){ nuevo+='\n'+partes[j].trim(); }
              }
              // Asegurar saltos: Hola Patina! \n Me interesa...
              nuevo=nuevo.replace(/! Me interesa/i, '!\nMe interesa');
              nuevo=nuevo.replace(/\(Gs\)/g, 'Gs');
              url.searchParams.set('text', nuevo);
              el.href=url.toString();
            }
          }catch(e){}
        }
      });
      // --- Pildoras de categorias nuevas en #todos / MAS CATEGORIAS ---
      var prods=getProductos();
      var base=['cartera','accesorio','accesorios','ofertas','todos','home'];
      var nuevas=[];
      prods.forEach(function(p){
        var c=String(p.category||p.categoria||'').trim().toLowerCase();
        if(c && base.indexOf(c)===-1 && nuevas.indexOf(c)===-1) nuevas.push(c);
      });
      nuevas.forEach(function(cat){
        document.querySelectorAll('#view-todos .patina-cat-pills, [id*="todos"] .patina-cat-pills, .patina-cat-pills').forEach(function(wrap){
          if(wrap.querySelector('[data-cat-pill="'+cat+'"]')) return;
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
      // --- Form: Etiqueta antes de Descripcion + Foto chiquita (sin tocar calc) ---
      var m2=document.getElementById('patinaFormModal');
      if(m2){
        var et=document.getElementById('patinaF_etiqueta');
        var des=document.getElementById('patinaF_descripcion');
        if(et&&des){
          var etLabel=null, desLabel=null;
          m2.querySelectorAll('label').forEach(function(l){
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
        // Se va a mostrar ABAJO DE AMBAS - por LABELS
        var calc=document.getElementById('patinaCalc');
        if(calc){
          var labPrecio=null, labOferta=null;
          m2.querySelectorAll('label').forEach(function(l){
            var t=(l.textContent||'').trim().toUpperCase();
            if(t==='PRECIO') labPrecio=l;
            if(t.indexOf('OFERTA')!==-1) labOferta=l;
          });
          if(labPrecio && labOferta){
            var fila=null, a=labPrecio;
            while(a && a!==m2){ if(a.contains(labOferta)){ fila=a; break; } a=a.parentElement; }
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
        var fotoBox=m2.querySelector('.patina-foto');
        if(fotoBox){
          fotoBox.style.display='flex'; fotoBox.style.alignItems='center'; fotoBox.style.gap='8px';
          fotoBox.style.padding='6px 10px'; fotoBox.style.minHeight='0'; fotoBox.style.height='auto'; fotoBox.style.margin='0';
        }
      }
      // --- Stock en ficha: respetar stock real del producto ---
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
            var stockRaw=prod.stock!=null?prod.stock:(prod.cantidad!=null?prod.cantidad:prod.stock_cantidad);
            if(stockRaw!=null && stockRaw!=='' && !isNaN(stockRaw)){
              var stockNum=parseInt(stockRaw,10);
              if(stockNum>0){
                if(ficha.innerHTML.indexOf('Máx. '+stockNum)!==-1){ /* ya esta bien */ }
                else { ficha.innerHTML=ficha.innerHTML.replace(/Máx\.\s*\d+\s*unidades/i, 'Máx. '+stockNum+' unidades'); }
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
