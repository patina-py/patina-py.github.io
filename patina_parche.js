// V21 = V20 + WhatsApp articulo individual con "Me das mas info?" al final. Carrito no se toca.
(function(){
  try{
    if(!document.getElementById('patina-nozoom')){
      var st=document.createElement('style');
      st.id='patina-nozoom';
      st.textContent='input,textarea,select{font-size:16px !important;} #patinaFormModal input,#patinaFormModal textarea,#patinaFormModal select{font-size:16px !important;}';
      document.head.appendChild(st);
    }
    if(!document.getElementById('patina-foto-chic')){
      var sf=document.createElement('style');
      sf.id='patina-foto-chic';
      sf.textContent=
        '#patinaFormModal .patina-foto{border:none !important; border-style:none !important; outline:none !important; background:rgba(255,255,255,0.08) !important; border-radius:14px !important; padding:8px 10px !important; margin:0 0 10px 0 !important; min-height:0 !important; height:auto !important; width:100% !important; max-width:100% !important; box-sizing:border-box !important; display:flex !important; align-items:center !important; gap:10px !important; overflow:hidden !important;}'+
        '#patinaFormModal .patina-foto img{width:56px !important; height:56px !important; min-width:56px !important; min-height:56px !important; max-width:56px !important; max-height:56px !important; object-fit:cover !important; border-radius:10px !important; border:none !important; flex-shrink:0 !important; display:block !important;}'+
        '#patinaFormModal .patina-foto .patina-foto-texto{display:flex !important; flex-direction:column !important; gap:2px !important; line-height:1.2 !important; min-width:0 !important; flex:1 !important;}'+
        '#patinaFormModal .patina-foto .patina-foto-titulo{font-size:11px !important; letter-spacing:.14em !important; font-weight:700 !important; text-transform:uppercase !important; color:#e8e2d6 !important; white-space:nowrap !important; overflow:hidden !important; text-overflow:ellipsis !important;}'+
        '#patinaFormModal .patina-foto .patina-foto-sub{font-size:12px !important; color:#b8ad9a !important; white-space:nowrap !important; overflow:hidden !important; text-overflow:ellipsis !important;}'+
        '#patinaFormModal .patina-foto .patina-foto-placeholder{width:56px !important; height:56px !important; min-width:56px !important; border-radius:10px !important; background:rgba(255,255,255,0.12) !important; display:flex !important; align-items:center !important; justify-content:center !important; font-size:22px !important; flex-shrink:0 !important;}';
      document.head.appendChild(sf);
    }
    var vp=document.querySelector('meta[name="viewport"]');
    if(vp && vp.content.indexOf('maximum-scale')===-1){
      vp.content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
    }
  }catch(e){}

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
  document.addEventListener('change', function(e){
    try{
      var sel=e.target;
      if(!sel || sel.tagName!=='SELECT') return;
      if(sel.value==='__nueva__'){
        var nombre=prompt('Escribí el nombre de la nueva categoría (ej: Termos)');
        if(nombre && nombre.trim()){
          var cat=nombre.trim().toLowerCase();
          var opt=document.createElement('option');
          opt.value=cat; opt.textContent=nombre.trim();
          sel.insertBefore(opt, sel.querySelector('option[value="__nueva__"]'));
          sel.value=cat;
          try{ sessionStorage.setItem('patina_nueva_categoria', cat); }catch(e){}
        } else {
          sel.value='';
        }
      }
    }catch(e){}
  }, true);

  function formatearWhatsAppIndividual(){
    try{
      document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"], a[href*="api.whatsapp"]').forEach(function(a){
        var href=a.getAttribute('href')||'';
        if(!href) return;
        var decoded='';
        try{ decoded=decodeURIComponent(href); }catch(e){ decoded=href; }
        if(decoded.toLowerCase().indexOf('carrito')!==-1) return;
        if(decoded.toLowerCase().indexOf('pedido')!==-1) return;
        if((decoded.match(/#00/g)||[]).length>1) return;
        if(decoded.indexOf('Me interesa el item')===-1 && decoded.indexOf('Me interesa el ítem')===-1 && decoded.indexOf('Me interesa')===-1) return;
        // Si ya tiene "Me das mas info?" y tiene saltos, no tocar
        if(decoded.indexOf('Me das')!==-1 && href.indexOf('%0A')!==-1){
          var c=(href.match(/%0A/gi)||[]).length;
          if(c>=4) return;
        }
        var m=decoded.match(/#(00\d+)\s*-\s*(.+?)\s*\(([^)]+)\)/);
        var numero=null, nombre=null, precio=null;
        if(m){
          numero=m[1]; nombre=m[2].trim(); precio=m[3].trim();
        } else {
          var m2=decoded.match(/#(00\d+)\s+(.+)/);
          if(m2){ numero=m2[1]; nombre=m2[2].trim(); precio=''; }
          else return;
        }
        var lineas=['Hola Pátina!','Me interesa el item #'+numero, nombre];
        if(precio) lineas.push(precio);
        lineas.push('Me das más info?');
        var texto=lineas.join('\n');
        var base=href.split('?')[0];
        var nuevo=base+'?text='+encodeURIComponent(texto);
        if(a.getAttribute('href')!==nuevo) a.setAttribute('href', nuevo);
        a.setAttribute('data-patina-wa-formateado','1');
      });
    }catch(e){}
  }

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
    try{
      if(window.patinaProductos && Array.isArray(window.patinaProductos) && window.patinaProductos.length) out=window.patinaProductos;
      if(window.__patinaProductos && Array.isArray(window.__patinaProductos) && window.__patinaProductos.length) out=window.__patinaProductos;
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
    return (cat||'•').charAt(0).toUpperCase();
  }
  function crearPildora(cat){
    var b=document.createElement('button');
    b.type='button'; b.className='patina-cat-pill'; b.setAttribute('data-cat-pill',cat);
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
  function estaEscribiendo(){
    try{
      var a=document.activeElement;
      if(!a) return false;
      var t=(a.tagName||'').toUpperCase();
      return t==='INPUT' || t==='TEXTAREA' || t==='SELECT' || a.isContentEditable;
    }catch(e){ return false; }
  }
  function arreglarFoto(){
    try{
      var m=document.getElementById('patinaFormModal');
      if(!m) return;
      var fotoBox=m.querySelector('.patina-foto');
      if(!fotoBox) return;
      if(fotoBox.getAttribute('data-foto-chic')==='1') return;
      fotoBox.setAttribute('data-foto-chic','1');
      var img=fotoBox.querySelector('img');
      var esEditar = document.body.innerText.indexOf('Editar producto')!==-1 || (m.querySelector('h2') && m.querySelector('h2').textContent.indexOf('Editar')!==-1);
      var titulo = esEditar ? 'CAMBIAR FOTO' : 'AGREGAR FOTO';
      var tieneImg = img && img.src && img.src.indexOf('placeholder')===-1;
      var fileInput=fotoBox.querySelector('input[type="file"]');
      var imgClone=null;
      if(tieneImg){ imgClone=img.cloneNode(true); }
      if(fileInput){ fileInput.style.display='none'; }
      fotoBox.innerHTML='';
      if(fileInput) fotoBox.appendChild(fileInput);
      if(imgClone){
        fotoBox.appendChild(imgClone);
      } else {
        var ph=document.createElement('div');
        ph.className='patina-foto-placeholder';
        ph.textContent='📷';
        fotoBox.appendChild(ph);
      }
      var txtWrap=document.createElement('div');
      txtWrap.className='patina-foto-texto';
      var t1=document.createElement('div');
      t1.className='patina-foto-titulo';
      t1.textContent=titulo;
      var t2=document.createElement('div');
      t2.className='patina-foto-sub';
      t2.textContent='Tocá para elegir de galería';
      txtWrap.appendChild(t1); txtWrap.appendChild(t2);
      fotoBox.appendChild(txtWrap);
      fotoBox.style.cursor='pointer';
      fotoBox.addEventListener('click', function(){
        try{
          var inp=fotoBox.querySelector('input[type="file"]') || m.querySelector('input[type="file"]');
          if(inp) inp.click();
        }catch(e){}
      });
    }catch(e){}
  }
  function corregir(){
    try{
      if(estaEscribiendo()) return;
      arreglarFoto();
      formatearWhatsAppIndividual();
      var prods=getProductos();
      var hayPildoras=document.querySelectorAll('[data-cat-pill]').length>0;
      var hayTarjetas=document.querySelectorAll('[data-product-id], .patina-card, .patina-product').length>0;
      var productosCargados = prods.length>0 && (hayPildoras || hayTarjetas || document.body.innerText.indexOf('#00')!==-1);
      if(!productosCargados) return;
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
      document.querySelectorAll('#patinaFormModal select').forEach(function(sel){
        sel.querySelectorAll('option').forEach(function(opt){
          var v=(opt.value||opt.textContent||'').trim().toLowerCase();
          if(v==='__nueva__') return;
          if(protegidas.indexOf(v)!==-1) return;
          if(v==='ofertas') return;
          if(!conteo[v] || conteo[v]===0) opt.remove();
        });
        var vals=[];
        sel.querySelectorAll('option').forEach(function(o){ vals.push((o.value||'').toLowerCase()); });
        catsConProductos.forEach(function(cat){
          if(vals.indexOf(cat)===-1){
            var o=document.createElement('option'); o.value=cat; o.textContent=cat.charAt(0).toUpperCase()+cat.slice(1);
            var nueva=sel.querySelector('option[value="__nueva__"]');
            if(nueva) sel.insertBefore(o, nueva);
            else sel.appendChild(o);
          }
        });
        if(!sel.querySelector('option[value="__nueva__"]')){
          var on=document.createElement('option'); on.value='__nueva__'; on.textContent='+ Nueva categoría...';
          sel.appendChild(on);
        }
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
      }
    }catch(e){}
  }
  document.addEventListener('click', function(){ setTimeout(corregir,150); setTimeout(corregir,500); setTimeout(corregir,900); }, true);
  setInterval(corregir, 1500);
})();
