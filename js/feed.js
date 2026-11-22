/* ---------- Лента ---------- */
function card(p){
 var liked=S.liked[p.id],cm=(p.c||[]).concat(S.comm[p.id]||[]),open=S.open[p.id];
 var head='<span class="tag'+(p.fill?' fill':'')+'">'+p.tag+'</span>'+(p.title?'<h2>'+esc(p.title)+'</h2>':'')+(p.text?'<p>'+esc(p.text)+'</p>':'')+(p.meta?'<p class="mute">'+esc(p.meta)+'</p>':'');
 if(p.go)return '<article class="card">'+head+'<div style="margin-top:10px"><button class="btn" data-go="'+p.go+'">Открыть тренировку</button></div></article>';
 var foot='<div class="row" style="margin-top:10px"><span class="by">'+ava(p.by)+'<span class="mute">'+esc(p.by)+'</span></span><span class="acts"><button class="like" data-cm="'+p.id+'" aria-expanded="'+!!open+'" aria-label="Комментарии">💬 '+cm.length+'</button><button class="like" data-like="'+p.id+'" aria-pressed="'+!!liked+'" aria-label="Нравится">'+(liked?"♥":"♡")+' '+(p.likes+(liked?1:0))+'</button></span></div>';
 var thr=open?'<div class="thr">'+cm.map(function(c){return '<div class="cm">'+ava(c.by)+'<div><b>'+esc(c.by)+'</b><br>'+esc(c.t)+'</div></div>'}).join("")+'<div class="send"><input data-ci="'+p.id+'" placeholder="Комментарий" aria-label="Комментарий"><button class="btn" data-cs="'+p.id+'">Ок</button></div></div>':"";
 return '<article class="card">'+head+foot+thr+'</article>';
}
function vFeed(){
 var f=["Все","Новости"],all=S.posts.concat(FEED);
 var items=all.filter(function(p){return S.filter==="Все"||p.tag===S.filter});
 var left=Math.ceil((USER.end-new Date())/864e5);
 var remind=(S.filter==="Все"&&left<=REMIND&&left>=0)?'<article class="card"><span class="tag fill">Подписка</span><p>Подписка заканчивается через '+left+' дн. ('+fmt(USER.end)+'). Продлите, чтобы не потерять доступ к тренировкам.</p><div style="margin-top:10px"><button class="btn" data-renew="1">Продлить на 30 дней</button></div></article>':"";
 var comp='<div class="card"><h2>Поделиться достижением</h2><div class="send" style="margin-top:8px"><input id="np" placeholder="Например: Сегодня впервые присел 120 кг" aria-label="Достижение"><button class="btn" id="npb">Опубликовать</button></div></div>';
 return '<h1>Лента</h1><div class="chips">'+f.map(function(x){
  return '<button class="chip" data-f="'+x+'" aria-pressed="'+(S.filter===x)+'">'+x+'</button>'}).join("")+'</div>'+remind+comp+items.map(card).join("");
}
function bindFeed(){
 document.querySelectorAll("[data-f]").forEach(function(b){b.onclick=function(){S.filter=b.dataset.f;render()}});
 document.querySelectorAll("[data-like]").forEach(function(b){b.onclick=function(){var i=b.dataset.like;S.liked[i]=!S.liked[i];render()}});
 document.querySelectorAll("[data-go]").forEach(function(b){b.onclick=function(){S.tab="train";S.day=dk(wdate(b.dataset.go));render();window.scrollTo(0,0)}});
 document.querySelectorAll("[data-cm]").forEach(function(b){b.onclick=function(){var i=b.dataset.cm;S.open[i]=!S.open[i];render()}});
 document.querySelectorAll("[data-cs]").forEach(function(b){
  var id=b.dataset.cs,inp=document.querySelector('[data-ci="'+id+'"]');
  function go(){var v=inp.value.trim();if(!v)return;(S.comm[id]=S.comm[id]||[]).push({by:ME_NAME,t:v});save("comm",S.comm);render()}
  b.onclick=go;inp.onkeydown=function(e){if(e.key==="Enter")go()};
 });
 function post(){var v=$("#np").value.trim();if(!v)return;S.posts.unshift({id:"u"+Date.now(),tag:"Новости",text:v,by:ME_NAME,likes:0});save("posts",S.posts);render()}
 $("#npb").onclick=post;$("#np").onkeydown=function(e){if(e.key==="Enter")post()};
 bindRenew();
}
