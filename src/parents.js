/* ===== app dos pais ===== */
const SYM={seca:['☀️','sym.seca'],umida:['<span style="font-size:1.35em">☁️</span>','sym.umida'],pouco:['☀️<span style="font-size:.55em">☁️</span>','sym.pouco'],acordou:['🌙','sym.acordou']};
const RAZ=['liquido','tarde','viagem','ar','estresse','doenca','outro'];
const norm=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^A-Za-z0-9]/g,'').toUpperCase();
const WA_URL='https://wa.me/5521984814150?text=Ol%C3%A1!%20Contato%20pelo%20App-Miccional%20do%20Dr.%20Domingos',AGENDA_URL='https://www.urologistapediatrico.com/agenda-online-drbica',IG_URL='https://www.instagram.com/drdomingosbica';
const waBtn=()=>'<a class="btn sm" href="'+WA_URL+'" target="_blank" rel="noopener">💬 '+t('ct.wa')+'</a>',agBtn=()=>'<a class="btn sm ghost" href="'+AGENDA_URL+'" target="_blank" rel="noopener">📅 '+t('ct.ag')+'</a>';
const bookBox=()=>'<p class="hint" style="margin:6px 0">'+t('rc.book')+'</p><div class="row wrap">'+waBtn()+agBtn()+'</div>';
const NOTEQ=['viagem','estresse','remedio','doente','tarde','liquido','ar','rotina'];
const hasMod=m=>(S.p.mods||[]).includes(m);
function sem(c,txt,ic){return '<span class="sem '+c+'"><i aria-hidden="true">'+ic+'</i>'+txt+'</span>'}
const ul=a=>'<ul style="margin:8px 0 0;padding-left:20px;color:var(--ink2);display:flex;flex-direction:column;gap:6px">'+a.map(x=>'<li>'+x+'</li>').join('')+'</ul>';
const ONB_LANGS=()=>'<div class="lang" role="group" aria-label="'+t('lang')+'">'+LANGS.map(l=>'<button type="button" data-a="lang" data-v="'+l+'" aria-pressed="'+(LANG===l)+'">'+LNAME[l]+'</button>').join('')+'</div>';
function hdrP(){
 const sub=S.p.screen==='onb'?'':(S.p.code?'<div class="who">'+t('code')+'<br><b style="color:#fff;font-size:15px;letter-spacing:.06em">'+S.p.code+'</b></div>':'');
 return '<div class="hdr">'+MARK+'<div><div class="nm">Dr. Domingos Bica</div><div class="sub">'+t('sub')+'</div></div>'+sub+'</div>'+ONB_LANGS();
}
function footP(){
 const n=S.outbox.length;
 const st=S.token?(n?'<span class="sem y"><i aria-hidden="true">…</i>'+(flushing?t('f.sending')+'<span class="dots"></span>':t(n>1?'f.sendn':'f.send1',n))+'</span>':'<span class="sem g"><i aria-hidden="true">✓</i>'+t('f.sent')+'</span>'):'';
 return '<div class="foot">'+(st?'<div style="margin-bottom:8px">'+st+'</div>':'')+(S.authBad?'<div class="note" style="margin-bottom:8px">'+t('f.auth')+'</div>':'')+t('f.brand')+' · <a href="'+IG_URL+'" target="_blank" rel="noopener">@drdomingosbica</a><br><span style="opacity:.8">'+t('f.ver')+' '+APP_V+'</span></div>'}
function stepper(path,min,max){return '<div class="stepper"><button type="button" data-a="st" data-p="'+path+'" data-d="-1" data-min="'+min+'" data-max="'+max+'" aria-label="'+t('less')+'">−</button><output data-bind="'+path+'">'+get(path)+'</output><button type="button" data-a="st" data-p="'+path+'" data-d="1" data-min="'+min+'" data-max="'+max+'" aria-label="'+t('more')+'">+</button></div>'}
function nextSat(){let d=TODAY;while(d.getDay()!==6)d=add(d,1);return d}
const chipB=(a,k,v,txt,on)=>'<button type="button" class="chip" data-a="'+a+'" data-k="'+k+'" data-v="'+v+'" aria-pressed="'+on+'">'+txt+'</button>';

/* ----- entrada ----- */
function obValid(){const o=S.ob;return norm(o.code).length>=4&&o.dob&&o.sx&&o.papel&&o.sit&&o.termo&&(o.papel!=='adol'||o.assent)&&(o.sit!=='investigacao'||o.mn||o.md)}
function obNormHtml(){return norm(S.ob.code)?t('ob.read')+'<b>'+norm(S.ob.code)+'</b>':t('ob.case')}
function viewOnb(){
 const o=S.ob;
 return '<div class="body"><div><h1>'+t('ob.title')+'</h1><p class="lead" style="margin-top:6px">'+t('ob.intro')+'</p></div>'+
 '<div class="card flat"><div class="field"><label class="lbl" for="ob-code">'+t('ob.code')+'</label><input id="ob-code" class="in" data-i="ob.code" data-u="ob" value="'+esc(o.code)+'" autocapitalize="characters" autocomplete="off" placeholder="Ex.: TG2013"><div class="hint" id="ob-norm" style="margin-top:4px">'+obNormHtml()+'</div></div>'+
 '<div class="field" style="margin-top:12px"><label class="lbl" for="ob-dob">'+t('ob.dob')+'</label><input id="ob-dob" type="date" class="in" data-i="ob.dob" data-u="ob" value="'+esc(o.dob)+'"><div class="hint" style="margin-top:4px">'+t('ob.dobh')+'</div></div>'+
 '<div style="margin-top:12px"><span class="lbl">'+t('ob.sx')+'</span><div class="chips">'+['M','F'].map(k=>chipB('ob','sx',k,t('ob.'+k),o.sx===k)).join('')+'</div></div>'+
 '<div style="margin-top:12px"><span class="lbl">'+t('ob.who')+'</span><div class="chips">'+['mae','pai','outro','adol'].map(k=>chipB('ob','papel',k,t('ob.'+k),o.papel===k)).join('')+'</div></div>'+
 '<label class="chk" style="margin-top:12px"><input type="checkbox" data-c="ob.cas"'+(o.cas?' checked':'')+'><span>'+t('ob.cas')+'</span></label></div>'+
 '<div class="card flat"><span class="lbl">'+t('ob.phase')+'</span><div class="chips">'+[['investigacao','ob.inv'],['tratamento','ob.trat']].map(x=>chipB('ob','sit',x[0],t(x[1]),o.sit===x[0])).join('')+'</div>'+
 (o.sit==='investigacao'?'<div style="margin-top:12px"><span class="lbl">'+t('ob.why')+'</span><label class="chk"><input type="checkbox" data-c="ob.mn"'+(o.mn?' checked':'')+'><span>'+t('ob.mn')+'</span></label><label class="chk" style="margin-top:8px"><input type="checkbox" data-c="ob.md"'+(o.md?' checked':'')+'><span>'+t('ob.md')+'</span></label>'+
 '<div style="margin-top:12px"><span class="lbl">'+t('ob.nd')+'</span><div class="chips">'+[1,2,3].map(n=>chipB('ob','nd',n,n,o.nd===n)).join('')+'</div></div></div>':'')+'</div>'+
 '<div class="card flat"><h3>'+t('ob.term')+'</h3><div class="term" style="margin-top:8px">'+[0,1,2,3,4,5,6,7].map(i=>'<p>'+t('ob.t'+i)+'</p>').join('')+'<p class="hint">'+t('ob.tv')+TERMO_V+'</p></div>'+
 '<label class="chk" style="margin-top:12px"><input type="checkbox" data-c="ob.termo"'+(o.termo?' checked':'')+'><span>'+t('ob.agree')+'</span></label>'+
 (o.papel==='adol'?'<label class="chk" style="margin-top:8px"><input type="checkbox" data-c="ob.assent"'+(o.assent?' checked':'')+'><span>'+t('ob.assent')+'</span></label><p class="hint" style="margin-top:6px">'+t('ob.assenth')+'</p>':'')+'</div>'+
 (o.err?'<div class="note" style="border-color:var(--crit)">'+esc(o.err)+'</div>':'')+'<button type="button" class="btn block" id="ob-go" data-a="obgo"'+(obValid()&&!o.busy?'':' disabled')+'>'+(o.busy?t('ob.busy'):t('ob.go'))+'</button></div>';
}
/* ----- fase de avaliação: tela inicial de quem ainda está em investigação ----- */
const dxFeitos=()=>((S.cfg&&S.cfg.dx?S.cfg.dx.feitos:0)+S.outbox.filter(e=>e.a==='fim').length);
function lockedItem(ic,title){return '<div class="mi locked" aria-disabled="true"><span class="ic">'+ic+'</span><span style="flex:1"><div class="t">'+title+'</div><div class="d">'+t('dx.soon')+'</div></span><span class="lock" aria-hidden="true">🔒</span></div>'}
function viewDx(){
 const d=Object.assign({},S.cfg&&S.cfg.dx||{n:0,tipo:'inicial',prazo:''}),n=d.n,fe=dxFeitos(),done=n>0&&fe>=n,us=(S.cfg&&S.cfg.us)||{p:false,f:''};
 const seg=d.tipo==='seguimento',nightDx=!seg&&hasMod('n'),inTr=!!(S.cfg&&S.cfg.fase==='trat'&&S.cfg.inicio);
 let h='<div class="body">'+(inTr?'<button class="back" data-a="go" data-v="menu">'+t('back')+'</button><div><h2>'+t('mn.dia')+'</h2></div>':'<div><h1>'+t('hello')+'</h1><p class="lead">'+DL[TODAY.getDay()]+', '+FY(TODAY)+'</p></div>')+
 '<div class="card"><span class="sem y"><i aria-hidden="true">🔎</i>'+(seg||inTr?t('dx.title2'):t('dx.phase'))+'</span><p class="lead" style="margin-top:10px">'+t(inTr&&!n?'dx.none':'dx.intro')+'</p></div>';
 if(inTr&&!n)return h+'</div>';
 h+='<div class="card"><h3>1 · '+t('dx.diaries')+'</h3><p class="lead" style="margin-top:6px">'+t(n===1?'dx.asked1':'dx.askedn',n)+(d.prazo?' '+t('dx.by',FY(P(d.prazo))):'')+'</p>'+(nightDx?'<p class="hint" style="margin-top:4px">'+t('dx.fr1')+'</p>':'')+
 '<div class="row wrap" style="gap:8px;margin-top:10px">'+Array.from({length:n},(_,i)=>sem(i<fe?'g':(i===fe&&S.dx.ativo?'y':'n'),t('dx.diary',i+1),i<fe?'✓':(i===fe&&S.dx.ativo?'…':'·'))).join('')+'</div>'+
 (done?'<p style="margin-top:12px">'+t('dx.done')+'</p>':'<p class="lead" style="margin-top:12px">'+t('dx.next',F(nextSat()))+'</p><button type="button" class="btn block" style="margin-top:12px" data-a="dxstart">'+(S.dx.ativo?(S.dx.retro?t('dx.contp'):t('dx.cont')):t('dx.start'))+'</button>'+(S.dx.ativo?'':'<button type="button" class="btn block ghost" style="margin-top:8px" data-a="sheet" data-v="paper">'+t('dx.paper')+'</button>'))+'</div>';
 if(us.p)h+='<div class="card"><h3>2 · '+t('dx.us')+'</h3>'+(us.f?'<p class="lead" style="margin-top:6px">'+t('dx.usdone',FY(P(us.f)))+'</p>':'<p class="lead" style="margin-top:6px">'+t('dx.usask')+'</p><button type="button" class="btn block ghost" style="margin-top:10px" data-a="usdone">'+t('dx.usbtn')+'</button>')+'</div>';
 {const k=checkCard();h+=k+(k.includes('data-v="agendei"')?'':retCard())}
 h+='<div class="card flat"><h3>'+t('dx.how')+'</h3><ol style="margin:8px 0 0;padding-left:20px;color:var(--ink2);font-size:14px;display:flex;flex-direction:column;gap:6px">'+['dx.h1','dx.h2','dx.h3','dx.h4','dx.h5','dx.h6'].map(k=>'<li>'+t(k)+'</li>').join('')+'<li>'+t(nightDx?'dx.h7a':'dx.h7b')+'</li></ol></div>';
 if(inTr)return h+'<div class="note">'+t('dx.n1')+'</div><div class="note">'+t('dx.n2')+'</div></div>';
 h+='<div class="menu">'+lockedItem('🌙',t('mn.cal'))+((hasMod('d')||hasMod('i'))?lockedItem('📋',t('mn.week')):'')+lockedItem('⏰',t('mn.dev'))+
  '<button class="mi" data-a="go" data-v="info"><span class="ic">ℹ️</span><span style="flex:1"><div class="t">'+t('mn.info')+'</div><div class="d">'+t('mn.infod')+'</div></span></button>'+
  '<button class="mi" data-a="go" data-v="help"><span class="ic">❓</span><span style="flex:1"><div class="t">'+t('mn.help')+'</div><div class="d">'+t('mn.helpd')+'</div></span></button></div>';
 h+='<div class="note">'+t('dx.n1')+'</div><div class="note">'+t('dx.n2')+'</div></div>';
 return h;
}
const dxNight=()=>((S.cfg&&S.cfg.dx&&S.cfg.dx.tipo)||'inicial')==='inicial'&&hasMod('n');
function viewDiary(){
 const d=S.dx,mic=d.mic.slice().sort((a,b)=>a[0]<b[0]?-1:1),tot=mic.reduce((s,x)=>s+(x[1]||0),0),liq=d.liq.reduce((s,x)=>s+x[1],0);
 return '<div class="body"><button class="back" data-a="go" data-v="dx">'+t('back')+'</button><div><h2>'+t('dy.title',dxFeitos()+1,(S.cfg&&S.cfg.dx&&S.cfg.dx.n)||1)+'</h2><p class="lead">'+DL[P(d.data).getDay()]+', '+FY(P(d.data))+'</p></div>'+
 (d.retro?'<div class="note" style="border-color:var(--gold)">'+t('dy.retro')+'</div>':'<div class="note">'+t('dy.rem')+'</div>')+'<button class="btn block" data-a="sheet" data-v="mic">'+t('dy.addmic')+'</button><button class="btn block ghost" data-a="sheet" data-v="liq">'+t('dy.addliq')+'</button>'+
 '<div class="card"><div class="row"><h3>'+t('dy.today')+'</h3><span class="sp"></span><span class="hint">'+mic.length+' '+t(mic.length===1?'dy.m1':'dy.mn')+' · '+tot+' mL · '+t('dy.liq')+' '+liq+' mL</span></div>'+
 (mic.length?'<div class="tw"><table class="t" style="margin-top:6px"><tr><th>'+t('dy.hour')+'</th><th>mL</th><th>'+t('dy.urg')+'</th><th>'+t('dy.loss')+'</th><th>'+t('dy.obs')+'</th></tr>'+mic.map(x=>'<tr><td>'+x[0]+'</td><td>'+(x[1]||t('dy.nm'))+'</td><td>'+VL(x[2])+'</td><td>'+VL(x[3])+'</td><td>'+esc(x[4]||'')+'</td></tr>').join('')+'</table></div>':'<p class="hint" style="margin-top:8px">'+t('dy.none')+'</p>')+'</div>'+
 (d.liq.length?'<div class="card"><h3>'+t('dy.liqt')+'</h3><div class="tw"><table class="t" style="margin-top:6px"><tr><th>'+t('dy.hour')+'</th><th>'+t('dy.what')+'</th><th>mL</th></tr>'+d.liq.map(x=>'<tr><td>'+(x[0]||'—')+'</td><td>'+esc(VL(x[2]||''))+'</td><td>'+x[1]+'</td></tr>').join('')+'</table></div></div>':'')+(dxNight()?'<div class="card"><h3>🌙 '+t('dy.night')+'</h3><p class="hint" style="margin:4px 0 8px">'+t('sh.fimnote')+'</p><div class="field"><label class="lbl" for="fg2">'+t('sh.fg')+'</label><input id="fg2" type="number" inputmode="numeric" class="in" data-i="dx.fim.g" value="'+esc(d.fim.g)+'"></div><div class="field"><label class="lbl" for="fm2">'+t('sh.fm')+'</label><input id="fm2" type="number" inputmode="numeric" class="in" data-i="dx.fim.m" value="'+esc(d.fim.m)+'"></div></div>':'')+'<button class="btn block gold" data-a="sheet" data-v="fim"'+(mic.length?'':' disabled')+'>'+t('dy.end')+'</button></div>';
}
/* ----- tratamento ----- */
const hasNight=k=>!!(S.nights[k]||(S.cfg&&S.cfg.nights&&S.cfg.nights[k]));
const alarmOn=k=>!!(S.cfg&&S.cfg.alarme&&S.cfg.alarme<=k);
const calStart=()=>S.cfg&&S.cfg.inicio?P(S.cfg.inicio):add(TODAY,-75);
function nightsMissing(){const y=add(TODAY,-1),ms=new Date(y.getFullYear(),y.getMonth(),1,12),st=calStart(),a=ms>st?ms:st;let m=0;for(let d=a;d<=y;d=add(d,1))if(!hasNight(I(d)))m++;return m}

const isTrat=()=>!!(S.cfg&&S.cfg.fase==='trat'&&S.cfg.status==='ativo');
const dxPend=()=>!!(S.cfg&&S.cfg.dx&&dxFeitos()<S.cfg.dx.n);
const needStart=()=>isTrat()&&!S.cfg.inicio&&!dxPend();
function pauseInfo(){
 const c=S.cfg;if(!isTrat()||!c.inicio||!c.ret)return null;
 const tol=c.tol||14,late=diff(TODAY,P(c.ret));
 if(late<=tol)return null;
 if(c.agd&&diff(TODAY,P(c.agd))<=7)return null;
 return {late,tol};
}
function agForm(){
 if(!S.ag.q)return '<button class="chip" data-a="agq">'+t('rc.ag')+'</button>';
 const mx=I(add(TODAY,150));
 return '<div class="field" style="max-width:260px"><label class="lbl" for="ag-dt">'+t('ag.q')+'</label><input id="ag-dt" type="date" class="in" data-i="ag.dt" min="'+I(TODAY)+'" max="'+mx+'" value="'+esc(S.ag.dt)+'"></div>'+(S.ag.bad?'<p class="hint" style="color:var(--bad)">'+t('ag.bad')+'</p>':'')+'<button class="btn sm" data-a="agsave">'+t('ag.ok')+'</button>';
}
function retCard(){
 const c=S.cfg;if(!c||!c.ret)return '';
 const d=P(c.ret),n=diff(d,TODAY),ag=c.agd&&diff(P(c.agd),TODAY)>=-7;
 const left=n===0?t('rc.today'):n===1?t('rc.d1'):n<=30?t('rc.d',n):n<=90?t('rc.w',Math.round(n/7)):t('rc.m',Math.round(n/30.4));
 return '<div class="card flat"><span class="lbl">'+t('rc.t')+'</span><p style="margin:4px 0">'+t('rc.when',MN[d.getMonth()]+' '+d.getFullYear())+'</p>'+
 (ag?'<div class="row"><span class="sem g"><i>✓</i>'+t('rc.agok',FY(P(c.agd)))+'</span></div>':agForm()+''+bookBox()+'')+'</div>';
}
function retChip(){
 const c=S.cfg;if(!c||!c.ret||!isTrat()||!c.inicio||pauseInfo())return '';
 const n=diff(P(c.ret),TODAY);if(n<0)return '';
 const left=n===0?t('rc.today'):n===1?t('rc.d1'):n<=30?t('rc.d',n):n<=90?t('rc.w',Math.round(n/7)):t('rc.m',Math.round(n/30.4));
 return '<p class="hint" style="margin:-4px 0 10px">📅 '+t('rc.chip','<b>'+left+'</b>')+'</p>'}
function rrOpts(list){
 return '<div style="display:flex;flex-direction:column;gap:8px">'+list.map(k=>'<button class="chip" style="justify-content:flex-start;text-align:left" data-a="rr" data-v="'+k+'">'+t('ck.o.'+k)+'</button>').join('')+'</div>';
}
function checkCard(){
 const c=S.cfg;if(!c||!c.ret||!isTrat()||!c.inicio)return '';
 const rr=c.rr||{m:'',d:''};
 if(S.ckmsg)return '<div class="note" style="border-color:var(--gold)">'+t('ck.r.'+S.ckmsg)+'<div style="margin-top:8px"><button class="chip" data-a="ckok">'+t('ck.ok')+'</button></div></div>';
 if(rr.m==='parou')return '<div class="card flat"><span class="lbl">'+t('ck.pause')+'</span><p style="margin:4px 0 8px">'+t('ck.pausep')+'</p><button class="chip" data-a="rr" data-v="">'+t('ck.resume')+'</button></div>';
 const tol=c.tol||14,late=diff(TODAY,P(c.ret));
 if(late<0||late>tol)return '';
 if(c.agd&&diff(P(c.agd),TODAY)>=-7)return '';
 if(rr.m&&rr.d&&rr.d>=c.ret&&!(rr.m==='depois'&&diff(TODAY,P(rr.d))>=3))return '';
 return '<div class="card" data-ck="1" style="border-color:var(--gold)"><span class="lbl">'+t('ck.t')+'</span><p style="margin:6px 0 10px">'+t('ck.p',late,tol-late)+'</p>'+agForm()+'<div style="height:8px"></div>'+rrOpts(['vou','melhorou','custo','parou','outro','depois'])+bookBox()+'</div>';
}
function cqCard(){const k=S.p.cqs;if(!k||!M['cq.t.'+k])return '';
 return '<div class="card" style="border-color:var(--gold)"><span class="lbl">'+t('cq.t.'+k)+'</span><p style="margin:6px 0 10px">'+t('cq.m.'+k)+'</p><button class="btn sm" data-a="cqok">'+t('cq.ok')+'</button></div>'}
function hqCard(){
 const c=S.cfg;if(!c||c.hq||pauseInfo()||needStart()||c.status==='pendente')return '';
 if(S.p.hqs&&diff(TODAY,P(S.p.hqs))<7)return '';
 return '<div class="card" style="border-color:var(--gold)"><span class="lbl">'+t('hq.t')+'</span><p class="hint" style="margin:4px 0 10px">'+t('hq.p')+'</p><div class="row"><button class="btn sm" data-a="go" data-v="hist">'+t('hq.now')+'</button><button class="btn sm ghost" data-a="hqskip">'+t('hq.later')+'</button></div></div>';
}
function viewHist(){
 const q=S.hq,ch=(k,v,txt,on)=>'<button type="button" class="chip" data-a="hqset" data-k="'+k+'" data-v="'+v+'" aria-pressed="'+on+'">'+txt+'</button>';
 const blk=(title,body)=>'<div style="margin-top:16px"><span class="lbl">'+title+'</span><div class="chips" style="margin-top:6px">'+body+'</div></div>';
 return '<div class="body"><div><h1>'+t('hq.t')+'</h1><p class="lead">'+t('hq.p')+'</p></div>'+
  blk(t('hq.s1'),ch('hp','n',t('hq.no'),q.hp==='n')+ch('hp','s',t('hq.y'),q.hp==='s'))+
  (q.hp==='s'?blk(t('hq.s2'),['bex','desm','ws','uro','out','ns'].map(k=>ch('hm',k,t('hq.m.'+k),q.hm.indexOf(k)>=0)).join('')):'')+
  (hasMod('n')?blk(t('hq.s3'),[0,1,2,3,4].map(v=>ch('hn',v,t('hq.n'+v),String(q.hn)===String(v))).join('')):'')+
  (hasMod('d')?blk(t('hq.s4'),[0,1,2,3,4].map(v=>ch('hd',v,t('hq.d'+v),String(q.hd)===String(v))).join('')):'')+
  (hasMod('d')?blk(t('sh.pt'),['u','s','e','m'].map(v=>ch('hu',v,t('sh.pt.'+v),q.hu===v)).join('')):'')+
  (hasMod('i')?blk(t('hq.s5'),['n','a','s'].map(v=>ch('hi',v,t('hq.i.'+v),q.hi===v)).join('')):'')+
  '<div class="row" style="margin-top:20px"><button class="btn" data-a="hqsend">'+t('hq.send')+'</button><button class="btn ghost" data-a="hqskip">'+t('hq.later')+'</button></div></div>';
}

/* ---------- histórico mensal (meses anteriores) ---------- */
const mkey=d=>I(d).slice(0,7);
function monthsList(){
 const c=S.cfg;if(!c||!c.inicio||!isTrat())return [];
 const cur=new Date(TODAY.getFullYear(),TODAY.getMonth(),1,12),lim=new Date(cur.getFullYear(),cur.getMonth()-12,1,12),st=P(c.inicio);
 let a=new Date(st.getFullYear(),st.getMonth(),1,12);if(a<lim)a=lim;
 const out=[];for(let d=a;d<cur;d=new Date(d.getFullYear(),d.getMonth()+1,1,12))out.push(mkey(d));return out.reverse();
}
/* situação do mês: calendário (conta as noites molhadas), relato dos pais ou nada */
function monthInfo(m){
 const y=+m.slice(0,4),mo=+m.slice(5,7),dm=new Date(y,mo,0).getDate();let loc=0,w=0,srv=0;
 for(let i=1;i<=dm;i++){const k=m+'-'+p2(i),n=S.nights[k];if(n){loc++;if(n.s==='umida'||n.s==='pouco')w++}else if(S.cfg.nights&&S.cfg.nights[k])srv++}
 if(loc>=dm*0.5)return{src:'cal',n:w};
 if(loc+srv>=dm*0.5)return{src:'cal',n:null};
 const r=S.cfg.meses&&S.cfg.meses[m];if(r)return{src:'rep',r:r};
 return{src:'',n:null};
}
const monthsMissing=()=>monthsList().filter(m=>!monthInfo(m).src);
function msCard(){
 const k=monthsMissing().length;if(!k||pauseInfo()||needStart())return '';
 return '<div class="card" style="border-color:var(--gold)"><span class="lbl">'+t('ms.t')+'</span><p class="hint" style="margin:4px 0 10px">'+t('ms.card',k)+'</p><button class="btn sm" data-a="go" data-v="meses">'+t('ms.open')+'</button></div>';
}
function msBuild(m){
 const q=S.mq[m];if(!q)return null;const o={mes:m};
 if(hasMod('n')){if(q.na)o.na=1;else if(q.n!==''&&q.n!=null){const n=Math.round(Number(q.n));if(!isNaN(n)&&n>=0&&n<=31)o.n=n}}
 if(hasMod('d')){if(q.d!==''&&q.d!=null)o.d=Number(q.d);if(q.u!==''&&q.u!=null)o.u=Number(q.u)}
 if(hasMod('i')&&q.i)o.i=q.i;
 return Object.keys(o).length>1?o:null;
}
const msPending=()=>monthsList().filter(m=>(!monthInfo(m).src||(S.mq[m]&&S.mq[m].ed))&&msBuild(m));
function viewMeses(){
 const L=monthsList(),mq=m=>S.mq[m]||(S.mq[m]={n:'',d:'',u:'',i:'',na:false,ed:false}),mn=m=>MN[+m.slice(5,7)-1]+' '+m.slice(0,4);
 const sel=(m,k,opts)=>'<select class="in" style="padding:6px;font-size:14px" data-i="mq.'+m+'.'+k+'" data-u="ms"><option value="">—</option>'+opts.map(o=>'<option value="'+o[0]+'"'+(String(mq(m)[k])===String(o[0])?' selected':'')+'>'+o[1]+'</option>').join('')+'</select>';
 const open=L.filter(m=>!monthInfo(m).src||mq(m).ed),done=L.filter(m=>!open.includes(m));
 const doneRow=m=>{const inf=monthInfo(m);let tx;if(inf.src==='cal')tx=inf.n==null?t('ms.cal'):t('ms.calN',inf.n);
  else{const r=inf.r,a=[];if(hasMod('n'))a.push(r.na?t('ms.rna'):t('ms.rn',r.n));if(hasMod('d')&&r.d!=='')a.push(t('hq.d'+r.d));if(hasMod('i')&&r.i)a.push(t('hq.i.'+r.i));tx=a.join(' · ')}
  return '<tr><td style="text-transform:capitalize"><b>'+mn(m)+'</b></td><td class="hint" colspan="2">✓ '+tx+(inf.src==='rep'?' <button class="chip" data-a="msed" data-m="'+m+'">'+t('ms.edit')+'</button>':'')+'</td></tr>'};
 const row=m=>{const q=mq(m);
  return '<tr><td style="text-transform:capitalize;vertical-align:middle"><b>'+mn(m)+'</b></td>'+
   (hasMod('n')?'<td><input type="number" inputmode="numeric" min="0" max="31" style="width:72px" aria-label="'+t('ms.n')+'" data-i="mq.'+m+'.n" data-u="ms" value="'+(q.na?'':q.n)+'"'+(q.na?' disabled':'')+'></td><td><button type="button" class="chip tiny" data-a="msna" data-m="'+m+'" aria-pressed="'+q.na+'">'+t('ms.na')+'</button></td>':'<td colspan="2"></td>')+'</tr>'+
   (hasMod('d')||hasMod('i')?'<tr><td></td><td colspan="2" style="padding-bottom:14px"><div style="display:grid;gap:6px">'+
    (hasMod('d')?'<label class="hint">'+t('ms.d')+sel(m,'d',[0,1,2,3,4].map(v=>[v,t('hq.d'+v)]))+'</label><label class="hint">'+t('ms.u')+sel(m,'u',[0,1,2,3].map(v=>[v,t('ms.u'+v)]))+'</label>':'')+
    (hasMod('i')?'<label class="hint">'+t('ms.i')+sel(m,'i',['n','a','s'].map(v=>[v,t('hq.i.'+v)]))+'</label>':'')+'</div></td></tr>':'')};
 const any=msPending().length>0;
 return '<div class="body"><button class="back" data-a="go" data-v="menu">'+t('back')+'</button><div><h2>'+t('ms.t')+'</h2><p class="lead">'+t('ms.p')+'</p></div>'+
  (!L.length?'<p class="hint">'+t('ms.none')+'</p>':
  (!open.length?'<div class="note">'+t('ms.done')+'</div>':'')+
  '<div class="card" style="padding:8px 12px"><table style="width:100%;border-collapse:collapse"><thead><tr style="text-align:left"><th class="hint">'+t('ms.col1')+'</th><th class="hint">'+(hasMod('n')?t('ms.col2'):'')+'</th><th></th></tr></thead><tbody>'+open.map(row).join('')+done.map(doneRow).join('')+'</tbody></table></div>'+
  (open.length?'<button class="btn block" id="ms-go" data-a="msall"'+(any?'':' disabled')+'>'+t('ms.saveall')+'</button>':''))+'</div>';
}
/* ---------- DVSS: questionário antes da consulta ---------- */
function dvCard(){
 const c=S.cfg;if(!c||!c.ret||!isTrat()||!c.inicio||pauseInfo()||needStart()||!(hasMod('d')||hasMod('i')))return '';
 if(S.dvok)return '<div class="note">'+t('dv.thx')+'</div>';
 const to=diff(P(c.ret),TODAY);if(to>10)return '';
 if(c.dv&&diff(TODAY,P(c.dv))<=25)return '';
 return '<div class="card" style="border-color:var(--gold)"><span class="lbl">'+t('dv.t')+'</span><p class="hint" style="margin:4px 0 10px">'+t('dv.card')+'</p><button class="btn sm" data-a="go" data-v="dvss">'+t('dv.go')+'</button></div>';
}
function viewDvss(){
 const a=S.dv.it,done=a.every(x=>x!=null);
 const q=(n)=>'<div class="card flat"><p style="margin:0 0 8px"><b>'+n+'.</b> '+t('dv.q'+n)+'</p><div class="chips">'+(n===10?[[0,'dv.no'],[3,'dv.yes']]:[[0,'dv.s0'],[1,'dv.s1'],[2,'dv.s2'],[3,'dv.s3']]).map(x=>'<button type="button" class="chip" data-a="dvset" data-k="'+(n-1)+'" data-v="'+x[0]+'" aria-pressed="'+(a[n-1]===x[0])+'">'+t(x[1])+'</button>').join('')+'</div></div>';
 return '<div class="body"><button class="back" data-a="go" data-v="menu">'+t('back')+'</button><div><h2>'+t('dv.t')+'</h2><p class="lead">'+t('dv.lead')+'</p></div>'+[1,2,3,4,5,6,7,8,9,10].map(q).join('')+'<button class="btn block" data-a="dvsend"'+(done?'':' disabled')+'>'+t('dv.send')+'</button></div>';
}
function impCard(){
 const c=S.cfg;if(!c||!c.ret||!isTrat()||!c.inicio||pauseInfo())return '';
 const to=diff(P(c.ret),TODAY);if(to>7)return '';
 if(c.imp&&diff(TODAY,P(c.imp))<=20)return S.impok?'<div class="note">'+t('im.thx')+'</div>':'';
 const ks=['n','d','i'].filter(k=>hasMod(k));if(!ks.length)return '';
 const done=ks.every(k=>S.imp[k]>0);
 return '<div class="card" style="border-color:var(--gold)"><span class="lbl">'+t('im.t')+'</span><p class="hint" style="margin:4px 0 10px">'+t('im.p')+'</p>'+ks.map(k=>'<div style="margin-bottom:10px"><b>'+t('im.'+k)+'</b><div class="chips" style="margin-top:6px">'+[1,2,3,4,5].map(v=>'<button type="button" class="chip" data-a="impset" data-k="'+k+'" data-v="'+v+'" aria-pressed="'+(S.imp[k]===v)+'">'+t('im.l'+v)+'</button>').join('')+'</div></div>').join('')+(()=>{const rc=(o)=>Object.keys(o).filter(k=>diff(TODAY,P(k))<=21&&diff(TODAY,P(k))>=0).length;let h='';
  if(hasMod('n')&&rc(S.nights)<10)h+='<div style="margin-bottom:10px"><b>'+t('iq.nw')+'</b><div class="chips" style="margin-top:6px">'+[0,1,2,3,4].map(v=>'<button type="button" class="chip" data-a="impq" data-k="nw" data-v="'+v+'" aria-pressed="'+(String(S.iq.nw)===String(v))+'">'+t('hq.n'+v)+'</button>').join('')+'</div></div>';
  if(hasMod('d')&&rc(S.weeks)<3)h+='<div style="margin-bottom:10px"><b>'+t('iq.dw')+'</b><div class="chips" style="margin-top:6px">'+[0,1,2,3,4].map(v=>'<button type="button" class="chip" data-a="impq" data-k="dw" data-v="'+v+'" aria-pressed="'+(String(S.iq.dw)===String(v))+'">'+t('hq.d'+v)+'</button>').join('')+'</div></div>';
  return h})()+'<button class="btn sm" data-a="impsend"'+(done?'':' disabled')+'>'+t('im.send')+'</button></div>';
}
const infoHelpItems=()=>'<button class="mi" data-a="go" data-v="info"><span class="ic">ℹ️</span><span style="flex:1"><div class="t">'+t('mn.info')+'</div><div class="d">'+t('mn.infod')+'</div></span></button><button class="mi" data-a="go" data-v="help"><span class="ic">❓</span><span style="flex:1"><div class="t">'+t('mn.help')+'</div><div class="d">'+t('mn.helpd')+'</div></span></button>';
function viewStart(){
 return '<div class="body"><div><h1>'+t('st.t')+'</h1><p class="lead">'+t('st.lead')+'</p></div>'+
'<div class="card"><div class="field" style="max-width:260px"><label class="lbl" for="st-dt">'+t('st.date')+'</label><input id="st-dt" type="date" class="in" data-i="st.dt" min="'+I(add(TODAY,-14))+'" max="'+I(TODAY)+'" value="'+esc(S.st.dt)+'"></div>'+(S.st.bad?'<p class="hint" style="color:var(--bad)">'+t('st.bad')+'</p>':'')+'</div>'+
 '<div class="card flat"><h3>'+t('st.ch')+'</h3><p style="margin:6px 0">'+t('st.cp')+'</p></div>'+
 '<button class="btn block" data-a="startgo">'+t('st.go')+'</button>'+
 '<div class="menu">'+lockedItem('🌙',t('mn.cal'))+((hasMod('d')||hasMod('i'))?lockedItem('📋',t('mn.week')):'')+lockedItem('⏰',t('mn.dev'))+infoHelpItems()+'</div></div>';
}
function viewPause(){
 const c=S.cfg||{},d=c.ret?P(c.ret):TODAY,rr=c.rr||{m:''};
 return '<div class="body"><div><h1>'+t('ps.t')+'</h1></div>'+
 '<div class="card" style="border-color:var(--gold)"><p>'+t('ps.p',MN[d.getMonth()]+' '+d.getFullYear())+'</p><p class="hint" style="margin-top:6px">'+t('ps.rec')+'</p></div>'+
 (S.ckmsg?'<div class="note" style="border-color:var(--gold)">'+t('ck.r.'+S.ckmsg)+'<div style="margin-top:8px"><button class="chip" data-a="ckok">'+t('ck.ok')+'</button></div></div>':'')+
 '<div class="card">'+agForm()+''+bookBox()+''+(rr.m==='parou'?'<button class="chip" data-a="rr" data-v="">'+t('ck.resume')+'</button>':rrOpts(['melhorou','custo','parou','outro']))+'</div>'+
 '<div class="menu">'+infoHelpItems()+'</div></div>';
}
function lateBox(){
 const c=S.cfg;if(!c||c.fase!=='trat'||!c.inicio||pauseInfo()||(c.rr&&c.rr.m==='parou'))return '';
 const st=calStart();let miss=0;for(let i=1;i<=7;i++){const d=add(TODAY,-i);if(d>=st&&!hasNight(I(d)))miss++}
 const okW=!!(S.weeks[I(add(monday(TODAY),-7))]||c.weeks.includes(I(add(monday(TODAY),-7))));
 const wkNeed=(hasMod('d')||hasMod('i'))&&!okW&&diff(add(monday(TODAY),-7),st)>=-6;
 if(!miss&&!wkNeed)return '';
 const k=((diff(TODAY,new Date(2026,0,1,12))%5)+5)%5;
 const l=[];if(miss)l.push(t(miss===1&&!hasNight(I(add(TODAY,-1)))?'lt.n1':'lt.nn',miss));if(wkNeed)l.push(t('lt.w'));
 return '<div class="note" style="border-color:var(--gold)"><b>'+l.join(' ')+'</b><br>'+t('lt.m'+k)+'</div>';
}
function viewMenu(){
 const y=I(add(TODAY,-1)),okN=hasNight(y),miss=nightsMissing();
 const wk=I(add(monday(TODAY),-7)),okW=!!(S.weeks[wk]||(S.cfg&&S.cfg.weeks.includes(wk)));
 const stars=Object.values(S.nights).filter(n=>n.por==='c').length;
 const mi=(a,v,ic,ti,de,badge)=>'<button class="mi" data-a="'+a+'" data-v="'+v+'"><span class="ic">'+ic+'</span><span style="flex:1"><div class="t">'+ti+'</div><div class="d">'+de+'</div></span>'+(badge||'')+'</button>';
 let items=mi('go','cal','🌙',t('mn.cal'),(okN?t('mn.calok'):t('mn.calno')),!miss?sem('g',t('mn.uptodate'),'✓'):sem('r',miss>1?t('mn.missn',miss):t('mn.miss1'),'!'));
 if(hasMod('d')||hasMod('i'))items+=mi('go','week','📋',t('mn.week'),t('mn.weekd',F(add(monday(TODAY),-7)),F(add(monday(TODAY),-1))),okW?sem('g',t('mn.sent'),'✓'):sem('r',t('mn.pend'),'!'));
 const dxc=S.cfg&&S.cfg.fase==='trat'&&S.cfg.dx&&dxFeitos()<S.cfg.dx.n?S.cfg.dx:null;
 if(dxc){const r=dxc.n-dxFeitos();items+=mi('dxfromtrat','','💧',t('mn.dia'),t(r>1?'mn.dian':'mn.dia1',r)+(dxc.prazo?t('mn.until',FY(P(dxc.prazo))):''),sem('r',t('ms.badge',r),'!'))}
 else items+=mi('dxfromtrat','','💧',t('mn.dia'),t('mn.dianone'),sem('g',t('mn.uptodate'),'✓'));
 const mL=monthsList();
 let msItem='';if(mL.length){const k=monthsMissing().length;msItem=mi('go','meses','🗓️',t('ms.mn'),k?t('ms.mnd'):t('ms.done'),k?sem('r',t('ms.badge',k),'!'):sem('g',t('mn.uptodate'),'✓'))}
 items=items.replace('<button class="mi" data-a="go" data-v="week">',msItem+'<button class="mi" data-a="go" data-v="week">');
 if(msItem&&!items.includes('data-v="meses"'))items+=msItem;
 items+=mi('go','info','ℹ️',t('mn.info'),t('mn.infod'))+mi('go','help','❓',t('mn.help'),t('mn.helpd'));
 const fresh=S.cfg&&S.cfg.fase==='trat'&&S.cfg.inicio&&diff(TODAY,P(S.cfg.inicio))<=2&&diff(TODAY,P(S.cfg.inicio))>=0;
 return '<div class="body"><div class="row"><div><h1>'+t('hello')+'</h1><p class="lead">'+DL[TODAY.getDay()]+', '+FY(TODAY)+'</p></div><span class="sp"></span>'+(S.p.adol?'':'<span class="sem n" title="'+t('mn.stars')+'"><i style="background:var(--gold)">★</i>'+stars+' <small>'+t('mn.starsl')+'</small></span>')+'</div>'+
 (fresh?'<div class="note" style="border-color:var(--gold)">'+t('mn.started')+'</div>':'')+retChip()+(()=>{const k=checkCard();return cqCard()+k+(k.includes('data-ck')?'':retCard())+hqCard()+dvCard()+impCard()})()+instCard()+
 (S.p.adol?'<div class="card flat"><label class="chk"><input type="checkbox" data-c="p.share"'+(S.p.share?' checked':'')+'><span><b>'+t('mn.share')+'</b></span></label><p class="hint" style="margin-top:6px">'+t(S.p.share?'mn.shareon':'mn.shareoff')+t('mn.shareend')+'</p></div>':'')+
 '<div class="menu">'+items+'</div>'+(S.p.cas?'<div class="note">'+t('mn.cas')+'</div>':'')+'</div>';
}
function viewCal(){
 const {y,m}=S.cal,start=calStart(),first=new Date(y,m,1,12),nd=new Date(y,m+1,0).getDate(),lead=first.getDay();
 let cells='';for(let i=0;i<lead;i++)cells+='<div></div>';
 for(let dd=1;dd<=nd;dd++){const d=new Date(y,m,dd,12),k=I(d),n=S.nights[k],sv=S.cfg&&S.cfg.nights?S.cfg.nights[k]:null,past=d<=add(TODAY,-1)&&d>=start,isT=I(d)===I(TODAY);
  let sym='',fl='';
  if(!n&&sv){sym=sv.s?'<span style="font-size:17px;line-height:1">'+SYM[sv.s][0]+'</span>':'<span style="font-size:15px;color:var(--good)" title="'+t('cal.filled')+'">✔</span>'}
  else if(n){sym='<span style="font-size:17px;line-height:1">'+SYM[n.s][0]+'</span>';
   {const part=!S.p.adol&&!n.rem;fl='<span class="st '+(part?'wn':'ok')+'">'+(part?'!':'✔')+'</span>'+(n.f.includes('med')?'🔵':'')+(n.f.some(f=>f!=='med')?'🔺':'')}}
  if(!n&&!sv&&past)fl='<span class="st bad">!</span>';
  cells+='<button type="button" class="day'+(past?' hit':' off')+(isT?' today':'')+(past&&!n&&!sv?' miss':'')+'"'+(past?' data-a="night" data-v="'+k+'"':' disabled')+' aria-label="'+DS[d.getDay()]+' '+dd+'"><span style="font-size:10px">'+DS[d.getDay()]+'</span><b>'+dd+'</b><span>'+sym+'</span><span class="fl">'+fl+'</span></button>'}
 const prev=new Date(y,m,1,12)>new Date(start.getFullYear(),start.getMonth(),1,12),next=!(y===TODAY.getFullYear()&&m>=TODAY.getMonth());
 return '<div class="body"><button class="back" data-a="go" data-v="menu">'+t('back')+'</button><div class="row"><button class="chip" data-a="cm" data-v="-1"'+(prev?'':' disabled')+' aria-label="'+t('cal.prev')+'">‹</button><h2 class="sp" style="text-align:center;text-transform:capitalize">'+MN[m]+' '+y+'</h2><button class="chip" data-a="cm" data-v="1"'+(next?'':' disabled')+' aria-label="'+t('cal.next')+'">›</button></div>'+
 '<div class="cal">'+DS.map(x=>'<div class="h">'+x+'</div>').join('')+cells+'</div>'+
 '<div class="card" style="border-color:var(--gold);margin-top:12px"><span class="lbl">🧒 '+t('cal.kid')+'</span><p class="hint" style="margin:2px 0 8px">'+t('cal.kidp')+'</p><div class="legend">'+Object.values(SYM).map(x=>'<span>'+x[0]+' '+t(x[1])+'</span>').join('')+'</div></div>'+
 '<p class="hint" style="margin:10px 2px">'+t('cal.st')+'</p><div class="card flat" style="margin-top:16px;border-top:3px solid var(--line)"><span class="lbl">👨‍👩‍👧 '+t('cal.par')+'</span><div class="legend" style="margin-top:6px"><span>'+t('cal.med')+'</span><span>'+t('cal.diff')+'</span></div></div>'+
 '<div class="card flat"><h3>'+t('cal.tips')+'</h3>'+ul([1,2,3,4].map(i=>t('cal.t'+i)))+'</div></div>';
}
function sheetNight(){
 const k=S.p.sheet.k,d=P(k),n=S.nights[k],dr=S.draft,adol=S.p.adol,step=adol?0:(S.p.sheet.step||1);
 const title='<h2>'+t('nt.title',DS[d.getDay()],F(d))+'</h2>';
 if(!n&&S.p.cas&&S.cfg&&S.cfg.nights&&S.cfg.nights[k])return title+'<p>'+t('nt.other')+'</p><button class="btn block" data-a="sheet" data-v="">'+t('close')+'</button>';
 const chip=(a,k,v,tx,on)=>chipB(a,k,v,tx,on);
 const child='<div class="note" style="border-color:var(--gold)">'+t('nt.child')+'</div><div><span class="lbl">'+t('nt.how')+'</span><div class="big">'+Object.keys(SYM).map(s=>'<button type="button" class="sym" data-a="dr" data-k="s" data-v="'+s+'" aria-pressed="'+(dr.s===s)+'"><b>'+SYM[s][0]+'</b>'+t(SYM[s][1])+'</button>').join('')+'</div></div>'+(adol?'':'<div class="row"><span class="hint">'+t('nt.who')+'</span>'+chip('drp','k','c',t('nt.kid'),dr.por==='c')+chip('drp','k','r',t('nt.guard'),dr.por==='r')+'</div>');
 const par=(adol?'':'<div><span class="lbl">'+t('nt.resp')+'</span><div class="chips">'+[['mae','ob.mae'],['pai','ob.pai'],['outro','ob.outro']].map(x=>chip('dr','who',x[0],t(x[1]),dr.who===x[0])).join('')+'</div></div>')+
  '<div><span class="lbl">'+t('nt.med')+'</span><div class="chips">'+[['sim','nt.yes'],['nao','nt.no'],['na','nt.na']].map(x=>chip('dr','rem',x[0],t(x[1]),dr.rem===x[0])).join('')+'</div></div>'+
  (alarmOn(k)?'<div><span class="lbl">'+t('nt.alarm')+'</span><div class="chips">'+[['t','nt.a1'],['n','nt.a2'],['z','nt.z'],['x','nt.a3']].map(x=>chip('dr','al',x[0],t(x[1]),dr.al===x[0])).join('')+'</div></div>':'')+
  '<div><span class="lbl">'+t('nt.diff')+'<span class="hint">'+t('nt.opt')+'</span></span><div class="chips">'+RAZ.map(r=>'<button type="button" class="chip" data-a="drf" data-v="'+r+'" aria-pressed="'+dr.f.includes(r)+'">'+t('raz.'+r)+'</button>').join('')+'</div></div>'+
  '<div><label class="lbl" for="nx">'+t('no.opt')+'</label><textarea id="nx" class="in" rows="2" data-i="draft.x" placeholder="'+esc(t('no.ph'))+'">'+esc(dr.x||'')+'</textarea><p class="hint" style="margin-top:4px">'+t('no.names')+'</p></div>';
 const cancel='<button class="btn block ghost" data-a="sheet" data-v="">'+t('cancel')+'</button>';
 if(adol)return title+child+par+'<button class="btn block" data-a="savenight"'+(dr.s&&dr.rem?'':' disabled')+'>'+t('save')+'</button>'+cancel;
 if(step===1)return title+'<span class="hint">'+t('nt.step1')+'</span>'+child+'<button class="btn block" data-a="nstep" data-v="2"'+(dr.s?'':' disabled')+'>'+t('nt.cont')+'</button><button class="btn block ghost" data-a="savekid"'+(dr.s?'':' disabled')+'>'+t('nt.kidonly')+'</button>'+cancel;
 return title+'<span class="hint">'+t('nt.step2')+'</span><p class="lead">'+t('nt.draw')+'<b style="font-size:1.1em">'+SYM[dr.s][0]+'</b> '+t(SYM[dr.s][1])+'</p>'+par+'<button class="btn block" data-a="savenight"'+(dr.rem&&dr.who?'':' disabled')+'>'+t('save')+'</button><button class="btn block ghost" data-a="nstep" data-v="1">'+t('nt.back')+'</button>';
}
function viewWeek(){
 const w=S.ws,a=add(monday(TODAY),-7);
 const q=(ti,sub,p,mn,mx)=>'<div class="qrow"><div class="q">'+ti+(sub?'<small>'+sub+'</small>':'')+'</div>'+stepper(p,mn,mx)+'</div>';
 return '<div class="body"><button class="back" data-a="go" data-v="menu">'+t('back')+'</button><div><h2>'+t('wk.title')+'</h2><p class="lead">'+t('wk.lead',F(a),F(add(a,6)))+'</p></div>'+
 '<div class="card">'+(S.p.cas?q(t('wk.dias'),t('wk.diash'),'ws.dias',0,7):'')+
 (hasMod('d')?q(t('wk.av'),t('wk.avh'),'ws.av',0,40)+q(t('wk.sem'),t('wk.semh'),'ws.sem',0,40)+q(t('wk.urg'),'','ws.urg',0,60)+q(t('wk.troca'),'','ws.troca',0,40):'')+
 q(t('wk.regra'),t('wk.regrah'),'ws.regra',0,7)+
 (hasMod('i')?q(t('wk.evac'),'','ws.evac',0,21)+'<div class="qrow"><div class="q">'+t('wk.stool')+'</div></div><div class="chips">'+[1,2,4,6].map(v=>'<button type="button" class="chip" data-a="wb" data-v="'+v+'" aria-pressed="'+(ws_b(v))+'">'+t('wk.s'+v)+'</button>').join('')+'</div>'+q(t('wk.fecal'),'','ws.fecal',0,21):'')+'</div>'+
 '<button class="btn block" data-a="savewk">'+t('wk.send')+'</button></div>';
}
const ws_b=v=>(S.ws.bris===v);
function viewNotes(){
 return '<div class="body"><button class="back" data-a="go" data-v="menu">'+t('back')+'</button><h2>'+t('no.title')+'</h2><div class="card flat"><span class="lbl">'+t('no.q')+'</span><div class="chips" style="margin:6px 0 12px">'+NOTEQ.map(k=>'<button type="button" class="chip" data-a="ntq" data-v="'+k+'" aria-pressed="'+S.ntq.includes(k)+'">'+t('no.c.'+k)+'</button>').join('')+'</div><label class="lbl" for="nt">'+t('no.opt')+'</label><textarea id="nt" class="in" rows="3" data-i="nt" placeholder="'+esc(t('no.ph'))+'">'+esc(S.nt)+'</textarea><p class="hint" style="margin-top:4px">'+t('no.names')+'</p><button class="btn block" style="margin-top:10px" data-a="addnote">'+t('no.save')+'</button></div>'+
 S.notes.map(n=>'<div class="card flat"><div class="hint">'+n[0]+'</div><div>'+esc(n[1])+'</div></div>').join('')+'</div>';
}
const acc=(ic,tt,body,open)=>'<details class="card acc"'+(open?' open':'')+'><summary><span aria-hidden="true">'+ic+'</span><b>'+tt+'</b></summary><div class="accb">'+body+'</div></details>';
const ct=(ic,tt)=>'<h3 class="ct"><span aria-hidden="true">'+ic+'</span>'+tt+'</h3>';
function viewInfo(){
 return '<div class="body"><button class="back" data-a="go" data-v="menu">'+t('back')+'</button><h2>'+t('in.title')+'</h2>'+
 (isTrat()?acc('📅',t('st.ch'),'<p style="margin:6px 0">'+t('st.cp')+'</p>',false):'')+
 acc('🌙',t('in.cal'),ul([1,2,3,4,5,6].map(i=>t('in.c'+i))),true)+
 acc('📝',t('in.dhow'),ul([1,2,3,4,5,6].map(i=>t('in.'+i))),false)+
 acc('💧',t('in.liq'),'<p class="lead" style="margin-top:6px">'+t('in.liqh')+'</p><div style="display:flex;flex-direction:column;gap:8px;margin-top:10px">'+
 [[1,95],[2,80],[3,50],[4,22],[5,3]].map(x=>'<div class="wk" style="grid-template-columns:110px 1fr 74px"><span>'+t('in.l'+x[0])+'</span><i style="width:'+x[1]+'%;background:var(--c-noite)"></i><span>'+t('in.l'+x[0]+'v')+'</span></div>').join('')+'</div>',false)+
 acc('🥤',t('in.hyd'),'<div class="tw"><table class="t" style="margin-top:8px"><tr><th>'+t('in.age')+'</th><th>'+t('in.total')+'</th><th>'+t('in.cups')+'</th></tr>'+[1,2,3].map(i=>'<tr><td>'+t('hy.a'+i)+'</td><td>'+t('hy.a'+i+'t')+'</td><td>'+t('in.cups'+i)+'</td></tr>').join('')+'</table></div><p class="hint" style="margin-top:8px">'+t('in.href')+'</p>',false)+
 acc('🌿',t('in.hab'),ul([1,2,3,4,5,6,7].map(i=>t('in.h'+i))),false)+
 acc('⏰',t('in.wet'),'<p class="lead" style="margin-top:6px">'+t('dv.wst')+'</p>'+ul([1,2,3,4].map(i=>t('dv.ws'+i))),false)+
 acc('⌚',t('in.wobl'),'<p class="lead" style="margin-top:6px">'+t('dv.wbt')+'</p>'+ul([1,2,3,4,5].map(i=>t('dv.wb'+i))),false)+
 contactCard()+'</div>';
}
function sheetsP(){
 const sh=S.p.sheet;if(!sh)return'';let c='';
 const cancel='<button class="btn block ghost" data-a="sheet" data-v="">'+t('cancel')+'</button>';
 if(sh.v==='night')c=sheetNight();
 else if(sh.v==='paper'){const x=S.dxp||(S.dxp={dt:'',bad:false}),mn=I(add(TODAY,-60)),mx=I(add(TODAY,-1));c='<h2>'+t('pp.t')+'</h2><p>'+t('pp.p')+'</p><div class="field"><label class="lbl" for="pd">'+t('pp.d')+'</label><input id="pd" type="date" class="in" min="'+mn+'" max="'+mx+'" data-i="dxp.dt" value="'+esc(x.dt)+'"></div>'+(x.bad?'<div class="note" style="border-color:var(--crit)">'+t('pp.bad')+'</div>':'')+'<button class="btn block" data-a="paperok">'+t('pp.go')+'</button>'+cancel}
 else if(sh.v==='rule')c='<h2>'+t('sh.rule',DL[TODAY.getDay()])+'</h2><p>'+t('sh.rulet')+'</p><label class="chk"><input type="checkbox" data-c="dx.ack"'+(S.dx.ack?' checked':'')+'><span>'+t('sh.rulec')+'</span></label><button class="btn block" data-a="ruleok"'+(S.dx.ack?'':' disabled')+'>'+t('sh.rulego')+'</button><button class="btn block ghost" data-a="sheet" data-v="">'+t('sh.ruleno')+'</button>';
 else if(sh.v==='mic'){const m=S.draft2;c='<h2>'+t('sh.mic')+'</h2><div class="field"><label class="lbl" for="mh">'+t('sh.time')+'</label><input id="mh" type="time" class="in" data-i="draft2.h" value="'+m.h+'"></div><div class="field"><label class="lbl" for="mv">'+t('sh.vol')+'</label><input id="mv" type="number" inputmode="numeric" class="in" data-i="draft2.v" value="'+(m.nm?'':m.v)+'" placeholder="'+t('sh.ex')+'"'+(m.nm?' disabled':'')+'></div><label class="chk"><input type="checkbox" data-c="draft2.nm"'+(m.nm?' checked':'')+'><span>'+t('sh.nm')+'</span></label><div><span class="lbl">'+t('sh.urg')+'</span><div class="chips">'+['ausente','+','++','+++'].map(u=>chipB('d2','u',u,VL(u),m.u===u)).join('')+'</div></div><div><span class="lbl">'+t('sh.leak')+'</span><div class="chips">'+['nenhuma','gotas','roupa íntima','roupa molhada'].map(u=>chipB('d2','p',u,VL(u),m.p===u)).join('')+'</div></div>'+(m.p!=='nenhuma'?'<div><span class="lbl">'+t('sh.pt')+'</span><div class="chips">'+['u','s','e'].map(u=>chipB('d2','pt',u,t('sh.pt.'+u),m.pt===u)).join('')+'</div></div>':'')+'<div class="field"><label class="lbl" for="mo">'+t('sh.obs')+'</label><input id="mo" class="in" data-i="draft2.o" value="'+esc(m.o||'')+'" placeholder="'+esc(t('sh.obsph'))+'"></div><button class="btn block" data-a="savemic">'+t('save')+'</button>'+cancel}
 else if(sh.v==='liq'){const m=S.draft3;c='<h2>'+t('sh.liq')+'</h2><div class="field"><label class="lbl" for="lh">'+t('sh.timeo')+'</label><input id="lh" type="time" class="in" data-i="draft3.h" value="'+m.h+'"></div><div><span class="lbl">'+t('sh.drank')+'</span><div class="chips">'+['Água','Suco','Leite','Refrigerante','Outro'].map(x=>'<button type="button" class="chip" data-a="d3t" data-v="'+x+'" aria-pressed="'+(m.t===x)+'">'+VL(x)+'</button>').join('')+'</div></div><div><span class="lbl">'+t('sh.qty')+'</span><div class="chips">'+[100,200,300,500].map(v=>'<button type="button" class="chip" data-a="d3" data-v="'+v+'" aria-pressed="'+(m.v===v&&!m.vv)+'">'+v+'</button>').join('')+'</div></div><div class="field"><label class="lbl" for="lv">'+t('sh.qtyt')+'</label><input id="lv" type="number" inputmode="numeric" class="in" data-i="draft3.vv" value="'+esc(m.vv||'')+'"></div><button class="btn block" data-a="saveliq">'+t('save')+'</button>'+cancel}
 else if(sh.v==='sair')c='<h2>'+t('sh.out')+'</h2><p>'+t('sh.outt')+(S.outbox.length?t('sh.outl',S.outbox.length):'')+t('sh.outr')+'</p><button class="btn block" data-a="sairok">'+t('sh.outb')+'</button>'+cancel;
 else if(sh.v==='fim'){const f=S.dx.fim;
  c='<h2>'+t('sh.fim')+'</h2><div><span class="lbl">'+t('sh.fimq')+'</span><div class="chips">'+[['nao','sh.fimn'],['sim','sh.fims']].map(x=>chipB('fim','k',x[0],t(x[1]),f.q===x[0])).join('')+'</div></div>'+
  (dxNight()?'<div class="note">'+t('sh.fimnote')+'</div><div class="field"><label class="lbl" for="fg">'+t('sh.fg')+'</label><input id="fg" type="number" inputmode="numeric" class="in" data-i="dx.fim.g" value="'+esc(f.g)+'"></div><div class="field"><label class="lbl" for="fm">'+t('sh.fm')+'</label><input id="fm" type="number" inputmode="numeric" class="in" data-i="dx.fim.m" value="'+esc(f.m)+'"></div>':(hasMod('n')?'<div class="note">'+t('sh.fimfu')+'</div>':''))+
  '<button class="btn block" data-a="fimok"'+(f.q?'':' disabled')+'>'+t('sh.fimok')+'</button><button class="btn block ghost" data-a="sheet" data-v="">'+t('goback')+'</button>'}
 return '<div class="sheetbg" data-a="sheetbg"><div class="sheet" role="dialog" aria-modal="true">'+c+'</div></div>';
}
function viewPais(){
 let b;const sc=S.p.screen,enc=S.cfg&&S.cfg.status==='encerrado';
 if(sc==='onb')b=viewOnb();else if(sc==='wait')b='<div class="body"><h1>'+t(enc?'wait.enc':'wait.rec')+'</h1><p class="lead">'+t(enc?'wait.enct':'wait.rect')+'</p><button class="btn block" data-a="refresh">'+(S.busy?t('wait.busy'):t('wait.btn'))+'</button></div>';
 else if(sc==='dx')b=viewDx();else if(sc==='start')b=viewStart();else if(sc==='hist')b=viewHist();else if(sc==='pause')b=viewPause();else if(sc==='diary')b=viewDiary();else if(sc==='menu')b=viewMenu();else if(sc==='cal')b=viewCal();else if(sc==='meses')b=viewMeses();else if(sc==='dvss')b=viewDvss();else if(sc==='week')b=viewWeek();else if(sc==='notes')b=viewNotes();else if(sc==='info')b=viewInfo();else if(sc==='help')b=viewHelpP();else if(sc==='load')b='<div class="body"><p class="lead">'+t('loading')+'</p></div>';else if(sc==='dev')b=viewDev();else if(sc==='inst')b=viewInst();
 return '<div class="phone">'+hdrP()+b+footP()+sheetsP()+'</div>';
}

/* ----- ícone na tela inicial ----- */
const isStandalone=()=>{try{return (window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone===true}catch(e){return false}};
const isIOS=()=>/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const iosWebview=()=>isIOS()&&!/Safari\//.test(navigator.userAgent);
function instNeeded(){return !isStandalone()&&S.p.inst!=='ok'&&canStore}
function instCard(){
 const c=S.cfg;if(!c||!instNeeded()||pauseInfo()||needStart()||c.status==='pendente')return '';
 if(S.p.inst&&diff(TODAY,P(S.p.inst))<3)return '';
 return '<div class="card" style="border-color:var(--gold)"><p class="hint" style="margin:0 0 10px;color:var(--ink)">'+t('in.card')+'</p><div class="row"><button class="btn sm" data-a="go" data-v="inst">'+t('in.how')+'</button><button class="btn sm ghost" data-a="instlater">'+t('in.later')+'</button></div></div>'
}
function viewInst(){
 const pl=S.instpl||(isIOS()?'ios':'and'),ol=a=>'<ol style="margin:10px 0 0;padding-left:22px;display:flex;flex-direction:column;gap:10px">'+a.map(x=>'<li>'+x+'</li>').join('')+'</ol>';
 return '<div class="body">'+(S.p.inst?'<button class="back" data-a="go" data-v="menu">'+t('back')+'</button>':'')+'<div><h1>'+t('in.t')+'</h1><p class="lead">'+t('in.lead')+'</p></div>'+
 '<div class="chips">'+[['ios','in.ios'],['and','in.and']].map(x=>'<button type="button" class="chip" data-a="instpl" data-v="'+x[0]+'" aria-pressed="'+(pl===x[0])+'">'+t(x[1])+'</button>').join('')+'</div>'+
 (pl==='ios'&&iosWebview()?'<div class="note" style="border-color:var(--gold)">'+t('in.web')+'</div>':'')+
 '<div class="card">'+(pl==='ios'?ol([1,2,3,4].map(i=>t('in.i'+i))):ol([1,2,3,4].map(i=>t('in.a'+i))))+(pl==='and'&&window._ip?'<button class="btn block" style="margin-top:14px" data-a="instnow">'+t('in.now')+'</button>':'')+'</div>'+
 '<div class="note">'+t('in.last')+'</div>'+
 '<button class="btn block" data-a="instdone">'+t('in.done')+'</button><button class="btn block ghost" data-a="instlater">'+t('in.later')+'</button></div>'
}
function viewHelpP(){
 return '<div class="body"><button class="back" data-a="go" data-v="menu">'+t('back')+'</button><h2>'+t('hp.title')+'</h2>'+
 acc('💡',t('hp.why'),'<p class="lead" style="margin-top:6px">'+t('hp.whyt')+'</p>',true)+
 acc('👣',t('hp.steps'),ul([1,2,3,4].map(i=>t('hp.s'+i))),false)+
 (instNeeded()?acc('📲',t('in.t'),'<button class="btn block ghost" style="margin-top:10px" data-a="go" data-v="inst">'+t('in.how')+'</button>',false):'')+
 acc('📱',t('hp.dev'),'<p class="lead" style="margin-top:6px">'+t('hp.devt',esc(S.code||''))+'</p><button class="btn block ghost" style="margin-top:10px" data-a="sheet" data-v="sair">'+t('sh.outb')+'</button>',false)+
 acc('❓',t('hp.faq'),ul([1,2,3,4,5,6].map(i=>t('hp.f'+i))),false)+
 acc('🛠️',t('fb.t'),'<p class="hint" style="margin:4px 0 8px">'+t('fb.h')+'</p><textarea id="fb" class="in" rows="3" data-i="fb" placeholder="'+esc(t('fb.ph'))+'">'+esc(S.fb||'')+'</textarea><button class="btn block ghost" style="margin-top:10px" data-a="fbsend">'+t('fb.go')+'</button>',false)+
 contactCard()+'</div>';
}
function contactCard(){return '<div class="card">'+ct('💬',t('ct.t'))+'<div class="row wrap" style="margin-top:10px">'+waBtn()+agBtn()+'<a class="btn sm ghost" href="'+IG_URL+'" target="_blank" rel="noopener">'+t('ct.ig')+'</a></div></div>'}
function devCards(){
 return '<div class="card">'+ct('⏰',t('in.wet'))+'<p class="lead" style="margin-top:6px">'+t('dv.wst')+'</p>'+ul([1,2,3,4].map(i=>t('dv.ws'+i)))+'</div>'+
 '<div class="card">'+ct('⌚',t('in.wobl'))+'<p class="lead" style="margin-top:6px">'+t('dv.wbt')+'</p>'+ul([1,2,3,4,5].map(i=>t('dv.wb'+i)))+'</div>';
}
function viewDev(){
 return '<div class="body"><button class="back" data-a="go" data-v="menu">'+t('back')+'</button><h2>'+t('dv.title')+'</h2>'+
 '<div class="card"><h3>'+t('dv.ws')+'</h3><p class="lead" style="margin-top:6px">'+t('dv.wst')+'</p>'+ul([1,2,3,4].map(i=>t('dv.ws'+i)))+'</div>'+
 '<div class="card"><h3>'+t('dv.wb')+'</h3><p class="lead" style="margin-top:6px">'+t('dv.wbt')+'</p>'+ul([1,2,3,4,5].map(i=>t('dv.wb'+i)))+'</div></div>';
}
