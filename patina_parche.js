// V16 = V15 + HOME siempre 3 lugares: si no hay ofertas, Ofertas se cambia por 3ra categoria. Si solo hay 2, quedan 2 centradas. Icono generico mismo tamano para categorias nuevas.
(function(){
  var ultimoStock = null;
  document.addEventListener('click', function(e){
    try{
      var btn=e.target.closest? e.target.closest('button') : null;
      if(!btn) return;
      if((btn.textContent||'').trim().toUpperCase().indexOf('GUARDAR')===-1) return;
      var m=document.getElementById('patinaFormModal'); if(!m) return;
      var stockVal='';
      m.querySelectorAll('label').forEach(function(l){
        if((l.textContent||'').trim().toUpperCase()==='STOCK'){
          var nxt=l.nextElementSibling;
          if(nxt) stockVal=nxt.value;
        }
      });
      if(!stockVal){
        var inp=document.getElementById('patinaF_stock');
        if(inp) stockVal=inp.value;
      }
      if(stockVal) ultimoStock=parseInt(stockVal,10);
      try{ sessionStorage.setItem('patina_ultimo_stock', String(ultimoStock)); }catch(e){}
      var sel=m.querySelector('select');
      if(sel && sel.value){
        try{ sessionStorage.setItem('patina_ultima_categoria', String(sel.value).toLowerCase()); }catch(e){}
      }
    }catch(e){}
  }, true);
  function getUltimoStock(){
    if(ultimoStock) return ultimoStock;
    try{ var v=sessionStorage.getItem('patina_ultimo_stock'); if(v) return parseInt(v,10); }catch(e){}
    return null;
  }
  function getProductos(){
    var out=[];
    try{
      for(var i=0;i<localStorage.length;i++){
        var k=localStorage.key(i);
        if(k && k.indexOf('patina')!==-1){
          try{
            var v=JSON.parse(localStorage.getItem(k));
            if(Array.isArray(v) && v.length && (v[0].id!=null || v[0].nombre || v[0].name)) out=v;
          }catch(e){}
        }
      }
    }catch(e){}
    return out;
  }
  function tieneOferta(p){
    var precio=parseFloat(p.precio||p.price||0)||0;
    var oferta=parseFloat(p.precio_oferta||p.oferta||p.precioOferta||p.sale_price||0)||0;
    if(oferta>0 && precio>0 && oferta<precio) return true;
    if(p.descuento && parseFloat(p.descuento)>0) return true;
    if(p.etiqueta && String(p.etiqueta).toUpperCase().indexOf('OFF')!==-1) return true;
    return false;
  }
  function iconoPara(cat){
    var c=(cat||'').toLowerCase();
    if(c.indexOf('cartera')!==-1) return '👜';
    if(c.indexOf('accesorio')!==-1) return '✨';
    if(c.indexOf('termo')!==-1) return '🧉';
    if(c.indexOf('mate')!==-1) return '🧉';
    if(c.indexOf('oferta')!==-1) return '🏷️';
    // Generico: primera letra en circulo, mismo tamano que los otros iconos
    return (cat||'•').charAt(0).toUpperCase();
  }
  function crearPildora(cat){
    var b=document.createElement('button');
    b.type='button'; b.className='patina-cat-pill'; b.setAttribute('data-cat-pill',cat);
    // Icono + texto, mismo formato que Carteras / Accesorios
    var ico=document.createElement('span');
    ico.className='patina-cat-ico';
    ico.textContent=iconoPara(cat);
    ico.style.cssText='display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;min-width:22px;font-size:13px;margin-right:6px;';
    var txt=document.createElement('span');
    txt.textContent=cat.charAt(0).toUpperCase()+cat.slice(1);
    b.appendChild(ico); b.appendChild(txt);
    b.addEventListener('click', function(){
      try{ window.__patinaCatFilter=cat; }catch(e){}
      try{ if(window.patinaIrA) window.patinaIrA('todos'); }catch(e){}
    });
    return b;
  }
  function corregir(){
    try{
      var prods=getProductos();
      var protegidas=['todos','home',''];
      var conteo={};
      prods.forEach(function(p){
        var c=String(p.category||p.categoria||'').trim().toLowerCase();
        if(!c) return;
        conteo[c]=(conteo[c]||0)+1;
      });
      var hayOferta=prods.some(function(p){ return tieneOferta(p); });
      var catsConProductos=Object.keys(conteo).filter(function(c){ return conteo[c]>0 && c!=='ofertas' && c!=='todos'; });
      var ordenPref=['cartera','carteras','accesorio','accesorios'];
      catsConProductos.sort(function(a,b){
        var ia=ordenPref.indexOf(a); var ib=ordenPref.indexOf(b);
        if(ia===-1) ia=99; if(ib===-1) ib=99;
        return ia-ib;
      });
      // HOME quiere 3 lugares: si hay oferta -> 2 cats + Ofertas. Si no hay oferta -> 3 cats.
      var homeDeseado=[];
      if(hayOferta){
        homeDeseado=catsConProductos.slice(0,2);
        homeDeseado.push('ofertas');
      } else {
        homeDeseado=catsConProductos.slice(0,3);
      }
      document.querySelectorAll('.patina-cat-pills').forEach(function(wrap){
        if(wrap.closest('#patinaFormModal')) return;
        var esTodos = wrap.closest('#view-todos') || wrap.id.indexOf('todos')!==-1;
        if(esTodos){
          var todosBtn=null;
          wrap.querySelectorAll('[data-cat-pill]').forEach(function(b){
            if((b.getAttribute('data-cat-pill')||'').toLowerCase()==='todos') todosBtn=b;
          });
          if(todosBtn && todosBtn!==wrap.lastElementChild) wrap.appendChild(todosBtn);
          wrap.querySelectorAll('[data-cat-pill]').forEach(function(b){
            var cat=(b.getAttribute('data-cat-pill')||'').toLowerCase().trim();
            if(protegidas.indexOf(cat)!==-1) return;
            if(cat==='ofertas' && !hayOferta){ b.remove(); return; }
            if(!conteo[cat] || conteo[cat]===0) b.remove();
          });
          catsConProductos.forEach(function(cat){
            if(!conteo[cat] || conteo[cat]===0) return;
            if(wrap.querySelector('[data-cat-pill="'+cat+'"]')) return;
            var b=crearPildora(cat);
            if(todosBtn) wrap.insertBefore(b, todosBtn);
            else wrap.appendChild(b);
          });
          if(hayOferta && !wrap.querySelector('[data-cat-pill="ofertas"]')){
            var bo=document.createElement('button');
            bo.type='button'; bo.className='patina-cat-pill'; bo.setAttribute('data-cat-pill','ofertas');
            bo.textContent='Ofertas';
            if(todosBtn) wrap.insertBefore(bo, todosBtn);
            else wrap.appendChild(bo);
          }
        } else {
          // HOME: dejar solo homeDeseado (2+Ofertas o 3 cats), borrar lo demas, centrar si son solo 2
          wrap.querySelectorAll('[data-cat-pill]').forEach(function(b){
            var cat=(b.getAttribute('data-cat-pill')||'').toLowerCase().trim();
            if(cat==='todos') return;
            if(homeDeseado.indexOf(cat)===-1) b.remove();
          });
          homeDeseado.forEach(function(cat){
            if(wrap.querySelector('[data-cat-pill="'+cat+'"]')) return;
            var b;
            if(cat==='ofertas'){
              b=document.createElement('button');
              b.type='button'; b.className='patina-cat-pill'; b.setAttribute('data-cat-pill','ofertas');
              b.textContent='Ofertas';
              b.addEventListener('click', function(){
                try{ window.__patinaCatFilter='ofertas'; }catch(e){}
                try{ if(window.patinaIrA) window.patinaIrA('todos'); }catch(e){}
              });
            } else {
              b=crearPildora(cat);
            }
            wrap.appendChild(b);
          });
          // Proporcion: si solo hay 2 en HOME, centrarlas (sin hueco vacio)
          var n=wrap.querySelectorAll('[data-cat-pill]').length;
          if(n===2){
            wrap.style.justifyContent='center';
            wrap.style.display='flex';
            wrap.style.gap='10px';
          } else {
            wrap.style.justifyContent='';
          }
        }
      });
      document.querySelectorAll('#patinaFormModal select option').forEach(function(opt){
        var v=(opt.value||opt.textContent||'').trim().toLowerCase();
        if(protegidas.indexOf(v)!==-1) return;
        if(!conteo[v] || conteo[v]===0) opt.remove();
      });
      document.querySelectorAll('img').forEach(function(img){
        try{
          if(document.body.innerText.toUpperCase().indexOf('PRUEBA')!==-1){
            if(img.clientWidth>150 && img.clientHeight>100){
              img.style.display='none';
              var padre=img.parentElement;
              if(padre && !padre.querySelector('.patina-sin-foto')){
                var d=document.createElement('div');
                d.className='patina-sin-foto';
                d.textContent='Sin foto';
                d.style.cssText='width:100%;height:280px;display:flex;align-items:center;justify-content:center;background:#e8e2d6;color:#8a7a5f;font-size:14px;letter-spacing:.1em;text-transform:uppercase;';
                padre.appendChild(d);
              }
            }
          }
        }catch(e){}
      });
      var ficha=null;
      document.querySelectorAll('div').forEach(function(d){
        if(d.textContent && d.textContent.indexOf('CANTIDAD')!==-1 && d.textContent.indexOf('Máx')!==-1 && !ficha) ficha=d;
      });
      if(ficha){
        var s=getUltimoStock();
        if(s && s>0 && ficha.innerHTML.indexOf('Máx. '+s)===-1){
          ficha.innerHTML=ficha.innerHTML.replace(/Máx\.\s*\d+\s*unidades/i, 'Máx. '+s+' unidades');
        }
      }
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
    }catch(e){}
  }
  document.addEventListener('click', function(){ setTimeout(corregir,150); setTimeout(corregir,500); setTimeout(corregir,900); }, true);
  setInterval(corregir, 700);
})();
