/* ---------- Состояние ---------- */
var S={
 tab:"feed",filter:"Все",liked:{},
 day:"Пн",done:{},
 goal:load("goal","loss"),mday:0,
 weight:load("weight",82.5),
 chat:load("chat",[{me:0,t:"Здравствуйте! Задайте вопрос о тренировках или питании — отвечу в течение дня."}])
};
var USER={since:new Date(2025,10,20),end:new Date(2026,11,20)};
var $=function(s){return document.querySelector(s)};
var fmt=function(d){return d.toLocaleDateString("ru-RU")};
var svg=function(n){return '<svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+ICON[n]+'</svg>'};
var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})};

/* ---------- Доп. состояние: прогресс, календарь, лента ---------- */
function dk(d){return d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2)}
var REMIND=35; /* за сколько дней до конца подписки напоминать */
var ME_NAME="Сергей Филиппов";
(function(){var e=load("end",null);if(e)USER.end=new Date(e)})();
FEED.forEach(function(p,i){p.id="f"+i});
FEED[1].c=[{by:"Александр Рылов",t:"Мощно! Следующая цель — 130."}];
FEED[2].c=[{by:"Денис Сошников",t:"Поздравляю, красавчик!"},{by:"Тренер Андрей Корнеев",t:"Отличная работа, не забывай про разминку."}];
S.posts=load("posts",[]);S.comm=load("comm",{});S.open={};S.wopen={};S.goalW=load("goalw",78);
S.wlog=load("wlog",null);
if(!S.wlog){var n0=new Date(),w0=[86.0,85.2,84.5,83.8,83.0,S.weight];S.wlog=w0.map(function(v,i){var d=new Date(n0);d.setDate(n0.getDate()-7*(5-i));return{d:dk(d),w:v}})}
S.hist=load("hist2",null);
if(!S.hist){S.hist={};var t0=new Date();var mon0=new Date(t0.getFullYear(),t0.getMonth(),t0.getDate()-((t0.getDay()+6)%7));for(var k0=1;k0<=21;k0++){var d0=new Date(mon0);d0.setDate(mon0.getDate()-k0);if([1,3,5].indexOf(d0.getDay())>=0)S.hist[dk(d0)]=1}}
function renew(){USER.end=new Date(USER.end.getTime()+30*864e5);save("end",USER.end.toISOString());render()}
function bindRenew(){document.querySelectorAll("[data-renew]").forEach(function(b){b.onclick=renew})}
