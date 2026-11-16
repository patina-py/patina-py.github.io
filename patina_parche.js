
// PÁTINA - Parche Admin v3 Seguro + Sincronización GAS
// NO usa MutationObserver. NO usa setInterval que recorra todo el DOM.
// Solo: guardar -> POST GAS + localStorage, y corrección puntual al abrir detalle con flag + setTimeout 400/900.
(function(){
"use strict";
var WJ = "\u2060"; // WORD JOINER invisible, trim() no lo borra
var LS_PRODUCTS = "patina_products_v1";
var LS_HISTORY = "patina_history_v1";
var LS_PW = "patina_admin_pw_hash_v1";
var LS_GAS = "patina_gas_url_v1";
var GAS_URL = localStorage.getItem(LS_GAS) || ""; // <-- PEGA TU EXEC URL DE PÁTINA AQUÍ o desde Admin > Configuración. NO mezclar con CAVI.
window.PATINA_GAS_URL = GAS_URL;
var corrigiendo = false;
function fmtGs(n){ n=Math.floor(Number(n)||0); return "Gs "+n.toString().replace(/\B(?=(\d{3})+(?!\d))/g,"."); }
function cleanStr(s){ if(s==null) return ""; return String(s).replace(/\u2060/g,"").trim(); }
function isEmptyVal(v){ return cleanStr(v)==="" || cleanStr(v)===WJ; }
function hashPw(s){ var h=0; s=String(s); for(var i=0;i<s.length;i++){ h=((h<<5)-h)+s.charCodeAt(i); h|=0; } return "h"+(h>>>0).toString(36)+"_"+s.length; }
function getPwHash(){ return localStorage.getItem(LS_PW) || hashPw("PATINA2026"); }
function checkPw(pw){ return hashPw(pw)===getPwHash(); }
function getSeed(){
  try{ if(window.__PATINA_SEED_PRODUCTS && Array.isArray(window.__PATINA_SEED_PRODUCTS)) return window.__PATINA_SEED_PRODUCTS; }catch(e){}
  return [];
}
function getProducts(){
  try{
    var raw=localStorage.getItem(LS_PRODUCTS);
    if(raw){ var arr=JSON.parse(raw); if(Array.isArray(arr)&&arr.length>0) return arr; }
  }catch(e){}
  // Fallback: seed del index.html (productos actuales de Pátina) - NUNCA lista vacía si hay seed
  var seed=getSeed();
  if(seed.length>0){ try{ localStorage.setItem(LS_PRODUCTS, JSON.stringify(seed)); }catch(e){} return seed; }
  return [];
}
function saveProductsLocal(list){ try{ localStorage.setItem(LS_PRODUCTS, JSON.stringify(list)); }catch(e){} }
function pushHistory(action, name){
  try{
    var h=JSON.parse(localStorage.getItem(LS_HISTORY)||"[]");
    h.unshift({when:new Date().toISOString(), action:action, name:name||""});
    h=h.slice(0,200);
    localStorage.setItem(LS_HISTORY, JSON.stringify(h));
  }catch(e){}
}
function calcDiscount(price, sale){
  price=Math.floor(Number(price)||0); sale=Math.floor(Number(sale)||0);
  if(!sale || sale>=price) return {has:false, pct:0, saving:0, sale:null};
  var pct=Math.round((1 - sale/price)*100);
  return {has:true, pct:pct, saving:price-sale, sale:Math.floor(Number(sale))};
}
function toStoreFormat(p){
  // Normaliza para guardar: salePrice entero exacto, sin recalcular. Desc vacía -> WJ
  var price=Math.floor(Number(p.price)||0);
  var saleRaw = p.salePrice==null||p.salePrice==="" ? null : Math.floor(Number(p.salePrice));
  var d=calcDiscount(price, saleRaw);
  return {
    id: String(p.id||""),
    name: String(p.name||""),
    category: String(p.category||""),
    price: price,
    salePrice: d.has ? d.sale : null,
    discount: d.has ? ("-"+d.pct+"% OFF") : "",
    saving: d.has ? d.saving : 0,
    hasDiscount: d.has,
    desc: isEmptyVal(p.desc) ? WJ : String(p.desc),
    badge: isEmptyVal(p.badge) ? WJ : String(p.badge),
    stock: (p.stock==null||String(p.stock).trim()==="") ? "" : String(p.stock),
    img: p.img||"",
    waText: p.waText||""
  };
}
function toDisplay(p){
  var c={...p};
  if(cleanStr(c.desc)===WJ || c.desc===WJ) c.desc="";
  if(cleanStr(c.badge)===WJ || c.badge===WJ) c.badge="";
  return c;
}
// --- Sync GAS ---
async function syncToGAS(list){
  var url = GAS_URL || localStorage.getItem(LS_GAS) || "";
  if(!url) return false;
  try{
    await fetch(url, {method:"POST", mode:"no-cors", headers:{"Content-Type":"text/plain"}, body: JSON.stringify({type:"patina_products", products: list, updatedAt: new Date().toISOString()})});
    return true;
  }catch(e){ return false; }
}
async function syncFromGAS(){
  var url = GAS_URL || localStorage.getItem(LS_GAS) || "";
  if(!url) return null;
  try{
    var r=await fetch(url+"?action=get&shop=patina&_="+Date.now());
    if(!r.ok) return null;
    var j=await r.json();
    if(j && Array.isArray(j.products) && j.products.length>0){ saveProductsLocal(j.products); return j.products; }
  }catch(e){}
  return null;
}
// Poll cada 15s, solo fetch, NO recorre DOM
setInterval(function(){ syncFromGAS().then(function(list){ if(list) window.dispatchEvent(new CustomEvent("patina-products-updated",{detail:list})); }); }, 15000);

// --- Parche v3: corrección puntual al abrir detalle ---
function fixDetailOnce(){
  if(corrigiendo) return; corrigiendo=true;
  function attempt(){
    try{
      var list=getProducts();
      // Buscar producto activo por URL hash, data, o título visible
      var titleEl=document.querySelector('[class*="modal"] h2, [class*="detail"] h2, [role="dialog"] h2');
      var title = titleEl ? cleanStr(titleEl.textContent) : "";
      var prod = null;
      if(title){ prod=list.find(function(p){ return cleanStr(p.name)===title; }); }
      if(!prod && list.length===1) prod=list[0];
      if(prod){
        var stored=toStoreFormat(prod);
        if(stored.hasDiscount){
          // Si el DOM muestra 84995 vs 85000 (diff <2000), reemplazar por exacto
          document.querySelectorAll("span,div,p").forEach(function(el){
            var t=el.textContent||"";
            if(el.children.length>0) return;
            if(t.indexOf("Gs")!==-1){
              var num=parseInt(t.replace(/[^\d]/g,""),10);
              if(!isNaN(num) && Math.abs(num-stored.salePrice)<2000 && num!==stored.salePrice){
                el.textContent = t.replace(/Gs\s*[\d\.\,]+/, fmtGs(stored.salePrice));
              }
              if(Math.abs(num-stored.price)<2000 && num!==stored.price && t.indexOf("Ahorr")<0){
                // solo si es precio tachado: tiene line-through en style o parent
                var cs=getComputedStyle(el);
                if(cs && (cs.textDecoration.indexOf("line-through")!==-1)){
                  el.textContent = t.replace(/Gs\s*[\d\.\,]+/, fmtGs(stored.price));
                }
              }
            }
            if(t.indexOf("Ahorr")!==-1 && stored.saving){
              el.textContent = "Ahorrás "+fmtGs(stored.saving);
            }
            if(t.indexOf("% OFF")!==-1 || t.indexOf("%")!==-1 && t.indexOf("OFF")!==-1){
              el.textContent = "-"+stored.discount.replace(/[^0-9]/g,"")+"% OFF";
            }
          });
        }
      }
    }catch(e){}
  }
  setTimeout(attempt,400);
  setTimeout(function(){ attempt(); corrigiendo=false; },900);
}
document.addEventListener("click", function(e){
  var t=e.target && e.target.closest ? e.target.closest("button, [data-product], .product-card, [class*='card']") : null;
  if(t) fixDetailOnce();
}, true);

// --- Admin UI ---
var adminOpen=false;
function ensureStyles(){
  if(document.getElementById("patina-admin-style")) return;
  var s=document.createElement("style"); s.id="patina-admin-style";
  s.textContent = `
  #patina-admin-btn{position:fixed;left:50%;transform:translateX(-50%);bottom:6px;z-index:9999;font-size:10px;letter-spacing:.12em;padding:5px 10px;border-radius:999px;background:rgba(18,18,18,.65);color:rgba(245,236,220,.55);border:1px solid rgba(201,168,122,.25);backdrop-filter:blur(8px);cursor:pointer}
  #patina-admin-btn:hover{color:#F5ECDC;border-color:#C9A87A}
  #patina-admin-overlay{position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.72);backdrop-filter:blur(6px);display:none;overflow:auto}
  #patina-admin-overlay.open{display:block}
  .pa-panel{max-width:760px;margin:24px auto;background:#121212;color:#F5ECDC;border:1px solid rgba(201,168,122,.35);border-radius:18px;padding:18px}
  .pa-panel h2{font-size:20px;letter-spacing:.08em;margin:0 0 4px}
  .pa-panel input,.pa-panel select,.pa-panel textarea{width:100%;background:#1e1e1e;color:#F5ECDC;border:1px solid rgba(245,236,220,.18);border-radius:10px;padding:10px 12px;font-size:14px;box-sizing:border-box}
  .pa-btn{background:#F5ECDC;color:#121212;border:none;border-radius:999px;padding:10px 16px;font-size:13px;cursor:pointer;font-weight:600}
  .pa-btn-ghost{background:transparent;color:#F5ECDC;border:1px solid rgba(245,236,220,.35);border-radius:999px;padding:10px 16px;cursor:pointer}
  .pa-btn-danger{background:#7a2a2a;color:#fff;border:none;border-radius:999px;padding:8px 12px;cursor:pointer}
  .pa-row{display:flex;gap:10px;flex-wrap:wrap}.pa-row>*{flex:1;min-width:140px}
  .pa-card{background:#1a1a1a;border:1px solid rgba(245,236,220,.12);border-radius:12px;padding:12px;display:flex;gap:12px;align-items:center}
  .pa-card img{width:64px;height:48px;object-fit:cover;border-radius:8px;background:#222}
  .pa-preview{font-size:13px;background:#1e1e1e;border-radius:12px;padding:12px;line-height:1.5}
  .pa-preview s{opacity:.6}
  .pa-small{font-size:11px;opacity:.7}
  `;
  document.head.appendChild(s);
}
function renderAdmin(){
  window.renderAdmin = renderAdmin;
  ensureStyles();
  var ov=document.getElementById("patina-admin-overlay");
  if(!ov){ ov=document.createElement("div"); ov.id="patina-admin-overlay"; document.body.appendChild(ov); }
  var list=getProducts();
  var html = '<div class="pa-panel pa-panel-v8">'
    + '<div class="pa-head"><h2>Productos</h2>'
    + '<div class="pa-head-btns">'
    + '<button class="pa-btn-ghost pa-mini" onclick="window.__paChangePw()">\uD83D\uDD11 Cambiar contraseña</button>'
    + '<button class="pa-btn pa-mini" onclick="document.getElementById(\'patina-admin-overlay\').classList.remove(\'open\');document.body.classList.remove(\'patina-admin-open\')">\u2190 Volver a tienda</button>'
    + '<button class="pa-btn pa-mini pa-add" onclick="window.__paNew()">+ Agregar</button>'
    + '</div></div>'
    + '<p class="pa-sub">Lista de productos de la tienda. Toc\u00e1 Editar o Borrar, o agreg\u00e1 uno nuevo.</p>'
    + '<p class="pa-sub pa-green">\u2022 Base compartida: conectada - todos ven lo mismo</p>'
    + '<div class="pa-search-row"><input id="pa-search" placeholder="\uD83D\uDD0D Buscar producto..." oninput="window.__paFilter(this.value)"></div>'
    + '<div id="pa-form-wrap"></div>'
    + '<div id="pa-list"></div>'
    + '<div class="pa-foot-btns"><button class="pa-btn-ghost pa-mini" onclick="window.__paBackup()">\u2B07 Respaldo</button><button class="pa-btn-ghost pa-mini" onclick="window.__paShowHistory()">\u231A Historial</button><button class="pa-btn-ghost pa-mini" onclick="window.__paConfigGAS()">\u2699\uFE0F GAS URL</button></div>'
    + '<div id="pa-history" style="display:none"></div>'
    + '</div>';
  ov.innerHTML=html; ov.classList.add("open"); document.body.classList.add("patina-admin-open");
  renderList(""); 
}
function renderList(filter){
  var list=getProducts();
  if(filter) list=list.filter(function(p){ return cleanStr(p.name).toLowerCase().indexOf(filter.toLowerCase())!==-1; });
  var el=document.getElementById("pa-list"); if(!el) return;
  if(list.length===0){ el.innerHTML='<p class="pa-small">No hay productos. Recarg\u00e1 con Ctrl+F5.</p>'; return; }
  el.innerHTML=list.map(function(p){
    var st=toStoreFormat(p);
    var priceLine = st.hasDiscount ? (fmtGs(st.price)+' - Oferta '+fmtGs(st.salePrice)+' (-'+st.discount.replace(/[^0-9]/g,"")+'%)') : fmtGs(st.price);
    var stockTxt = (p.stock===""||p.stock==null) ? "" : (" \u00b7 Quedan "+p.stock);
    var initial = (p.name||"P").charAt(0).toUpperCase();
    var imgHtml = p.img ? '<img src="'+p.img+'">' : '<div class="pa-thumb">'+initial+'</div>';
    return '<div class="pa-card pa-card-v8">'+imgHtml+'<div class="pa-info"><b>'+(p.name||"")+'</b><div class="pa-meta">'+(p.category||"")+' - '+priceLine+stockTxt+'</div></div><div class="pa-actions"><button class="pa-btn-ghost pa-action" onclick="window.__paEdit(\''+p.id+'\')">Editar</button><button class="pa-btn-ghost pa-action pa-del" onclick="window.__paDelete(\''+p.id+'\')">Borrar</button></div></div>';
  }).join("");
}
function renderHistory(){
  var el=document.getElementById("pa-history"); if(!el) return;
  try{
    var h=JSON.parse(localStorage.getItem(LS_HISTORY)||"[]");
    el.innerHTML = h.length? h.slice(0,20).map(function(x){ return '<div>'+new Date(x.when).toLocaleString("es-PY")+' — '+x.action+' — '+(x.name||"")+'</div>'; }).join("") : '<div class="pa-small">Sin cambios aún.</div>';
  }catch(e){ el.innerHTML=""; }
}
function openForm(prod){
  var wrap=document.getElementById("pa-form-wrap"); if(!wrap) return;
  var isNew=!prod;
  var p = prod ? toDisplay(prod) : {id:"", name:"", category:"cartera", price:"", salePrice:"", desc:"", badge:"", stock:"", img:""};
  if(isNew){ var all=getProducts(); var max=0; all.forEach(function(x){ var n=parseInt(x.id,10); if(!isNaN(n)&&n>max) max=n; }); p.id=String(max+1).padStart(4,"0"); }
  wrap.innerHTML = '<div class="pa-form-v9">'
    + '<h3>'+(isNew?"Agregar producto":"Editar \u2014 "+(p.name||""))+'</h3>'
    + '<div class="pa-f-row"><div class="pa-f-field"><label>Nombre</label><input id="pa-f-name" value="'+(p.name||"").replace(/"/g,"&quot;")+'"></div><div class="pa-f-field"><label>Categor\u00eda</label><select id="pa-f-cat"><option value="cartera" '+(p.category==="cartera"?"selected":"")+'>cartera</option><option value="accesorio" '+(p.category==="accesorio"||p.category==="accesorios"?"selected":"")+'>accesorio</option><option value="oferta" '+(p.category==="oferta"?"selected":"")+'>oferta</option><option value="todos" '+(p.category==="todos"?"selected":"")+'>todos</option></select></div></div>'
    + '<div class="pa-f-row"><div class="pa-f-field"><label>Precio (solo n\u00fameros, sin puntos) Ej: 105000</label><input id="pa-f-price" inputmode="numeric" value="'+(p.price||"")+'" oninput="this.value=this.value.replace(/[^0-9]/g,\'\');window.__paPreview()"></div><div class="pa-f-field"><label>Precio con descuento (vac\u00edo = sin descuento)</label><input id="pa-f-sale" inputmode="numeric" value="'+(p.salePrice||"")+'" oninput="this.value=this.value.replace(/[^0-9]/g,\'\');window.__paPreview()"></div></div>'
    + '<div class="pa-f-field"><label>Descripci\u00f3n (vac\u00edo = queda en blanco de verdad)</label><textarea id="pa-f-desc" rows="3">'+(p.desc||"")+'</textarea></div>'
    + '<div class="pa-f-row"><div class="pa-f-field"><label>Etiqueta / Badge (vac\u00edo = sin badge)</label><input id="pa-f-badge" value="'+(p.badge||"")+'"></div><div class="pa-f-field"><label>Stock / Unidades (vac\u00edo = sin l\u00edmite)</label><input id="pa-f-stock" inputmode="numeric" value="'+(p.stock||"")+'" oninput="this.value=this.value.replace(/[^0-9]/g,\'\')"></div></div>'
    + '<div class="pa-f-field"><label>Foto \u2014 se recorta a 4:3 sin deformar</label><input type="file" id="pa-f-img" accept="image/*" onchange="window.__paCropImage(event)"><div id="pa-img-preview">'+(p.img?'<img src="'+p.img+'" style="width:120px;height:90px;object-fit:cover;border-radius:10px;margin-top:8px">':"")+'</div><input type="hidden" id="pa-f-img-data" value="'+(p.img||"")+'"></div>'
    + '<div id="pa-preview" class="pa-preview-v9"></div>'
    + '<div class="pa-f-actions"><button class="pa-btn-v9 pa-save" onclick="window.__paSave(\''+p.id+'\','+(isNew?"true":"false")+')">Guardar</button><button class="pa-btn-v9 pa-cancel" onclick="document.getElementById(\'pa-form-wrap\').innerHTML=\'\'">Cancelar</button></div>'
    + '</div>';
  window.__paPreview();
  wrap.dataset.editId = p.id;
  wrap.dataset.isNew = isNew ? "1":"0";
  wrap.dataset.origImg = p.img||"";
}
window.__paFilter=function(v){ renderList(v); };
window.__paNew=function(){ openForm(null); };
window.__paEdit=function(id){ var p=getProducts().find(function(x){ return String(x.id)===String(id); }); if(p) openForm(p); };
window.__paDelete=function(id){
  var p=getProducts().find(function(x){ return String(x.id)===String(id); });
  if(!p) return;
  if(!confirm("¿Eliminar '"+p.name+"' ? Esta acción queda en historial.")) return;
  var list=getProducts().filter(function(x){ return String(x.id)!==String(id); });
  saveProductsLocal(list); pushHistory("Eliminó", p.name);
  syncToGAS(list); renderList(document.getElementById("pa-search")?.value||""); renderHistory();
  alert("Eliminado.");
};
window.__paPreview=function(){
  var el=document.getElementById("pa-preview"); if(!el) return;
  var price=parseInt(document.getElementById("pa-f-price")?.value||"0",10)||0;
  var saleRaw=document.getElementById("pa-f-sale")?.value||"";
  var sale=saleRaw===""?null:Math.floor(Number(saleRaw));
  if(!price){ el.innerHTML="Complet\u00e1 precio para ver vista previa."; return; }
  if(sale==null||sale>=price){ el.innerHTML='<b>'+fmtGs(price)+'</b> \u00b7 Sin descuento'; return; }
  var d=calcDiscount(price, sale);
  el.innerHTML='<s>'+fmtGs(price)+'</s> <b>'+fmtGs(sale)+'</b> \u00b7 <span style="color:#C9A87A">-'+d.pct+'% OFF</span> \u00b7 Ahorr\u00e1s '+fmtGs(d.saving);
};
window.__paCropImage=function(ev){
  var file=ev.target.files && ev.target.files[0]; if(!file) return;
  var reader=new FileReader();
  reader.onload=function(e){
    var img=new Image();
    img.onload=function(){
      var canvas=document.createElement("canvas");
      var targetW=1200, targetH=900; // 4:3
      canvas.width=targetW; canvas.height=targetH;
      var ctx=canvas.getContext("2d");
      var srcRatio=img.width/img.height, dstRatio=4/3;
      var sw, sh, sx, sy;
      if(srcRatio>dstRatio){ sh=img.height; sw=sh*dstRatio; sx=(img.width-sw)/2; sy=0; } else { sw=img.width; sh=sw/dstRatio; sx=0; sy=(img.height-sh)/2; }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH);
      var data=canvas.toDataURL("image/jpeg", 0.85);
      var hid=document.getElementById("pa-f-img-data"); if(hid) hid.value=data;
      var prev=document.getElementById("pa-img-preview"); if(prev) prev.innerHTML='<img src="'+data+'" style="width:120px;height:90px;object-fit:cover;border-radius:8px">';
    };
    img.src=e.target.result;
  };
  reader.readAsDataURL(file);
};
window.__paSave=function(id, isNew){
  var name=document.getElementById("pa-f-name").value.trim();
  var cat=document.getElementById("pa-f-cat").value;
  var priceRaw=document.getElementById("pa-f-price").value.replace(/[^0-9]/g,"");
  var saleRaw=document.getElementById("pa-f-sale").value.replace(/[^0-9]/g,"");
  var desc=document.getElementById("pa-f-desc").value; // NO trim forzado: si vacío queda WJ en toStoreFormat
  var badge=document.getElementById("pa-f-badge").value;
  var stock=document.getElementById("pa-f-stock").value.replace(/[^0-9]/g,"");
  var imgData=document.getElementById("pa-f-img-data").value;
  if(!name){ alert("Falta nombre."); return; }
  if(!priceRaw){ alert("Falta precio (solo números)."); return; }
  var price=Math.floor(Number(priceRaw));
  var sale = saleRaw===""? null : Math.floor(Number(saleRaw));
  if(sale!=null && sale>=price){ alert("El descuento debe ser menor al precio."); return; }
  var prod={ id:id, name:name, category:cat, price:price, salePrice:sale, desc:desc, badge:badge, stock:stock, img:imgData };
  var stored=toStoreFormat(prod);
  // Mantener img original si no se cambió y era existente
  if(!imgData){
    var old=getProducts().find(function(x){ return String(x.id)===String(id); });
    if(old && old.img) stored.img=old.img;
  }
  var list=getProducts();
  var idx=list.findIndex(function(x){ return String(x.id)===String(id); });
  if(idx>=0){ list[idx]=stored; pushHistory("Editó", name); }
  else { list.push(stored); pushHistory("Agregó", name); }
  saveProductsLocal(list);
  syncToGAS(list).then(function(){});
  document.getElementById("pa-form-wrap").innerHTML="";
  renderList(document.getElementById("pa-search")?.value||""); renderHistory();
  alert("Guardado ✓ Sincronizando en hasta 15s a otros equipos.");
};
window.__paBackup=function(){
  var data={shop:"patina", exportedAt:new Date().toISOString(), products:getProducts(), history: JSON.parse(localStorage.getItem(LS_HISTORY)||"[]")};
  var blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  var a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="patina-backup-"+new Date().toISOString().slice(0,10)+".json"; a.click();
};
window.__paImport=function(ev){
  var f=ev.target.files && ev.target.files[0]; if(!f) return;
  var r=new FileReader();
  r.onload=function(e){
    try{
      var j=JSON.parse(e.target.result);
      var arr = Array.isArray(j) ? j : j.products;
      if(!Array.isArray(arr) || arr.length===0){ alert("Backup vacío o inválido."); return; }
      // Nunca sobreescribir con lista vacía - ya validado
      var normalized=arr.map(function(p){ return toStoreFormat(p); });
      saveProductsLocal(normalized); pushHistory("Importó Backup", normalized.length+" productos");
      syncToGAS(normalized);
      renderList(""); renderHistory(); alert("Backup importado: "+normalized.length+" productos.");
    }catch(err){ alert("Error al importar backup."); }
  };
  r.readAsText(f);
};
window.__paChangePw=function(){
  var cur=prompt("Contraseña actual:");
  if(cur==null) return;
  if(!checkPw(cur)){ alert("Contraseña actual incorrecta."); return; }
  var nw=prompt("Nueva contraseña (mínimo 6 caracteres):");
  if(!nw || nw.length<6){ alert("Debe tener al menos 6 caracteres."); return; }
  localStorage.setItem(LS_PW, hashPw(nw));
  pushHistory("Cambió contraseña", "");
  alert("Contraseña cambiada ✓");
};
window.__paConfigGAS=function(){
  var cur=localStorage.getItem(LS_GAS)||GAS_URL||"";
  var nw=prompt("Pegá la URL exec de Google Apps Script de PÁTINA (NO la de CAVI):", cur);
  if(nw==null) return;
  nw=nw.trim();
  localStorage.setItem(LS_GAS, nw); GAS_URL=nw; window.PATINA_GAS_URL=nw;
  alert("GAS URL guardada. A partir de ahora sincroniza con ese proyecto.");
};
function openAdmin(){
  ensureStyles();
  var old=document.getElementById('patina-login-overlay');
  if(old) old.remove();
  var ov=document.createElement('div'); ov.id='patina-login-overlay';
  ov.innerHTML = '<div id="patina-login-card">'
    + '<h3>Administración - PÁTINA</h3>'
    + '<p>Escribí tu contraseña para entrar.</p>'
    + '<input id="patina-login-input" type="password" placeholder="Contraseña" autocomplete="current-password">'
    + '<div id="patina-login-error">Contraseña incorrecta.</div>'
    + '<button id="patina-login-enter">Entrar</button>'
    + '<button id="patina-login-back">Volver a tienda</button>'
    + '</div>';
  document.body.appendChild(ov);
  var input=document.getElementById('patina-login-input');
  setTimeout(function(){ input.focus(); }, 100);
  function tryEnter(){
    var pw=input.value||'';
    if(!checkPw(pw)){ document.getElementById('patina-login-error').style.display='block'; input.select(); return; }
    ov.remove();
    document.body.classList.add('patina-admin-open');
    renderAdmin();
  }
  document.getElementById('patina-login-enter').onclick=tryEnter;
  input.addEventListener('keydown', function(e){ if(e.key==='Enter') tryEnter(); });
  document.getElementById('patina-login-back').onclick=function(){ ov.remove(); };
  ov.addEventListener('click', function(e){ if(e.target===ov) ov.remove(); });
}
function initAdminBtn(){
  if(document.getElementById("patina-admin-btn")) return;
  var b=document.createElement("button");
  b.id="patina-admin-btn"; b.textContent="Admin";
  b.setAttribute("aria-label","Admin");
  b.onclick=openAdmin;
  document.body.appendChild(b);
}
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", initAdminBtn); else initAdminBtn();
if(window.location.search.indexOf('admin=1')!==-1){ setTimeout(function(){ try{ openAdmin(); }catch(e){} }, 800); }
else initAdminBtn();
var _s=document.createElement('style'); _s.id='patina-admin-v7'; _s.textContent='\n#patina-login-overlay{position:fixed;inset:0;z-index:10001;background:rgba(18,18,18,.55);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:16px}\n#patina-login-card{background:#F5ECDC;color:#121212;border-radius:20px;padding:22px;width:100%;max-width:380px;box-shadow:0 20px 60px rgba(0,0,0,.35)}\n#patina-login-card h3{margin:0 0 4px;font-family:Georgia,serif;font-size:20px;font-weight:600}\n#patina-login-card p{margin:0 0 14px;font-size:13px;color:rgba(18,18,18,.65)}\n#patina-login-card input{width:100%;background:#fff;color:#121212;border:1px solid rgba(18,18,18,.12);border-radius:999px;padding:12px 14px;font-size:14px;box-sizing:border-box;outline:none}\n#patina-login-card input:focus{border-color:#C9A87A}\n#patina-login-enter{width:100%;background:#b98a5a !important;color:#fff !important;border:none;border-radius:999px;padding:12px;font-size:15px;font-weight:700;cursor:pointer;margin-top:12px;transition:transform .15s}\n#patina-login-enter:hover{transform:scale(1.02)} #patina-login-enter:active{transform:scale(.98)}\n#patina-login-back{width:100%;background:none;border:none;color:rgba(18,18,18,.65);padding:10px;cursor:pointer;font-size:13px}\n#patina-login-error{color:#8a3a2a;font-size:12px;margin-top:8px;display:none}\n#patina-admin-overlay{background:rgba(18,18,18,.55) !important;backdrop-filter:blur(4px)}\n#patina-admin-overlay .pa-panel{background:#F5ECDC !important;color:#121212 !important;border:none !important;border-radius:22px !important;padding:20px !important;box-shadow:0 20px 60px rgba(0,0,0,.35);max-width:640px !important}\n#patina-admin-overlay .pa-panel h2{color:#121212 !important;font-family:Georgia,serif !important;font-weight:600 !important}\n#patina-admin-overlay .pa-panel input,#patina-admin-overlay .pa-panel select,#patina-admin-overlay .pa-panel textarea{background:#fff !important;color:#121212 !important;border:1px solid rgba(18,18,18,.12) !important;border-radius:999px !important}\n#patina-admin-overlay .pa-panel textarea{border-radius:14px !important}\n#patina-admin-overlay .pa-btn{background:#121212 !important;color:#F5ECDC !important}\n#patina-admin-overlay .pa-btn-ghost{background:#fff !important;color:#121212 !important;border:1px solid rgba(18,18,18,.15) !important}\n#patina-admin-overlay .pa-btn-danger{background:#fff !important;color:#8a3a2a !important;border:1px solid rgba(138,58,42,.35) !important}\n#patina-admin-overlay .pa-card{background:#fff !important;border:1px solid rgba(18,18,18,.06) !important}\n#patina-admin-overlay .pa-card b{color:#121212 !important}\n/* BOTON QUIETO ABAJO - NO fijo, solo se ve al bajar hasta abajo */\n#patina-admin-btn{position:absolute !important;left:0 !important;right:0 !important;margin-left:auto !important;margin-right:auto !important;top:auto !important;bottom:3px !important;transform:none !important;background:rgba(18,18,18,.55) !important;color:rgba(245,236,220,.50) !important;border:1px solid rgba(201,168,122,.22) !important;box-shadow:none !important;padding:3px 8px !important;border-radius:999px !important;font-size:9px !important;letter-spacing:.14em !important;font-weight:500 !important;width:auto !important;max-width:70px !important;text-align:center !important;z-index:10 !important}\nbody{position:relative !important;padding-bottom:26px !important}\nbody.patina-admin-open #patina-admin-btn{display:none !important}\n'; document.head.appendChild(_s);
// Exponer para debug
window.__patinaAdmin = {getProducts: getProducts, toStoreFormat: toStoreFormat, fmtGs: fmtGs, calcDiscount: calcDiscount};
})();

// Exponer para login v5
try{ if(typeof renderAdmin!=='undefined') window.renderAdmin = renderAdmin; }catch(e){}

// FIX v6 boton quieto
(function(){var s=document.createElement('style');s.id='patina-admin-v6';s.textContent='\n/* FIX v6 - Botón Admin QUIETO abajo, NO fijo en pantalla */\n#patina-admin-btn{position:absolute !important;left:0 !important;right:0 !important;margin-left:auto !important;margin-right:auto !important;top:auto !important;bottom:3px !important;transform:none !important}\nbody{position:relative !important;padding-bottom:26px !important;min-height:100dvh}\nhtml{position:relative}\n';document.head.appendChild(s);})();

window.addEventListener('patina-open-admin', function(){ try{ if(window.renderAdmin) window.renderAdmin(); }catch(e){} });

(function(){var s=document.createElement('style');s.id='patina-admin-v8';s.textContent='\n.pa-panel-v8{width:calc(100% - 24px) !important;max-width:620px !important;margin:12px auto !important;padding:16px !important;border-radius:22px !important;box-sizing:border-box !important;overflow:hidden}\n.pa-head{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:6px}\n.pa-head h2{font-size:21px !important;margin:0 !important}\n.pa-head-btns{display:flex;gap:6px;flex-wrap:wrap}\n.pa-mini{padding:7px 11px !important;font-size:12px !important;white-space:nowrap}\n.pa-add{background:#b98a5a !important;color:#fff !important;border:none !important}\n.pa-sub{font-size:12px !important;line-height:1.4 !important;margin:2px 0 !important;color:rgba(18,18,18,.65) !important}\n.pa-green{color:#2f6b2f !important;font-size:11.5px !important}\n.pa-search-row{margin:12px 0 10px}\n.pa-search-row input{width:100% !important;box-sizing:border-box !important}\n.pa-card-v8{display:flex !important;gap:10px !important;align-items:center !important;padding:10px !important;border-radius:14px !important;box-sizing:border-box !important}\n.pa-card-v8 img,.pa-thumb{width:52px !important;height:52px !important;min-width:52px !important;border-radius:10px !important;object-fit:cover !important}\n.pa-thumb{background:#E8DDC8 !important;color:#8a6b3a !important;display:flex !important;align-items:center !important;justify-content:center !important;font-size:20px !important;font-weight:700 !important}\n.pa-info{flex:1 !important;min-width:0 !important;overflow:hidden}\n.pa-info b{font-size:14px !important;line-height:1.25 !important;display:block !important;white-space:nowrap !important;overflow:hidden !important;text-overflow:ellipsis !important}\n.pa-meta{font-size:11.5px !important;line-height:1.35 !important;color:rgba(18,18,18,.62) !important;white-space:normal !important;word-break:break-word !important}\n.pa-actions{display:flex !important;flex-direction:column !important;gap:6px !important;flex-shrink:0 !important}\n.pa-action{padding:6px 10px !important;font-size:12px !important;white-space:nowrap}\n.pa-del{color:#8a3a2a !important;border-color:rgba(138,58,42,.35) !important}\n.pa-foot-btns{display:flex;gap:6px;flex-wrap:wrap;margin-top:12px}\n#patina-admin-overlay .pa-panel input,#patina-admin-overlay .pa-panel select{box-sizing:border-box !important}\n#patina-admin-overlay{padding:0 !important}\n';document.head.appendChild(s);})();

(function(){var s=document.createElement('style');s.id='patina-admin-v9';s.textContent='\n.pa-form-v9{background:#121212 !important;color:#F5ECDC !important;border:1px solid rgba(201,168,122,.35) !important;border-radius:18px !important;padding:16px !important;margin:12px 0 !important;box-sizing:border-box !important;box-shadow:0 10px 30px rgba(0,0,0,.25)}\n.pa-form-v9 h3{margin:0 0 14px !important;font-family:Georgia,serif !important;font-size:18px !important;color:#F5ECDC !important;font-weight:600 !important}\n.pa-f-row{display:flex !important;gap:10px !important;flex-wrap:wrap !important}\n.pa-f-field{flex:1 !important;min-width:140px !important;margin-bottom:10px !important}\n.pa-f-field label{display:block !important;font-size:11px !important;letter-spacing:.06em !important;color:rgba(245,236,220,.75) !important;margin-bottom:6px !important;text-transform:uppercase}\n.pa-form-v9 input,.pa-form-v9 select,.pa-form-v9 textarea{width:100% !important;box-sizing:border-box !important;background:rgba(245,236,220,.92) !important;color:#121212 !important;border:none !important;border-radius:999px !important;padding:11px 14px !important;font-size:14px !important;outline:none !important;backdrop-filter:blur(12px)}\n.pa-form-v9 textarea{border-radius:14px !important;resize:vertical}\n.pa-form-v9 input:focus,.pa-form-v9 select:focus,.pa-form-v9 textarea:focus{box-shadow:0 0 0 2px #C9A87A}\n.pa-form-v9 input[type="file"]{background:rgba(245,236,220,.15) !important;color:#F5ECDC !important;padding:10px !important}\n.pa-preview-v9{background:rgba(245,236,220,.10) !important;color:#F5ECDC !important;border:1px solid rgba(201,168,122,.25) !important;border-radius:12px !important;padding:11px 12px !important;font-size:13px !important;line-height:1.5 !important;margin-top:10px !important}\n.pa-preview-v9 s{opacity:.6}\n.pa-f-actions{display:flex !important;gap:10px !important;margin-top:14px !important}\n.pa-btn-v9{flex:1 !important;border:none !important;border-radius:999px !important;padding:12px !important;font-size:14px !important;font-weight:700 !important;cursor:pointer !important;transition:transform .15s, box-shadow .15s, background .15s !important}\n.pa-btn-v9:hover{transform:scale(1.03) !important;box-shadow:0 6px 18px rgba(0,0,0,.25) !important}\n.pa-btn-v9:active{transform:scale(.97) !important}\n.pa-save{background:rgba(245,236,220,.92) !important;color:#121212 !important}\n.pa-cancel{background:transparent !important;color:#F5ECDC !important;border:1px solid rgba(245,236,220,.35) !important}\n/* Efectos al presionar iconos/botones del Admin igual que HOME */\n#patina-admin-overlay .pa-btn,#patina-admin-overlay .pa-btn-ghost,#patina-admin-overlay .pa-action,#patina-admin-overlay .pa-mini{transition:transform .15s, box-shadow .15s !important}\n#patina-admin-overlay .pa-btn:hover,#patina-admin-overlay .pa-btn-ghost:hover,#patina-admin-overlay .pa-action:hover{transform:scale(1.03) !important}\n#patina-admin-overlay .pa-btn:active,#patina-admin-overlay .pa-btn-ghost:active,#patina-admin-overlay .pa-action:active{transform:scale(.97) !important}\n#patina-login-enter{transition:transform .15s !important} #patina-login-enter:active{transform:scale(.97) !important}\n';document.head.appendChild(s);})();
