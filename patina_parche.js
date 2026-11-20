// FIX FINAL V20 - PRECIO GEMELAS (por texto) + DETALLE RESPETA STOCK + TIENDA = ADMIN + BORRAR SI BORRA (no resucita) + SCROLL + RENUMERA
(function(){
  console.log('PATINA V20 CARGADO');
  try{
    var meta=document.querySelector('meta[name="viewport"]');
    if(!meta){ meta=document.createElement('meta'); meta.setAttribute('name','viewport'); document.head.appendChild(meta); }
    meta.setAttribute('content','width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover');
  }catch(e){}
  var css = ""
  + "html{ -webkit-text-size-adjust:100%!important; touch-action:manipulation!important }"
  + "body{ touch-action:manipulation!important }"
  + "input, textarea, select, [contenteditable]{ font-size:16px!important; -webkit-text-size-adjust:100%!important }"
  + "input::placeholder, textarea::placeholder{ font-size:15px!important }"
  + "html,body{overscroll-behavior:none!important}"
  + "#patinaGrid, .patina-grid, .patina-products, [class*='product'], [class*='grid']{ transition:opacity .22s ease, transform .22s ease!important }"
  + ".patina-grid-cambiando{ opacity:0!important; transform:translateY(6px)!important }"
  + "#patinaFormOverlay:not(.open):not([class*='open']){ display:none!important; visibility:hidden!important; pointer-events:none!important }"
  + "#patinaFormOverlay.open, #patinaFormOverlay[class*='open']{ display:flex!important; visibility:visible!important; pointer-events:auto!important; position:fixed!important; inset:0!important; align-items:center!important; justify-content:center!important; padding:8px!important; overflow:hidden!important }"
  + ".patina-form-modal{width:100%!important;max-width:520px!important;height:auto!important;max-height:calc(100dvh - 16px)!important;overflow:hidden!important;overflow-y:hidden!important;padding:10px 12px 10px!important;gap:0!important;border-radius:20px!important;display:flex!important;flex-direction:column!important}"
  + ".patina-form-modal label{margin:4px 0 2px!important;font-size:9px!important;letter-spacing:.08em!important;line-height:1!important;flex-shrink:0!important}"
  + ".patina-form-modal input,.patina-form-modal textarea,.patina-form-modal select{padding:7px 10px!important;font-size:16px!important;line-height:1.2!important;flex-shrink:0!important;border-radius:12px!important}"
  + ".patina-form-modal #patinaF_nombre{height:38px!important;min-height:38px!important}"
  + ".patina-form-modal #patinaF_etiqueta{height:40px!important;min-height:40px!important;max-height:40px!important;overflow:hidden!important;font-size:16px!important}"
  + ".patina-form-modal #patinaF_descripcion{height:48px!important;min-height:48px!important;max-height:48px!important;overflow:hidden!important;font-size:16px!important;resize:none!important;white-space:pre-wrap!important}"
  + "#patinaFormModal .patina-row, .patina-form-modal .patina-row{display:flex!important;gap:8px!important;width:100%!important;max-width:100%!important;flex-shrink:0!important;box-sizing:border-box!important;align-items:stretch!important}"
  + "#patinaFormModal .patina-row > *, .patina-form-modal .patina-row > *{flex:1 1 0!important;flex-basis:0!important;min-width:0!important;width:50%!important;max-width:50%!important;box-sizing:border-box!important;padding:0!important;margin:0!important}"
  + "#patinaFormModal #patinaF_precio, #patinaFormModal #patinaF_precioOferta, .patina-form-modal #patinaF_precio, .patina-form-modal #patinaF_precioOferta{width:100%!important;max-width:100%!important;height:38px!important;min-height:38px!important;max-height:38px!important;padding:0 10px!important;font-size:16px!important;line-height:38px!important;border-radius:12px!important;box-sizing:border-box!important;border-width:1px!important;flex:none!important}"
  + ".patina-form-modal #patinaF_categoria,.patina-form-modal #patinaF_stock{height:38px!important;min-height:38px!important}"
  + ".patina-form-modal #patinaF_nuevaCategoria{height:38px!important;min-height:38px!important}"
  + ".patina-foto{display:flex!important;align-items:center!important;gap:8px!important;height:40px!important;min-height:40px!important;max-height:40px!important;overflow:hidden!important;padding:4px 10px!important;flex-shrink:0!important;margin:2px 0!important}"
  + ".patina-foto-ico{width:30px!important;height:30px!important;min-width:30px!important;min-height:30px!important;flex-shrink:0!important}"
  + ".patina-foto-ico img{width:100%!important;height:100%!important;object-fit:cover!important}"
  + ".patina-foto span{line-height:1.2!important;font-size:11px!important}"
  + "#patinaFotoTxt{font-size:11px!important;white-space:nowrap!important}"
  + ".patina-preview-line{font-size:10px!important;line-height:1.2!important;margin:3px 0 0!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}"
  + ".patina-form-btns{position:static!important;bottom:auto!important;background:transparent!important;background-color:transparent!important;padding:8px 0 0!important;margin-top:6px!important;box-shadow:none!important;border:none!important;display:flex!important;gap:8px!important;width:100%!important;flex-shrink:0!important}"
  + ".patina-form-btns button{flex:1 1 0!important;min-width:0!important;white-space:nowrap!important;padding:10px 6px!important;font-size:14px!important;height:42px!important;min-height:42px!important}"
  + ".patina-visible-row,.patina-form-modal .visible-row{margin:4px 0 0!important;flex-shrink:0!important}"
  + ".patina-cat-new{width:100%!important;flex-shrink:0!important}"
  + ".patina-form-modal h3,.patina-form-modal .patina-form-title{margin:0 0 2px!important;font-size:18px!important;line-height:1.1!important;flex-shrink:0!important}"
  + ".patina-form-modal .patina-form-sub{margin:0 0 4px!important;font-size:11px!important;line-height:1.2!important;flex-shrink:0!important}"
  + ".patina-form-modal #patinaBtnNuevaCat,.patina-form-modal #patinaBtnAgregarCat{height:34px!important;min-height:34px!important;padding:6px!important;font-size:12px!important;flex-shrink:0!important}"
  + ".patina-stock-msg{font-size:11px!important;color:#E8D5B5!important;margin-top:4px!important;text-align:center!important}";
  var s=document.createElement('style'); s.textContent=css; document.head.appendChild(s);
  function getAdmin(){
    try{ var raw=localStorage.getItem('patina_v25_admin'); if(!raw) return []; var a=JSON.parse(raw); return Array.isArray(a)?a:[]; }catch(e){ return []; }
  }
  function normName(n){ return String(n||'').toLowerCase().trim().replace(/\s+/g,' '); }
  function getDeleted(){
    try{ var raw=localStorage.getItem('patina_deleted_v1'); if(!raw) return []; var a=JSON.parse(raw); return Array.isArray(a)?a:[]; }catch(e){ return []; }
  }
  function markDeleted(nombre){
    try{
      var arr=getDeleted();
      var n=normName(nombre);
      arr=arr.filter(function(x){ return normName(x.nombre)!==n; });
      arr.push({nombre:n, ts:Date.now()});
      // Guardar solo ultimos 20 borrados, 10 minutos de proteccion
      localStorage.setItem('patina_deleted_v1', JSON.stringify(arr.slice(-20)));
    }catch(e){}
  }
  function isDeleted(nombre){
    var arr=getDeleted();
    var n=normName(nombre);
    var now=Date.now();
    for(var i=0;i<arr.length;i++){
      if(normName(arr[i].nombre)===n && (now - (arr[i].ts||0)) < 10*60*1000) return true;
    }
    return false;
  }
  // Interceptar Borrar / Eliminar en Admin: marcar el nombre como borrado antes de que la tienda lo resucite
  try{
    document.addEventListener('click', function(e){
      var btn=e.target.closest('button, [role="button"], a');
      if(!btn) return;
      var txt=(btn.textContent||'').trim().toLowerCase();
      if(txt.indexOf('borrar')===-1 && txt.indexOf('eliminar')===-1 && txt.indexOf('delete')===-1 && txt!=='🗑' && txt.indexOf('🗑')===-1) return;
      // Buscar el nombre del producto en la misma tarjeta / fila
      var card=btn.closest('[class*="product"], [class*="card"], [class*="item"], tr, li, div');
      var nombre='';
      if(card){
        var heads=card.querySelectorAll('h1, h2, h3, h4, [class*="name"], [class*="title"], strong, b');
        for(var i=0;i<heads.length;i++){ var t=(heads[i].textContent||'').trim(); if(t && t.length>1 && t.length<80){ nombre=t; break; } }
        if(!nombre){
          var txtCard=(card.textContent||'').trim();
          // Primer linea como nombre
          nombre=txtCard.split('\n')[0].trim().slice(0,80);
        }
      }
      if(nombre) markDeleted(nombre);
      // Tambien marcar si el modal de borrar tiene el nombre
      setTimeout(function(){
        try{
          var modales=document.querySelectorAll('[class*="modal"], [class*="Modal"]');
          modales.forEach(function(m){
            if(m.offsetHeight && m.textContent.toLowerCase().indexOf('eliminar')!==-1){
              var h=m.querySelector('h1, h2, h3, strong');
              if(h) markDeleted(h.textContent);
            }
          });
        }catch(e){}
      }, 100);
    }, true);
  }catch(e){}
  function stockDe(nombre){
    var arr=getAdmin();
    var n=normName(nombre);
    for(var i=0;i<arr.length;i++){
      if(normName(arr[i].nombre||arr[i].name)===n){
        var st=arr[i].stock;
        if(st===null || st===undefined || st==='' || String(st).toLowerCase().indexOf('sin')!==-1 || String(st).toLowerCase().indexOf('ilimit')!==-1) return 999;
        var num=parseInt(st,10);
        if(isNaN(num)) return 999;
        return num;
      }
    }
    return 999;
  }
  function clampDetalle(){
    try{
      var modales=document.querySelectorAll('[class*="modal"], [class*="Modal"], [id*="modal"], [id*="Modal"], [id*="Overlay"], [class*="overlay"]');
      modales.forEach(function(modal){
        if(!modal || !modal.offsetHeight) return;
        if(modal.id && (modal.id.toLowerCase().indexOf('form')!==-1 || modal.id.toLowerCase().indexOf('admin')!==-1)) return;
        if(modal.className && (String(modal.className).toLowerCase().indexOf('form')!==-1 || String(modal.className).toLowerCase().indexOf('admin')!==-1)) return;
        var btns=modal.querySelectorAll('button, [role="button"]');
        var btnMas=null, btnMenos=null, qtyEl=null;
        btns.forEach(function(b){
          var t=(b.textContent||'').trim();
          if(t==='+') btnMas=b;
          if(t==='-' || t==='–' || t==='−') btnMenos=b;
        });
        if(!btnMas) return;
        var parent=btnMas.parentElement;
        if(parent){
          var nums=parent.querySelectorAll('span, div, input');
          nums.forEach(function(n){
            var v=(n.tagName==='INPUT'? n.value : n.textContent||'').trim();
            if(/^\d+$/.test(v) && n!==btnMas && n!==btnMenos) qtyEl=n;
          });
        }
        if(!qtyEl) return;
        var tituloEl=modal.querySelector('h1, h2, h3, [class*="title"], [class*="name"]');
        var nombre=tituloEl ? tituloEl.textContent.trim() : '';
        if(!nombre || nombre.length<2){
          var heads=modal.querySelectorAll('h1, h2, h3, h4');
          if(heads.length) nombre=heads[0].textContent.trim();
        }
        if(!nombre) return;
        var stock=stockDe(nombre);
        if(stock>=999) return;
        var qty=parseInt(qtyEl.tagName==='INPUT'? qtyEl.value : qtyEl.textContent, 10);
        if(isNaN(qty)) qty=1;
        if(qty>stock){
          if(qtyEl.tagName==='INPUT') qtyEl.value=stock; else qtyEl.textContent=String(stock);
          qty=stock;
        }
        if(qty>=stock){
          btnMas.style.setProperty('opacity','0.35','important');
          btnMas.style.setProperty('pointer-events','none','important');
          btnMas.setAttribute('disabled','true');
        } else {
          btnMas.style.setProperty('opacity','1','important');
          btnMas.style.setProperty('pointer-events','auto','important');
          btnMas.removeAttribute('disabled');
        }
        var msg=modal.querySelector('.patina-stock-msg');
        if(!msg && parent){
          msg=document.createElement('div');
          msg.className='patina-stock-msg';
          parent.parentElement ? parent.parentElement.appendChild(msg) : parent.appendChild(msg);
        }
        if(msg){
          msg.textContent = stock<=0 ? 'Sin stock' : 'Solo quedan ' + stock + ' unidades';
          msg.style.display='block';
        }
        if(!btnMas.dataset.patinaStockGuard){
          btnMas.dataset.patinaStockGuard='1';
          btnMas.addEventListener('click', function(e){
            var q2=parseInt(qtyEl.tagName==='INPUT'? qtyEl.value : qtyEl.textContent, 10);
            if(!isNaN(q2) && q2>=stock){ e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); return false; }
          }, true);
        }
      });
    }catch(e){}
  }
  try{
    var origGet = window.__patinaGetProducts;
    window.__patinaGetProducts = function(){
      var admin=getAdmin();
      if(admin && admin.length) return admin;
      if(origGet) return origGet();
      return admin;
    };
  }catch(e){}
  function igualarPorTexto(){
    try{
      var modales=document.querySelectorAll('[class*="modal"], [class*="Modal"], [id*="modal"], [id*="Modal"], [id*="Form"], [class*="form"]');
      var candidatos=[];
      if(document.getElementById('patinaFormModal')) candidatos.push(document.getElementById('patinaFormModal'));
      if(document.getElementById('patinaFormOverlay')) candidatos.push(document.getElementById('patinaFormOverlay'));
      modales.forEach(function(m){ candidatos.push(m); });
      function buscarEn(root){
        if(!root || !root.querySelectorAll) return null;
        var labels=root.querySelectorAll('label, span, div, p');
        var labelPrecio=null, labelOferta=null;
        labels.forEach(function(l){
          if(l.children.length>0) return;
          var t=(l.textContent||'').trim().toUpperCase();
          if(t==='PRECIO') labelPrecio=l;
          if(t==='PRECIO OFERTA' || t==='PRECIO OFERTA*') labelOferta=l;
        });
        if(!labelPrecio || !labelOferta) return null;
        function inputDe(label){
          var fid=label.getAttribute('for');
          if(fid){ var el=document.getElementById(fid); if(el) return el; }
          var sib=label.nextElementSibling;
          while(sib){ if(sib.tagName==='INPUT' || sib.tagName==='SELECT') return sib; if(sib.querySelector){ var inner=sib.querySelector('input, select'); if(inner) return inner; } sib=sib.nextElementSibling; }
          var padre=label.parentElement;
          if(padre){ var inp=padre.querySelector('input, select'); if(inp) return inp; var abuelo=padre.parentElement; if(abuelo){ var inp2=abuelo.querySelector('input, select'); if(inp2) return inp2; } }
          return null;
        }
        var inpPrecio=inputDe(labelPrecio);
        var inpOferta=inputDe(labelOferta);
        if(!inpPrecio || !inpOferta) return null;
        return {p1:inpPrecio, p2:inpOferta, l1:labelPrecio, l2:labelOferta};
      }
      var par=null;
      for(var i=0;i<candidatos.length && !par;i++){ par=buscarEn(candidatos[i]); }
      if(!par) par=buscarEn(document);
      if(!par) return;
      [par.p1, par.p2].forEach(function(el){
        el.style.setProperty('width','100%','important');
        el.style.setProperty('height','38px','important');
        el.style.setProperty('min-height','38px','important');
        el.style.setProperty('max-height','38px','important');
        el.style.setProperty('padding','0 10px','important');
        el.style.setProperty('font-size','16px','important');
        el.style.setProperty('line-height','38px','important');
        el.style.setProperty('border-radius','12px','important');
        el.style.setProperty('box-sizing','border-box','important');
        el.style.setProperty('border-width','1px','important');
        el.style.setProperty('margin','0','important');
        el.style.setProperty('flex','none','important');
        var padre=el.parentElement;
        if(padre){
          padre.style.setProperty('flex','1 1 0','important');
          padre.style.setProperty('flex-basis','0','important');
          padre.style.setProperty('min-width','0','important');
          padre.style.setProperty('width','50%','important');
          padre.style.setProperty('max-width','50%','important');
          padre.style.setProperty('box-sizing','border-box','important');
          padre.style.setProperty('padding','0','important');
          padre.style.setProperty('margin','0','important');
          var fila=padre.parentElement;
          if(fila){
            fila.style.setProperty('display','flex','important');
            fila.style.setProperty('gap','8px','important');
            fila.style.setProperty('width','100%','important');
            fila.style.setProperty('box-sizing','border-box','important');
            fila.style.setProperty('align-items','stretch','important');
          }
        }
      });
      [par.l1, par.l2].forEach(function(l){
        l.style.setProperty('font-size','9px','important');
        l.style.setProperty('margin','4px 0 2px','important');
        l.style.setProperty('line-height','1','important');
      });
    }catch(e){}
  }
  var scrollGuardado=0; var modalAbierto=false;
  function esModalDetalle(){
    var cands=document.querySelectorAll('[class*="modal"], [class*="overlay"], [id*="modal"], [id*="Modal"], [id*="Overlay"]');
    for(var i=0;i<cands.length;i++){
      var el=cands[i];
      if(el.id && (el.id.toLowerCase().indexOf('form')!==-1 || el.id.toLowerCase().indexOf('admin')!==-1)) continue;
      if(el.className && (String(el.className).toLowerCase().indexOf('form')!==-1 || String(el.className).toLowerCase().indexOf('admin')!==-1)) continue;
      if(el.classList && (el.classList.contains('open') || el.style.display==='flex' || el.style.display==='block')){
        if(el.offsetHeight>0) return true;
      }
    }
    return false;
  }
  try{
    document.addEventListener('click', function(e){
      var card=e.target.closest('[class*="product"], [class*="card"], [data-id], [data-product]');
      var esCierre = e.target.closest('button, [role="button"], a');
      var txtCierre = esCierre ? (esCierre.textContent||'').trim().toLowerCase() : '';
      var esX = esCierre && (txtCierre==='x' || txtCierre==='×' || txtCierre.indexOf('cerrar')!==-1 || txtCierre.indexOf('volver')!==-1);
      if(card && !e.target.closest('#patinaAdminOverlay') && !e.target.closest('#patinaFormModal')){
        scrollGuardado=window.scrollY || document.documentElement.scrollTop || 0;
        modalAbierto=true;
        setTimeout(function(){ var y=window.scrollY||0; if(y===0 && scrollGuardado>100) window.scrollTo(0, scrollGuardado); }, 50);
        setTimeout(function(){ var y2=window.scrollY||0; if(y2===0 && scrollGuardado>100) window.scrollTo(0, scrollGuardado); }, 250);
      }
      if(esX && modalAbierto){
        setTimeout(function(){ window.scrollTo(0, scrollGuardado); modalAbierto=false; }, 80);
        setTimeout(function(){ window.scrollTo(0, scrollGuardado); }, 350);
      }
    }, true);
    var mo=new MutationObserver(function(){
      var abierto=esModalDetalle();
      if(!abierto && modalAbierto){ setTimeout(function(){ window.scrollTo(0, scrollGuardado); modalAbierto=false; }, 100); }
    });
    mo.observe(document.documentElement, {childList:true, subtree:true, attributes:true, attributeFilter:['class','style']});
    document.addEventListener('keydown', function(e){ if(e.key==='Escape' && modalAbierto){ setTimeout(function(){ window.scrollTo(0, scrollGuardado); modalAbierto=false; }, 120); } });
  }catch(e){}
  try{
    document.addEventListener('click', function(e){
      var btn=e.target.closest('button, [role="button"], a');
      if(!btn) return;
      if(btn.closest('#patinaFormModal')) return;
      if(btn.closest('[class*="product-modal"], [class*="detalle"], [class*="detail"], [class*="cantidad"], [class*="qty"]')) return;
      var txt=(btn.textContent||'').trim();
      if(txt==='+' || txt==='-' || txt==='＋' || txt==='－') return;
      if(txt.toLowerCase().indexOf('agregar')!==-1 || txt.toLowerCase().indexOf('comprar')!==-1 || txt.toLowerCase().indexOf('a\u00f1adir')!==-1) return;
      var cls=(btn.className||'').toLowerCase();
      var parentCls=((btn.parentElement && btn.parentElement.className)||'').toLowerCase();
      var esPildora = cls.indexOf('cat')!==-1 || cls.indexOf('pill')!==-1 || cls.indexOf('categoria')!==-1 || parentCls.indexOf('cat')!==-1 || parentCls.indexOf('pill')!==-1 || parentCls.indexOf('categoria')!==-1 || btn.getAttribute('data-cat') || btn.getAttribute('data-categoria');
      if(!esPildora) return;
      var grids=document.querySelectorAll('#patinaGrid, .patina-grid, .patina-products');
      if(!grids.length) grids=document.querySelectorAll('[class*="grid"]');
      grids.forEach(function(g){ g.classList.add('patina-grid-cambiando'); setTimeout(function(){ g.classList.remove('patina-grid-cambiando'); }, 260); });
    }, true);
  }catch(e){}
  try{
    if(window.visualViewport){
      window.visualViewport.addEventListener('resize', function(){
        var m=document.getElementById('patinaFormModal');
        if(m && document.getElementById('patinaFormOverlay') && document.getElementById('patinaFormOverlay').classList.contains('open')){
          m.style.maxHeight=(window.visualViewport.height - 16)+'px';
        }
      });
    }
  }catch(e){}
  function fixAll(){
    igualarPorTexto();
    clampDetalle();
    try{
      var modal=document.getElementById('patinaFormModal');
      if(modal){
        var labels=modal.querySelectorAll('label');
        var etiLabel=null, desLabel=null, etiInput=null, desInput=null;
        labels.forEach(function(l){
          var t=(l.textContent||'').toUpperCase();
          if(t.indexOf('ETIQUETA')!==-1) etiLabel=l;
          if(t.indexOf('DESCRIPCI')!==-1) desLabel=l;
        });
        var inputs=modal.querySelectorAll('input, textarea');
        inputs.forEach(function(inp){
          var ph=(inp.placeholder||'').toUpperCase();
          if(ph.indexOf('IMAGEN ILUSTRATIVA')!==-1 || ph.indexOf('ETIQUETA')!==-1) etiInput=inp;
          if(ph.indexOf('DESCRIPCION')!==-1 || ph.indexOf('DESCRIPCI')!==-1) desInput=inp;
        });
        if(!etiInput) etiInput=document.getElementById('patinaF_etiqueta');
        if(!desInput) desInput=document.getElementById('patinaF_descripcion');
        if(etiLabel && desLabel && etiInput && desInput){
          if(desLabel.compareDocumentPosition(etiLabel) & 4){
            var pEti=etiLabel.parentElement, pDes=desLabel.parentElement;
            if(pEti && pDes && pEti!==modal && pEti===etiInput.parentElement && pDes===desInput.parentElement && pEti!==pDes){
              pDes.parentElement.insertBefore(pEti, pDes);
            } else {
              modal.insertBefore(etiLabel, desLabel);
              modal.insertBefore(etiInput, desLabel);
            }
          }
        }
      }
    }catch(e){}
    try{
      var modal2=document.getElementById('patinaFormModal');
      if(modal2){
        var preview=null;
        var all=modal2.querySelectorAll('*');
        all.forEach(function(el){ if(el.children.length===0 && el.textContent.indexOf('Se va a mostrar')!==-1) preview=el; });
        if(preview){
          preview.style.display='block'; preview.style.width='100%'; preview.style.maxWidth='100%'; preview.style.gridColumn='1 / -1';
          preview.style.fontSize='10px'; preview.style.lineHeight='1.2'; preview.style.margin='3px 0 0'; preview.style.whiteSpace='nowrap'; preview.style.overflow='hidden'; preview.style.textOverflow='ellipsis'; preview.style.textAlign='left'; preview.style.flexShrink='0';
          preview.classList.add('patina-preview-line');
          var etiLabel2=null;
          var labs2=modal2.querySelectorAll('label');
          labs2.forEach(function(l){ if((l.textContent||'').toUpperCase().indexOf('ETIQUETA')!==-1) etiLabel2=l; });
          var precioInput=document.getElementById('patinaF_precio');
          var filaPrecios=null;
          if(precioInput){
            var padreDirecto=precioInput.parentElement;
            if(padreDirecto && padreDirecto.querySelector('#patinaF_precioOferta')) filaPrecios=padreDirecto;
          }
          if(filaPrecios && filaPrecios.parentElement===modal2){
            if(preview.parentElement!==modal2 || preview.previousSibling!==filaPrecios){
              modal2.insertBefore(preview, filaPrecios.nextSibling);
            }
          } else if(etiLabel2 && preview.compareDocumentPosition(etiLabel2) & 4){
            modal2.insertBefore(preview, etiLabel2);
          }
        }
      }
    }catch(e){}
    try{
      var inputs2=document.querySelectorAll('input, textarea, select');
      inputs2.forEach(function(i){ if(i.style.fontSize!== '16px') i.style.fontSize='16px'; });
    }catch(e){}
  }
  setInterval(fixAll, 400);
  try{
    var lastTouch=0;
    document.addEventListener('touchend', function(e){
      var now=Date.now();
      if(now-lastTouch<300){ e.preventDefault(); }
      lastTouch=now;
    }, {passive:false});
  }catch(e){}
})();
// PATINA V20 - RENUMERA + SINCRONIZACION CON CANDADO + BORRAR NO RESUCITA
(function(){
  "use strict";
  var GAS_URL = "https://script.google.com/macros/s/AKfycbznKXsIvfuR_kb4UIwHk2QtjaqOlGUW9imJFjXDKfWuanUCFZOtbPLSXVlwAx8mr_I2UQ/exec";
  try{ var saved=localStorage.getItem("patina_gas_url_v1"); if(saved) GAS_URL=saved; }catch(e){}
  var KEY='patina_v25_admin';
  var CATS_KEY='patina_v25_cats';
  function getLocal(){ try{ var raw=localStorage.getItem(KEY); if(!raw) return []; var a=JSON.parse(raw); return Array.isArray(a)?a:[]; }catch(e){ return []; } }
  function saveLocal(arr){ try{ localStorage.setItem(KEY, JSON.stringify(arr)); }catch(e){} }
  function normId(id){ return String(id||'').padStart(4,'0'); }
  function normName(n){ return String(n||'').toLowerCase().trim().replace(/\s+/g,' '); }
  function normVisible(v){ if(v===false || v==='false' || v==='FALSE' || v===0 || v==='0' || v==='no' || v==='NO') return false; return true; }
  function getDeleted(){ try{ var raw=localStorage.getItem('patina_deleted_v1'); if(!raw) return []; var a=JSON.parse(raw); return Array.isArray(a)?a:[]; }catch(e){ return []; } }
  function isDeleted(nombre){
    var arr=getDeleted(); var n=normName(nombre); var now=Date.now();
    for(var i=0;i<arr.length;i++){ if(normName(arr[i].nombre)===n && (now-(arr[i].ts||0))<10*60*1000) return true; }
    return false;
  }
  function cleanByName(arr){
    var map={}; var order=[];
    arr.forEach(function(d){
      var key=normName(d.nombre || d.name || '');
      if(!key) return;
      // Si esta marcado como borrado hace menos de 10 min, no lo traigas de vuelta
      if(isDeleted(key)) return;
      if(!map[key]){
        var c={}; for(var k in d) c[k]=d[k];
        c.id=normId(c.id); if('visible' in c) c.visible=normVisible(c.visible);
        map[key]=c; order.push(key);
      } else {
        var keep=map[key]; var dup=d;
        if(!keep.foto && dup.foto) keep.foto=dup.foto;
        if(!keep.descripcion && dup.descripcion) keep.descripcion=dup.descripcion;
        if(!keep.etiqueta && dup.etiqueta) keep.etiqueta=dup.etiqueta;
        if((!keep.precio || keep.precio===0) && dup.precio) keep.precio=dup.precio;
        if(normVisible(dup.visible)) keep.visible=true;
        if(dup.stock!==undefined && dup.stock!=='' && String(dup.stock).toLowerCase().indexOf('sin')===-1) keep.stock=dup.stock;
      }
    });
    return order.map(function(k){ return map[k]; });
  }
  function renumerar(arr){
    var ids={}; var duplicado=false;
    arr.forEach(function(d){ var id=normId(d.id); if(ids[id]) duplicado=true; ids[id]=1; });
    var todosCero = arr.length>0 && arr.every(function(d){ return normId(d.id)==='0000'; });
    if(!duplicado && !todosCero) return arr;
    return arr.map(function(d,i){ var c={}; for(var k in d) c[k]=d[k]; c.id=String(i+1).padStart(4,'0'); return c; });
  }
  function stripFoto(arr){ return arr.map(function(d){ var c={}; for(var k in d){ c[k]=d[k]; } if(typeof c.foto==='string' && c.foto.length>48000) c.foto=''; return c; }); }
  var lastPushed=''; var gasCount=0;
  function postNow(force){
    var loc=renumerar(cleanByName(getLocal())); if(!loc.length) return;
    var payload={action:'save_all', productos: stripFoto(loc), categorias: [], password:'PATINA2026'};
    try{ var cats=localStorage.getItem(CATS_KEY); if(cats) payload.categorias=JSON.parse(cats); }catch(e){}
    var sig=JSON.stringify(payload.productos);
    if(!force && sig===lastPushed) return;
    lastPushed=sig;
    fetch(GAS_URL,{method:'POST', body: JSON.stringify(payload)}).catch(function(){ lastPushed=''; });
  }
  try{
    var l0=getLocal();
    if(l0.length>0){
      var c0=renumerar(cleanByName(l0));
      if(JSON.stringify(c0)!==JSON.stringify(l0)){ saveLocal(c0); setTimeout(function(){ postNow(true); }, 1500); }
    }
  }catch(e){}
  var lastLocal='';
  try{ lastLocal=JSON.stringify(renumerar(cleanByName(getLocal()))); }catch(e){}
  setInterval(function(){
    try{
      var cur=JSON.stringify(renumerar(cleanByName(getLocal())));
      if(cur && cur!==lastLocal){ lastLocal=cur; setTimeout(function(){ postNow(false); }, 2000); }
    }catch(e){}
  }, 2000);
  function getFromGAS(){
    if(document.getElementById('patinaAdminOverlay') && document.getElementById('patinaAdminOverlay').classList.contains('open')) return;
    if(document.getElementById('patinaFormOverlay') && document.getElementById('patinaFormOverlay').classList.contains('open')) return;
    if(document.activeElement && (document.activeElement.tagName==='INPUT' || document.activeElement.tagName==='TEXTAREA')) return;
    fetch(GAS_URL).then(function(r){ return r.json(); }).then(function(gas){
      if(!Array.isArray(gas) || !gas.length) return;
      gasCount=cleanByName(gas).length;
      var loc=getLocal();
      var gasClean=renumerar(cleanByName(gas));
      var fotoMap={}; cleanByName(loc).forEach(function(d){ if(d.foto) fotoMap[normName(d.nombre)]=d.foto; });
      gasClean.forEach(function(d){ if(!d.foto && fotoMap[normName(d.nombre)]) d.foto=fotoMap[normName(d.nombre)]; });
      var locClean=renumerar(cleanByName(loc));
      if(JSON.stringify(gasClean)!==JSON.stringify(locClean)){
        // V20: si la diferencia es que en local falta algo que esta en GAS pero ese algo esta marcado como borrado, NO lo restaures. Empuja local a GAS para borrarlo alla tambien.
        var gasSolo=gasClean.filter(function(g){ return !locClean.some(function(l){ return normName(l.nombre||l.name)===normName(g.nombre||g.name); }); });
        var todoBorrado = gasSolo.length>0 && gasSolo.every(function(g){ return isDeleted(g.nombre||g.name); });
        if(todoBorrado || gasClean.length < locClean.length){
          setTimeout(function(){ postNow(true); }, 1000);
          return;
        }
        // Si local tiene menos productos pero NO es borrado, antes se restauraba. Ahora solo restaura si local esta vacio o casi vacio (corrupcion real). Si no, empuja local.
        if(gasClean.length > locClean.length && locClean.length>=30){
          setTimeout(function(){ postNow(true); }, 1000);
          return;
        }
        saveLocal(gasClean);
        lastLocal=JSON.stringify(gasClean);
        lastPushed=JSON.stringify(stripFoto(gasClean));
        try{ if(window.patinaRefrescarTienda) window.patinaRefrescarTienda(); }catch(e){}
        setTimeout(function(){ try{ if(window.patinaRefrescarTienda) window.patinaRefrescarTienda(); }catch(e){} }, 800);
      }
    }).catch(function(){});
  }
  setTimeout(getFromGAS, 1500);
  setInterval(getFromGAS, 15000);
  window.patinaPostNow=function(){ postNow(true); };
})();
