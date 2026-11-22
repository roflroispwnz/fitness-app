/* ---------- Питание ---------- */
function wcard(){
 var L=S.wlog,n=L.length,ws=L.map(function(x){return x.w}),cur=S.weight;
 var mn=Math.min.apply(null,ws.concat(S.goalW))-1,mx=Math.max.apply(null,ws.concat(S.goalW))+1;
 var X=function(i){return 24+(n>1?i*(272/(n-1)):0)},Y=function(v){return 12+(mx-v)/(mx-mn)*78};
 var pts=L.map(function(x,i){return X(i)+","+Y(x.w)}).join(" ");
 var dots=L.map(function(x,i){return '<circle cx="'+X(i)+'" cy="'+Y(x.w)+'" r="3.5" fill="currentColor"/>'}).join("");
 var df=Math.round((cur-S.goalW)*10)/10,dd=function(d){return d.slice(8)+"."+d.slice(5,7)};
 return '<div class="card"><div class="row"><h2>Ваш вес</h2><b><span id="wv">'+cur+'</span> кг</b></div>'+
 '<svg viewBox="0 0 320 112" role="img" aria-label="График изменения веса" style="width:100%;color:var(--brand)"><line x1="24" x2="296" y1="'+Y(S.goalW)+'" y2="'+Y(S.goalW)+'" stroke="var(--ok)" stroke-dasharray="4 4"/><polyline points="'+pts+'" fill="none" stroke="currentColor" stroke-width="2.5"/>'+dots+
 '<text x="24" y="108" font-size="10" fill="var(--mute)">'+dd(L[0].d)+'</text><text x="296" y="108" font-size="10" text-anchor="end" fill="var(--mute)">'+dd(L[n-1].d)+'</text></svg>'+
 '<p class="mute">Пунктир — цель '+S.goalW+' кг · '+(df===0?"цель достигнута":"до цели "+Math.abs(df)+" кг")+'</p>'+
 '<div class="send" style="margin-top:8px"><label class="mute" style="flex:1">Вес, кг<input id="w" type="number" step="0.001" min="30" max="300" value="'+cur+'" style="display:block;width:100%;margin-top:4px"></label>'+
 '<label class="mute" style="flex:1">Цель, кг<input id="gw" type="number" step="0.5" min="30" max="300" value="'+S.goalW+'" style="display:block;width:100%;margin-top:4px"></label></div>'+
 '<button class="btn" id="ws" style="width:100%;margin-top:10px">Сохранить</button></div>';
}
function foodKey(){return "meal-plan:"+S.goal+":"+S.mday}
function foodPlan(){
 var templates=MEALS[S.goal].plans;
 var initial=templates[S.mday%templates.length].map(function(meal){
  return [meal[0],meal[1].map(function(line){
   var parts=line.split(";");
   return {name:parts[0],portion:parts[1],kcal:Number(parts[2])};
  })];
 });
 return load(foodKey(),initial);
}
function vFood(){
 var g=MEALS[S.goal],dn=["Пн","Вт","Ср","Чт","Пт","Сб","Вс"],total=0;
 var meals=foodPlan().map(function(meal,m){
  var sum=0,editable=S.mday<5;
  var rows=meal[1].map(function(item,i){
   sum+=item.kcal;
   var name=editable?'<button type="button" class="food-edit" data-food-item="'+i+'" aria-label="Изменить: '+esc(item.name)+'">'+esc(item.name)+' <span aria-hidden="true">✎</span></button>':esc(item.name);
   return '<div class="li">'+name+'<span class="mute">'+esc(item.portion)+' · '+item.kcal+' ккал</span></div>';
  }).join("");
  total+=sum;
  return '<div class="meal" data-meal="'+m+'"><div style="flex:1"><div class="row"><b>'+meal[0]+'</b><span class="mute">'+sum+' ккал</span></div>'+rows+
   (editable?'<button type="button" class="chip" data-food-add>+ Добавить позицию</button><div data-food-editor></div>':'')+'</div></div>';
 }).join("");
 return '<h1>Питание</h1>'+
 wcard()+
 '<div class="chips">'+["loss","gain"].map(function(k){
  return '<button class="chip" data-goal="'+k+'" aria-pressed="'+(S.goal===k)+'">Цель: '+MEALS[k].label.toLowerCase()+'</button>'}).join("")+'</div>'+
 '<div class="chips">'+dn.map(function(d,i){return '<button class="chip" data-md="'+i+'" aria-pressed="'+(S.mday===i)+'">'+d+'</button>'}).join("")+'</div>'+
 '<div class="card"><div class="row"><h2>План на день</h2><b>'+total+' из '+g.kcal+' ккал</b></div>'+meals+'</div>';
}
function bindFood(){
 document.querySelectorAll("[data-goal]").forEach(function(b){b.onclick=function(){S.goal=b.dataset.goal;save("goal",S.goal);render()}});
 document.querySelectorAll("[data-md]").forEach(function(b){b.onclick=function(){S.mday=+b.dataset.md;render()}});
 document.querySelectorAll("[data-meal]").forEach(function(section){
  var add=section.querySelector("[data-food-add]");
  if(!add)return;
  var editor=section.querySelector("[data-food-editor]"), mealIndex=Number(section.dataset.meal);
  function edit(index){
   var plan=foodPlan(), items=plan[mealIndex][1], item=items[index];
   editor.innerHTML='<form class="card food-form"><label>Название<input name="product" required maxlength="120"></label>'+
    '<label>Порция (г, мл или шт.)<input name="portion" required maxlength="50" placeholder="150 г"></label>'+
    '<label>Ккал на порцию<input name="energy" type="number" min="0" step="1" required></label>'+
    '<div><button type="button" class="btn" data-save>Сохранить</button> <button type="button" class="chip" data-cancel>Отмена</button> '+
    (item?'<button type="button" class="chip" data-remove>Удалить позицию</button>':'')+'</div></form>';
   var form=editor.firstElementChild, f=form.elements;
   f.product.value=item?item.name:"";
   f.portion.value=item?item.portion:"";
   f.energy.value=item?item.kcal:"";
   f.product.focus();
   function commit(){
    save(foodKey(),plan);render();
    document.querySelector('[data-meal="'+mealIndex+'"] [data-food-add]').focus();
   }
   function storeItem(){
    f.product.value=f.product.value.trim();f.portion.value=f.portion.value.trim();
    if(!form.reportValidity())return;
    var portion=f.portion.value;
    if(/^\d+(?:[.,]\d+)?$/.test(portion))portion+=" г";
    items[index]={name:f.product.value,portion:portion,kcal:f.energy.valueAsNumber};
    commit();
   }
   form.querySelector("[data-save]").onclick=storeItem;
   form.onsubmit=function(event){event.preventDefault();storeItem()};
   form.onkeydown=function(event){if(event.key==="Enter" && event.target.tagName==="INPUT" && !event.isComposing){event.preventDefault();storeItem()}};
   form.querySelector("[data-cancel]").onclick=function(){editor.replaceChildren();add.focus()};
   if(item)form.querySelector("[data-remove]").onclick=function(){items.splice(index,1);commit()};
  }
  add.onclick=function(){edit(foodPlan()[mealIndex][1].length)};
  section.querySelectorAll("[data-food-item]").forEach(function(button){button.onclick=function(){edit(Number(button.dataset.foodItem))}});
 });
 $("#ws").onclick=function(){var v=parseFloat($("#w").value),g=parseFloat($("#gw").value);if(!(v>=30&&v<=300&&g>=30&&g<=300))return;recordWeight(v);S.goalW=g;save("goalw",g);render()};
}
