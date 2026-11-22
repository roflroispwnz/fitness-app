const nutritionItems = [
 ["protein", "Протеин", "Белковые смеси выпускают в виде порошков и готовых напитков. На этикетке указывают источник белка и его количество в порции."],
 ["gainer", "Гейнер", "Порошковая смесь белков и углеводов. На упаковке указывают состав и энергетическую ценность порции."],
 ["creatine", "Креатин", "Спортивная добавка в порошке или капсулах. На упаковке указывают форму креатина, например моногидрат."],
 ["amino", "Аминокислоты", "Выпускаются по отдельности и в смесях. BCAA — это лейцин, изолейцин и валин. EAA — незаменимые аминокислоты."],
 ["weight", "Препараты, снижающие вес", "В эту категорию входят средства для контроля веса. Лекарственные препараты и пищевые добавки относятся к разным категориям продуктов."],
 ["carnitine", "L-карнитин", "Встречается в капсулах, порошках и жидких продуктах. На упаковке указывают количество L-карнитина в порции."],
 ["vitamins", "Витамины и минералы", "Выпускаются по отдельности и в составе комплексов. Количество каждого компонента на порцию указано на упаковке."],
 ["special", "Специальные препараты", "К спортивным продуктам специального назначения относятся, например, предтренировочные смеси и напитки с электролитами."],
 ["joints", "Средства для суставов и связок", "В этой категории встречаются продукты с коллагеном, глюкозамином или хондроитином. Состав зависит от конкретного продукта."]
];
const proteinItems = [
 ["beef", "Говяжий протеин",
  "Говяжий протеин — порошковая добавка на основе белков из говяжьего сырья. В спортивных смесях встречаются изолят и гидролизат. При гидролизе длинные белковые цепочки расщепляются на более короткие фрагменты.",
  "Аминокислотный состав зависит от сырья. Если в составе указан гидролизованный коллаген, обратите внимание на профиль незаменимых аминокислот: у коллагена он отличается от профиля мышечного белка. Количество белка, наличие креатина и других добавок проверяйте по этикетке конкретного продукта."
 ],
 ["isolate", "Изолят сывороточного протеина",
  "Сывороточный изолят получают из молочной сыворотки, удаляя часть лактозы, жира и других компонентов. В отраслевых спецификациях доля белка в сухом сырье обычно составляет около 90%. В готовом ароматизированном порошке она может быть ниже.",
  "В изоляте обычно меньше лактозы и жира, чем в концентрате. Сравнивайте фактическое количество белка и лактозы на порцию. Изолят остаётся молочным белком и содержит молочный аллерген."
 ],
 ["casein", "Казеиновый протеин",
  "Казеин — один из основных белков молока. В добавках встречаются мицеллярный казеин и казеинаты, например казеинат кальция. Мицеллярный казеин часто даёт более густую консистенцию коктейля.",
  "Казеин переваривается медленнее сывороточного белка, поэтому аминокислоты поступают в кровь более постепенно. Его используют как дополнительный источник белка, в том числе в составе смешанных порошков. Количество белка, остаточной лактозы и вкусовых добавок зависит от продукта. Казеин содержит молочный аллерген."
 ],
 ["blend", "Комплексный протеин",
  "Комплексный протеин объединяет несколько источников белка. В одной смеси могут сочетаться сывороточный белок и казеин, иногда с яичным или соевым белком. Растительные смеси тоже бывают комплексными, например с белками гороха и риса.",
  "У компонентов могут различаться аминокислотный состав и скорость переваривания. Конкретный профиль зависит от пропорций смеси. При сравнении упаковок полезно смотреть на источники белка, его количество в порции и аллергены. Если производитель не раскрывает пропорции, по списку ингредиентов нельзя определить точное количество каждого белка."
 ],
 ["matrix", "Матричный протеин",
  "«Протеиновая матрица» — обозначение смеси, которое производитель может использовать на упаковке. Например, в неё могут входить концентрат и изолят сывороточного белка или белки из разных источников: сыворотки, казеина и яйца.",
  "Состав такой смеси удобно читать по отдельным компонентам. Название «матрица» само по себе не указывает, сколько каждого белка приходится на порцию. Если на упаковке заявлено постепенное высвобождение аминокислот, оценивать это утверждение стоит по конкретному составу и данным о продукте."
 ],
 ["soy", "Соевый протеин",
  "Соевый протеин получают из соевых бобов. В спортивных порошках встречается соевый изолят, в котором после обработки повышается доля белка. Соя содержит незаменимые аминокислоты и используется как самостоятельный источник белка и как компонент растительных смесей.",
  "Чистый соевый изолят имеет растительное происхождение. В готовом порошке могут быть дополнительные источники белка, ароматизаторы и подсластители. Чтобы понять состав порции, смотрите список ингредиентов, количество белка и отметку о сое как аллергене."
 ],
 ["whey", "Сывороточный протеин",
  "Сывороточный протеин получают из жидкой части молока, которая отделяется при свёртывании. Он содержит незаменимые аминокислоты, в том числе лейцин, и переваривается быстрее казеина.",
  "Основные формы — концентрат, изолят и гидролизат. В концентрате может оставаться больше лактозы и жира, изолят содержит большую долю белка, а в гидролизате часть белковых цепочек уже расщеплена. Сравнивайте граммы белка в порции готового порошка: вес мерной ложки включает и другие ингредиенты. Все три формы содержат молочный белок."
 ],
 ["egg", "Яичный протеин",
  "Яичный протеин обычно делают из высушенного яичного белка. В составе его также могут обозначать как яичный альбумин. Он содержит все незаменимые аминокислоты и используется как отдельно, так и в смесях с другими белками.",
  "Порошок из яичного белка и порошок из цельного яйца отличаются по содержанию жира. В спортивной смеси могут присутствовать молочные компоненты и вкусовые добавки, поэтому состав готового продукта стоит смотреть на упаковке. Яйцо относится к пищевым аллергенам."
 ]
];
const nutritionGuide = { item: null, query: "", scroll: 0, protein: null, proteinQuery: "", proteinScroll: 0 };

function isProteinList() {
 return nutritionGuide.item?.[0] === "protein";
}

function nutritionImage(id, proteinList) {
 if (id === "whey") return "assets/guide/nutrition/protein.jpg";
 return "assets/guide/nutrition/"+(proteinList ? "protein/" : "")+id+".jpg";
}

function nutritionGuideResults() {
 const proteinList = isProteinList();
 const query = (proteinList ? nutritionGuide.proteinQuery : nutritionGuide.query).trim().toLowerCase().replace(/^л[- ]?карнитин/, "l-карнитин");
 const items = proteinList ? proteinItems : nutritionItems;
 return items.filter(([, name]) => name.toLowerCase().includes(query)).map(([id, name]) =>
  '<button type="button" class="exercise-guide-row" data-nutrition="'+id+'">'+
  '<img class="exercise-guide-thumb" src="'+nutritionImage(id, proteinList)+'" alt="" width="64" height="64" loading="lazy"><span>'+esc(name)+'</span></button>'
 ).join("") || '<p class="mute">Ничего не найдено.</p>';
}

function vNutritionGuide() {
 const back = '<button type="button" class="exercise-guide-icon" id="nutrition-guide-back" aria-label="Назад">'+svg("guideBack")+'</button>';
 const proteinList = isProteinList();
 const detail = proteinList ? nutritionGuide.protein : nutritionGuide.item;
 if (detail) {
  const [id, name, ...paragraphs] = detail;
  return '<article class="nutrition-guide-detail">'+back+'<img class="nutrition-guide-feature" src="'+nutritionImage(id, proteinList)+'" alt="" width="240" height="240">'+
   '<h1>'+esc(name)+'</h1>'+paragraphs.map(paragraph => '<p>'+esc(paragraph)+'</p>').join("")+'</article>';
 }
 const title = proteinList ? "Протеин" : "Спортивное питание";
 const query = proteinList ? nutritionGuide.proteinQuery : nutritionGuide.query;
 return '<section class="nutrition-guide"><header class="exercise-guide-header">'+back+'<h1>'+title+'</h1></header>'+
  '<label class="exercise-guide-search">'+svg("guideSearch")+'<input id="nutrition-guide-search" type="search" aria-label="'+(proteinList ? "Поиск по видам протеина" : "Поиск по спортивному питанию")+'" placeholder="Поиск" value="'+esc(query)+'"></label>'+
  '<div id="nutrition-guide-results">'+nutritionGuideResults()+'</div></section>';
}

function bindNutritionGuide() {
 $("#nutrition-guide-back").onclick = () => {
  const item = nutritionGuide.protein || nutritionGuide.item;
  const scroll = nutritionGuide.protein ? nutritionGuide.proteinScroll : nutritionGuide.scroll;
  if (nutritionGuide.protein) nutritionGuide.protein = null;
  else if (nutritionGuide.item) {
   nutritionGuide.item = null;
   nutritionGuide.proteinQuery = "";
  } else guidePage = null;
  render();
  if (item) {
   const row = document.querySelector('[data-nutrition="'+item[0]+'"]');
   if (row) row.focus({preventScroll: true});
  }
  window.scrollTo(0, item ? scroll : 0);
 };
 const proteinList = isProteinList();
 if (proteinList ? nutritionGuide.protein : nutritionGuide.item) return;
 const results = $("#nutrition-guide-results");
 $("#nutrition-guide-search").oninput = event => {
  nutritionGuide[proteinList ? "proteinQuery" : "query"] = event.target.value;
  results.innerHTML = nutritionGuideResults();
 };
 results.onclick = event => {
  const row = event.target.closest("[data-nutrition]");
  if (!row) return;
  const items = proteinList ? proteinItems : nutritionItems;
  nutritionGuide[proteinList ? "proteinScroll" : "scroll"] = window.scrollY;
  nutritionGuide[proteinList ? "protein" : "item"] = items.find(([id]) => id === row.dataset.nutrition);
  render();
  window.scrollTo(0, 0);
 };
}
