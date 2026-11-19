'use strict';
// Writes docs/PRONOUN-CHECK.pdf: every pronoun card with its picture, its word, and tap-to-play links
// for its four recordings (plain, possessive with a masculine noun, with a feminine noun, with verbs).
// The links play the recordings from the published site. Run: npm run build:pronoun:pdf
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {chromium}=require(process.env.SENB_PLAYWRIGHT||'playwright');
const root=path.resolve(__dirname,'..'),out=path.join(root,'docs/PRONOUN-CHECK.pdf');
const SITE='https://hamada013.github.io/sentences-builder/';
const context=vm.createContext({});vm.runInContext(fs.readFileSync(path.join(root,'assets/data.js'),'utf8'),context);
const cards=vm.runInContext("ITEMS_DATABASE['07 Pronoun']",context);
const esc=v=>String(v??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
const url=file=>SITE+file.split('/').map(encodeURIComponent).join('/');
const image=id=>'data:image/webp;base64,'+fs.readFileSync(path.join(root,`images/07 pronouns/${id}.webp`)).toString('base64');
// What a typical card in each position is expected to show, for comparison only.
const SUGGEST={'انا':['تبعي','تبعتي'],'هاد':['تبعو','تبعتو'],'هي':['تبعها','تبعتها'],'هذا':['تبعو','تبعتو'],'هذه':['تبعها','تبعتها'],'هم':['تبعهم','تبعتهم'],'انتَ':['تبعك','تبعتك'],'انتِ':['تبعك','تبعتك'],'انتما':['تبعكم','تبعتكم'],'نحن':['تبعنا','تبعتنا'],'هدول':['تبعهم','تبعتهم']};
const KINDS=[['pronoun','الضمير','عادي'],['for possessive male noun','مع اسم مذكر','ملكية ♂'],['for possessive female noun','مع اسم مؤنث','ملكية ♀'],['for possessive verbs','مع الأفعال','أفعال']];
const play=(folder,id)=>{const file=`sounds/${folder}/${id}.m4a`;return fs.existsSync(path.join(root,file))?`<a class="play" href="${esc(url(file))}">▶</a>`:'<span class="none">لا يوجد</span>';};
const rows=cards.map(card=>{const word=card.title.trim(),[m,f]=SUGGEST[word]||['',''];
 return `<section class="card"><div class="pic"><img src="${image(card.id)}" alt=""><b>${card.id}</b></div><div class="body">
 <div class="top"><span class="label">مكتوب على البطاقة:</span><span class="word">${esc(word)}</span></div>
 <div class="q"><span>الصورة تطابق الكلمة؟</span><i class="box"></i> نعم <i class="box"></i> لا · الكلمة الصحيحة: <span class="blank"></span></div>
 <table><tr>${KINDS.map(([,name,chip])=>`<th><small>${esc(chip)}</small>${esc(name)}</th>`).join('')}</tr>
 <tr>${KINDS.map(([folder])=>`<td>${play(folder,card.id)}</td>`).join('')}</tr>
 <tr class="hint">${['',m&&`اقتراح: ${m}`,f&&`اقتراح: ${f}`,''].map(text=>`<td>${esc(text)}</td>`).join('')}</tr>
 <tr>${KINDS.map(()=>'<td><span class="write">ماذا تسمع؟</span><span class="blank wide"></span><span class="ok"><i class="box"></i>صح <i class="box"></i>خطأ</span></td>').join('')}</tr></table></div></section>`;}).join('');
const html=`<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><style>
@page{size:A4;margin:12mm 11mm 14mm}
body{margin:0;font-family:"SF Arabic","Geeza Pro","Noto Naskh Arabic",Arial,sans-serif;color:#14303c}
h1{font-size:22pt;color:#246b86;margin:0 0 2mm}.lead{font-size:11pt;color:#4a6572;margin:0 0 5mm;line-height:1.7}
.card{display:flex;gap:4mm;padding:3mm;margin:0 0 3mm;border:.3mm solid #d7e3ea;border-radius:3mm;break-inside:avoid}
.pic{flex:none;width:36mm;text-align:center;position:relative}.pic img{width:36mm;height:36mm;object-fit:contain;border:.3mm solid #e3ebf0;border-radius:2mm;background:#fff}
.pic b{position:absolute;top:1mm;right:1mm;background:#246b86;color:#fff;border-radius:1.5mm;padding:.3mm 1.8mm;font:700 10pt Menlo,monospace}
.body{flex:1;min-width:0}.top{display:flex;align-items:baseline;gap:3mm}.label{font-size:10pt;color:#7a8e9b}.word{font-size:20pt;font-weight:800}
.q{font-size:10.5pt;margin:1mm 0 2mm;display:flex;align-items:center;gap:1.5mm;flex-wrap:wrap}.q>span:first-child{font-weight:700}
.box{display:inline-block;width:4mm;height:4mm;border:.4mm solid #246b86;border-radius:1mm;vertical-align:middle}
.blank{display:inline-block;width:28mm;border-bottom:.3mm solid #9aa9b3;height:5mm}.blank.wide{display:block;width:100%;margin:1mm 0}
table{width:100%;border-collapse:collapse;table-layout:fixed}th{font-size:9.5pt;font-weight:700;background:#eef6f8;padding:1.2mm;border:.3mm solid #e3ebf0}th small{display:block;font-size:7.5pt;color:#7a8e9b;font-weight:500}
td{border:.3mm solid #e3ebf0;padding:1.2mm;text-align:center;font-size:9pt;vertical-align:top}
.play{display:inline-block;min-width:12mm;padding:1mm 3mm;border-radius:2mm;background:#246b86;color:#fff;text-decoration:none;font-size:12pt}
.none{color:#b3261e;font-size:9pt}.hint td{color:#b7791f;font-size:9pt;border-top:0}.write{font-size:8pt;color:#7a8e9b}.ok{font-size:8.5pt;display:block}
</style><body><h1>مراجعة بطاقات الضمائر وأصواتها · جملة</h1>
<p class="lead">لكل بطاقة: انظر إلى الصورة والكلمة، ثم اضغط ▶ لسماع كل تسجيل (يفتح من موقع التطبيق، يحتاج إنترنت). اكتب ما تسمعه وضع علامة صح أو خطأ. «اقتراح» هو الصيغة المتوقعة باللهجة للمقارنة فقط. بعد التعبئة أرسل لي الصفحات أو صوّرها، وأنا أصلّح الكلمات والصور والملفات.</p>
${rows}</body></html>`;
(async()=>{
 fs.mkdirSync(path.dirname(out),{recursive:true});
 const browser=await chromium.launch({headless:true}),page=await browser.newPage();
 await page.setContent(html,{waitUntil:'load'});
 await page.pdf({path:out,format:'A4',printBackground:true,preferCSSPageSize:true,displayHeaderFooter:true,headerTemplate:'<span></span>',footerTemplate:'<div style="width:100%;font-size:8pt;color:#7a8e9b;text-align:center;font-family:Menlo,monospace"><span class="pageNumber"></span> / <span class="totalPages"></span></div>'});
 if(process.env.PREVIEW)await page.setViewportSize({width:794,height:1123}),await page.emulateMedia({media:'print'}),await page.screenshot({path:process.env.PREVIEW,fullPage:false});
 await browser.close();console.log(`Pronoun check PDF → docs/PRONOUN-CHECK.pdf: ${cards.length} cards × ${KINDS.length} recordings.`);
})().catch(error=>{console.error(error);process.exitCode=1;});
