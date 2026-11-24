/* ---------- Нижнее меню ---------- */
function renderTabs(){
 $("#tabrow").innerHTML=TABS.map(function(t){
  return '<button data-tab="'+t[0]+'"'+(S.tab===t[0]?' aria-current="page"':'')+'>'+svg(t[0])+t[1]+'</button>'}).join("");
 document.querySelectorAll("#tabrow button").forEach(function(b){
  b.onclick=function(){guidePage=null;S.tab=b.dataset.tab;render();pageScroller().scrollTo(0,0)}});
}

/* ---------- Роутер ---------- */
var V={guide:[vGuide,bindGuide],feed:[vFeed,bindFeed],train:[vTrain,bindTrain],food:[vFood,bindFood],chat:[vChat,bindChat],me:[vMe,bindMe]};
function render(){
 var guideVideo=$("#view .exercise-demo video");
 if(guideVideo)guideVideo.pause();
 $("#view").innerHTML=V[S.tab][0]();V[S.tab][1]();renderTabs();
}
/* ---------- Экран входа: визуальный макет, настоящей авторизации нет ---------- */
(function(){
 var L=$("#login");
 function authed(){try{return sessionStorage.getItem("fit:auth")==="1"}catch(e){return false}}
 function setA(v){try{v?sessionStorage.setItem("fit:auth","1"):sessionStorage.removeItem("fit:auth")}catch(e){}}
 function show(on){L.style.display=on?"block":"none";document.body.style.overflow=on?"hidden":""}
 function enter(){
  var panel=L.querySelector(".body-panel");if(panel)panel.remove();
  L.classList.remove("profile-step");L.setAttribute("aria-label","Вход в Fitness Workspace");
  setA(true);show(false);S.tab="feed";render();pageScroller().scrollTo(0,0);
 }
 function start(){
  if(L.classList.contains("profile-step"))return;
  show(true);L.classList.add("profile-step");L.setAttribute("aria-label","Параметры тела");
  L.insertAdjacentHTML("beforeend",'<section class="body-panel"><h1>Параметры тела</h1><p>Укажите вес, рост и возраст. Позже их можно изменить в кабинете.</p>'+bodyForm(true)+'</section>');
  L.scrollTop=0;bindBody(L.querySelector(".body-form"),enter);
 }
 show(!authed());if(authed() && !bodyProfile)start();
 document.querySelectorAll("[data-stub]").forEach(function(b){b.onclick=function(){$("#lh").textContent="Вход "+b.dataset.stub+" пока не подключён: это визуальный макет. Нажмите «Вход без регистрации»."}});
 $("#email-entry").onclick=start;
 $("#guest").onclick=start;
 window.logout=function(){setA(false);$("#lh").textContent="";show(true);L.scrollTop=0};
})();
render();
