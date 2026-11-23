// V22 = V21 + FIX REAL segun INDEX_FINAL: Foto solo CSS (no desarmar), Calc abajo de los 2 precios, Etiqueta arriba de Descripcion moviendo bloque completo, Botones con iconos visibles, Buscador Admin sin cerrar teclado
(function(){
  // --- CSS CORRECTO segun estructura real ---
  try{
    if(!document.getElementById('patina-v22-css')){
      var st=document.createElement('style');
      st.id='patina-v22-css';
      st.textContent=
        'input,textarea,select{font-size:16px !important;}'+
        '#patinaFormModal input,#patinaFormModal textarea,#patinaFormModal select{font-size:16px !important;}'+
        /* FOTO: no desarmar, solo CSS. Estructura real: label.patina-foto > span#patinaFotoIco (img) + span con #patinaFotoTxt + subtitulo */
        '#patinaFormModal .patina-foto{border:none !important; background:rgba(255,255,255,0.08) !important; border-radius:14px !important; padding:8px 10px !important; margin:0 0 10px 0 !important; height:auto !important; min-height:56px !important; max-height:none !important; overflow:hidden !important; display:flex !important; align-items:center !important; gap:10px !important; box-sizing:border-box !important;}'+
        '#patinaFormModal .patina-foto-ico{width:56px !important; height:56px !important; min-width:56px !important; min-height:56px !important; max-width:56px !important; max-height:56px !important; border-radius:10px !important; overflow:hidden !important; flex-shrink:0 !important; display:grid !important; place-items:center !important; font-size:22px !important;}'+
        '#patinaFormModal .patina-foto-ico img{width:100% !important; height:100% !important; object-fit:cover !important; display:block !important;}'+
        '#patinaFormModal .patina-foto > span:last-of-type{flex:1 !important; min-width:0 !important;}'+
        '#patinaFormModal #patinaFotoTxt{font-size:11px !important; letter-spacing:.14em !important; white-space:nowrap !important;}'+
        /* CALC: abajo de los 2 precios, ancho completo */
        '#patinaFormModal #patinaCalc{width:100% !important; display:block !important; margin:6px 0 2px 0 !important; text-align:left !important; font-size:11px !important; line-height:1.4 !important;}'+
        /* BOTONES: siempre visibles, con fondo para que no se corten */
        '#patinaFormModal .patina-form-btns{position:sticky !important; bottom:0 !important; background:#2F3A2A !important; padding:12px 0 4px 0 !important; margin-top:12px !important; z-index:10 !important;}'+
        '#patinaFormModal .patina-form-modal{padding-bottom:16px !important;}'+
        '.patina-search{font-size:16px !important;}';
      document.head.appendChild(st);
    }
    var vp=document.querySelector('meta[name="viewport"]');
    if(vp && vp.content.indexOf('maximum-scale')===-1){
      vp.content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
    }
  }catch(e){}

  var ultimoStock=null;
  // --- FIX TECLADO BUSCADOR ADMIN: patinaSetQ recrea toda la lista y saca el foco. Guardar posicion y devolver foco ---
  try{
    if(window.patinaSetQ && !window.patinaSetQ._v22){
      var origSetQ=window.patinaSetQ;
      var wrapped=function(v){
        var input=document.querySelector('.patina-search');
        var pos=0;
        try{ if(input) pos=input.selectionStart!=null?input.selectionStart:String(v).length; }catch(e){ pos=String(v).length; }
        origSetQ(v);
        setTimeout(function(){
          try{
            var inp=document.querySelector('.patina-search');
            if(inp){
              inp.focus();
              try{ var p=Math.min(pos, inp.value.length); inp.setSelectionRange(p,p); }catch(e){}
            }
          }catch(e){}
        }, 0);
      };
      wrapped._v22=true;
      window.patinaSetQ=wrapped;
    }
  }catch(e){}

  document.addEventListener('click', function(e){
    try{
      var btn=e.target.closest? e.target.closest('button') : null;
      if(!btn) return;
      if((btn.textContent||'').trim().toUpperCase().indexOf('GUARDAR')===-1 && (btn.textContent||'').trim().toUpperCase().indexOf('AGREGAR')===-1) {
        // Guardar en modal de producto es "Guardar" o "Agregar"
        if((btn.textContent||'').indexOf('Guardar')===-1 && (btn.textContent||'').indexOf('Agregar')===-1) return;
      }
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
        } else { sel.value=''; }
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
        if(decoded.indexOf('Me interesa el item')===-1 && decoded.indexOf('Me interesa')===-1) return;
        if(decoded.indexOf('Me das')!==-1 && href.indexOf('%0A')!==-1){
          var c=(href.match(/%0A/gi)||[]).length;
          if(c>=4) return;
        }
        var m=decoded.match(/#(00\d+)\s*-\s*(.+?)\s*\(([^)]+)\)/);
        var numero=null, nombre=null, precio=null;
        if(m){ numero=m[1]; nombre=m[2].trim(); precio=m[3].trim(); }
        else {
          var m2=decoded.match(/#(00\d+)\s+(.+)/);
          if(m2){ numero=m2[1]; nombre=m2[2].trim(); precio=''; } else return;
        }
        var lineas=['Hola Pátina!','Me interesa el item #'+numero, nombre];
        if(precio) lineas.push(precio);
        lineas.push('Me das más info?');
        var texto=lineas.join('\n');
        var base=href.split('?')[0];
        var nuevo=base+'?text='+encodeURIComponent(texto);
        if(a.getAttribute('href')!==nuevo) a.setAttribute('href', nuevo);
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
  // --- FIX MODAL: no desarmar nada, solo mover nodos completos ---
  function arreglarModal(){
    try{
      var modal=document.getElementById('patinaFormModal');
      if(!modal) return;
      // Si es modal de Nueva categoria o Eliminar, no tocar orden
      if(modal.innerText.indexOf('Nueva categoría')!==-1) return;
      if(modal.innerText.indexOf('¿Eliminar')!==-1) return;
      // 1) CALC: sacarlo de adentro de Precio Oferta y ponerlo abajo de los 2 precios
      var calc=document.getElementById('patinaCalc');
      if(calc){
        var row=calc.closest('.patina-row');
        if(row && calc.parentNode!==row.parentNode){
          // calc esta dentro de la columna de Precio Oferta, moverlo despues de la fila
          row.parentNode.insertBefore(calc, row.nextSibling);
          calc.style.cssText='width:100% !important; display:block !important; margin:6px 0 2px 0 !important; text-align:left !important; font-size:11px !important; line-height:1.4 !important;';
        } else if(row && calc.parentNode===row){
          // Si ya esta directo bajo row pero antes de algo, asegurar que quede despues
          if(calc.nextSibling!==null && calc.nextSibling!==row.nextSibling){
            // ya esta bien
          }
        }
        // Si calc quedo dentro de row pero no despues, mover
        if(row && row.contains(calc)){
          row.parentNode.insertBefore(calc, row.nextSibling);
        }
      }
      // 2) ETIQUETA arriba de DESCRIPCION, moviendo bloque completo (label + textarea)
      var eti=document.getElementById('patinaF_etiqueta');
      var des=document.getElementById('patinaF_descripcion');
      if(eti && des){
        var etiLabel=null, desLabel=null;
        modal.querySelectorAll('label').forEach(function(l){
          var t=(l.textContent||'').trim().toUpperCase();
          if(t.indexOf('ETIQUETA')!==-1) etiLabel=l;
          if(t.indexOf('DESCRIPCI')!==-1) desLabel=l;
        });
        if(etiLabel && desLabel){
          // Si Des esta antes que Eti, hay que mover Eti antes que Des
          // compareDocumentPosition: si Des precede a Eti, Des.compareDocumentPosition(Eti) tiene bit 4 (FOLLOWING)
          var desAntes = (desLabel.compareDocumentPosition(etiLabel) & 4) !== 0;
          if(desAntes){
            // Mover en orden: EtiLabel antes de DesLabel, luego EtiTextarea antes de DesLabel
            modal.insertBefore(etiLabel, desLabel);
            modal.insertBefore(eti, desLabel);
          }
        }
      }
      // 3) BOTONES con iconos, sin duplicar
      modal.querySelectorAll('.patina-form-btns button').forEach(function(b){
        var txt=(b.textContent||'').trim();
        if(b.classList.contains('patina-form-save')){
          if(txt.indexOf('✓')===-1 && txt.indexOf('✔')===-1){
            b.textContent='✓ ' + txt;
          }
        }
        if(b.classList.contains('patina-form-cancel')){
          if(txt.indexOf('✕')===-1 && txt.indexOf('✖')===-1){
            b.textContent='✕ ' + txt;
          }
        }
      });
    }catch(e){}
  }

  function corregir(){
    try{
      // Modal siempre se arregla aunque estes escribiendo, porque no toca el input con foco (solo mueve Calc/Etiqueta/Botones)
      // Pero si estas escribiendo en el buscador, no tocar pills para no perder foco
      arreglarModal();
      formatearWhatsAppIndividual();
      if(estaEscribiendo()){
        // Si estas en buscador Admin, no tocar pills/categorias para no cerrar teclado
        // Solo modal ya se arreglo arriba
        return;
      }
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
      if(hayOferta){ homeDeseado=catsConProductos.slice(0,2); homeDeseado.push('ofertas'); }
      else { homeDeseado=catsConProductos.slice(0,3); }
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
            } else { b=crearPildora(cat); }
            wrap.appendChild(b);
          });
          var n=wrap.querySelectorAll('[data-cat-pill]').length;
          if(n===2){ wrap.style.justifyContent='center'; wrap.style.display='flex'; wrap.style.gap='10px'; }
          else { wrap.style.justifyContent=''; }
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
    }catch(e){}
  }
  // Observer para cuando se abre el modal (renderForm recrea innerHTML)
  try{
    var mo=new MutationObserver(function(){ arreglarModal(); });
    mo.observe(document.documentElement, {childList:true, subtree:true});
  }catch(e){}
  document.addEventListener('click', function(){ setTimeout(corregir,150); setTimeout(corregir,500); setTimeout(corregir,900); }, true);
  setInterval(corregir, 1500);
  setTimeout(corregir, 300);
})();
