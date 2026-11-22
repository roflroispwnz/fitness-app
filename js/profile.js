/* ---------- Личный кабинет ---------- */
function cal(){
 var n=dateOf(S.day),tk=dk(new Date()),y=n.getFullYear(),m=n.getMonth(),first=(new Date(y,m,1).getDay()+6)%7,dim=new Date(y,m+1,0).getDate(),c=0,cells="";
 ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"].forEach(function(x){cells+='<span>'+x+'</span>'});
 for(var i=0;i<first;i++)cells+='<i></i>';
 for(var day=1;day<=dim;day++){
  var key=dk(new Date(y,m,day)),cls="";
  if(workouts[key]){if(S.hist[key]===1){c++;cls=" on"}else cls=S.hist[key]==="m"||key<tk?" ms":" pl"}
  cells+='<button class="cd'+cls+(key===S.day?' td':'')+'" data-date="'+key+'" aria-label="'+fmt(dateOf(key))+'" aria-pressed="'+(key===S.day)+'">'+day+'</button>';
 }
 return '<div class="card"><div class="row"><button class="chip" data-month="-1" aria-label="Предыдущий месяц">‹</button><b>'+n.toLocaleDateString("ru-RU",{month:"long",year:"numeric"})+'</b><button class="chip" data-month="1" aria-label="Следующий месяц">›</button></div><label>Перейти к дате <input id="pick-date" type="date" min="1000-01-01" max="9999-12-31" value="'+S.day+'"></label><div class="cal">'+cells+'</div><p class="mute">Выполнено за месяц: '+c+'</p>'+
 '<p class="mute lg"><span><i class="dot pl"></i>запланирована</span><span><i class="dot on"></i>выполнена</span><span><i class="dot ms"></i>пропущена</span></p></div>';
}
var bodyProfile=load("body-profile",null);
function recordWeight(value){
 S.weight=value;
 save("weight",value);
 var today=dk(new Date()),last=S.wlog[S.wlog.length-1];
 if(last && last.d===today)last.w=value;
 else S.wlog.push({d:today,w:value});
 save("wlog",S.wlog);
}
function wheelField(name,label,value,min,max,step=1){
  var rows="";
  for(var n=min;n<=max;n+=step)rows+='<div class="wheel-number" data-number="'+n+'">'+n+'</div>';
  if(value>max)rows+='<div class="wheel-number" data-number="'+value+'">'+value+'</div>';
  return '<div><div class="wheel-frame"><div class="metric-wheel" role="spinbutton" tabindex="0" aria-label="'+label+'" aria-valuemin="'+min+'" aria-valuemax="'+Math.max(max,value)+'" aria-valuenow="'+value+'" data-field="'+name+'">'+rows+'</div></div><small>'+label+'</small></div>';
}
function bodyForm(first){
 var grams=Math.round(S.weight*10)*100;
 function card(title,fields){return '<div class="metric-card"><strong>'+title+'</strong><div class="metric-values">'+fields+'</div></div>'}
 return '<form class="body-form">'+card("Ваш вес",wheelField("kg","кг",Math.floor(grams/1000),30,300)+wheelField("grams","г",grams%1000,0,900,100))+
 card("Ваш рост",wheelField("height","см",bodyProfile?bodyProfile.height:175,50,250))+
 card("Ваш возраст",wheelField("age","лет",bodyProfile?bodyProfile.age:25,1,120))+
 '<p class="wheel-error" role="status"></p><button type="button" class="btn">'+(first?"Продолжить":"Сохранить")+'</button></form>';
}
function bindWheels(form){
 var wheels=Array.from(form.querySelectorAll(".metric-wheel")),step=36;
 function position(w){return Math.max(0,Math.min(w.children.length-1,Math.round(w.scrollTop/step)))}
 function read(w){
  return Number(w.children[position(w)].dataset.number);
 }
 function select(w,index){
  index=Math.max(0,Math.min(w.children.length-1,index));
  w.scrollTop=index*step;
  w.setAttribute("aria-valuenow",w.children[index].dataset.number);
 }
 function align(){
  if(form.getClientRects().length && wheels[0].clientHeight)
   wheels.forEach(function(w){select(w,Array.from(w.children).findIndex(function(row){return row.dataset.number===w.getAttribute("aria-valuenow")}))});
 }
 wheels.forEach(function(w){
  w.onscroll=function(){if(w.clientHeight)w.setAttribute("aria-valuenow",read(w))};
  w.onclick=function(event){var row=event.target.closest("[data-number]");if(row)select(w,Array.from(w.children).indexOf(row))};
  w.onkeydown=function(event){
   var deltas={ArrowUp:-1,ArrowDown:1,PageUp:-10,PageDown:10};
   if(event.key in deltas){event.preventDefault();select(w,position(w)+deltas[event.key])}
  };
 });
 align();
 var details=form.closest("details");
 if(details)details.addEventListener("toggle",function(){if(details.open)align()});
 return function(){
  var values={};wheels.forEach(function(w){values[w.dataset.field]=read(w)});
  return values;
 };
}
function bindBody(form,complete){
 var readBody=bindWheels(form);
 function submit(){
  var values=readBody();
  var weight=(1000*values.kg+values.grams)/1000;
  if(weight>300){form.querySelector(".wheel-error").textContent="При весе 300 кг выберите 0 г.";return}
  bodyProfile={height:values.height,age:values.age};
  recordWeight(weight);save("body-profile",bodyProfile);complete();
 }
 form.querySelector("button").onclick=submit;
 form.onsubmit=function(event){event.preventDefault();submit()};
 form.onkeydown=function(event){if(event.key==="Enter" && event.target.tagName==="INPUT"){event.preventDefault();submit()}};
}
function vMe(){
 var now=new Date(),used=Math.floor((now-USER.since)/864e5),left=Math.max(0,Math.ceil((USER.end-now)/864e5));
 return '<h1>Личный кабинет</h1>'+'<div class="card row" style="justify-content:flex-start;gap:14px"><img class="av" style="width:72px;height:72px" src="'+AVS[ME_NAME]+'" alt="'+ME_NAME+'"><div><div class="big">'+ME_NAME+'</div><p class="mute">Участник клуба</p><p class="mute">В клубе с '+fmt(USER.since)+'</p></div></div>'+
 '<div class="card"><h2>Параметры тела</h2><p>'+S.weight.toLocaleString("ru-RU")+' кг · '+(bodyProfile?bodyProfile.height+' см · '+bodyProfile.age+' '+pl(bodyProfile.age,"год","года","лет"):"")+'</p><details id="profile-edit"><summary>Изменить параметры</summary>'+bodyForm(false)+'</details></div>'+
 '<div class="card"><span class="tag">Подписка активна</span><div class="big">до '+fmt(USER.end)+'</div><p class="mute">Продлится автоматически · осталось '+left+' дн.</p><p class="mute">Вы с нами '+used+' дн.</p></div>'+
 '<button class="btn ghost" id="out" style="width:100%;margin-top:12px">Выйти</button>';
}
function bindMe(){bindBody($("#profile-edit form"),render);$("#out").onclick=function(){window.logout()}}
