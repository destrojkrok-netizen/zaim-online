const $ = s => document.querySelector(s);
const fmt = n => n.toLocaleString("ru-RU");
const plural = (n,a,b,c)=>{n=Math.abs(n)%100;const n1=n%10;if(n>10&&n<20)return c;if(n1>1&&n1<5)return b;if(n1==1)return a;return c};
let list = [...OFFERS];

const CITIES = ["Архангельск","Астрахань","Барнаул","Белгород","Брянск","Владивосток","Владимир","Волгоград","Вологда","Воронеж","Екатеринбург","Иваново","Ижевск","Иркутск","Казань","Калининград","Калуга","Кемерово","Киров","Кострома","Краснодар","Красноярск","Курган","Курск","Липецк","Магнитогорск","Махачкала","Москва","Мурманск","Набережные Челны","Нижний Новгород","Нижний Тагил","Новокузнецк","Новосибирск","Омск","Оренбург","Орёл","Пенза","Пермь","Петрозаводск","Псков","Ростов-на-Дону","Рязань","Самара","Санкт-Петербург","Саранск","Саратов","Севастополь","Смоленск","Сочи","Ставрополь","Сургут","Тамбов","Тверь","Тольятти","Томск","Тула","Тюмень","Улан-Удэ","Ульяновск","Уфа","Хабаровск","Чебоксары","Челябинск","Череповец","Чита","Якутск","Ярославль"].sort((a,b)=>a.localeCompare(b,"ru"));
let city = SITE.city; try { city = localStorage.getItem("city") || city; } catch(e){}
$("#city").textContent = city;
const cityDrop=$("#cityDrop"), menuDrop=$("#menuDrop");
function renderCities(q=""){
  const qq=q.trim().toLowerCase();
  $("#cityList").innerHTML = CITIES.filter(c=>c.toLowerCase().includes(qq)).map(c=>`<li class="${c===city?"sel":""}">${c}</li>`).join("") || `<li style="color:var(--muted);cursor:default">Не найдено</li>`;
}
$("#cityBtn").onclick = e=>{ e.stopPropagation(); menuDrop.hidden=true; cityDrop.hidden=!cityDrop.hidden; if(!cityDrop.hidden){ $("#cityQ").value=""; renderCities(); $("#cityQ").focus(); } };
$("#cityQ").oninput = e=>renderCities(e.target.value);
$("#cityList").onclick = e=>{ const li=e.target.closest("li"); if(!li||!CITIES.includes(li.textContent)) return; city=li.textContent; $("#city").textContent=city; try{localStorage.setItem("city",city)}catch(e){} cityDrop.hidden=true; };
$("#menuBtn").onclick = e=>{ e.stopPropagation(); cityDrop.hidden=true; menuDrop.hidden=!menuDrop.hidden; };
document.addEventListener("click", e=>{ if(!e.target.closest(".dropdown")){ cityDrop.hidden=true; menuDrop.hidden=true; } });
document.addEventListener("keydown", e=>{ if(e.key==="Escape"){ cityDrop.hidden=true; menuDrop.hidden=true; } });
$("#searchBtn").onclick = ()=>{ const f=$(".filter"); f.open=true; f.scrollIntoView({behavior:"smooth"}); };
$("#pageTitle").textContent = SITE.title;
$("#year").textContent = new Date().getFullYear();
$("#ctaBtn").href = SITE.promoUrl;
const mn = OFFERS.length ? Math.min(...OFFERS.map(o=>o.minSum)) : 0, mx = OFFERS.length ? Math.max(...OFFERS.map(o=>o.maxSum)) : 0;
const free = OFFERS.filter(o=>o.freeDays).length;
$("#metaText").textContent = !OFFERS.length ? "предложения скоро появятся" : `${OFFERS.length} ${plural(OFFERS.length,"предложение","предложения","предложений")} МФО, суммы от ${fmt(mn)} до ${fmt(mx)} ₽, ${free} ${plural(free,"предложение","предложения","предложений")} с первым займом под 0%.`;
const d = new Date(); d.setDate(d.getDate()+30);
$("#untilDate").textContent = d.toLocaleDateString("ru-RU",{day:"numeric",month:"long"});
$("#updated").textContent = new Date().toLocaleDateString("ru-RU") + " " + new Date().toLocaleTimeString("ru-RU",{hour:"2-digit",minute:"2-digit"});

const term = o => o.maxDays >= 90 && o.minDays >= 30 ? `${Math.round(o.minDays/30)}–${Math.round(o.maxDays/30)} мес.` : `${o.minDays}–${o.maxDays} дн.`;

function card(o,i){
  const logo = o.logo ? `<img src="${o.logo}" alt="${o.name}">` : `<span>${o.name}</span>`;
  const badge = o.freeDays ? `<span class="card__badge">0% ${o.freeDays} дн.</span>` : (o.badge?`<span class="card__badge">${o.badge}</span>`:"");
  return `<article class="card">
    <div class="card__logo">${logo}</div>${badge}
    <div class="card__name">${o.name}</div>
    <div class="card__params">
      <div><small>Сумма до</small><b class="g">${fmt(o.maxSum)} ₽</b></div>
      <div><small>Срок</small><b>${term(o)}</b></div>
      <div><small>Ставка</small><b>${o.rate||"—"}</b></div>
      <div><small>ПСК</small><b>${o.psk||"—"}</b></div>
    </div>
    <div class="card__foot"><button class="card__info" data-i="${i}" title="Подробнее">i</button><a class="btn btn--primary" href="${o.url}" target="_blank" rel="nofollow noopener">Получить</a></div>
  </article>`;
}
function render(){
  $("#grid").innerHTML = list.length ? list.map(o=>card(o, OFFERS.indexOf(o))).join("") : `<div class="panel empty">Пока нет подходящих предложений. Загляните позже или оставьте заявку ниже.</div>`;
  $("#count").textContent = list.length;
}
$("#grid").onclick = e=>{
  const b = e.target.closest(".card__info"); if(!b) return;
  const o = OFFERS[b.dataset.i];
  $("#modalBody").innerHTML = `<h3>${o.name}</h3><p style="color:var(--muted);margin:0">${o.product||""}</p>
    <dl><dt>Сумма</dt><dd>${fmt(o.minSum)} – ${fmt(o.maxSum)} ₽</dd><dt>Срок</dt><dd>${term(o)}</dd><dt>Ставка</dt><dd>${o.rate||"—"}</dd><dt>ПСК</dt><dd>${o.psk||"—"}</dd><dt>Без %</dt><dd>${o.freeDays?o.freeDays+" дн.":"нет"}</dd></dl>
    <p>${o.desc||""}</p><a class="btn btn--primary btn--wide" href="${o.url}" target="_blank" rel="nofollow noopener">Получить</a>`;
  $("#modal").hidden = false;
};
$("#modalClose").onclick = ()=> $("#modal").hidden = true;
$("#modal").onclick = e=>{ if(e.target.id==="modal") $("#modal").hidden = true; };

$("#sort").onchange = e=>{
  const k = e.target.value; list = [...list];
  if (k==="maxSum") list.sort((a,b)=>b.maxSum-a.maxSum);
  else if (k==="rate") list.sort((a,b)=>parseFloat((a.rate||"9").replace(/[^\d,.]/g,"").replace(",","."))-parseFloat((b.rate||"9").replace(/[^\d,.]/g,"").replace(",",".")));
  else list = OFFERS.filter(o=>list.includes(o));
  render();
};
const sum=$("#sum"), days=$("#days");
const upd=()=>{ $("#sumVal").textContent=fmt(+sum.value); $("#daysVal").textContent=days.value; };
sum.oninput = days.oninput = upd; upd();
$("#apply").onclick = ()=>{ const s=+sum.value,dd=+days.value; list=OFFERS.filter(o=>o.minSum<=s&&o.maxSum>=s&&o.minDays<=dd&&o.maxDays>=dd); render(); };
$("#reset").onclick = ()=>{ sum.value=10000; days.value=14; upd(); list=[...OFFERS]; render(); };
$("#chips").onclick = e=>{
  const a=e.target.closest("a"); if(!a) return; e.preventDefault();
  const on=a.classList.toggle("active"); [...a.parentNode.children].forEach(x=>x!==a&&x.classList.remove("active"));
  const f=a.dataset.f;
  list = !on ? [...OFFERS] : OFFERS.filter(o => f==="free" ? o.freeDays : f==="payday" ? o.maxDays<=31 : f==="new" ? !o.rating : true);
  render();
};

$("#topSection").hidden = $("#whoSection").hidden = !OFFERS.length;
$("#topBody").innerHTML = [...OFFERS].map((o,i)=>`<tr><td>${i+1}</td><td>${o.name}</td><td>${o.psk||"—"}</td><td>${o.rate||"—"}</td><td>от ${o.minDays} до ${o.maxDays} дней</td><td>от ${fmt(o.minSum)} до ${fmt(o.maxSum)} ₽</td></tr>`).join("");
$("#whoList").innerHTML = OFFERS.filter(o=>o.desc).map(o=>`<li><b>${o.name}</b> — ${o.desc}</li>`).join("");
render();
