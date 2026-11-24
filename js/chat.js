/* ---------- Сообщения ---------- */
var REPLIES=["Спасибо за вопрос! Посмотрю вашу программу и отвечу подробнее вечером.","Хороший вопрос. Начните с меньшего веса и следите за техникой — это важнее.","Добавьте воды и сон не меньше 7 часов — восстановление влияет на результат."];
function vChat(){
 return '<h1>Сообщения</h1><div class="card row" style="justify-content:flex-start;gap:12px"><img class="av" src="'+AV+'" alt="Тренер Андрей Корнеев"><div><b>Тренер Андрей Корнеев</b><br><span class="mute">Отвечает на вопросы по тренировкам и питанию</span></div></div>'+
 '<div class="chat" id="log">'+S.chat.map(function(m){return m.me?'<div class="msg me">'+esc(m.t)+'</div>':'<div class="mrow"><img class="av s" src="'+AV+'" alt=""><div class="msg">'+esc(m.t)+'</div></div>'}).join("")+'</div>'+
 '<div class="send chat-send"><input id="inp" placeholder="Ваш вопрос тренеру" aria-label="Сообщение"><button class="btn" id="go">Отправить</button></div>';
}
function bindChat(){
 function send(){var v=$("#inp").value.trim();if(!v)return;
  S.chat.push({me:1,t:v});save("chat",S.chat);render();
  setTimeout(function(){S.chat.push({me:0,t:REPLIES[S.chat.length%REPLIES.length]});save("chat",S.chat);if(S.tab==="chat")render()},1200)}
 $("#go").onclick=send;
 $("#inp").onkeydown=function(e){if(e.key==="Enter")send()};
 pageScroller().scrollTo(0,pageScroller().scrollHeight);
}
