const russianFoodTable = ["Химический состав российских пищевых продуктов", "https://bmc-med.ru/assets/documenty/khimicheskiy_sostav_rossiyskikh_pischevykh_produktov.pdf"];
const detailedRussianFoodTable = ["И. М. Скурихин, В. А. Тутельян · справочник", "https://dispace.edu.nstu.ru/didesk/file/get/404518"];
const usdaDairyTable = ["USDA · справочник пищевой ценности", "https://www.ars.usda.gov/ARSUserFiles/80400525/Data/SR/SR28/reports/sr28fg01.pdf"];
function dairyMinerals(sodium, potassium, calcium, phosphorus) {
 return [["Натрий, мг",sodium],["Калий, мг",potassium],["Кальций, мг",calcium],["Фосфор, мг",phosphorus]];
}
const dairyProducts = [
 {name:"Ацидофилин, 1,0% жирности", photo:"acidophilus-1", kcal:40, per100g:true, macros:[3,1,4], nutrients:[
  ["Насыщенные жиры",0.7], ["Бета-каротин",0], ["Витамин A",0], ["Витамин C",0.8],
  ["Рибофлавин",0.16], ["Железо",0.1], ["Калий",145], ["Кальций",120], ["Магний",15],
  ["Натрий",0.053], ["Фосфор",98], ["Клетчатка",0], ["Холестерин",0]
 ], inflammatoryFactor:{label:"0 · средний", marker:50}},
 {name:"Ацидофилин, 3,2% жирности", photo:"acidophilus-32", kcal:59, per100g:true, macros:[2.9,3.2,3.8], nutrients:dairyMinerals(53,145,120,98), source:russianFoodTable},
 {name:"Ацидофилин, нежирный", photo:"acidophilus-low-fat", kcal:31, per100g:true, macros:[3,0.05,3.9], nutrients:dairyMinerals(53,145,120,98), source:russianFoodTable},
 {name:"Ацидофилин, сладкий, 3,2% жирности", photo:"acidophilus-sweet-32", kcal:77, per100g:true, macros:[2.8,3.2,8.6], nutrients:[["Насыщенные жиры, г",2],["Холестерин, мг",9],["Клетчатка, г",0]], source:detailedRussianFoodTable},
 {name:"Банановое молоко, Binggrae", kcal:80, basis:"100 мл", macros:[2.5,3,11], nutrients:[["Насыщенные жиры, г",1.75],["Сахара, г",10.5],["Натрий, мг",42.5],["Холестерин, мг",10]], source:["FairPrice · Binggrae UHT, упаковка 200 мл","https://www.fairprice.com.sg/product/binggrae-uht-milk-packet-banana-6s-x-200ml-13040624"]},
 {name:"Варенец, 2,5% жирности", kcal:53, per100g:true, macros:[2.9,2.5,4.1], nutrients:dairyMinerals(51,144,118,96), source:russianFoodTable},
 {name:"Вареники ленивые, отварные", kcal:173, per100g:true, macros:[13.2,7,13.8], nutrients:dairyMinerals(267,81,74,143), source:russianFoodTable},
 {name:"Варшавский сырник", kcal:157},
 {name:"Варёный творог с прованскими травами", kcal:158},
 {name:"Греческий йогурт", kcal:76},
 {name:"Греческий йогурт 0%, Arla", kcal:59, per100g:true, macros:[9.5,0.2,4], nutrients:[["Насыщенные жиры, г",0.1],["Сахара, г",4],["Соль, г",0.14]], source:["Arla · натуральный греческий йогурт 0%","https://www.arla.se/produkter/arla-brand/grekisk-yoghurt-naturell-0-02pct-1000g-589294/"]},
 {name:"Десерт Doce de Leite", kcal:412},
 {name:"Десерт Dulce de leche", kcal:412},
 {name:"Десерт из йогурта и папайи (Shrikand)", kcal:68},
 {name:"Заменитель сливок в порошке", kcal:545, per100g:true, macros:[4.8,35.5,54.9], nutrients:[...dairyMinerals(123,812,22,422),["Сахара, г",54.9],["Насыщенные жиры, г",32.53]], source:["Минздрав Израиля · национальная база пищевой ценности","https://data.gov.il/he/datasets/ministry-health/nutrition-database/c3cb0630-0650-46c1-a068-82d575c094b2?page=10"]},
 {name:"Запеканка из нежирного творога", kcal:168, per100g:true, macros:[17.6,4.2,14.2], nutrients:dairyMinerals(415,127,113,183), source:russianFoodTable},
 {name:"Йогурт с гуанабаной, Alpina", kcal:81},
 {name:"Йогурт 3,2% жирности", kcal:68, per100g:true, macros:[5,3.2,3.5], nutrients:dairyMinerals(52,147,122,96), source:russianFoodTable},
 {name:"Йогурт АШАН, 0% жирности, сладкий, с ванилью", kcal:69},
 {name:"Йогурт ванильный, низкокалорийный, несладкий", kcal:43},
 {name:"Йогурт ванильный, обезжиренный, высокобелковый", kcal:85},
 {name:"Йогурт ванильный или лимонный, обезжиренный, с подсластителем", kcal:43, per100g:true, macros:[3.86,0.18,7.5], nutrients:[...dairyMinerals(59,177,143,109),["Витамин C, мг",1.1],["Магний, мг",13]], source:usdaDairyTable},
 {name:"Йогурт греческий обезжиренный натуральный", kcal:59, per100g:true, macros:[10.19,0.39,3.6], nutrients:[...dairyMinerals(36,141,110,135),["Магний, мг",11],["Железо, мг",0.07],["Сахара, г",3.24]], source:usdaDairyTable},
 {name:"Йогурт из овечьего молока", kcal:94},
 {name:"Йогурт из тофу", kcal:94, per100g:true, macros:[3.5,1.8,15.96], source:["USDA · Tofu yogurt, NDB 43476","https://www.ars.usda.gov/ARSUserFiles/80400525/Data/SR/SR28/reports/sr28fg16.pdf#page=808"]},
 {name:"Йогурт из обезжиренного молока, 13 г белка на порцию 227 г", kcal:56, per100g:true, macros:[5.73,0.18,7.68], source:usdaDairyTable},
 {name:"Йогурт из цельного молока, 8 г белка на порцию 227 г", kcal:61, per100g:true, macros:[3.47,3.25,4.66], nutrients:[...dairyMinerals(46,155,121,95),["Магний, мг",12],["Витамин C, мг",0.5]], source:usdaDairyTable},
 {name:"Йогурт плодово-ягодный, 1,5% жирности", kcal:90, per100g:true, macros:[4,1.5,14.3], source:["Технология цельномолочных продуктов · табл. 2.1","https://tm.ontu.edu.ua/wp-content/uploads/2014/03/2003-%D0%A2%D0%B5%D1%85%D0%BD%D0%BE%D0%BB%D0%BE%D0%B3%D0%B8%D1%8F-%D1%86%D0%B5%D0%BB%D1%8C%D0%BD%D0%BE%D0%BC%D0%BE%D0%BB%D0%BE%D1%87%D0%BD%D1%8B%D1%85-%D0%BF%D1%80%D0%BE%D0%B4%D1%83%D0%BA%D1%82%D0%BE%D0%B2-%D0%B8-%D0%BC%D0%BE%D0%BB%D0%BE%D1%87%D0%BD%D0%BE%D0%B3%D0%BE-%D0%91%D1%83%D1%8F%D0%BD%D0%BE%D0%B2%D0%B0.pdf"]},
 {name:"Йогурт с семенами чиа, арахисом и специями", kcal:593},
 {name:"Йогурт сладкий, 3,2% жирности", kcal:87, per100g:true, macros:[5,3.2,8.5], nutrients:dairyMinerals(50,140,119,91), source:russianFoodTable},
 {name:"Йогурт сладкий, 6,0% жирности", kcal:112, per100g:true, macros:[5,6,8.5], nutrients:dairyMinerals(50,137,122,92), source:russianFoodTable}
];
