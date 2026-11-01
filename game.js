const $=id=>document.getElementById(id);
const girls=[
{name:"Алиса",tag:"Спортсменка",desc:"Играет в волейбол, говорит прямо и не любит, когда вокруг ходят кругами.",likes:"Активность, честность, соревнования",x:12,y:17,emoji:"🏐"},
{name:"Лера",tag:"Творческая натура",desc:"Рисует в скетчбуке, часто замечает детали, которые другие пропускают.",likes:"Искусство, спокойные разговоры",x:36,y:13,emoji:"🎨"},
{name:"Маша",tag:"Душа компании",desc:"Легко знакомится с людьми и умеет превратить неловкую паузу в шутку.",likes:"Юмор, компании, истории",x:63,y:17,emoji:"☀️"},
{name:"Соня",tag:"Любительница книг",desc:"Предпочитает библиотеку шумным играм, но с интересным собеседником разговорится.",likes:"Книги, загадки, внимательность",x:86,y:22,emoji:"📚"},
{name:"Вика",tag:"Музыкант",desc:"Почти всегда напевает мелодии. Учится играть на гитаре и мечтает о сцене.",likes:"Музыка, поддержка, творчество",x:18,y:49,emoji:"🎸"},
{name:"Даша",tag:"Исследовательница",desc:"Любит прогулки и знает несколько тропинок вокруг лагеря.",likes:"Природа, приключения, наблюдения",x:46,y:43,emoji:"🌿"},
{name:"Полина",tag:"Организатор",desc:"Помогает вожатым, составляет планы и старается, чтобы никто не скучал.",likes:"Ответственность, помощь",x:76,y:48,emoji:"📋"},
{name:"Катя",tag:"Тихая оптимистка",desc:"Немногословна в большой компании, зато умеет слушать и поддерживать.",likes:"Забота, уют, искренность",x:10,y:80,emoji:"🌼"},
{name:"Ника",tag:"Шутница",desc:"Обожает настольные игры, розыгрыши без злобы и неожиданные идеи.",likes:"Игры, лёгкость, смелость",x:49,y:79,emoji:"🎲"},
{name:"Мила",tag:"Любит животных",desc:"Помогает ухаживать за лагерным псом и знает почти всех местных птиц.",likes:"Животные, доброта, природа",x:85,y:82,emoji:"🐾"}
];
const places=[
["Главный корпус","🏡",50,52,"Здесь проходят собрания, завтраки и вечерние объявления."],
["Столовая","🍲",50,27,"Пахнет кашей, свежим хлебом и чем-то сладким."],
["Пляж","🏖️",87,43,"Песок, озеро и деревянный пирс."],
["Спортивная площадка","⚽",26,31,"Мячи, сетка для волейбола и шумные команды."],
["Библиотека","📚",72,27,"Небольшая прохладная комната с книгами и настольными играми."],
["Костровая","🔥",32,68,"Вечером здесь собираются почти все."],
["Лесная тропа","🌲",70,73,"Тихая дорожка у края лагеря."],
["Музыкальный клуб","🎸",12,62,"Гитара, старое пианино и репетиции."],
["Медпункт","✚",91,17,"Медсестра, аптечки и запах антисептика."],
["Пирс","🛶",50,91,"Можно смотреть на воду и думать о своём."]
];
let state={day:1,minutes:480,scene:"intro",step:0,cabin:"Домик №3",roommate:"Илья",relations:{},visited:[],talked:{},mood:"Хорошее",music:true,volume:35};
girls.forEach(g=>state.relations[g.name]=0);
const intro=[
["Главный герой","Автобус мерно покачивался на загородной дороге. За окном мелькали сосны, поля и редкие остановки. Впереди — две недели в лагере «Сосновый берег». И, кажется, у меня есть план."],
["Главный герой","Мне восемнадцать, и у меня никогда не было отношений. Не то чтобы это было трагедией, но в последнее время я всё чаще думал: а вдруг пора что-то изменить?"],
["Главный герой","Моя цель на эти две недели — познакомиться с кем-нибудь поближе. Не обязательно сразу искать любовь всей жизни. Для начала хватит настоящего разговора."],
["Главный герой","Организаторы забрали у нас телефоны и прочие гаджеты. Сначала все возмущались, а теперь автобус постепенно затих. Придётся общаться по-настоящему."],
["Главный герой","Я успел заметить нескольких девушек. Алиса — спортивная и уверенная. Лера постоянно что-то рисует. Маша уже перезнакомилась с половиной автобуса. Соня читает книгу, не обращая внимания на шум."],
["Главный герой","Вика тихо напевает себе под нос. Даша смотрит в окно на лес. Полина помогает вожатой с рассадкой. Катя сидит одна у окна, Ника шутит с соседями, а Мила показывает кому-то фотографии животных."],
["Главный герой","Ладно. Две недели — не так уж мало. Главное — не пытаться понравиться всем сразу."]
];
let cabinChoices=["Домик №1","Домик №2","Домик №3","Домик №4"];
let roommateByCabin={"Домик №1":"Максим","Домик №2":"Илья","Домик №3":"Артём","Домик №4":"Денис"};
let currentGirl=null;
function clock(){let h=Math.floor(state.minutes/60)%24,m=state.minutes%60;return String(h).padStart(2,"0")+":"+String(m).padStart(2,"0")}
function advance(n){state.minutes+=n;while(state.minutes>=1440){state.minutes-=1440;state.day=Math.min(14,state.day+1)}updateHud()}
function updateHud(){$("clock").textContent=clock();$("dayLabel").textContent="День "+state.day;$("sideDay").textContent=state.day+" / 14";$("sideTime").textContent=clock();$("mood").textContent=state.mood}
function showScene(title,speaker,dialogue,choices=[],next=null,tag="ЛАГЕРЬ"){ $("scene").classList.remove("hidden");$("campView").classList.add("hidden");$("sceneTitle").textContent=title;$("locationTag").textContent=tag;$("speaker").textContent=speaker;$("dialogue").textContent=dialogue;$("choices").innerHTML="";choices.forEach(c=>{let b=document.createElement("button");b.className="choice";b.textContent=c.label;b.onclick=c.action;$("choices").appendChild(b)});$("nextBtn").style.display=next?"inline-block":"none";$("nextBtn").onclick=next||null; }
function introStep(){let s=intro[state.step];showScene("Дорога к лету",s[0],s[1],[],()=>{state.step++;if(state.step<intro.length)introStep();else arrival()}, "АВТОБУС");}
function arrival(){showScene("Добро пожаловать!", "Вожатая Марина","Автобус остановился у деревянной арки. За ней виднелись сосны, корпуса и широкая дорожка к озеру.\n\n— Ребята, вещи забираем и собираемся у флага! Сначала распределим домики, потом будет свободное время.",[],()=>chooseCabin(),"ПРИБЫТИЕ")}
function chooseCabin(){showScene("Выберите домик","Вожатая Марина","В каждом домике по несколько комнат. Выбирай, где поселиться. От этого зависит, с кем ты проведёшь первые вечера.",cabinChoices.map(c=>({label:c,action:()=>{state.cabin=c;state.roommate=roommateByCabin[c];roommateScene()}})),"", "РАССЕЛЕНИЕ")}
function roommateScene(){showScene(state.cabin,""+state.roommate,"— О, привет! Похоже, мы соседи. Я "+state.roommate+".\n\nОн закидывает рюкзак на свободную кровать и оглядывает комнату.\n\n— Ну что, как думаешь, здесь будет весело? Я пока никого толком не знаю.",[{label:"«Думаю, две недели пролетят быстро»",action:()=>{state.mood="Воодушевлённое";advance(10);campStart()}},{label:"«Главное, чтобы было чем заняться»",action:()=>{state.mood="Спокойное";advance(10);campStart()}},{label:"«Я вообще-то приехал знакомиться»",action:()=>{state.mood="Решительное";advance(10);campStart()}}],null,"ВАШ ДОМИК")}
function campStart(){ $("scene").classList.add("hidden");$("campView").classList.remove("hidden");renderMap();updateHud(); }
function renderMap(){$("map").innerHTML="";places.forEach((p,i)=>{let b=document.createElement("button");b.className="map-place"+(state.visited.includes(i)?" visited":"");b.style.left=p[2]+"%";b.style.top=p[3]+"%";b.innerHTML="<span>"+p[1]+"</span>"+p[0];b.onclick=()=>visitPlace(i);$("map").appendChild(b)})}
function visitPlace(i){let p=places[i];state.visited.push(i);advance(25);let nearby=girls.filter(g=>Math.abs(g.x-p[2])+Math.abs(g.y-p[3])<60);let pick=nearby.length?nearby[(state.day+i+state.visited.length)%nearby.length]:girls[(i+state.day)%girls.length];showScene(p[0], "Главный герой",p[4]+"\n\n"+(state.talked[pick.name]?"Кажется, неподалёку снова "+pick.name+". Вы уже немного знакомы.":"Ты замечаешь "+pick.name+". Пожалуй, можно подойти и поздороваться."),[{label:"Осмотреться и провести время",action:()=>{advance(20);campStart()}},{label:"Поговорить с "+pick.name,action:()=>talkGirl(pick)}],()=>campStart(),"ЛАГЕРЬ");$("sceneArt").style.background= i===2||i===9?"linear-gradient(180deg,#a8d0d2,#e5d8b6 65%,#7faeaa)":i===6?"linear-gradient(180deg,#a8c4aa,#597b59)": "linear-gradient(180deg,#b6c9b8,#e5d9b7 65%,#8ba27e)";}
function talkGirl(g){currentGirl=g;let n=state.talked[g.name]||0;let openers=[
"— Привет! Ты тоже решила немного отдохнуть от общей суеты? — спрашивает "+g.name+".",
"— О, снова ты! — "+g.name+" улыбается. — Кажется, лагерь не такой уж большой.",
"— Хорошо, что встретились. Я как раз собиралась передохнуть."
];showScene(g.name+" · "+g.tag,g.name,openers[Math.min(n,2)]+"\n\n"+g.desc,[{label:"Спросить, чем она увлекается",action:()=>girlChoice(g,"Расскажи, чем ты обычно занимаешься?","Она рассказывает о своих интересах. Ты стараешься слушать внимательно.",2)},{label:"Рассказать что-нибудь о себе",action:()=>girlChoice(g,"А я приехал сюда за новыми впечатлениями.","Разговор постепенно становится менее формальным.",1)},{label:"Предложить вместе прогуляться",action:()=>girlChoice(g,"Не хочешь как-нибудь прогуляться вместе?","— Почему бы и нет, — отвечает она. — Только давай чуть позже, когда будет свободнее.",3)},{label:"Попрощаться",action:()=>{advance(5);campStart()}}],null,"ЗНАКОМСТВО")}
function girlChoice(g,q,a,points){state.relations[g.name]=Math.min(100,state.relations[g.name]+points);state.talked[g.name]=(state.talked[g.name]||0)+1;advance(20);showScene("Небольшой разговор",g.name,"— "+q+"\n\n"+a+"\n\nОтношение "+g.name+" к тебе немного улучшилось.",[{label:"Продолжить день",action:()=>campStart()},{label:"Задать ещё один вопрос",action:()=>{advance(10);showScene(g.name,g.name,"— А что тебе самому нравится делать в свободное время?"+(state.relations[g.name]>5?" Мне интересно узнать тебя получше.":""),[{label:"Ответить искренне",action:()=>{state.relations[g.name]=Math.min(100,state.relations[g.name]+2);advance(10);campStart()}},{label:"Вернуться к делам",action:()=>campStart()}],null,"РАЗГОВОР")}}],null,"РАЗГОВОР")}
function peopleModal(){openModal("<h2>Знакомства</h2><p>Выбери человека, с кем хочешь пересечься. Разговор займёт немного времени.</p><div class='girl-list'>"+girls.map(g=>`<div class="girl-card"><b>${g.emoji} ${g.name}</b><small>${g.tag}</small><p>${g.desc}</p><button class="choice" onclick="closeModal();talkGirl(girls.find(x=>x.name==='${g.name}'))">Поговорить</button></div>`).join("")+"</div>")}
function relationsModal(){openModal("<h2>Отношения</h2><p>Здесь отображается, насколько хорошо вы успели узнать друг друга. Это не рейтинг популярности — важны ваши разговоры и проведённое вместе время.</p><div class='girl-list'>"+girls.map(g=>{let v=state.relations[g.name];return `<div class="girl-card"><b>${g.emoji} ${g.name}</b><small>${g.tag} · ${v<5?"Почти не знакомы":v<15?"Знакомые":v<30?"Приятели":v<55?"Хорошие друзья":v<80?"Близкие друзья":"Особенная связь"}</small><div class="meter"><i style="width:${v}%"></i></div></div>`}).join("")+"</div>")}
function openModal(content){$("modalContent").innerHTML=content;$("modal").classList.remove("hidden")}
function closeModal(){$("modal").classList.add("hidden")}
function settingsModal(){openModal(`<h2>Настройки</h2><div class="setting-row"><span>Фоновая музыка</span><input id="musicToggle" type="checkbox" ${state.music?"checked":""}></div><div class="setting-row"><span>Громкость музыки</span><input id="volume" type="range" min="0" max="100" value="${state.volume}"></div><div class="setting-row"><span>Размер текста</span><select id="textSize"><option>Обычный</option><option>Крупный</option></select></div><p>Прогресс автоматически сохраняется в браузере на этом устройстве.</p><button class="primary modal-action" onclick="saveSettings()">Сохранить</button> <button class="choice" onclick="resetGame()">Начать заново</button>`)}
function saveSettings(){state.music=$("musicToggle").checked;state.volume=+$("volume").value;document.querySelector(".dialogue-card p").style.fontSize=$("textSize").value==="Крупный"?"18px":"15px";musicControl();save();closeModal()}
function resetGame(){if(confirm("Начать новую игру? Текущий прогресс будет сброшен.")){localStorage.removeItem("letoSave");location.reload()}}
function journal(){openModal(`<h2>Дневник героя</h2><p><b>День ${state.day}, ${clock()}</b></p><p>Я поселился в ${state.cabin}. Мой сосед — ${state.roommate}. За это время я посетил ${new Set(state.visited).size} мест и познакомился с несколькими ребятами.</p><p>Похоже, эти две недели могут оказаться куда интереснее, чем я ожидал.</p><p><small>Цель: найти близкого человека, не забывая получать удовольствие от самого путешествия.</small></p>`)}
function save(){localStorage.setItem("letoSave",JSON.stringify(state))}
let audioCtx=null,osc=null,gain=null;
function musicControl(){if(!state.music||state.volume===0){if(gain)gain.gain.setTargetAtTime(0,audioCtx.currentTime,.2);return}if(!audioCtx){audioCtx=new(window.AudioContext||window.webkitAudioContext)();gain=audioCtx.createGain();gain.connect(audioCtx.destination);gain.gain.value=0;osc=audioCtx.createOscillator();osc.type="sine";osc.frequency.value=220;osc.connect(gain);osc.start();}gain.gain.setTargetAtTime(state.volume/100*.025,audioCtx.currentTime,.5)}
$("nextBtn").addEventListener("click",()=>{});$("settingsBtn").onclick=settingsModal;$("relationsBtn").onclick=relationsModal;$("closeModal").onclick=closeModal;$("modal").onclick=e=>{if(e.target===$("modal"))closeModal()};$("peopleBtn").onclick=peopleModal;$("restBtn").onclick=()=>{advance(60);state.mood="Отдохнувшее";save();campStart()};$("journalBtn").onclick=journal;
setInterval(()=>{if(! $("campView").classList.contains("hidden")){save();updateHud()}},5000);
const saved=localStorage.getItem("letoSave");if(saved){try{let s=JSON.parse(saved);if(s.scene==="camp"){state={...state,...s};campStart()}else introStep()}catch(e){introStep()}}else introStep();
document.addEventListener("click",()=>{if(state.music)musicControl()},{once:true});
window.addEventListener("beforeunload",save);
