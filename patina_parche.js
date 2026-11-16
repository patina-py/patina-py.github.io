
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
    badge: d.has ? ("-"+d.pct+"% OFF") : WJ,
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
  .pa-panel{max-width:760px;margin:24px auto;background:#2f3a2a;color:#F5ECDC;border:1px solid rgba(201,168,122,.35);border-radius:18px;padding:18px}
  .pa-panel h2{font-size:20px;letter-spacing:.08em;margin:0 0 4px}
  .pa-panel input,.pa-panel select,.pa-panel textarea{width:100%;background:#263324;color:#F5ECDC;border:1px solid rgba(245,236,220,.18);border-radius:10px;padding:10px 12px;font-size:14px;box-sizing:border-box}
  .pa-btn{background:#F5ECDC;color:#121212;border:none;border-radius:999px;padding:10px 16px;font-size:13px;cursor:pointer;font-weight:600}
  .pa-btn-ghost{background:transparent;color:#F5ECDC;border:1px solid rgba(245,236,220,.35);border-radius:999px;padding:10px 16px;cursor:pointer}
  .pa-btn-danger{background:#7a2a2a;color:#fff;border:none;border-radius:999px;padding:8px 12px;cursor:pointer}
  .pa-row{display:flex;gap:10px;flex-wrap:wrap}.pa-row>*{flex:1;min-width:140px}
  .pa-card{background:#263324;border:1px solid rgba(245,236,220,.12);border-radius:12px;padding:12px;display:flex;gap:12px;align-items:center}
  .pa-card img{width:64px;height:48px;object-fit:cover;border-radius:8px;background:#222}
  .pa-preview{font-size:13px;background:#263324;border-radius:12px;padding:12px;line-height:1.5}
  .pa-preview s{opacity:.6}
  .pa-small{font-size:11px;opacity:.7}
  `;
  document.head.appendChild(s);
}
function renderAdmin(){
  ensureStyles();
  var ov=document.getElementById("patina-admin-overlay");
  if(!ov){ ov=document.createElement("div"); ov.id="patina-admin-overlay"; document.body.appendChild(ov); }
  var list=getProducts();
  var html = '<div class="pa-panel">'
    + '<div style="display:flex;justify-content:space-between;align-items:center"><h2>PÁTINA — Admin</h2><button class="pa-btn-ghost" onclick="document.getElementById(\'patina-admin-overlay\').classList.remove(\'open\')">Cerrar ✕</button></div>'
    + '<p class="pa-small">Productos actuales: '+list.length+' · Sincroniza cada 15s con Google Apps Script si hay URL configurada. Si no hay URL, guarda en este navegador (localStorage).</p>'
    + '<div class="pa-row" style="margin:10px 0"><input id="pa-search" placeholder="🔍 Buscar por nombre..." oninput="window.__paFilter(this.value)"><button class="pa-btn" onclick="window.__paNew()">+ Agregar</button></div>'
    + '<div class="pa-row" style="margin-bottom:12px"><button class="pa-btn-ghost" onclick="window.__paBackup()">⬇ Backup</button><label class="pa-btn-ghost" style="text-align:center;cursor:pointer">⬆ Importar Backup<input type="file" accept=".json" style="display:none" onchange="window.__paImport(event)"></label><button class="pa-btn-ghost" onclick="window.__paChangePw()">🔑 Cambiar contraseña</button><button class="pa-btn-ghost" onclick="window.__paConfigGAS()">⚙️ Configurar GAS URL</button></div>'
    + '<div id="pa-form-wrap"></div>'
    + '<div id="pa-list"></div>'
    + '<div style="margin-top:16px"><h3 style="font-size:14px">Historial</h3><div id="pa-history" style="font-size:12px;opacity:.85"></div></div>'
    + '<p class="pa-small" style="margin-top:12px">Prueba: crear producto sin descripción, precio 105000, descuento 85000 → debe mostrar sin descripción, Gs 105.000 tachado, Gs 85.000, -19% OFF, Ahorrás Gs 20.000</p>'
    + '</div>';
  ov.innerHTML=html; ov.classList.add("open");
  renderList(""); renderHistory();
}
function renderList(filter){
  var list=getProducts();
  if(filter) list=list.filter(function(p){ return cleanStr(p.name).toLowerCase().indexOf(filter.toLowerCase())!==-1; });
  var el=document.getElementById("pa-list"); if(!el) return;
  if(list.length===0){ el.innerHTML='<p class="pa-small">No hay productos. Si es primera vez, se cargan desde la página actual. Si ves vacío, recargá con Ctrl+F5.</p>'; return; }
  el.innerHTML=list.map(function(p){
    var st=toStoreFormat(p);
    var priceLine = st.hasDiscount ? '<s>'+fmtGs(st.price)+'</s> <b>'+fmtGs(st.salePrice)+'</b> <span style="color:#C9A87A">-'+st.discount.replace(/[^0-9]/g,"")+'% OFF · Ahorrás '+fmtGs(st.saving)+'</span>' : '<b>'+fmtGs(st.price)+'</b>';
    var img = p.img ? '<img src="'+p.img+'">' : '<div style="width:64px;height:48px;background:#222;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:10px">Sin foto</div>';
    return '<div class="pa-card">'+img+'<div style="flex:1"><b>'+(p.name||"")+'</b><div class="pa-small">#'+p.id+' · '+(p.category||"")+' · Stock: '+(p.stock===""?"Sin límite":p.stock)+' · '+(isEmptyVal(p.desc)?"Sin descripción":"Con descripción")+'</div><div style="font-size:13px">'+priceLine+'</div></div><div style="display:flex;gap:6px;flex-direction:column"><button class="pa-btn" onclick="event.stopPropagation();window.__paEdit(\''+p.id+'\')">Editar</button><button class="pa-btn-danger" onclick="event.stopPropagation();window.__paDelete(\''+p.id+'\')">Eliminar</button></div></div>';
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
  var p = prod ? toDisplay(prod) : {id:"", name:"", category:"cartera", price:"", salePrice:"", desc:"", stock:"", img:""};
  if(isNew){ var all=getProducts(); var max=0; all.forEach(function(x){ var n=parseInt(x.id,10); if(!isNaN(n)&&n>max) max=n; }); p.id=String(max+1).padStart(4,"0"); }
  wrap.innerHTML = '<div class="pa-form-v9">'
    + '<h3>'+(isNew?"Agregar producto":"Editar - "+(p.name||""))+'</h3>'
    + '<div class="pa-f-row"><div class="pa-f-field"><label>Nombre</label><input id="pa-f-name" value="'+(p.name||"").replace(/"/g,"&quot;")+'"></div><div class="pa-f-field"><label>Categoria</label><select id="pa-f-cat"><option value="cartera" '+(p.category==="cartera"?"selected":"")+'>cartera</option><option value="accesorio" '+(p.category==="accesorio"||p.category==="accesorios"?"selected":"")+'>accesorio</option><option value="oferta" '+(p.category==="oferta"?"selected":"")+'>oferta</option><option value="todos" '+(p.category==="todos"?"selected":"")+'>todos</option></select></div></div>'
    + '<div class="pa-f-row"><div class="pa-f-field"><label>Precio (solo numeros, sin puntos) Ej: 105000</label><input id="pa-f-price" inputmode="numeric" value="'+(p.price||"")+'" oninput="this.value=this.value.replace(/[^0-9]/g,'');window.__paPreview()"></div><div class="pa-f-field"><label>Precio con descuento (vacio = sin descuento)</label><input id="pa-f-sale" inputmode="numeric" value="'+(p.salePrice||"")+'" oninput="this.value=this.value.replace(/[^0-9]/g,'');window.__paPreview()"></div></div>'
    + '<div class="pa-f-field"><label>Descripcion (vacio = queda en blanco de verdad)</label><textarea id="pa-f-desc" rows="3">'+(p.desc||"")+'</textarea></div>'
    + '<div class="pa-f-field"><label>Stock / Unidades (vacio = sin limite)</label><input id="pa-f-stock" inputmode="numeric" value="'+(p.stock||"")+'" oninput="this.value=this.value.replace(/[^0-9]/g,'')"></div>'
    + '<p style="font-size:11px;color:rgba(245,236,220,.65);margin:0 0 10px">El % OFF y la burbuja -% se calculan solos desde el descuento. Ej: 105000 / 85000 = -19% OFF, Ahorras Gs 20.000. Precio exacto, sin 995.</p>'
    + '<div class="pa-f-field"><label>Foto - se recorta a 4:3 sin deformar</label><input type="file" id="pa-f-img" accept="image/*" onchange="window.__paCropImage(event)"><div id="pa-img-preview">'+(p.img?'<img src="'+p.img+'" style="width:120px;height:90px;object-fit:cover;border-radius:10px;margin-top:8px">':"")+'</div><input type="hidden" id="pa-f-img-data" value="'+(p.img||"")+'"></div>'
    + '<div id="pa-preview" class="pa-preview-v9"></div>'
    + '<div class="pa-f-actions"><button class="pa-btn-v9 pa-save" onclick="window.__paSave(''+p.id+'','+(isNew?"true":"false")+')">Guardar</button><button class="pa-btn-v9 pa-cancel" onclick="document.getElementById('pa-form-wrap').innerHTML=''">Cancelar</button></div>'
    + '</div>';
  window.__paPreview();
  wrap.dataset.editId = p.id;
}
window.__paFilter=function(v){ renderList(v); };
window.__paNew=function(){ openForm(null); };
window.__paEdit=function(id, ev){ if(ev && ev.stopPropagation) ev.stopPropagation(); var p=getProducts().find(function(x){ return String(x.id)===String(id); }); if(p) openForm(p); };
window.__paDelete=function(id, ev){ if(ev && ev.stopPropagation) ev.stopPropagation();
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
  if(!price){ el.innerHTML="Completá precio para ver vista previa."; return; }
  if(sale==null||sale>=price){ el.innerHTML='<b>'+fmtGs(price)+'</b> · Sin descuento'; return; }
  var d=calcDiscount(price, sale);
  el.innerHTML='<s>'+fmtGs(price)+'</s> <b>'+fmtGs(sale)+'</b> · <span style="color:#C9A87A">-'+d.pct+'% OFF</span> · Ahorrás '+fmtGs(d.saving)+' · Precio exacto guardado con Math.floor, sin 995.';
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
  var badge="";
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
  var pw=prompt("Admin Pátina — Contraseña:");
  if(pw==null) return;
  if(!checkPw(pw)){ alert("Contraseña incorrecta."); return; }
  renderAdmin();
}
function initAdminBtn(){
  if(document.getElementById("patina-admin-btn")) return;
  var b=document.createElement("button");
  b.id="patina-admin-btn"; b.textContent="Admin";
  b.setAttribute("aria-label","Admin");
  b.onclick=openAdmin;
  document.body.appendChild(b);
}
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", initAdminBtn);
else initAdminBtn();
// Exponer para debug
window.__patinaAdmin = {getProducts: getProducts, toStoreFormat: toStoreFormat, fmtGs: fmtGs, calcDiscount: calcDiscount};
})();

(function(){var s=document.createElement('style');s.id='patina-admin-v10';s.textContent='\n#patina-admin-overlay{position:fixed !important;inset:0 !important;display:none !important;align-items:center !important;justify-content:center !important;overflow:hidden !important;padding:12px !important;box-sizing:border-box !important}\n#patina-admin-overlay.open{display:flex !important}\n#patina-admin-overlay .pa-panel-v8{margin:auto !important;max-height:88vh !important;overflow-y:auto !important;overscroll-behavior:contain}\n#patina-login-overlay{position:fixed !important;inset:0 !important;display:flex !important;align-items:center !important;justify-content:center !important;overflow:hidden !important}\nbody.patina-admin-open{overflow:hidden !important}\n';document.head.appendChild(s);})();

document.addEventListener('click', function(e){ if(e.target && e.target.closest && e.target.closest('#patina-admin-overlay, #patina-login-overlay')){ e.stopPropagation(); } }, true);

(function(){var s=document.createElement('style');s.id='patina-admin-v11';s.textContent='\n.pa-form-v9{background:#2f3a2a !important;color:#F5ECDC !important;border:1px solid rgba(201,168,122,.35) !important;border-radius:18px !important;padding:16px !important;margin:12px 0 !important;box-sizing:border-box !important}\n.pa-form-v9 h3{margin:0 0 14px !important;font-family:Georgia,serif !important;font-size:18px !important;color:#F5ECDC !important}\n.pa-f-row{display:flex !important;gap:10px !important;flex-wrap:wrap !important}\n.pa-f-field{flex:1 !important;min-width:140px !important;margin-bottom:10px !important}\n.pa-f-field label{display:block !important;font-size:11px !important;color:rgba(245,236,220,.75) !important;margin-bottom:6px !important;text-transform:uppercase !important;letter-spacing:.06em}\n.pa-form-v9 input,.pa-form-v9 select,.pa-form-v9 textarea{width:100% !important;box-sizing:border-box !important;background:rgba(245,236,220,.92) !important;color:#121212 !important;border:none !important;border-radius:999px !important;padding:11px 14px !important;font-size:14px !important}\n.pa-form-v9 textarea{border-radius:14px !important}\n.pa-form-v9 input[type="file"]{background:rgba(245,236,220,.15) !important;color:#F5ECDC !important}\n.pa-preview-v9{background:rgba(245,236,220,.10) !important;color:#F5ECDC !important;border:1px solid rgba(201,168,122,.25) !important;border-radius:12px !important;padding:11px !important;font-size:13px !important;margin-top:10px !important}\n.pa-f-actions{display:flex !important;gap:10px !important;margin-top:14px !important}\n.pa-btn-v9{flex:1 !important;border:none !important;border-radius:999px !important;padding:12px !important;font-size:14px !important;font-weight:700 !important;cursor:pointer !important;transition:transform .15s !important}\n.pa-btn-v9:hover{transform:scale(1.03) !important} .pa-btn-v9:active{transform:scale(.97) !important}\n.pa-save{background:rgba(245,236,220,.92) !important;color:#121212 !important}\n.pa-cancel{background:transparent !important;color:#F5ECDC !important;border:1px solid rgba(245,236,220,.35) !important}\n#patina-admin-overlay{position:fixed !important;inset:0 !important;display:none !important;align-items:center !important;justify-content:center !important;overflow:hidden !important;padding:12px !important;box-sizing:border-box !important}\n#patina-admin-overlay.open{display:flex !important}\n#patina-admin-overlay .pa-panel{margin:auto !important;max-height:88vh !important;overflow-y:auto !important}\n#patina-admin-overlay .pa-panel-v8{margin:auto !important;max-height:88vh !important;overflow-y:auto !important}\n#patina-login-overlay{position:fixed !important;inset:0 !important;display:flex !important;align-items:center !important;justify-content:center !important}\nbody.patina-admin-open{overflow:hidden !important}\n#patina-admin-overlay .pa-btn,#patina-admin-overlay .pa-btn-ghost,#patina-admin-overlay .pa-action{transition:transform .15s !important}\n#patina-admin-overlay .pa-btn:active,#patina-admin-overlay .pa-btn-ghost:active{transform:scale(.97) !important}\n';document.head.appendChild(s);})();

document.addEventListener('click', function(e){ if(e.target && e.target.closest && e.target.closest('#patina-admin-overlay, #patina-login-overlay')){ e.stopPropagation(); } }, true);

(function(){var s=document.createElement('style');s.id='patina-admin-v12';s.textContent='\n.pa-form-v9{background:#2f3a2a !important;color:#F5ECDC !important;border:1px solid rgba(201,168,122,.45) !important}\n#patina-admin-overlay .pa-panel,#patina-admin-overlay .pa-panel-v8{background:#2f3a2a !important;color:#F5ECDC !important;border:1px solid rgba(201,168,122,.45) !important}\n#patina-admin-overlay .pa-card{background:#263324 !important;border:1px solid rgba(245,236,220,.12) !important}\n#patina-admin-overlay .pa-preview,.pa-preview-v9{background:rgba(38,51,36,.85) !important;color:#F5ECDC !important}\n.pa-form-v9 input,.pa-form-v9 select,.pa-form-v9 textarea{background:rgba(245,236,220,.92) !important;color:#121212 !important}\n';document.head.appendChild(s);})();
