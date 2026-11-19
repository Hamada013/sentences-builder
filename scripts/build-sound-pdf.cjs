'use strict';
// Writes docs/SOUND-SCRIPT.pdf: the printable recording sheet for every clip جملة can play.
// The list comes from the app's own data and audio-path rules, so it always matches the app.
// Uses Chrome through Playwright so Arabic is shaped correctly.
// Run: npm run build:sounds:pdf   (SENB_PLAYWRIGHT can point to a Playwright install)
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {chromium}=require(process.env.SENB_PLAYWRIGHT||'playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'docs/SOUND-SCRIPT.pdf');
const context=vm.createContext({});
for(const file of ['data.js','grammar.js'])vm.runInContext(fs.readFileSync(path.join(root,'assets',file),'utf8'),context);
vm.runInContext('var state={row1Slots:[],row2Slots:[]};',context);
const run=code=>vm.runInContext(code,context);
const DB=run('ITEMS_DATABASE'),VC=run('VERB_CONJUGATIONS'),ADV=run('ADVANCED_CATEGORIES');
const esc=v=>String(v??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
const exists=file=>fs.existsSync(path.join(root,file));

// Person of each pronoun card, read from its Arabic word (the stored codes are legacy).
const PERSON={'انا':'i','هاد':'he','هي':'she','هذا':'he','هذه':'she','هم':'they','انتَ':'youmale','انتِ':'youfemale','انتما':'youplural','نحن':'we','هدول':'they'};
const OWN_M={i:'تبعي',he:'تبعو',she:'تبعها',we:'تبعنا',they:'تبعهم',youmale:'تبعك',youfemale:'تبعك',youplural:'تبعكم'};
const OWN_F={i:'تبعتي',he:'تبعتو',she:'تبعتها',we:'تبعتنا',they:'تبعتهم',youmale:'تبعتك',youfemale:'تبعتك',youplural:'تبعتكم'};
const PERSONS=[['i','أنا'],['he','هو'],['she','هي'],['we','نحن'],['they','هم'],['youmale','أنتَ'],['youfemale','أنتِ'],['youplural','أنتم']];

const groups=[];
function group(title,folder,items,note=''){
 // Same word twice in one folder: record once, copy the file.
 const first=new Map();
 for(const item of items){const key=item.text.trim();if(first.has(key))item.same=first.get(key);else first.set(key,item.id);}
 for(const item of items){item.file=`sounds/${folder}/${item.id}.m4a`;item.missing=!exists(item.file);}
 groups.push({title,folder,items,note});
}
const words=(cat,pick=item=>item.title)=>DB[cat].map(item=>({id:item.id,text:String(pick(item)).trim()}));
group('أشخاص / فاعل','subject',words('01 subject'));
group('أشياء / مفعول به','object',words('03 object'));
group('أماكن','place',words('04 place'));
group('زمان','time',words('06 time'));
group('أدوات ربط','linking',words('08 linking'));
group('حروف جر','prepositions',words('09 Prepositions'));
group('أرقام (قلها بالكلمة)','numbers',words('11 numbers'));
group('أسئلة','questions',words('12 questions'));
group('صفات · مذكر','adjectives/male',words('05 adjectives',item=>item.titleMale));
group('صفات · مؤنث','adjectives/female',words('05 adjectives',item=>item.titleFemale));
group('ألوان · مذكر','colors/male',words('10 colors',item=>item.titleMale));
group('ألوان · مؤنث','colors/female',words('10 colors',item=>item.titleFemale));
const pronounNote='صور بطاقات الضمائر لا تطابق بعض الكلمات (مثلاً البطاقة 4 صورة ولد ومكتوب «هذا»). سجّل ما تريد أن يظهر على البطاقة بعد مراجعتها.';
group('ضمائر','pronoun',words('07 Pronoun').map(item=>({...item,check:true})),pronounNote);
const own=(table,label)=>DB['07 Pronoun'].map(item=>{const word=item.title.trim(),person=PERSON[word];return {id:item.id,text:person?table[person]:'—',hint:`البطاقة: ${word}`,check:true};});
group('ملكية مع اسم مذكر','for possessive male noun',own(OWN_M),'الصيغة المكتوبة اقتراح باللهجة (تبعي/تبعو…). البطاقة لا تعرض هذه الصيغة حاليًا؛ أكّد الكلمة قبل التسجيل.');
group('ملكية مع اسم مؤنث','for possessive female noun',own(OWN_F),'الصيغة المكتوبة اقتراح باللهجة (تبعتي/تبعتو…). أكّد الكلمة قبل التسجيل.');
group('ضمائر مع الأفعال','for possessive verbs',DB['07 Pronoun'].map(item=>({id:item.id,text:item.title.trim(),hint:'الصيغة غير محدّدة في التطبيق',check:true})),'التطبيق لا يحدّد ما يقال هنا. حدّد الصيغة قبل التسجيل.');
for(const [tense,tenseName] of [['present','مضارع'],['past','ماضي']])for(const [code,personName] of PERSONS)
 group(`أفعال · ${tenseName} · ${personName}`,`verbs/${tense}/${code}`,DB['02 verbs'].map(verb=>({id:verb.id,text:VC[verb.id]?.[tense]?.[code]||verb.title,check:verb.id===15})),tense==='present'?'الملف 15 هو «بدّ» (يريد): يُستعمل أول كل فعل مستقبل، مثل «بدو» + «ياكل».':'');

const sentences=[];
for(const category of ADV)for(const sub of category.subcategories){
 const items=[];for(let n=1;n<=24;n++){const d=run(`getAdvancedItemData('${category.folder}','${sub.id}',${n})`);items.push({id:n,text:d.title,file:d.soundPath,missing:!exists(d.soundPath)});}
 sentences.push({title:`${category.name} · ${sub.id}. ${sub.name}`,folder:`advanced/${category.folder}/${sub.id}`,items});
}
// Identical sentence titles anywhere in the set: one recording can serve both.
const firstSentence=new Map();
for(const g of sentences)for(const item of g.items){const key=item.text.trim(),where=`${g.folder.slice(9)}/${item.id}`;if(firstSentence.has(key))item.same=firstSentence.get(key);else firstSentence.set(key,where);}
const all=[...groups.flatMap(g=>g.items),...sentences.flatMap(g=>g.items)];
const missing=all.filter(item=>item.missing),checks=all.filter(item=>item.check),repeats=sentences.flatMap(g=>g.items).filter(item=>item.same);

const cell=item=>`<div class="cell${item.missing?' missing':''}${item.check?' check':''}"><div class="num">${item.id}</div><div class="word">${esc(item.text)}${item.hint?`<small>${esc(item.hint)}</small>`:''}${item.same?`<small>نفس الملف ${item.same}</small>`:''}</div><span class="box"></span></div>`;
const section=g=>`<section><h2><span>${esc(g.title)}</span><small dir="ltr">sounds/${esc(g.folder)}/ · ${g.items.length}</small></h2>${g.note?`<p class="note">${esc(g.note)}</p>`:''}<div class="grid">${g.items.map(cell).join('')}</div></section>`;
const sentenceSection=g=>`<section class="sentences"><h2><span>${esc(g.title)}</span><small dir="ltr">sounds/${esc(g.folder)}/ · 24</small></h2><div class="grid two">${g.items.map(item=>`<div class="row${item.missing?' missing':''}${item.same?' same':''}"><div class="num">${item.id}</div><div class="line">${esc(item.text)}${item.same?`<small>نفس جملة ${esc(item.same)}</small>`:''}</div><span class="box"></span></div>`).join('')}</div></section>`;
const missingByFolder=Object.entries(missing.reduce((map,item)=>{const folder=item.file.slice(0,item.file.lastIndexOf('/'));(map[folder]||=[]).push(item);return map;},{}));
const html=`<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><style>
@page{size:A4;margin:13mm 12mm 15mm}
body{margin:0;font-family:"SF Arabic","Geeza Pro","Noto Naskh Arabic",Arial,sans-serif;color:#14303c}
.cover{page-break-after:always;padding-top:14mm}
.cover h1{font-size:30pt;margin:0 0 3mm;color:#246b86}.cover .sub{font-size:13pt;color:#4a6572;margin:0 0 8mm}
.stat{display:flex;gap:5mm;margin:8mm 0}.stat div{flex:1;border:1px solid #cfe0e8;border-radius:4mm;padding:4mm;text-align:center;font-size:10.5pt;color:#4a6572}.stat b{display:block;font-size:21pt;color:#14303c}
.stat .red b{color:#b3261e}.stat .amber b{color:#b7791f}
ol{font-size:12.5pt;line-height:1.85;padding-inline-start:7mm;margin:0}
.legend{display:flex;flex-wrap:wrap;gap:6mm;font-size:10.5pt;color:#4a6572;margin-top:7mm}.legend span{display:inline-flex;align-items:center;gap:2mm}
.swatch{width:5mm;height:5mm;border-radius:1.2mm;display:inline-block}
h2{display:flex;justify-content:space-between;align-items:baseline;gap:4mm;font-size:13.5pt;margin:6mm 0 2.5mm;padding:2mm 3.5mm;background:#eef6f8;border-radius:2.5mm;break-after:avoid}
h2 small{font:9pt "SF Mono",Menlo,monospace;color:#4a6572;white-space:nowrap}
.part{page-break-before:always;font-size:20pt;color:#246b86;margin:0 0 2mm}
.note{margin:0 0 2.5mm;padding:2mm 3mm;border-inline-start:1mm solid #b7791f;background:#fdf6ea;font-size:10pt;color:#6b4a12;break-after:avoid}
.grid{display:grid;grid-template-columns:repeat(3,1fr);column-gap:3mm}
.cell{display:flex;align-items:center;gap:2.5mm;padding:1.6mm .5mm;border-bottom:.3mm solid #e3ebf0;break-inside:avoid}
.num{flex:none;min-width:9mm;height:7.5mm;padding:0 1mm;box-sizing:border-box;display:grid;place-items:center;border-radius:1.8mm;background:#246b86;color:#fff;font:700 10pt/1 "SF Mono",Menlo,monospace;direction:ltr}
.word{flex:1;min-width:0;font-size:15pt;font-weight:600;line-height:1.25}.word small{display:block;font-size:8pt;font-weight:500;color:#7a8e9b}
.box{flex:none;width:5mm;height:5mm;border:.45mm solid #246b86;border-radius:1.2mm}
.check .num{background:#b7791f}.missing .num{background:#b3261e}
.missing .word::after,.missing .line::after{content:"ناقص";font-size:8pt;font-weight:700;color:#b3261e;border:.3mm solid #b3261e;border-radius:1.2mm;padding:0 1.2mm;margin-inline-start:2mm;vertical-align:middle}
.row{display:flex;align-items:center;gap:3mm;padding:1.8mm 1mm;border-bottom:.3mm solid #e3ebf0;break-inside:avoid}
.line{flex:1;font-size:14pt;font-weight:600;line-height:1.35}.line small{display:block;font-size:8pt;font-weight:500;color:#7a8e9b}.grid.two{grid-template-columns:repeat(2,1fr);column-gap:5mm}
.todo td,.todo th{border-bottom:.3mm solid #e3ebf0;padding:1.6mm 2mm;text-align:start;font-size:11pt}.todo{border-collapse:collapse;width:100%}.todo code{font:9.5pt "SF Mono",Menlo,monospace;direction:ltr;unicode-bidi:embed}
</style><body>
<section class="cover"><h1>قائمة الأصوات · جملة</h1><p class="sub">كل تسجيل يشغّله التطبيق، مرتّب حسب المجلد · ${new Date().toISOString().slice(0,10)}</p>
<div class="stat"><div><b>${all.length}</b>تسجيل</div><div class="red"><b>${missing.length}</b>ناقص الآن</div><div class="amber"><b>${checks.length}</b>تحقّق قبل التسجيل</div><div><b>${sentences.length*24}</b>جملة كاملة</div></div>
<ol><li>اقرأ الكلمة كما هي مكتوبة، بصوت واضح وهادئ، بنفس اللهجة في كل الملفات.</li><li>احفظ كل تسجيل باسم رقمه بصيغة <b dir="ltr">m4a</b> (مثل <b dir="ltr">12.m4a</b>) داخل المجلد المكتوب في رأس القسم.</li><li>اترك أقل من ربع ثانية صمت في أول التسجيل وآخره، وبنفس مستوى الصوت.</li><li>الأرقام الحمراء ملفات غير موجودة الآن: ابدأ بها. الأرقام البرتقالية تحتاج قرارًا قبل التسجيل.</li><li>«نفس الملف» يعني أن الكلمة مكرّرة في المجلد: سجّلها مرة وانسخ الملف بالاسم الثاني.</li><li>بعد وضع الملفات شغّل <b dir="ltr">npm run build:pwa</b> ليعمل التطبيق بدون إنترنت.</li><li>لا حاجة لمجلد <b dir="ltr">sounds/verbs/future</b>: المستقبل يُقال «بدّ» (الملف 15) ثم الفعل المضارع.</li></ol>
<div class="legend"><span><i class="swatch" style="background:#b3261e"></i>ناقص</span><span><i class="swatch" style="background:#b7791f"></i>تحقّق</span><span><i class="swatch" style="background:#246b86"></i>موجود (لإعادة التسجيل)</span><span><i class="box"></i>تمّ التسجيل</span></div></section>
<h1 class="part" style="page-break-before:auto">ابدأ هنا: الملفات الناقصة</h1>
<table class="todo"><tr><th>المجلد</th><th>العدد</th><th>الأرقام</th></tr>${missingByFolder.map(([folder,items])=>`<tr><td><code>${esc(folder)}/</code></td><td>${items.length}</td><td dir="ltr">${items[0].id}–${items.at(-1).id}</td></tr>`).join('')}</table>
<p class="note" style="margin-top:4mm">صيغة «أنتم» في المضارع ناقصة كلها تقريبًا. تجدها كاملة في قسم «أفعال · مضارع · أنتم» بالأحمر.</p>
<h1 class="part">كلمات البطاقات</h1>${groups.filter(g=>!g.folder.startsWith('verbs/')).map(section).join('')}
<h1 class="part">الأفعال</h1>${groups.filter(g=>g.folder.startsWith('verbs/')).map(section).join('')}
<h1 class="part">الجمل الكاملة (صور الجمل)</h1>${sentences.map(sentenceSection).join('')}
</body></html>`;
(async()=>{
 fs.mkdirSync(path.dirname(out),{recursive:true});
 const browser=await chromium.launch({headless:true}),page=await browser.newPage();
 await page.setContent(html,{waitUntil:'load'});
 await page.pdf({path:out,format:'A4',printBackground:true,preferCSSPageSize:true,displayHeaderFooter:true,headerTemplate:'<span></span>',footerTemplate:'<div style="width:100%;font-size:8pt;color:#7a8e9b;text-align:center;font-family:Menlo,monospace"><span class="pageNumber"></span> / <span class="totalPages"></span></div>'});
 await browser.close();
 console.log(`Sound list PDF → docs/SOUND-SCRIPT.pdf: ${all.length} clips, ${missing.length} missing, ${checks.length} to check, ${repeats.length} repeated sentences.`);
})().catch(error=>{console.error(error);process.exitCode=1;});
