/* ---------- Справочник ---------- */
var guideTitles=["Упражнения","Спортивное питание","Состав и таблица калорийности продуктов","Энциклопедия"];
var guidePage=null;
var foodCategories=[
 ["dairy","Молоко, йогурт и творог"],
 ["grains","Крупы, каши, хлопья и чипсы"],
 ["eggs-cheese","Яйца, сыры и плавленые сырки"],
 ["poultry","Птица, фарш и субпродукты"],
 ["produce","Овощи, зелень и оливки"]
];
var foodCategory=null, foodGuideScroll=0;
var foodProduct=null, foodProductScroll=0;
function foodCategoryImage(category){
 return '<img src="assets/guide/food/'+category[0]+'.jpg" alt="" width="960" height="540">';
}
function vDairyList(back){
 return '<section class="nutrition-guide"><header class="exercise-guide-header food-guide-header">'+back+'<h1>'+esc(foodCategory[1])+'</h1></header>'+
  '<div class="food-product-list">'+dairyProducts.map(function(product,index){
   return '<button type="button" class="food-product-row" data-food-product="'+index+'"><span>'+esc(product.name)+'</span><span class="mute">'+product.kcal+' ккал</span></button>';
  }).join("")+'</div></section>';
}
function foodProductIndex(title,label,marker){
 var available=typeof marker==="number";
 return '<h2>'+esc(title)+'</h2><div class="food-product-index'+(available?'':' is-unavailable')+'"><i aria-hidden="true"'+
  (available?' style="--marker:'+marker+'%"':'')+'></i><span>'+esc(label)+'</span></div>';
}
function vFoodProduct(back){
 var product=dairyProducts[foodProduct];
 var facts=[product.kcal].concat(product.macros||[]);
 var labels=["Ккал","Белки, г","Жиры, г","Углеводы, г"];
 var summary='<dl class="card food-product-macros">'+labels.map(function(label,index){
  return '<div><dt>'+label+'</dt><dd>'+(facts[index]?.toLocaleString("ru-RU")??"—")+'</dd></div>';
 }).join("")+'</dl>';
 var nutrients=product.nutrients?'<dl class="food-product-nutrients">'+product.nutrients.map(function(nutrient){
  return '<div><dt>'+esc(nutrient[0])+'</dt><dd>'+nutrient[1].toLocaleString("ru-RU")+'</dd></div>';
 }).join("")+'</dl>':product.macros?'':'<p class="mute">Калорийность со скриншота. Состав и размер порции не подтверждены.</p>';
 var basis=product.basis||(product.per100g?"100 г":"");
 var density=product.per100g?product.kcal/100:null;
 var densityLabel=density===null?"Нет данных на 100 г":density.toLocaleString("ru-RU",{minimumFractionDigits:2,maximumFractionDigits:2})+" ккал/г";
 var factor=product.inflammatoryFactor;
 var indices=foodProductIndex("Индекс плотности калорий",densityLabel,density===null?null:Math.min(100,density/9*100))+
  foodProductIndex("Воспалительный фактор",factor?.label??"Нет данных",factor?.marker);
 return '<article class="food-product-detail"><header class="food-guide-header">'+back+'</header>'+
  '<img class="food-product-photo" src="assets/guide/food/'+(product.photo||"dairy")+'.jpg" alt="" width="800" height="600"><h1>'+esc(product.name)+'</h1>'+
  '<h2>Пищевая ценность'+(basis?' на '+basis:'')+'</h2>'+summary+nutrients+indices+'</article>';
}
function vFoodGuide(){
 var back='<button type="button" class="exercise-guide-icon" id="food-guide-back" aria-label="Назад">'+svg("guideBack")+'</button>';
 if(foodProduct!==null)return vFoodProduct(back);
 if(foodCategory?.[0]==="dairy")return vDairyList(back);
 if(foodCategory)return '<header class="food-guide-header">'+back+'</header><section class="food-guide-tile">'+foodCategoryImage(foodCategory)+'<h1>'+esc(foodCategory[1])+'</h1></section>';
 return '<section class="nutrition-guide"><header class="exercise-guide-header food-guide-header">'+back+'<h1>Таблица калорийности</h1></header><div class="food-guide-list">'+foodCategories.map(function(category){
  return '<button type="button" class="food-guide-tile" data-food-category="'+category[0]+'">'+foodCategoryImage(category)+'<span>'+esc(category[1])+'</span></button>';
 }).join("")+'</div></section>';
}
function bindFoodGuide(){
 $("#food-guide-back").onclick=function(){
  if(foodProduct!==null){
   var index=foodProduct;
   foodProduct=null;render();
   var row=document.querySelector('[data-food-product="'+index+'"]');
   if(row)row.focus({preventScroll:true});
   pageScroller().scrollTo(0,foodProductScroll);
   return;
  }
  var category=foodCategory;
  if(category)foodCategory=null;
  else guidePage=null;
  render();
  if(category){
   var tile=document.querySelector('[data-food-category="'+category[0]+'"]');
   if(tile)tile.focus({preventScroll:true});
  }
  pageScroller().scrollTo(0,category?foodGuideScroll:0);
 };
 var products=$(".food-product-list");
 if(products)products.onclick=function(event){
  var row=event.target.closest("[data-food-product]");
  if(!row)return;
  foodProductScroll=pageScroller().scrollTop;
  foodProduct=Number(row.dataset.foodProduct);
  render();pageScroller().scrollTo(0,0);
 };
 document.querySelectorAll("[data-food-category]").forEach(function(tile){
  tile.onclick=function(){
   foodGuideScroll=pageScroller().scrollTop;
   foodCategory=foodCategories.find(function(category){return category[0]===tile.dataset.foodCategory});
   render();pageScroller().scrollTo(0,0);
  };
 });
}
var muscleGroups=[
 ["chest","Грудь",/грудь/],
 ["back","Спина",/спин[аы]|поясница|широчайшие|трапеции/],
 ["legs","Ноги",/ноги|квадрицепс|бедра/],
 ["glutes","Ягодичные",/ягодицы/],
 ["shoulders","Дельты",/плечи|дельты/],
 ["arms","Руки",/бицепс|трицепс|предплечья/]
];
var guideExercises=Array.from(new Map(Object.values(DAYS).flatMap(function(day){
 return day.ex.map(function(ex){return [ex.n,ex]});
})).values()).concat(guideExtraExercises, chestExercises, backExercises, legExercises);
const exerciseSearchAliases = {
 ...chestSearchAliases,
 "Присед": "Приседания со штангой",
 "Разгибание ног сидя": "Разгибание ног в тренажёре сидя",
 "Тяга верхнего блока к груди": "Вертикальная тяга широким прямым хватом к груди",
 "Тяга гантели одной рукой с опорой": "Тяга гантели одной рукой на скамье",
 "Горизонтальная тяга в блоке широким хватом": "Горизонтальная тяга блока сидя широким хватом"
};
var exerciseThumbnails={
 "Гиперэкстензия":"hyperextension",
 "Присед":"squat",
 "Жим гантелей сидя":"seated-dumbbell-press",
 "Разгибание ног сидя":"leg-extension",
 "Отведения на задние дельты лёжа":"rear-delt-fly",
 "Гудмонинг":"good-morning",
 "Сгибание рук с EZ-грифом стоя":"ez-bar-curl",
 "Подъём гантелей на бицепс стоя с пронацией":"dumbbell-curl",
 "Подтягивания":"pull-up",
 "Становая тяга":"deadlift",
 "Горизонтальная тяга в блоке широким хватом":"cable-row",
 "Шраги с гантелями":"shrug",
 "Молоты":"hammer-curl",
 "Жим штанги":"barbell-bench-press",
 "Жим гантелей лёжа":"dumbbell-bench-press",
 "Сведение рук в тренажёре":"pec-deck",
 "Французский жим с EZ-грифом":"ez-bar-triceps-extension",
 "Разгибание рук V-образной рукояткой":"cable-pushdown"
};
var exerciseGuide={group:null,query:"",savedOnly:false,videoOnly:false,exercise:null,scroll:0};
var savedExercises=new Set(load("guide-saved-exercises",[]));
Object.assign(ICON,{
 guideBack:'<path d="M20 12H4m6-6-6 6 6 6"/>',
 guideSearch:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
 guideSave:'<path d="M6 3h12v18l-6-5-6 5z"/>',
 guideFilter:'<path d="M3 4h18l-7 8v7l-4 2v-9z"/>'
});
function exerciseGuideResults(){
 var group=exerciseGuide.group;
 var query=exerciseGuide.query.trim().toLocaleLowerCase("ru").replace(/ё/g,"е");
 if(!group && !query && !exerciseGuide.savedOnly && !exerciseGuide.videoOnly){
  return '<div class="exercise-muscles">'+muscleGroups.map(function(item){
   return '<button type="button" class="muscle-tile" data-muscle="'+item[0]+'" style="background-image:linear-gradient(90deg,#082738 6%,#082738a8 38%,transparent 63%),url(assets/guide/muscles/'+item[0]+'.jpg)">'+item[1]+'</button>';
  }).join("")+'</div>';
 }
 var results=guideExercises.filter(function(ex){
  var matches=(ex.n+" "+ex.m+" "+(exerciseSearchAliases[ex.n]||"")).toLocaleLowerCase("ru").replace(/ё/g,"е").includes(query);
  return matches && (!group || group[2].test(ex.m.toLocaleLowerCase("ru"))) &&
   (!exerciseGuide.savedOnly || savedExercises.has(ex.n)) && (!exerciseGuide.videoOnly || ex.video);
 });
 return results.map(function(ex){
  var thumbnail=ex.thumbnail||exerciseThumbnails[ex.n];
  var preview=thumbnail?'<img class="exercise-guide-thumb" src="assets/guide/exercises/'+thumbnail+'.jpg" alt="" width="64" height="64" loading="lazy">':'<span></span>';
  return '<button type="button" class="exercise-guide-row" data-guide-exercise="'+guideExercises.indexOf(ex)+'">'+preview+'<span>'+esc(ex.n)+'</span></button>';
 }).join("") || '<p class="mute">Упражнения не найдены.</p>';
}
function vExerciseDetail(ex){
 var id=exerciseThumbnails[ex.n], instruction=ex.instructions||exerciseInstructions[id];
 var photo=ex.thumbnail?'<div class="exercise-demo"><img src="assets/guide/exercises/'+ex.thumbnail+'.jpg" alt="Положение тела при выполнении: '+esc(ex.n)+'" width="480" height="480"></div>':'';
 var demo=ex.video?'<video muted playsinline loop preload="metadata" poster="assets/guide/exercises/'+id+'.jpg" src="'+esc(ex.video)+'" aria-label="'+esc(ex.n)+'"></video>':
  '<canvas width="360" height="280" role="img" aria-label="Схема движения: '+esc(ex.n)+'"></canvas>';
 return '<article class="exercise-guide exercise-detail"><div class="exercise-detail-tools">'+
  '<button type="button" class="exercise-guide-icon" id="exercise-guide-back" aria-label="К списку упражнений">'+svg("guideBack")+'</button>'+
  '<button type="button" class="exercise-guide-icon" id="exercise-detail-save" aria-label="В избранном" aria-pressed="'+savedExercises.has(ex.n)+'">'+svg("guideSave")+'</button></div>'+
  (id?'<div class="exercise-demo">'+demo+'<button type="button" class="chip" id="exercise-demo-toggle">Воспроизвести</button></div>':photo)+
  '<h1>'+esc(ex.n)+'</h1><p class="mute">'+esc(ex.m)+'</p>'+
  (instruction?'<p>'+esc(instruction[0])+'</p><h2>Как выполнять</h2><ol class="exercise-steps">'+instruction.slice(1).map(function(step){return '<li><span>'+esc(step)+'</span></li>'}).join("")+'</ol>':'')+'</article>';
}
function bindExerciseDetail(ex){
 $("#exercise-guide-back").onclick=function(){
  var index=guideExercises.indexOf(ex);
  exerciseGuide.exercise=null;render();
  var row=document.querySelector('[data-guide-exercise="'+index+'"]');
  if(row)row.focus({preventScroll:true});
  pageScroller().scrollTo(0,exerciseGuide.scroll);
 };
 $("#exercise-detail-save").onclick=function(){
  if(savedExercises.has(ex.n))savedExercises.delete(ex.n);
  else savedExercises.add(ex.n);
  save("guide-saved-exercises",Array.from(savedExercises));
  this.setAttribute("aria-pressed",savedExercises.has(ex.n));
 };
 var toggle=$("#exercise-demo-toggle"), video=$(".exercise-demo video");
 if(!toggle)return;
 if(video){
  video.muted=true;
  video.onplay=function(){toggle.textContent="Пауза"};
  video.onpause=function(){toggle.textContent="Воспроизвести"};
  toggle.onclick=function(){if(video.paused)video.play().catch(function(){});else video.pause()};
  if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches)video.play().catch(function(){});
 }else mountExerciseMotion($(".exercise-demo canvas"),toggle,exerciseThumbnails[ex.n]);
}
function vExerciseGuide(){
 if(exerciseGuide.exercise)return vExerciseDetail(exerciseGuide.exercise);
 return '<section class="exercise-guide"><header class="exercise-guide-header"><button type="button" class="exercise-guide-icon" id="exercise-guide-back" aria-label="Назад">'+svg("guideBack")+'</button><h1>'+
 (exerciseGuide.group?exerciseGuide.group[1]:"Упражнения")+'</h1><div class="exercise-guide-tools">'+
 '<button type="button" class="exercise-guide-icon" id="exercise-saved" aria-label="Только избранные упражнения" aria-pressed="'+exerciseGuide.savedOnly+'">'+svg("guideSave")+'</button>'+
 '<button type="button" class="exercise-guide-icon" id="exercise-video" aria-label="Только упражнения с видеозаписью" aria-pressed="'+exerciseGuide.videoOnly+'">'+svg("guideFilter")+'</button></div></header>'+
 '<label class="exercise-guide-search">'+svg("guideSearch")+'<input type="search" id="exercise-search" aria-label="Поиск упражнений" placeholder="Поиск" value="'+esc(exerciseGuide.query)+'"></label>'+
 '<div id="exercise-guide-results">'+exerciseGuideResults()+'</div></section>';
}
function bindExerciseGuide(){
 if(exerciseGuide.exercise){bindExerciseDetail(exerciseGuide.exercise);return}
 var results=$("#exercise-guide-results");
 function updateResults(){results.innerHTML=exerciseGuideResults()}
 function openPage(){render();pageScroller().scrollTo(0,0)}
 $("#exercise-guide-back").onclick=function(){
  if(exerciseGuide.group)exerciseGuide.group=null;
  else guidePage=null;
  openPage();
 };
 $("#exercise-search").oninput=function(){exerciseGuide.query=this.value;updateResults()};
 [["#exercise-saved","savedOnly"],["#exercise-video","videoOnly"]].forEach(function(item){
  $(item[0]).onclick=function(){
   exerciseGuide[item[1]]=!exerciseGuide[item[1]];
   this.setAttribute("aria-pressed",exerciseGuide[item[1]]);
   updateResults();
  };
 });
 results.onclick=function(event){
  var group=event.target.closest("[data-muscle]");
  if(group){exerciseGuide.group=muscleGroups.find(function(item){return item[0]===group.dataset.muscle});openPage();return}
  var button=event.target.closest("[data-guide-exercise]");
  if(!button)return;
  exerciseGuide.scroll=pageScroller().scrollTop;
  exerciseGuide.exercise=guideExercises[Number(button.dataset.guideExercise)];
  openPage();
 };
}
function vGuide(){
 if(guidePage===null)return '<h1 class="guide-title">Справочник</h1>'+guideTitles.map(function(title,i){return '<button class="guide-tile tile-'+i+'" data-guide="'+i+'"><span>'+title+'</span></button>'}).join("");
 if(guidePage===0)return vExerciseGuide();
 if(guidePage===1)return vNutritionGuide();
 if(guidePage===2)return vFoodGuide();
 var content='<h2>Повторение</h2><p>Одно полное выполнение движения.</p><h2>Подход</h2><p>Серия повторений одного упражнения.</p><h2>Интервал отдыха</h2><p>Пауза между подходами.</p>';
 return '<button id="guide-back" class="chip">‹ Справочник</button><h1>'+guideTitles[guidePage]+'</h1><div class="card">'+content+'</div>';
}
function bindGuide(){
 if(guidePage===0){bindExerciseGuide();return}
 if(guidePage===1){bindNutritionGuide();return}
 if(guidePage===2){bindFoodGuide();return}
 document.querySelectorAll("[data-guide]").forEach(function(b){b.onclick=function(){
  guidePage=Number(b.dataset.guide);
  exerciseGuide={group:null,query:"",savedOnly:false,videoOnly:false,exercise:null,scroll:0};
  Object.assign(nutritionGuide,{item:null,query:"",scroll:0,protein:null,proteinQuery:"",proteinScroll:0});
  foodCategory=null;foodGuideScroll=0;foodProduct=null;foodProductScroll=0;
  render();pageScroller().scrollTo(0,0);
 }});
 if($("#guide-back"))$("#guide-back").onclick=function(){guidePage=null;render();pageScroller().scrollTo(0,0)};
}
