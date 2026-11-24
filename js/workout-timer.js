/* Таймер отдыха между подходами */
var DEFAULT_REST_SECONDS=120;
var WORK_REST_INCREMENT_SECONDS=15;
var T={id:null,phase:"idle",endsAt:0,remainingMs:0,restDuration:0,ex:null};
function stopT(){clearInterval(T.id);T.id=null;T.endsAt=0;T.remainingMs=0;T.phase="idle"}
function runRest(){
 T.endsAt=Date.now()+T.remainingMs;
 T.id=setInterval(tick,1000);
}
function fm(n){return Math.floor(n/60)+":"+("0"+n%60).slice(-2)}
function buzz(p){if(navigator.vibrate)try{navigator.vibrate(p)}catch(x){}}
function restSeconds(e){return e.restSeconds??DEFAULT_REST_SECONDS}
function restAfter(e,index){
 if(e.p[index].w)return 0;
 var previousWorkSets=e.p.slice(0,index).filter(function(set){return !set.w}).length;
 return restSeconds(e)+previousWorkSets*WORK_REST_INCREMENT_SECONDS;
}
function paintT(){
 var box=$("#timer");if(!box)return;
 var e=workouts[S.day].ex[T.ex],c=S.done[S.day+T.ex]||0;
 var rest=T.phase==="rest", finished=e.sets>0 && c===e.sets;
 var next=e.p[c], editing=!$("#set-form").hidden;
 $("#phase-title").textContent=finished?"Упражнение выполнено":next?((rest?"Далее · подход ":"Подход ")+(c+1)+" из "+e.sets+" · "+kgl(next)):"Подходов пока нет";
 $("#rep-value").textContent=next?next.r:"—";
 $("#rest-clock").hidden=!rest;
 if(rest){
  var clock=$("#time-value");
  var left=Math.ceil(T.remainingMs/1000);
  var accent=left<=30?"var(--bad)":left<=60?"var(--warm)":"var(--ok)";
  clock.textContent=fm(left);
  clock.style.setProperty("--accent",accent);
  clock.style.setProperty("--fill",(left/T.restDuration*100)+"%");
 }
 $("#done-value").textContent=c+"/"+e.sets;
 $("#done-value").style.setProperty("--fill",(e.sets?c/e.sets*100:0)+"%");
 $("#tb").textContent=rest?(T.id===null?"Продолжить":"Пауза"):finished?"Начать заново":next?"Завершить подход":"Добавьте первый подход";
 $("#tb").disabled=!e.sets || editing;
 $("#skip-rest").hidden=!rest;
 $("#skip-rest").disabled=editing;
 $("#set-add").disabled=T.id!==null;
 $("#sets").innerHTML=e.p.map(function(x,i){
  var cls=i<c?" on":(i===c&&!rest?" cur":"");
  return '<div class="srow'+cls+'"><span>'+(i<c?"✓":i+1)+'</span><span style="flex:1"><b>'+kgl(x)+' × '+x.r+'</b> <span class="mute">'+(x.w?"разминка":"рабочий")+'</span></span><span class="mute">'+(!x.w && i<e.sets-1?"отдых "+fm(rest && i===c-1?T.restDuration:restAfter(e,i)):"")+'</span><button class="chip" data-edit="'+i+'" aria-label="Изменить подход '+(i+1)+'" '+(T.phase==="idle"?"":"disabled")+'>Изменить</button></div>'}).join("");
}
function syncRest(){
 T.remainingMs=Math.max(0,T.endsAt-Date.now());
 if(T.remainingMs===0){stopT();buzz([100,80,100])}
}
function tick(){
 if(T.id===null)return;
 syncRest();
 paintT();
}
document.addEventListener("visibilitychange",function(){if(!document.hidden)tick()});
window.addEventListener("pageshow",tick);
function openEx(i){
 var e=workouts[S.day].ex[i];stopT();T.ex=i;
 var baseRest=restSeconds(e);
 var muscles=e.m.replace(/ · кг на каждую гантель$/i,"");
 $("#pane").innerHTML='<div class="row"><div><h2>'+esc(e.n)+'</h2><span class="tag">'+esc(muscles)+'</span></div><button class="btn ghost" id="close">Закрыть</button></div>'+
 vid(e)+
 '<section class="card" id="timer"><h3 id="phase-title"></h3><div class="rings"><div><b id="rep-value"></b>Повторения</div><div id="rest-clock" hidden><b id="time-value"></b>Отдых</div><div><b id="done-value"></b>Выполнено</div></div></section>'+
 '<div class="timer-actions"><button class="btn" id="tb"></button><button class="btn ghost" id="skip-rest" hidden>Закончить отдых</button></div>'+
 '<details id="set-list"><summary>План подходов · <span id="set-count">'+e.sets+' '+pl(e.sets,"подход","подхода","подходов")+'</span></summary>'+
 '<form id="rest-form" class="rest-form" aria-label="Базовый отдых"><div class="metric-values">'+wheelField("minutes","мин",Math.floor(baseRest/60),0,59)+wheelField("seconds","сек",baseRest%60,0,59)+'</div><button class="btn ghost">Сохранить отдых</button></form><p id="rest-status" class="mute rest-status" role="status"></p>'+
 '<div id="sets" style="margin:10px 0"></div><button type="button" class="btn ghost" id="set-add">Добавить подход</button><form class="card" id="set-form" hidden></form></details>'+
 '<div class="card" style="margin-top:12px"><h2>Заметка тренеру</h2><p class="mute" style="margin-bottom:8px">Если вес или повторения отличались от плана, напишите.</p><div class="send"><input id="nt" placeholder="Например: 72,5 кг × 5, последний подход тяжело" aria-label="Заметка"><button class="btn" id="nts">Отправить</button></div></div>';
 $("#sheet").classList.add("open");
 $("#close").onclick=closeEx;
 var form=$("#set-form");
 var restForm=$("#rest-form"), restStatus=$("#rest-status");
 restForm.onsubmit=function(event){
  event.preventDefault();
  var values=readRest(), seconds=values.minutes*60+values.seconds;
  if(!Number.isSafeInteger(seconds) || seconds<1){restStatus.textContent="Выберите время отдыха больше 0:00.";return}
  e.restSeconds=seconds;
  persistWorkouts();paintT();
  restStatus.textContent="Отдых сохранён: "+fm(seconds)+(T.phase==="rest"?" со следующего перерыва.":".");
 };
 var list=$("#set-list"), listKey="set-list:"+S.day+":"+e.n;
 list.open=load(listKey,false);
 var readRest=bindWheels(restForm);
 list.ontoggle=function(){
  save(listKey,list.open);
  if(!list.open && !form.hidden){form.hidden=true;paintT()}
 };
 function editSet(index){
  var adding=index===e.p.length;
  if(adding?T.id!==null:T.phase!=="idle")return;
  var value=e.p[index] || e.p[index-1] || {kg:0,r:12,w:false};
  form.innerHTML='<div id="set-fields"><h3>'+(adding?"Добавить подходы":"Подход "+(index+1))+'</h3>'+
   '<label>Вес, кг (0 — свой вес)<input name="kg" type="number" required min="0" step="any"></label>'+
   '<label>Повторения<input name="reps" type="number" required min="1" step="1"></label>'+
   '<label>Тип подхода<select name="kind"><option value="work">Рабочий</option><option value="warm">Разминка</option></select></label>'+
   (adding?'<label>Количество подходов<input name="quantity" type="number" required min="1" max="100" step="1" value="1"></label>':'')+
   '<div><button type="button" id="set-save" class="btn">Сохранить</button> <button type="button" class="chip" id="set-cancel">Отмена</button> '+
   (adding?"":'<button type="button" class="chip" id="set-delete">Удалить</button>')+'</div></div>'+
   (adding?'':'<div id="set-delete-question" hidden><p>Удалить подход '+(index+1)+'?</p><button type="button" class="btn bad" id="set-delete-yes">Да, удалить</button> <button type="button" class="chip" id="set-delete-no">Отмена</button></div>');
  form.hidden=false;
  form.elements.kg.value=value.kg;
  form.elements.reps.value=value.r;
  form.elements.kind.value=value.w?"warm":"work";
  $("#tb").disabled=true;
  $("#skip-rest").disabled=true;
  form.elements.kg.focus();
  function finish(){
   e.sets=e.p.length;
   persistWorkouts();
   $("#set-count").textContent=e.sets+" "+pl(e.sets,"подход","подхода","подходов");
   form.hidden=true;
   paintT();
  }
  function saveSet(){
   if(form.hidden || $("#set-fields").hidden || !form.reportValidity())return;
   var set={kg:form.elements.kg.valueAsNumber,r:form.elements.reps.valueAsNumber,w:form.elements.kind.value==="warm"};
   if(adding){
    var insertAt=index;
    if(set.w){
     var firstPending=S.done[S.day+i]||0;
     var firstWork=e.p.findIndex(function(item,position){return position>=firstPending && !item.w});
     if(firstWork!==-1)insertAt=firstWork;
    }
    var quantity=form.elements.quantity.valueAsNumber;
    var added=Array.from({length:quantity},function(){return {...set}});
    e.p.splice(insertAt,0,...added);
   }else e.p[index]=set;
   finish();
  }
  $("#set-save").onclick=saveSet;
  form.onsubmit=function(event){event.preventDefault();saveSet()};
  form.onkeydown=function(event){
   if(event.key==="Enter" && !event.isComposing && event.target.tagName==="INPUT"){event.preventDefault();saveSet()}
  };
  $("#set-cancel").onclick=function(){form.hidden=true;paintT()};
  if(adding)return;
  var fields=$("#set-fields"), question=$("#set-delete-question");
  $("#set-delete").onclick=function(){
   fields.hidden=true;
   question.hidden=false;
   $("#set-delete-no").focus();
  };
  $("#set-delete-no").onclick=function(){
   question.hidden=true;
   fields.hidden=false;
   $("#set-delete").focus();
  };
  $("#set-delete-yes").onclick=function(){
   if(form.hidden || question.hidden)return;
   e.p.splice(index,1);
   if(index<(S.done[S.day+i]||0))S.done[S.day+i]--;
   finish();
  };
 }
 $("#sets").onclick=function(event){
  var button=event.target.closest("[data-edit]");
  if(button)editSet(Number(button.dataset.edit));
 };
 $("#set-add").onclick=function(){editSet(e.p.length)};
 var pv=document.querySelector("#pane video");if(pv)pv.onerror=function(){pv.parentNode.outerHTML=demo()};
 $("#nts").onclick=function(){var v=$("#nt").value.trim();if(!v)return;S.chat.push({me:1,t:"«"+e.n+"»: "+v});save("chat",S.chat);$("#nt").value="";$("#nts").textContent="Отправлено ✓";
  setTimeout(function(){S.chat.push({me:0,t:"Принял, посмотрю и дам рекомендации."});save("chat",S.chat);if(S.tab==="chat")render()},1200)};
 $("#tb").onclick=function(){
  if(T.phase==="rest"){
   if(T.id===null){
    runRest();
   }else{
    syncRest();
    clearInterval(T.id);
    T.id=null;
   }
   paintT();
   return;
  }
  var key=S.day+i, completed=S.done[key]||0;
  if(completed>=e.sets){
   S.done[key]=0;
  }else{
   S.done[key]=completed+1;
   if(S.done[key]<e.sets && !e.p[completed].w){
    T.phase="rest";T.restDuration=restAfter(e,completed);T.remainingMs=T.restDuration*1000;
    runRest();
   }
  }
  paintT();
 };
 $("#skip-rest").onclick=function(){stopT();paintT()};
 paintT();
}
function closeEx(){stopT();$("#sheet").classList.remove("open");render()}
$("#sheet").onclick=function(ev){if(ev.target.id==="sheet")closeEx()};
