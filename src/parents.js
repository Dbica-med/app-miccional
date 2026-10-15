/* ===== app dos pais ===== */
const SYM={seca:['☀️','sym.seca'],umida:['<span style="font-size:1.35em">☁️</span>','sym.umida'],pouco:['☀️<span style="font-size:.55em">☁️</span>','sym.pouco'],acordou:['🌙','sym.acordou']};
const RAZ=['liquido','tarde','viagem','ar','estresse','doenca','outro'];
const norm=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^A-Za-z0-9]/g,'').toUpperCase();
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
 const st=S.token?(n?'<span class="sem y"><i aria-hidden="true">…</i>'+t(n>1?'f.sendn':'f.send1',n)+'</span>':'<span class="sem g"><i aria-hidden="true">✓</i>'+t('f.sent')+'</span>'):'';
 return '<div class="foot">'+(st?'<div style="margin-bottom:8px">'+st+'</div>':'')+(S.authBad?'<div class="note" style="margin-bottom:8px">'+t('f.auth')+'</div>':'')+t('f.brand')+' · <a href="https://www.instagram.com/dr.domingosbica" target="_blank" rel="noopener">@dr.domingosbica</a><br><span style="opacity:.8">'+t('f.ver')+' '+APP_V+'</span></div>'}
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
 '<div class="card flat"><h3>'+t('ob.term')+'</h3><div class="term" style="margin-top:8px">'+[1,2,3,4,5,6].map(i=>'<p>'+t('ob.t'+i)+'</p>').join('')+'<p class="hint">'+t('ob.tv')+TERMO_V+'</p></div>'+
 '<label class="chk" style="margin-top:12px"><input type="checkbox" data-c="ob.termo"'+(o.termo?' checked':'')+'><span>'+t('ob.agree')+'</span></label>'+
 (o.papel==='adol'?'<label class="chk" style="margin-top:8px"><input type="checkbox" data-c="ob.assent"'+(o.assent?' checked':'')+'><span>'+t('ob.assent')+'</span></label><p class="hint" style="margin-top:6px">'+t('ob.assenth')+'</p>':'')+'</div>'+
 (o.err?'<div class="note" style="border-color:var(--crit)">'+esc(o.err)+'</div>':'')+'<button type="button" class="btn block" id="ob-go" data-a="obgo"'+(obValid()&&!o.busy?'':' disabled')+'>'+(o.busy?t('ob.busy'):t('ob.go'))+'</button></div>';
}
/* ----- fase de avaliação: tela inicial de quem ainda está em investigação ----- */
const dxFeitos=()=>((S.cfg&&S.cfg.dx?S.cfg.dx.feitos:0)+S.outbox.filter(e=>e.a==='fim').length);
function lockedItem(ic,title){return '<div class="mi locked" aria-disabled="true"><span class="ic">'+ic+'</span><span style="flex:1"><div class="t">'+title+'</div><div class="d">'+t('dx.soon')+'</div></span><span class="lock" aria-hidden="true">🔒</span></div>'}
function viewDx(){
 const d=Object.assign({},S.cfg&&S.cfg.dx||{n:0,tipo:'inicial',prazo:''}),n=d.n,fe=dxFeitos(),done=n>0&&fe>=n,us=(S.cfg&&S.cfg.us)||{p:false,f:''};
 const seg=d.tipo==='seguimento',nightDx=!seg&&hasMod('n');
 let h='<div class="body"><div><h1>'+t('hello')+'</h1><p class="lead">'+DL[TODAY.getDay()]+', '+FY(TODAY)+'</p></div>'+
 '<div class="card"><span class="sem y"><i aria-hidden="true">🔎</i>'+(seg?t('dx.title2'):t('dx.phase'))+'</span><p class="lead" style="margin-top:10px">'+t('dx.intro')+'</p></div>';
 h+='<div class="card"><h3>1 · '+t('dx.diaries')+'</h3><p class="lead" style="margin-top:6px">'+t(n===1?'dx.asked1':'dx.askedn',n)+(d.prazo?' '+t('dx.by',FY(P(d.prazo))):'')+'</p>'+(nightDx?'<p class="hint" style="margin-top:4px">'+t('dx.fr1')+'</p>':'')+
 '<div class="row wrap" style="gap:8px;margin-top:10px">'+Array.from({length:n},(_,i)=>sem(i<fe?'g':(i===fe&&S.dx.ativo?'y':'n'),t('dx.diary',i+1),i<fe?'✓':(i===fe&&S.dx.ativo?'…':'·'))).join('')+'</div>'+
 (done?'<p style="margin-top:12px">'+t('dx.done')+'</p>':'<p class="lead" style="margin-top:12px">'+t('dx.next',F(nextSat()))+'</p><button type="button" class="btn block" style="margin-top:12px" data-a="dxstart">'+(S.dx.ativo?t('dx.cont'):t('dx.start'))+'</button>')+'</div>';
 if(us.p)h+='<div class="card"><h3>2 · '+t('dx.us')+'</h3>'+(us.f?'<p class="lead" style="margin-top:6px">'+t('dx.usdone',FY(P(us.f)))+'</p>':'<p class="lead" style="margin-top:6px">'+t('dx.usask')+'</p><button type="button" class="btn block ghost" style="margin-top:10px" data-a="usdone">'+t('dx.usbtn')+'</button>')+'</div>';
 h+='<div class="card flat"><h3>'+t('dx.how')+'</h3><ol style="margin:8px 0 0;padding-left:20px;color:var(--ink2);font-size:14px;display:flex;flex-direction:column;gap:6px">'+['dx.h1','dx.h2','dx.h3','dx.h4','dx.h5','dx.h6'].map(k=>'<li>'+t(k)+'</li>').join('')+'<li>'+t(nightDx?'dx.h7a':'dx.h7b')+'</li></ol></div>';
 h+='<div class="menu">'+lockedItem('🌙',t('mn.cal'))+((hasMod('d')||hasMod('i'))?lockedItem('📋',t('mn.week')):'')+lockedItem('⏰',t('mn.dev'))+
  '<button class="mi" data-a="go" data-v="info"><span class="ic">ℹ️</span><span style="flex:1"><div class="t">'+t('mn.info')+'</div><div class="d">'+t('mn.infod')+'</div></span></button>'+
  '<button class="mi" data-a="go" data-v="help"><span class="ic">❓</span><span style="flex:1"><div class="t">'+t('mn.help')+'</div><div class="d">'+t('mn.helpd')+'</div></span></button></div>';
 h+='<div class="note">'+t('dx.n1')+'</div><div class="note">'+t('dx.n2')+'</div></div>';
 return h;
}
function viewDiary(){
 const d=S.dx,mic=d.mic.slice().sort((a,b)=>a[0]<b[0]?-1:1),tot=mic.reduce((s,x)=>s+(x[1]||0),0),liq=d.liq.reduce((s,x)=>s+x[1],0);
 return '<div class="body"><button class="back" data-a="go" data-v="dx">'+t('back')+'</button><div><h2>'+t('dy.title',dxFeitos()+1,(S.cfg&&S.cfg.dx&&S.cfg.dx.n)||1)+'</h2><p class="lead">'+DL[TODAY.getDay()]+', '+FY(TODAY)+'</p></div>'+
 '<div class="note">'+t('dy.rem')+'</div><button class="btn block" data-a="sheet" data-v="mic">'+t('dy.addmic')+'</button><button class="btn block ghost" data-a="sheet" data-v="liq">'+t('dy.addliq')+'</button>'+
 '<div class="card"><div class="row"><h3>'+t('dy.today')+'</h3><span class="sp"></span><span class="hint">'+mic.length+' '+t(mic.length===1?'dy.m1':'dy.mn')+' · '+tot+' mL · '+t('dy.liq')+' '+liq+' mL</span></div>'+
 (mic.length?'<div class="tw"><table class="t" style="margin-top:6px"><tr><th>'+t('dy.hour')+'</th><th>mL</th><th>'+t('dy.urg')+'</th><th>'+t('dy.loss')+'</th><th>'+t('dy.obs')+'</th></tr>'+mic.map(x=>'<tr><td>'+x[0]+'</td><td>'+(x[1]||t('dy.nm'))+'</td><td>'+VL(x[2])+'</td><td>'+VL(x[3])+'</td><td>'+esc(x[4]||'')+'</td></tr>').join('')+'</table></div>':'<p class="hint" style="margin-top:8px">'+t('dy.none')+'</p>')+'</div>'+
 (d.liq.length?'<div class="card"><h3>'+t('dy.liqt')+'</h3><div class="tw"><table class="t" style="margin-top:6px"><tr><th>'+t('dy.hour')+'</th><th>'+t('dy.what')+'</th><th>mL</th></tr>'+d.liq.map(x=>'<tr><td>'+(x[0]||'—')+'</td><td>'+esc(VL(x[2]||''))+'</td><td>'+x[1]+'</td></tr>').join('')+'</table></div></div>':'')+'<button class="btn block gold" data-a="sheet" data-v="fim"'+(mic.length?'':' disabled')+'>'+t('dy.end')+'</button></div>';
}
/* ----- tratamento ----- */
const hasNight=k=>!!(S.nights[k]||(S.cfg&&S.cfg.nights&&S.cfg.nights[k]));
const alarmOn=k=>!!(S.cfg&&S.cfg.alarme&&S.cfg.alarme<=k);
const calStart=()=>S.cfg&&S.cfg.inicio?P(S.cfg.inicio):add(TODAY,-75);
function nightsMissing(){let m=0;for(let i=1;i<=7;i++)if(!hasNight(I(add(TODAY,-i))))m++;return m}
function viewMenu(){
 const y=I(add(TODAY,-1)),okN=hasNight(y),miss=nightsMissing();
 const wk=I(add(monday(TODAY),-7)),okW=!!(S.weeks[wk]||(S.cfg&&S.cfg.weeks.includes(wk)));
 const stars=Object.values(S.nights).filter(n=>n.por==='c').length;
 const mi=(a,v,ic,ti,de,badge)=>'<button class="mi" data-a="'+a+'" data-v="'+v+'"><span class="ic">'+ic+'</span><span style="flex:1"><div class="t">'+ti+'</div><div class="d">'+de+'</div></span>'+(badge||'')+'</button>';
 let items=mi('go','cal','🌙',t('mn.cal'),(okN?t('mn.calok'):t('mn.calno'))+(miss&&okN?t('mn.miss',miss):''),okN?sem('g',t('mn.uptodate'),'✓'):sem('r',miss>1?t('mn.missn',miss):t('mn.miss1'),'!'));
 if(hasMod('d')||hasMod('i'))items+=mi('go','week','📋',t('mn.week'),t('mn.weekd',F(add(monday(TODAY),-7)),F(add(monday(TODAY),-1))),okW?sem('g',t('mn.sent'),'✓'):sem('r',t('mn.pend'),'!'));
 const dxc=S.cfg&&S.cfg.fase==='trat'&&S.cfg.dx&&dxFeitos()<S.cfg.dx.n?S.cfg.dx:null;
 if(dxc){const r=dxc.n-dxFeitos();items+=mi('dxfromtrat','','💧',t('mn.dia'),t(r>1?'mn.dian':'mn.dia1',r)+(dxc.prazo?t('mn.until',FY(P(dxc.prazo))):''),sem('y',t('mn.asked'),'…'))}
 items+=mi('go','notes','✍️',t('mn.notes'),t('mn.notesd'))+mi('go','info','ℹ️',t('mn.info'),t('mn.infod'))+mi('go','dev','⏰',t('mn.dev'),t('mn.devd'))+mi('go','help','❓',t('mn.help'),t('mn.helpd'));
 const fresh=S.cfg&&S.cfg.fase==='trat'&&S.cfg.inicio&&diff(TODAY,P(S.cfg.inicio))<=2&&diff(TODAY,P(S.cfg.inicio))>=0;
 return '<div class="body"><div class="row"><div><h1>'+t('hello')+'</h1><p class="lead">'+DL[TODAY.getDay()]+', '+FY(TODAY)+'</p></div><span class="sp"></span>'+(S.p.adol?'':'<span class="sem n" title="'+t('mn.stars')+'"><i style="background:var(--gold)">★</i>'+stars+'</span>')+'</div>'+
 (fresh?'<div class="note" style="border-color:var(--gold)">'+t('mn.started')+'</div>':'')+
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
   {fl=(n.f.includes('med')?'🔵':'')+(n.f.some(f=>f!=='med')?'🔺':'')}}
  cells+='<button type="button" class="day'+(past?' hit':' off')+(isT?' today':'')+(past&&!n&&!sv?' miss':'')+'"'+(past?' data-a="night" data-v="'+k+'"':' disabled')+' aria-label="'+DS[d.getDay()]+' '+dd+'"><span style="font-size:10px">'+DS[d.getDay()]+'</span><b>'+dd+'</b><span>'+sym+'</span><span class="fl">'+fl+'</span></button>'}
 const prev=new Date(y,m,1,12)>new Date(start.getFullYear(),start.getMonth(),1,12),next=!(y===TODAY.getFullYear()&&m>=TODAY.getMonth());
 return '<div class="body"><button class="back" data-a="go" data-v="menu">'+t('back')+'</button><div class="row"><button class="chip" data-a="cm" data-v="-1"'+(prev?'':' disabled')+' aria-label="'+t('cal.prev')+'">‹</button><h2 class="sp" style="text-align:center;text-transform:capitalize">'+MN[m]+' '+y+'</h2><button class="chip" data-a="cm" data-v="1"'+(next?'':' disabled')+' aria-label="'+t('cal.next')+'">›</button></div>'+
 '<div class="cal">'+DS.map(x=>'<div class="h">'+x+'</div>').join('')+cells+'</div>'+
 '<div class="card flat"><span class="lbl">'+t('cal.child')+'</span><div class="legend">'+Object.values(SYM).map(x=>'<span>'+x[0]+' '+t(x[1])+'</span>').join('')+'</div><span class="lbl" style="margin-top:12px">'+t('cal.par')+'</span><div class="legend"><span>'+t('cal.med')+'</span><span>'+t('cal.diff')+'</span></div></div></div>';
}
function sheetNight(){
 const k=S.p.sheet.k,d=P(k),n=S.nights[k],dr=S.draft,adol=S.p.adol,step=adol?0:(S.p.sheet.step||1);
 const title='<h2>'+t('nt.title',DS[d.getDay()],F(d))+'</h2>';
 if(!n&&S.p.cas&&S.cfg&&S.cfg.nights&&S.cfg.nights[k])return title+'<p>'+t('nt.other')+'</p><button class="btn block" data-a="sheet" data-v="">'+t('close')+'</button>';
 const chip=(a,k,v,tx,on)=>chipB(a,k,v,tx,on);
 const child='<div class="note" style="border-color:var(--gold)">'+t('nt.child')+'</div><div><span class="lbl">'+t('nt.how')+'</span><div class="big">'+Object.keys(SYM).map(s=>'<button type="button" class="sym" data-a="dr" data-k="s" data-v="'+s+'" aria-pressed="'+(dr.s===s)+'"><b>'+SYM[s][0]+'</b>'+t(SYM[s][1])+'</button>').join('')+'</div></div>'+(adol?'':'<div class="row"><span class="hint">'+t('nt.who')+'</span>'+chip('drp','k','c',t('nt.kid'),dr.por==='c')+chip('drp','k','r',t('nt.guard'),dr.por==='r')+'</div>');
 const par=(adol?'':'<div><span class="lbl">'+t('nt.resp')+'</span><div class="chips">'+[['mae','ob.mae'],['pai','ob.pai'],['outro','ob.outro']].map(x=>chip('dr','who',x[0],t(x[1]),dr.who===x[0])).join('')+'</div></div>')+
  '<div><span class="lbl">'+t('nt.med')+'</span><div class="chips">'+[['sim','nt.yes'],['nao','nt.no'],['na','nt.na']].map(x=>chip('dr','rem',x[0],t(x[1]),dr.rem===x[0])).join('')+'</div></div>'+
  (alarmOn(k)?'<div><span class="lbl">'+t('nt.alarm')+'</span><div class="chips">'+[['t','nt.a1'],['n','nt.a2'],['x','nt.a3']].map(x=>chip('dr','al',x[0],t(x[1]),dr.al===x[0])).join('')+'</div></div>':'')+
  '<div><span class="lbl">'+t('nt.diff')+'<span class="hint">'+t('nt.opt')+'</span></span><div class="chips">'+RAZ.map(r=>'<button type="button" class="chip" data-a="drf" data-v="'+r+'" aria-pressed="'+dr.f.includes(r)+'">'+t('raz.'+r)+'</button>').join('')+'</div></div>';
 const cancel='<button class="btn block ghost" data-a="sheet" data-v="">'+t('cancel')+'</button>';
 if(adol)return title+child+par+'<button class="btn block" data-a="savenight"'+(dr.s&&dr.rem?'':' disabled')+'>'+t('save')+'</button>'+cancel;
 if(step===1)return title+'<span class="hint">'+t('nt.step1')+'</span>'+child+'<button class="btn block" data-a="nstep" data-v="2"'+(dr.s?'':' disabled')+'>'+t('nt.cont')+'</button>'+cancel;
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
 return '<div class="body"><button class="back" data-a="go" data-v="menu">'+t('back')+'</button><h2>'+t('no.title')+'</h2><div class="card flat"><label class="lbl" for="nt">'+t('no.new')+'</label><textarea id="nt" class="in" rows="3" data-i="nt" placeholder="'+esc(t('no.ph'))+'">'+esc(S.nt)+'</textarea><p class="hint" style="margin-top:4px">'+t('no.names')+'</p><button class="btn block" style="margin-top:10px" data-a="addnote">'+t('no.save')+'</button></div>'+
 S.notes.map(n=>'<div class="card flat"><div class="hint">'+n[0]+'</div><div>'+esc(n[1])+'</div></div>').join('')+'</div>';
}
function viewInfo(){
 return '<div class="body"><button class="back" data-a="go" data-v="menu">'+t('back')+'</button><h2>'+t('in.title')+'</h2><div class="note">'+t('in.note')+'</div>'+
 '<div class="card"><h3>'+t('in.how')+'</h3>'+ul([1,2,3,4,5,6].map(i=>t('in.'+i)))+'</div>'+
 '<div class="card"><h3>'+t('in.other')+'</h3>'+ul([t('in.o1'),t('in.o2')])+'</div>'+
 '<div class="card"><h3>'+t('in.liq')+'</h3><p class="lead" style="margin-top:6px">'+t('in.liqh')+'</p><div style="display:flex;flex-direction:column;gap:8px;margin-top:10px">'+
 [[1,95],[2,80],[3,50],[4,22],[5,3]].map(x=>'<div class="wk" style="grid-template-columns:110px 1fr 74px"><span>'+t('in.l'+x[0])+'</span><i style="width:'+x[1]+'%;background:var(--c-noite)"></i><span>'+t('in.l'+x[0]+'v')+'</span></div>').join('')+'</div></div>'+
 '<div class="card"><h3>'+t('in.hyd')+'</h3><div class="tw"><table class="t" style="margin-top:8px"><tr><th>'+t('in.age')+'</th><th>'+t('in.total')+'</th><th>'+t('in.cups')+'</th></tr>'+[1,2,3].map(i=>'<tr><td>'+t('in.a'+i)+'</td><td>'+t('in.a'+i+'t')+'</td><td>'+t('in.cups'+i)+'</td></tr>').join('')+'</table></div><p class="hint" style="margin-top:8px">'+t('in.href')+'</p></div>'+
 '<div class="card"><h3>'+t('in.hab')+'</h3>'+ul([1,2,3,4].map(i=>t('in.h'+i)))+'</div></div>';
}
/* ----- sheets (janelas inferiores) ----- */
function sheetsP(){
 const sh=S.p.sheet;if(!sh)return'';let c='';
 const cancel='<button class="btn block ghost" data-a="sheet" data-v="">'+t('cancel')+'</button>';
 if(sh.v==='night')c=sheetNight();
 else if(sh.v==='rule')c='<h2>'+t('sh.rule',DL[TODAY.getDay()])+'</h2><p>'+t('sh.rulet')+'</p><label class="chk"><input type="checkbox" data-c="dx.ack"'+(S.dx.ack?' checked':'')+'><span>'+t('sh.rulec')+'</span></label><button class="btn block" data-a="ruleok"'+(S.dx.ack?'':' disabled')+'>'+t('sh.rulego')+'</button><button class="btn block ghost" data-a="sheet" data-v="">'+t('sh.ruleno')+'</button>';
 else if(sh.v==='mic'){const m=S.draft2;c='<h2>'+t('sh.mic')+'</h2><div class="field"><label class="lbl" for="mh">'+t('sh.time')+'</label><input id="mh" type="time" class="in" data-i="draft2.h" value="'+m.h+'"></div><div class="field"><label class="lbl" for="mv">'+t('sh.vol')+'</label><input id="mv" type="number" inputmode="numeric" class="in" data-i="draft2.v" value="'+(m.nm?'':m.v)+'" placeholder="'+t('sh.ex')+'"'+(m.nm?' disabled':'')+'></div><label class="chk"><input type="checkbox" data-c="draft2.nm"'+(m.nm?' checked':'')+'><span>'+t('sh.nm')+'</span></label><div><span class="lbl">'+t('sh.urg')+'</span><div class="chips">'+['ausente','+','++','+++'].map(u=>chipB('d2','u',u,VL(u),m.u===u)).join('')+'</div></div><div><span class="lbl">'+t('sh.leak')+'</span><div class="chips">'+['nenhuma','gotas','roupa íntima','roupa molhada'].map(u=>chipB('d2','p',u,VL(u),m.p===u)).join('')+'</div></div><div class="field"><label class="lbl" for="mo">'+t('sh.obs')+'</label><input id="mo" class="in" data-i="draft2.o" value="'+esc(m.o||'')+'" placeholder="'+esc(t('sh.obsph'))+'"></div><button class="btn block" data-a="savemic">'+t('save')+'</button>'+cancel}
 else if(sh.v==='liq'){const m=S.draft3;c='<h2>'+t('sh.liq')+'</h2><div class="field"><label class="lbl" for="lh">'+t('sh.timeo')+'</label><input id="lh" type="time" class="in" data-i="draft3.h" value="'+m.h+'"></div><div><span class="lbl">'+t('sh.drank')+'</span><div class="chips">'+['Água','Suco','Leite','Refrigerante','Outro'].map(x=>'<button type="button" class="chip" data-a="d3t" data-v="'+x+'" aria-pressed="'+(m.t===x)+'">'+VL(x)+'</button>').join('')+'</div></div><div><span class="lbl">'+t('sh.qty')+'</span><div class="chips">'+[100,200,300,500].map(v=>'<button type="button" class="chip" data-a="d3" data-v="'+v+'" aria-pressed="'+(m.v===v&&!m.vv)+'">'+v+'</button>').join('')+'</div></div><div class="field"><label class="lbl" for="lv">'+t('sh.qtyt')+'</label><input id="lv" type="number" inputmode="numeric" class="in" data-i="draft3.vv" value="'+esc(m.vv||'')+'"></div><button class="btn block" data-a="saveliq">'+t('save')+'</button>'+cancel}
 else if(sh.v==='sair')c='<h2>'+t('sh.out')+'</h2><p>'+t('sh.outt')+(S.outbox.length?t('sh.outl',S.outbox.length):'')+t('sh.outr')+'</p><button class="btn block" data-a="sairok">'+t('sh.outb')+'</button>'+cancel;
 else if(sh.v==='fim'){const f=S.dx.fim;
  c='<h2>'+t('sh.fim')+'</h2><div><span class="lbl">'+t('sh.fimq')+'</span><div class="chips">'+[['nao','sh.fimn'],['sim','sh.fims']].map(x=>chipB('fim','k',x[0],t(x[1]),f.q===x[0])).join('')+'</div></div>'+
  (S.dx.tipo==='inicial'&&hasMod('n')?'<div class="note">'+t('sh.fimnote')+'</div><div class="field"><label class="lbl" for="fg">'+t('sh.fg')+'</label><input id="fg" type="number" inputmode="numeric" class="in" data-i="dx.fim.g" value="'+esc(f.g)+'"></div><div class="field"><label class="lbl" for="fm">'+t('sh.fm')+'</label><input id="fm" type="number" inputmode="numeric" class="in" data-i="dx.fim.m" value="'+esc(f.m)+'"></div>':(hasMod('n')?'<div class="note">'+t('sh.fimfu')+'</div>':''))+
  '<button class="btn block" data-a="fimok"'+(f.q?'':' disabled')+'>'+t('sh.fimok')+'</button><button class="btn block ghost" data-a="sheet" data-v="">'+t('goback')+'</button>'}
 return '<div class="sheetbg" data-a="sheetbg"><div class="sheet" role="dialog" aria-modal="true">'+c+'</div></div>';
}
function viewPais(){
 let b;const sc=S.p.screen,enc=S.cfg&&S.cfg.status==='encerrado';
 if(sc==='onb')b=viewOnb();else if(sc==='wait')b='<div class="body"><h1>'+t(enc?'wait.enc':'wait.rec')+'</h1><p class="lead">'+t(enc?'wait.enct':'wait.rect')+'</p><button class="btn block" data-a="refresh">'+(S.busy?t('wait.busy'):t('wait.btn'))+'</button></div>';
 else if(sc==='dx')b=viewDx();else if(sc==='diary')b=viewDiary();else if(sc==='menu')b=viewMenu();else if(sc==='cal')b=viewCal();else if(sc==='week')b=viewWeek();else if(sc==='notes')b=viewNotes();else if(sc==='info')b=viewInfo();else if(sc==='help')b=viewHelpP();else if(sc==='load')b='<div class="body"><p class="lead">'+t('loading')+'</p></div>';else if(sc==='dev')b=viewDev();
 return '<div class="phone">'+hdrP()+b+footP()+sheetsP()+'</div>';
}
function viewHelpP(){
 return '<div class="body"><button class="back" data-a="go" data-v="menu">'+t('back')+'</button><h2>'+t('hp.title')+'</h2>'+
 '<div class="card"><h3>'+t('hp.why')+'</h3><p class="lead" style="margin-top:6px">'+t('hp.whyt')+'</p></div>'+
 '<div class="card"><h3>'+t('hp.steps')+'</h3>'+ul([1,2,3,4].map(i=>t('hp.s'+i)))+'</div>'+
 '<div class="card"><h3>'+t('hp.dev')+'</h3><p class="lead" style="margin-top:6px">'+t('hp.devt',esc(S.code||''))+'</p><button class="btn block ghost" style="margin-top:10px" data-a="sheet" data-v="sair">'+t('sh.outb')+'</button></div>'+
 '<div class="card"><h3>'+t('hp.faq')+'</h3>'+ul([1,2,3,4,5,6].map(i=>t('hp.f'+i)))+'</div></div>';
}
function viewDev(){
 return '<div class="body"><button class="back" data-a="go" data-v="menu">'+t('back')+'</button><h2>'+t('dv.title')+'</h2><div class="note">'+t('dv.note')+'</div>'+
 '<div class="card"><h3>'+t('dv.a')+'</h3><p class="lead" style="margin-top:6px">'+t('dv.at')+'</p>'+ul([1,2,3,4,5].map(i=>t('dv.a'+i)))+'</div>'+
 '<div class="card"><h3>'+t('dv.w')+'</h3><p class="lead" style="margin-top:6px">'+t('dv.wt')+'</p>'+ul([t('dv.w1'),t('dv.w2')])+'</div></div>';
}
