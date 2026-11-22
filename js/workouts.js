/* ---------- Тренировки ---------- */
var WO={"Пн":0,"Ср":2,"Пт":4};
function wdate(day){var n=new Date();return new Date(n.getFullYear(),n.getMonth(),n.getDate()-((n.getDay()+6)%7)+WO[day])}
S.day=dk(new Date());
var workouts=load("dated-workouts",null);
function dateOf(key){return new Date(key+"T12:00:00")}
function persistWorkouts(){save("dated-workouts",workouts)}
if(!workouts){
 workouts={};
 function seed(key,template){workouts[key]=JSON.parse(JSON.stringify(DAYS[template]))}
 Object.keys(DAYS).forEach(function(day){seed(dk(wdate(day)),day)});
 Object.keys(S.hist).forEach(function(key){
  var template=["Вс","Пн","Вт","Ср","Чт","Пт","Сб"][dateOf(key).getDay()];
  if(DAYS[template])seed(key,template);
 });
 persistWorkouts();
}
function vTrain(){
 var d=workouts[S.day], date=dateOf(S.day).toLocaleDateString("ru-RU",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
 var header='<h1>Тренировки</h1>'+cal()+'<div class="card"><h2>'+date+'</h2>';
 if(!d)return header+'<p class="mute">На этот день тренировки пока нет.</p><div id="new-workout"><label>Название тренировки<input name="title" maxlength="100" placeholder="Например, тренировка ног"></label><button type="button" id="create-workout" class="btn">Создать тренировку</button></div></div>';
 var items=d.ex.map(function(e,i){
  var completed=S.done[S.day+i]||0;
  return '<div class="exercise-row"><div class="exercise-line"><div class="exercise-track"><button class="ex" data-ex="'+i+'"><span class="n">'+(i+1)+'</span><span style="flex:1"><b>'+esc(e.n)+'</b><br><span class="mute">'+sumr(e)+'</span></span><span>'+(completed>=e.sets&&e.sets?'✓ ':'')+completed+'/'+e.sets+'</span></button><button type="button" class="exercise-remove">Удалить</button></div></div></div>';
 }).join("");
 var status=S.hist[S.day],future=S.day>dk(new Date());
 var controls=future?'': '<div class="seg"><button class="btn '+(status===1?'ok':'ghost')+'" data-status="done">Выполнена'+(status===1?' ✓':'')+'</button><button class="btn '+(status==="m"?'bad':'ghost')+'" data-status="miss">Пропущена'+(status==="m"?' ✓':'')+'</button></div>';
 return header+'<h3>'+esc(d.title)+'</h3><details id="workout-plan"'+((S.wopen[S.day] ?? !items)?' open':'')+'><summary>План тренировки · '+d.ex.length+' '+pl(d.ex.length,"упражнение","упражнения","упражнений")+'</summary>'+(items?'<p class="mute"><span class="swipe-hint">Смахните упражнение влево для удаления. </span>'+(d.ex.length>1?'Чтобы изменить порядок, удерживайте упражнение и перетащите его.':'')+'</p>':'')+items+
 '<details'+(d.ex.length?'':' open')+'><summary>Добавить упражнение</summary><form id="new-ex"><label>Название упражнения<input name="exercise" required maxlength="100"></label><label>Количество подходов<input name="count" type="number" min="1" max="100" value="3" required></label><label>Вес, кг (0 — свой вес)<input name="kg" type="number" min="0" step="any" value="0" required></label><label>Повторений в подходе<input name="reps" type="number" min="1" value="10" required></label><button class="btn" type="button" id="add-exercise">Добавить в тренировку</button></form></details></details>'+controls+'<button class="btn ghost" id="delete-workout" type="button">Удалить тренировку</button><div id="delete-question" hidden><p>Удалить тренировку «'+esc(d.title)+'» за '+fmt(dateOf(S.day))+' вместе с упражнениями?</p><div class="seg"><button type="button" class="btn ghost" id="cancel-delete">Отмена</button><button type="button" class="btn bad" id="confirm-delete">Удалить</button></div></div></div>';
}
function bindTrain(){
 function selectDate(key){S.day=key;render()}
 document.querySelectorAll("[data-date]").forEach(function(b){b.onclick=function(){selectDate(b.dataset.date)}});
 $("#pick-date").onchange=function(){if(this.value&&this.validity.valid)selectDate(this.value)};
 document.querySelectorAll("[data-month]").forEach(function(b){b.onclick=function(){
  var date=dateOf(S.day);date.setDate(1);date.setMonth(date.getMonth()+Number(b.dataset.month));selectDate(dk(date));
 }});
 var d=workouts[S.day];
 if(!d){
  var titleInput=$("#new-workout input");
  function createWorkout(){
   workouts[S.day]={title:titleInput.value.trim()||"Тренировка",ex:[]};
   S.wopen[S.day]=true;persistWorkouts();render();
   $("#new-ex").elements.exercise.focus();
  }
  $("#create-workout").onclick=createWorkout;
  titleInput.onkeydown=function(event){if(event.key==="Enter"&&!event.isComposing){event.preventDefault();createWorkout()}};
  return;
 }
 var plan=$("#workout-plan"),planDay=S.day;
 if(plan)plan.ontoggle=function(){if(plan.isConnected)S.wopen[planDay]=plan.open};
 var exerciseForm=$("#new-ex");
 function addExercise(){
  var f=exerciseForm.elements,name=f.exercise.value.trim();
  f.exercise.setCustomValidity(name?"":"Введите название упражнения");
  if(!exerciseForm.reportValidity())return;
  var sets=Array.from({length:f.count.valueAsNumber},function(){return {kg:f.kg.valueAsNumber,r:f.reps.valueAsNumber,w:false}});
  d.ex.push({n:name,m:"Упражнение",sets:sets.length,p:sets});
  S.wopen[S.day]=true;persistWorkouts();render();
  document.querySelector('[data-ex="'+(d.ex.length-1)+'"]').focus();
 }
 $("#add-exercise").onclick=addExercise;
 exerciseForm.oninput=function(){exerciseForm.elements.exercise.setCustomValidity("")};
 exerciseForm.onsubmit=function(event){event.preventDefault();addExercise()};
 exerciseForm.onkeydown=function(event){
  if(event.key==="Enter"&&!event.isComposing&&event.target.tagName==="INPUT"){event.preventDefault();addExercise()}
 };
 var activeRow=null;
 function dismissRow(){
  if(!activeRow)return;
  activeRow.classList.remove("revealed");
  var question=activeRow.querySelector(".exercise-question");
  if(question)question.remove();
  activeRow=null;
 }
 function revealRow(row){
  if(activeRow!==row)dismissRow();
  activeRow=row;
  row.classList.add("revealed");
 }
 function moveExercise(from,to){
  if(from===to || to<0 || to>=d.ex.length)return;
  var progress=d.ex.map(function(_,i){return S.done[planDay+i]||0});
  d.ex.splice(to,0,d.ex.splice(from,1)[0]);
  progress.splice(to,0,progress.splice(from,1)[0]);
  progress.forEach(function(count,i){S.done[planDay+i]=count});
  S.wopen[planDay]=true;persistWorkouts();render();
 }
 var rows=Array.from(plan.querySelectorAll(".exercise-row"));
 document.querySelectorAll("[data-ex]").forEach(function(button){
  var row=button.closest(".exercise-row"), remove=row.querySelector(".exercise-remove");
  var index=Number(button.dataset.ex),track=button.parentNode;
  var start=null,mode="",skipTap=false,holdTimer,frame,lastY,target=index,originPageTop,grabOffset;
  function clearMarker(){
   rows[target].classList.remove("drop-before","drop-after");
  }
  function placeRow(){
   var top=lastY-grabOffset;
   row.style.transform="translateY("+(top+window.scrollY-originPageTop)+"px)";
   var center=top+row.offsetHeight/2;
   clearMarker();
   target=0;
   rows.forEach(function(other){
    if(other===row)return;
    var rect=other.getBoundingClientRect();
    var midpoint=rect.top+rect.height/2;
    if(center>midpoint || (center===midpoint && rows.indexOf(other)>index))target++;
   });
   if(target!==index)rows[target].classList.add(target<index?"drop-before":"drop-after");
  }
  function followPointer(){
   if(!row.isConnected || mode!=="move"){finish(false);return}
   var edge=70, bottom=window.innerHeight-70;
   var speed=lastY<edge?-Math.min(14,(edge-lastY)/4):Math.max(0,Math.min(14,(lastY-bottom)/4));
   if(speed)window.scrollBy(0,speed);
   placeRow();frame=requestAnimationFrame(followPointer);
  }
  function lift(){
   if(!start || !row.isConnected || mode!=="pending")return;
   dismissRow();mode="move";skipTap=true;
   var rect=row.getBoundingClientRect();
   originPageTop=rect.top+window.scrollY;grabOffset=start.y-rect.top;
   row.classList.add("lifted");frame=requestAnimationFrame(followPointer);
  }
  button.oncontextmenu=function(event){if(start || skipTap)event.preventDefault()};
  button.onpointerdown=function(event){
   if(start || !event.isPrimary || event.button!==0)return;
   start={x:event.clientX,y:event.clientY,id:event.pointerId};
   lastY=start.y;mode="pending";skipTap=false;
   button.setPointerCapture(event.pointerId);
   if(rows.length>1)holdTimer=setTimeout(lift,380);
  };
  button.onpointermove=function(event){
   if(!start || event.pointerId!==start.id)return;
   var dx=event.clientX-start.x,dy=event.clientY-start.y,previousY=lastY;
   lastY=event.clientY;
   if(mode==="pending"){
    if(Math.max(Math.abs(dx),Math.abs(dy))<8)return;
    clearTimeout(holdTimer);skipTap=true;
    if(event.pointerType==="mouse" && rows.length>1){lift();return}
    mode=Math.abs(dy)>=Math.abs(dx)?"scroll":"swipe";
    if(mode==="swipe")track.classList.add("dragging");
   }
   if(mode==="scroll" && event.pointerType!=="mouse")window.scrollBy(0,previousY-lastY);
   if(mode==="swipe"){
    var offset=Math.max(-88,Math.min(0,(activeRow===row?-88:0)+dx));
    button.style.setProperty("--slide",offset+"px");
   }
  };
  function finish(commit){
   clearTimeout(holdTimer);cancelAnimationFrame(frame);
   if(mode==="move"){
    if(commit)placeRow();
    clearMarker();row.classList.remove("lifted");row.style.removeProperty("transform");
   }
   var moved=mode==="move" && commit && index!==target;
   track.classList.remove("dragging");button.style.removeProperty("--slide");
   start=null;mode="";
   if(moved)moveExercise(index,target);
  }
  function endGesture(event){
   if(!start || event.pointerId!==start.id)return;
   var commit=event.type==="pointerup";
   if(commit){
    lastY=event.clientY;
    var dx=event.clientX-start.x;
    if(mode==="swipe" && dx < -30)revealRow(row);
    if(mode==="swipe" && dx > 30)dismissRow();
   }
   finish(commit);
  }
  button.onpointerup=button.onpointercancel=button.onlostpointercapture=endGesture;
  button.onkeydown=function(event){
   if(event.altKey && (event.key==="ArrowUp" || event.key==="ArrowDown")){
    event.preventDefault();
    var next=index+(event.key==="ArrowUp"?-1:1);
    if(next>=0 && next<rows.length){moveExercise(index,next);document.querySelector('[data-ex="'+next+'"]').focus()}
    return;
   }
   if(event.key==="Delete"){event.preventDefault();revealRow(row);remove.focus()}
  };
  button.onclick=function(event){
   if(skipTap && event.detail){skipTap=false;return}
   if(activeRow===row){dismissRow();return}
   dismissRow();openEx(index);
  };
  remove.onclick=function(){
   revealRow(row);
   if(row.querySelector(".exercise-question"))return;
   var question=document.createElement("div");
   question.className="exercise-question";
   question.innerHTML='<p>Удалить упражнение «'+esc(d.ex[index].n)+'» из плана?</p><button type="button" class="btn bad">Да, удалить</button> <button type="button" class="btn ghost">Отмена</button>';
   row.appendChild(question);
   var actions=question.querySelectorAll("button");
   actions[1].focus();
   actions[1].onclick=function(){dismissRow();button.focus()};
   actions[0].onclick=function(){
    d.ex.splice(index,1);
    for(var pos=index;pos<d.ex.length;pos++){
     S.done[S.day+pos]=S.done[S.day+(pos+1)]||0;
    }
    delete S.done[S.day+d.ex.length];
    S.wopen[S.day]=true;
    persistWorkouts();render();
    var next=document.querySelector('[data-ex="'+Math.min(index,d.ex.length-1)+'"]');
    (next || $("#new-ex").elements.exercise).focus();
   };
  };
 });
 plan.addEventListener("pointerdown",function(event){
  if(activeRow && !activeRow.contains(event.target))dismissRow();
 });
 plan.addEventListener("keydown",function(event){
  if(event.key==="Escape" && activeRow){
   var trigger=activeRow.querySelector("[data-ex]");
   dismissRow();trigger.focus();
  }
 });
 document.querySelectorAll("[data-status]").forEach(function(b){b.onclick=function(){
  var value=b.dataset.status==="done"?1:"m";if(S.hist[S.day]===value)delete S.hist[S.day];else S.hist[S.day]=value;save("hist2",S.hist);render();
 }});
 var deleteButton=$("#delete-workout"), question=$("#delete-question");
 deleteButton.onclick=function(){question.hidden=false;$("#cancel-delete").focus()};
 $("#cancel-delete").onclick=function(){question.hidden=true;deleteButton.focus()};
 $("#confirm-delete").onclick=function(){
  d.ex.forEach(function(e,i){delete S.done[S.day+i]});delete S.wopen[S.day];delete workouts[S.day];delete S.hist[S.day];save("hist2",S.hist);persistWorkouts();render();
 };
}

/* Анимация-заглушка. Для настоящей техники подставьте <img src="жим.gif"> */
function demo(){
 return '<div class="demo"><svg viewBox="0 0 320 150" role="img" aria-label="Схема выполнения упражнения">'+
 '<rect x="40" y="128" width="240" height="6" rx="3" fill="currentColor" opacity=".15"/>'+
 '<g stroke="currentColor" stroke-width="5" stroke-linecap="round" fill="none" opacity=".75"><circle cx="160" cy="88" r="9" fill="currentColor" stroke="none"/><path d="M160 98v22M160 104l-22 10M160 104l22 10"/></g>'+
 '<g class="bar" style="color:var(--brand)"><rect x="90" y="56" width="140" height="5" rx="2.5" fill="currentColor"/><rect x="82" y="44" width="10" height="29" rx="3" fill="currentColor"/><rect x="228" y="44" width="10" height="29" rx="3" fill="currentColor"/></g></svg></div>';
}

function pl(n,a,b,c){var m=n%10,h=n%100;return m===1&&h!==11?a:(m>=2&&m<=4&&(h<12||h>14))?b:c}
function kgl(x){return x.kg===0?"свой вес":String(x.kg).replace(".",",")+" кг"}
function sumr(e){
 if(!e.sets)return "Подходов пока нет";
 var last=e.p[e.sets-1];
 if(e.p.every(function(x){return !x.w && x.kg===last.kg && x.r===last.r}))return e.sets+" × "+last.r+" · "+kgl(last);
 return e.sets+" "+pl(e.sets,"подход","подхода","подходов");
}
/* Видео-инструкция: если у упражнения есть поле video и файл найден, показываем его, иначе схему-заглушку */
function vid(e){
 if(!e.video)return demo();
 return '<div class="demo"><video src="'+e.video+'" autoplay muted loop playsinline controls preload="metadata" aria-label="Видео: '+e.n+'"></video></div>';
}
