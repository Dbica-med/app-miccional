/* ===== estado, armazenamento no aparelho, fila de envio e ações ===== */
let S;
const get=p=>p.split('.').reduce((o,k)=>o==null?o:o[k],S);
const set=(p,v)=>{const a=p.split('.'),l=a.pop();a.reduce((o,k)=>o[k],S)[l]=v};
const KEY='mic.v1';
const newDx=()=>({id:'',data:'',ativo:false,ack:false,mic:[],liq:[],fim:{q:'',g:'',m:''},retro:false});
const blankOb=()=>({code:'',dob:'',sx:'',papel:'',sit:'',termo:false,assent:false,cas:false,mn:false,md:false,nd:2,err:'',busy:false});
const draftBlank=()=>({s:'',f:[],por:'c',rem:'',who:'',al:'',x:''});
const now=()=>{const d=new Date();return p2(d.getHours())+':'+p2(d.getMinutes())};
const uid=()=>(Date.now().toString(36)+Math.random().toString(36).slice(2,9));
let canStore=true;
function load(){try{const r=localStorage.getItem(KEY);return r?JSON.parse(r):null}catch(e){canStore=false;return null}}
function save(){
 if(!canStore)return;
 try{localStorage.setItem(KEY,JSON.stringify({code:S.code,token:S.token,papel:S.papel,cfg:S.cfg,nights:S.nights,weeks:S.weeks,notes:S.notes,outbox:S.outbox,dx:S.dx,screen:S.p.screen,share:S.p.share,hqs:S.p.hqs,inst:S.p.inst,cq:S.p.cq,cqs:S.p.cqs,ws:S.ws}))}catch(e){canStore=false}
}
function init(){
 const L=load()||{};
 S={code:L.code||'',token:L.token||'',papel:L.papel||'',cfg:L.cfg||null,nights:L.nights||{},weeks:L.weeks||{},notes:L.notes||[],outbox:L.outbox||[],
  dx:Object.assign(newDx(),L.dx||{}),nt:'',p:{screen:L.token?(L.screen||'menu'):'onb',share:!!L.share,hqs:L.hqs||'',inst:L.inst||'',cq:L.cq,cqs:L.cqs||''},ob:blankOb(),draft:draftBlank(),
  draft2:{h:'12:00',v:'',nm:false,u:'ausente',p:'nenhuma',pt:'',o:''},draft3:{h:'12:00',v:0,t:'Água',vv:''},
  st:{dt:I(TODAY),ok:false,bad:false},ntq:[],ag:{q:false,dt:'',bad:false},mq:{},dv:{it:Array(10).fill(null)},dvok:false,imp:{n:0,d:0,i:0},iq:{nw:'',dw:''},hq:{hp:'',hm:[],hn:'',hd:'',hi:'',hu:''},ckmsg:'',impok:false,ws:L.ws||{dias:3,av:0,sem:0,urg:0,troca:0,regra:5,evac:6,bris:4,fecal:0},cal:{y:TODAY.getFullYear(),m:TODAY.getMonth()},busy:false,authBad:false};
 if(S.cfg)applyCfg(S.cfg,true);
}
function applyCfg(c,quiet){
 S.cfg=c;S.p.code=S.code;S.p.cas=c.guarda;S.p.adol=c.adolescente;S.p.mods=c.modulos;
 if(c.adolescente&&S.papel==='adol')S.p.share=c.compartilha;
 if(!quiet)fixScreen();
}
/* para onde o app deve ir conforme a configuração do paciente */
function fixScreen(){
 const c=S.cfg;if(!c){S.p.screen='onb';return}
 const sc=S.p.screen;
 if((c.fase==='trat'&&c.status!=='ativo')||c.status==='encerrado'){S.p.screen='wait';return}
 if(needStart()){if(!['start','info','help'].includes(sc))S.p.screen='start';return}
 if(pauseInfo()){if(!['pause','info','help'].includes(sc))S.p.screen='pause';return}
 if(sc==='start'||sc==='pause')S.p.screen='menu';
 if(sc==='wait'||sc==='onb'||sc==='load')S.p.screen=(c.fase==='inv'&&c.dx)?'dx':'menu';
 if((c.fase==='inv'||(c.fase==='trat'&&!c.inicio))&&c.dx&&dxPend()&&(sc==='menu'||sc==='start'))S.p.screen='dx';if(c.fase==='inv'&&c.dx&&(sc==='menu'))S.p.screen='dx';
 if(c.fase==='trat'&&c.inicio&&(sc==='dx')&&!S.dx.ativo&&S.p.dxm!==1)S.p.screen='menu';
 if(!S.p.inst&&instNeeded()&&['wait','onb','load'].includes(sc)&&['menu','dx'].includes(S.p.screen))S.p.screen='inst';
}
/* ---------- rede ---------- */
async function api(req){
 if(!API_URL||API_URL.indexOf('COLE')>=0)return{ok:false,err:'config'};
 const ctl=new AbortController(),tm=setTimeout(()=>ctl.abort(),30000);
 try{
  const r=await fetch(API_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(req),redirect:'follow',signal:ctl.signal});
  return await r.json();
 }catch(e){return{ok:false,err:'rede'}}finally{clearTimeout(tm)}
}
function queue(a,d){S.outbox.push({eid:uid(),a:a,d:d});save();flush()}
let flushing=false;
async function flush(){
 if(flushing||!S.token||!S.outbox.length||S.authBad)return;
 if(navigator.onLine===false)return;
 flushing=true;render();
 try{
  for(let guard=0;guard<20&&S.outbox.length;guard++){
   const batch=S.outbox.slice(0,40);
   const r=await api({a:'sync',c:S.code,t:S.token,e:batch});
   if(r.ok){
    const gone=new Set((r.done||[]).concat(r.bad||[]));
    S.outbox=S.outbox.filter(e=>!gone.has(e.eid));
    if(r.config)applyCfg(r.config);
    save();render();
   }else{if(r.err==='auth'){S.authBad=true;save();render()}break}
  }
 }finally{flushing=false}
}
async function refresh(){
 if(!S.token)return;
 const r=await api({a:'config',c:S.code,t:S.token});
 if(r.ok){applyCfg(r.config);cqCheck();save()}else if(r.err==='auth'){S.authBad=true}
 render();flush();
}
/* ---------- visual ---------- */
function render(){
 const ae=document.activeElement,fk=ae&&ae.dataset&&ae.dataset.i?{k:ae.dataset.i,s:ae.selectionStart}:null;
 document.getElementById('app').innerHTML=viewPais()+(flushing||S.busy?'<div class="ld" aria-hidden="true"></div>':'');
 if(fk){const el=document.querySelector('[data-i="'+fk.k+'"]');if(el){el.focus();try{el.setSelectionRange(fk.s,fk.s)}catch(e){}}}
}
const toTop=()=>window.scrollTo(0,0);
function openNight(k){
 const n=S.nights[k];
 S.draft=n?{s:n.s,f:n.f.filter(x=>x!=='med'),por:n.por,al:n.al||'',rem:n.f.includes('med')?'nao':(n.rem||(S.p.adol?'sim':'')),who:n.who||(n.h==='P'?'pai':(S.papel==='pai'?'pai':'mae'))}:Object.assign(draftBlank(),{who:S.papel==='pai'?'pai':(S.papel==='mae'?'mae':'')});
 if(S.p.adol)S.draft.who='adol';
 S.p.sheet={v:'night',k,step:(n&&!n.rem&&!S.p.adol)?2:1};
}
function cqAch(){
 const a=[],ks=Object.keys(S.nights).sort(),dry=k=>S.nights[k]&&S.nights[k].s==='seca';
 if(hasMod('n')){
  if(ks.some(dry))a.push('n1');
  let run=0,best=0,prev=null;ks.forEach(k=>{if(dry(k)){run=(prev&&dry(prev)&&diff(P(k),P(prev))===1)?run+1:1;best=Math.max(best,run)}else run=0;prev=k});
  if(best>=7)a.push('n7');if(best>=14)a.push('n14');
  const w=ks.filter(k=>{const d=diff(TODAY,P(k));return d>=0&&d<28});
  if(w.length>=14){const f=w.filter(dry).length/w.length;if(f>=.5)a.push('p50');if(f>=.8)a.push('p80')}
  const w2=ks.filter(k=>{const d=diff(TODAY,P(k));return d>=0&&d<21});
  if(S.cfg&&S.cfg.inicio&&diff(TODAY,P(S.cfg.inicio))>=21&&w2.length>=14&&w2.filter(dry).length/w2.length<=.1)a.push('apoio');
 }
 if(hasMod('d')){const wk=Object.keys(S.weeks).sort(),z=k=>S.weeks[k]&&S.weeks[k].esc===0;
  if(wk.some(z))a.push('d1');
  if(wk.some((k,i)=>i>0&&z(k)&&z(wk[i-1])&&diff(P(k),P(wk[i-1]))===7))a.push('d2')}
 return a;
}
function cqCheck(){
 if(!S.token)return;const a=cqAch();
 if(S.p.cq===undefined){S.p.cq=a.slice();return}
 const nw=a.filter(k=>!S.p.cq.includes(k));if(!nw.length)return;
 [['n1','n7','n14','p50','p80'],['d1','d2'],['apoio']].forEach(g=>{const hit=g.filter(k=>nw.includes(k));if(!hit.length)return;
  g.forEach(k=>{if(a.includes(k)&&!S.p.cq.includes(k))S.p.cq.push(k)});
  const best=hit[hit.length-1];queue('conq',{k:best});S.p.cqs=best});
 save();
}
const A={
 go(d){let v=d.v;S.p.dxm=d.v==='dx'?1:0;if(needStart()&&!['start','info','help'].includes(v))v='start';else if(pauseInfo()&&!['pause','info','help'].includes(v))v='pause';if(v==='menu'&&S.cfg&&S.cfg.fase==='inv'&&S.cfg.dx)v='dx';S.p.screen=v;S.p.sheet=null;save();toTop()},
 lang(d){setLang(d.v);render()},
 agenda(d){if(!S.cfg||!S.cfg.ret)return 'norender';S.cfg.ag=d.v==='1'?I(TODAY):'';queue('ag',{v:d.v==='1'?1:0});save()},
 rr(d){if(!S.cfg||!S.cfg.ret)return 'norender';const m=d.v||'';S.cfg.rr={m:m,d:m?I(TODAY):''};if(m==='agendei')S.cfg.ag=I(TODAY);S.ckmsg=m&&m!=='parou'?m:'';queue('rr',{m:m});save()},
 ckok(){S.ckmsg='';},
 agq(){S.ag.q=true;S.ag.bad=false},
 agsave(){const dt=S.ag.dt;if(!/^\d{4}-\d{2}-\d{2}$/.test(dt)||diff(P(dt),TODAY)<-1||diff(P(dt),TODAY)>150){S.ag.bad=true;return}
  S.ag.bad=false;S.ag.q=false;S.ag.dt='';S.cfg.agd=dt;S.cfg.ag=I(TODAY);S.cfg.rr={m:'agendei',d:I(TODAY)};S.ckmsg='';queue('rr',{m:'agendei',dt:dt});save();fixScreen()},
 startgo(){const dt=S.st.dt;if(!/^\d{4}-\d{2}-\d{2}$/.test(dt)||diff(TODAY,P(dt))<0||diff(TODAY,P(dt))>14){S.st.bad=true;return}
  S.st.bad=false;S.cfg.inicio=dt;if(!(S.cfg.tol>0)){S.cfg.ret=I(add(P(dt),30));S.cfg.tol=7;S.cfg.agd='';S.cfg.ag='';S.cfg.rr={m:'',d:''}}
  queue('ini',{dt:dt,ok:true});S.p.screen='menu';save();toTop()},
 impq(d){S.iq[d.k]=String(S.iq[d.k])===d.v?'':d.v},
 hqset(d){const q=S.hq;if(d.k==='hm'){const i=q.hm.indexOf(d.v);if(i>=0)q.hm.splice(i,1);else q.hm.push(d.v)}else q[d.k]=q[d.k]===d.v?'':d.v},
 instpl(d){S.instpl=d.v},
 instnow(){const e=window._ip;if(!e)return 'norender';e.prompt();try{e.userChoice.then(r=>{if(r&&r.outcome==='accepted'){S.p.inst='ok';save()}window._ip=null;render()})}catch(x){}return 'norender'},
 instdone(){S.p.inst='ok';S.p.screen='menu';fixScreen();save();toTop()},
 instlater(){S.p.inst=I(TODAY);S.p.screen='menu';fixScreen();save();toTop()},
 hqskip(){S.p.hqs=I(TODAY);S.p.screen='menu';save();toTop()},
 msset(d){const q=S.mq[d.m];q[d.k]=String(q[d.k])===d.v?'':(d.k==='i'?d.v:Number(d.v))},
 msna(d){const q=S.mq[d.m];q.na=!q.na;if(q.na)q.n=''},
 msed(d){const q=S.mq[d.m]||(S.mq[d.m]={n:'',d:'',u:'',i:'',na:false,ed:false}),r=(S.cfg.meses||{})[d.m]||{};Object.assign(q,{n:r.n===''||r.n==null?'':r.n,d:r.d===''||r.d==null?'':r.d,u:r.u===''||r.u==null?'':r.u,i:r.i||'',na:!!r.na,ed:true})},
 msall(){const L=msPending();if(!L.length)return 'norender';S.cfg.meses=S.cfg.meses||{};
  L.forEach(m=>{const o=msBuild(m);S.cfg.meses[m]={n:o.n==null?'':o.n,d:o.d==null?'':o.d,u:o.u==null?'':o.u,i:o.i||'',na:o.na?1:0};delete S.mq[m];queue('mes',o)});S.msok=true;save()},
 dvset(d){S.dv.it[+d.k]=Number(d.v)},
 dvsend(){if(!S.dv.it.every(x=>x!=null))return 'norender';queue('dvss',{it:S.dv.it.slice()});S.cfg.dv=I(TODAY);S.dv.it=Array(10).fill(null);S.dvok=true;S.p.screen='menu';save();toTop()},
 hqsend(){const q=S.hq,o={};if(q.hp)o.hp=q.hp;if(q.hp==='s'&&q.hm.length)o.hm=q.hm.slice();if(q.hn!=='')o.hn=Number(q.hn);if(q.hd!=='')o.hd=Number(q.hd);if(q.hi)o.hi=q.hi;if(q.hu)o.hu=q.hu;if(!Object.keys(o).length)return 'norender';S.cfg.hq=1;queue('hist',o);S.p.screen='menu';save();toTop()},
 impset(d){S.imp[d.k]=Number(d.v)},
 impsend(){const ks=['n','d','i'].filter(k=>hasMod(k));if(!ks.every(k=>S.imp[k]>0))return 'norender';const o={};ks.forEach(k=>o[k]=S.imp[k]);if(S.iq.nw!=='')o.nw=Number(S.iq.nw);if(S.iq.dw!=='')o.dw=Number(S.iq.dw);S.iq={nw:'',dw:''};S.cfg.imp=I(TODAY);S.impok=true;S.imp={n:0,d:0,i:0};queue('imp',o);save()},
 usdone(){if(!S.cfg||!S.cfg.us)return 'norender';S.cfg.us.f=I(TODAY);queue('us',{});save()},
 ob(d){S.ob[d.k]=d.k==='nd'?Number(d.v):d.v;S.ob.err=''},
 async obgo(){
  const o=S.ob;if(!obValid()||o.busy)return 'norender';
  o.busy=true;o.err='';render();
  const mods=o.sit==='investigacao'?[o.mn?'n':null,o.md?'d':null].filter(Boolean).join(','):'';
  const r=await api({a:'register',c:norm(o.code),dob:o.dob,papel:o.papel,sx:o.sx,fase:o.sit==='investigacao'?'inv':'trat',nd:o.nd,mods,cas:o.cas?1:0,termo:{v:TERMO_V,ok:true}});
  o.busy=false;
  if(!r.ok){
   o.err=(['dados','bloqueado','termo','codigo','rede','config','ocupado'].includes(r.err)?t('err.'+r.err):t('err.x'));
   render();return 'norender';
  }
  S.code=norm(o.code);S.token=r.token;S.papel=o.papel;S.authBad=false;S.p.screen='load';S.ob=blankOb();
  applyCfg(r.config);save();toTop();
 },
 refresh(){S.busy=true;render();refresh().then(()=>{S.busy=false;render()});return 'norender'},
 dxstart(){
  const d=S.dx;
  if(d.ativo||[0,6].includes(TODAY.getDay())||d.ack){if(!d.ativo){d.id='d'+uid();d.data=I(TODAY);d.ativo=true}S.p.screen='diary';save();toTop()}
  else S.p.sheet={v:'rule'}},
 paperok(){const dt=(S.dxp&&S.dxp.dt)||'',ok=/^\d{4}-\d{2}-\d{2}$/.test(dt)&&diff(TODAY,P(dt))>=1&&diff(TODAY,P(dt))<=60;if(!ok){S.dxp.bad=true;return}
  const d=S.dx;if(d.ativo)return 'norender';d.id='d'+uid();d.data=dt;d.ativo=true;d.retro=true;S.p.sheet=null;S.p.screen='diary';save();toTop()},
 ruleok(){const d=S.dx;S.p.sheet=null;d.id='d'+uid();d.data=I(TODAY);d.ativo=true;S.p.screen='diary';save();toTop()},
 dxfromtrat(){S.p.screen='dx';S.p.dxm=1;save();toTop()},
 sheet(d){S.p.sheet=d.v?{v:d.v}:null;if(d.v==='mic')S.draft2={h:S.dx.retro?'':now(),v:'',nm:false,u:'ausente',p:'nenhuma',pt:'',o:''};if(d.v==='liq')S.draft3={h:S.dx.retro?'':now(),v:0,t:'Água',vv:''};if(d.v==='fim')S.dx.fim={q:'',g:'',m:''};if(d.v==='paper'){S.dxp={dt:'',bad:false}}},
 night(d){openNight(d.v)},
 dr(d){S.draft[d.k]=d.v},
 drf(d){const f=S.draft.f,i=f.indexOf(d.v);i<0?f.push(d.v):f.splice(i,1)},
 drp(d){S.draft.por=d.v},
 nstep(d){S.p.sheet.step=Number(d.v)},
 savekid(){const k=S.p.sheet.k,dr=S.draft;if(!dr.s)return 'norender';const casa=S.papel==='pai'?'P':'M';S.nights[k]={h:casa,s:dr.s,f:[],por:dr.por,al:'',rem:'',who:''};queue('night',{data:k,casa,s:dr.s,por:dr.por,rem:'',al:'',flags:[],quem:S.papel});S.p.sheet=null;cqCheck();save()},
 savenight(){
  const k=S.p.sheet.k,dr=S.draft,casa=dr.who==='pai'?'P':'M';
  const f=dr.f.filter(x=>x!=='med').concat(dr.rem==='nao'?['med']:[]);
  S.nights[k]={h:casa,s:dr.s,f,por:dr.por,al:dr.al||'',rem:dr.rem,who:dr.who};
  queue('night',{data:k,casa,s:dr.s,por:dr.por,rem:dr.rem,al:dr.al||'',flags:f,quem:dr.who||S.papel});
  const nx=String(dr.x||'').trim().slice(0,500);if(nx)queue('note',{data:k,texto:nx});
  S.p.sheet=null;cqCheck();save()},
 cm(d){let{y,m}=S.cal;m+=Number(d.v);if(m<0){m=11;y--}if(m>11){m=0;y++}S.cal={y,m}},
 d2(d){S.draft2[d.k]=(d.k==='pt'&&S.draft2.pt===d.v)?'':d.v;if(d.k==='p'&&d.v==='nenhuma')S.draft2.pt=''},
 d3(d){S.draft3.v=Number(d.v);S.draft3.vv=''},
 d3t(d){S.draft3.t=d.v},
 savemic(){const m=S.draft2,dx=S.dx;if(!/^\d{2}:\d{2}$/.test(m.h||''))return 'norender';const ml=m.nm?0:Math.round(Number(m.v)||0);
  dx.mic.push([m.h,ml,m.u,m.p,m.o||'']);
  queue('mic',{diario:dx.id,data:dx.data,hora:m.h,ml,urg:m.u,perda:m.p,pt:m.p==='nenhuma'?'':m.pt,obs:m.o||''});S.p.sheet=null;save()},
 saveliq(){const v=Math.round(Number(S.draft3.vv)||S.draft3.v);if(!v)return 'norender';const dx=S.dx;
  dx.liq.push([S.draft3.h,v,S.draft3.t]);
  queue('liq',{diario:dx.id,data:dx.data,hora:S.draft3.h||'',ml:v,tipo:S.draft3.t});S.p.sheet=null;save()},
 fim(d){S.dx.fim.q=d.v},
 fimok(){const dx=S.dx,f=dx.fim,tipo=S.cfg&&S.cfg.dx?S.cfg.dx.tipo:'inicial';
  queue('fim',{diario:dx.id,data:dx.data,tipo,sr:f.q==='sim'?'sim':'nao',g:f.g,m:f.m});
  Object.assign(S.dx,newDx());S.p.sheet=null;S.p.screen=(S.cfg&&S.cfg.fase==='trat')?'menu':'dx';save();toTop()},
 cqok(){S.p.cqs='';save()},
 wb(d){S.ws.bris=Number(d.v)},
 savewk(){const w=S.ws,k=I(add(monday(TODAY),-7));
  S.weeks[k]={dias:w.dias,esc:w.av+w.sem,av:w.av,sem:w.sem,urg:w.urg,troca:w.troca,regra:w.regra,evac:w.evac,bris:w.bris,fecal:w.fecal};
  queue('week',{semana:k,dias:w.dias,esc:w.av+w.sem,av:w.av,sem:w.sem,urg:w.urg,troca:w.troca,regra:w.regra,evac:w.evac,bris:w.bris,fecal:w.fecal});
  S.p.screen='menu';cqCheck();save();toTop()},
 ntq(d){const i=S.ntq.indexOf(d.v);if(i>=0)S.ntq.splice(i,1);else S.ntq.push(d.v)},
 fbsend(){const x=(S.fb||'').trim();if(!x)return 'norender';const tx='PROBLEMAS OU DÚVIDAS EM RELAÇÃO AO APP\n\nCódigo: '+S.code+'\nApp v'+APP_V+'\nAparelho: '+(navigator.userAgent||'').replace(/^Mozilla\/5\.0 /,'').slice(0,70)+'\n\n'+x.slice(0,700);window.open('https://wa.me/5521984814150?text='+encodeURIComponent(tx),'_blank');S.fb=''},
 addnote(){const f=(S.nt||'').trim(),qs=S.ntq.map(k=>M['no.c.'+k][0]).join('; ');const tx=(qs+(qs&&f?'. ':'')+f).slice(0,500);if(!tx)return 'norender';S.notes.unshift([FY(TODAY),tx]);queue('note',{data:I(TODAY),texto:tx});S.nt='';S.ntq=[]},
 st(d){const v=Math.max(Number(d.min),Math.min(Number(d.max),Number(get(d.p))+Number(d.d)));set(d.p,v);document.querySelectorAll('output[data-bind="'+d.p+'"]').forEach(o=>o.textContent=v);save();return 'norender'},
 sheetbg(d,e){if(e.target.classList.contains('sheetbg')){S.p.sheet=null}else return 'norender'},
 sairok(){try{localStorage.removeItem(KEY)}catch(e){}init();S.p.screen='onb';render();toTop()}
};
document.addEventListener('click',e=>{
 const el=e.target.closest('[data-a]');if(!el||el.disabled)return;
 const fn=A[el.dataset.a];if(!fn)return;
 if(el.classList.contains('sheetbg')&&e.target!==el)return;
 const r=fn(el.dataset,e);
 if(r&&typeof r.then==='function'){r.then(x=>{if(x!=='norender')render()});return}
 if(r==='norender')return;
 render();
});
function onField(e){
 const el=e.target;
 if(el.dataset.i){set(el.dataset.i,el.value);if(el.dataset.i==='ob.code'||el.dataset.i==='ob.dob'){S.ob.err=''}
  const u=el.dataset.u;
  if(u==='ms'){const g=document.getElementById('ms-go');if(g)g.disabled=!msPending().length}
  if(u==='ob'){const g=document.getElementById('ob-go');if(g)g.disabled=!obValid()||S.ob.busy;const n=document.getElementById('ob-norm');if(n)n.innerHTML=obNormHtml()}
  save();
 }
 if(el.dataset.c&&e.type==='change'){
  set(el.dataset.c,el.checked);
  if(el.dataset.c==='p.share')queue('share',{v:el.checked});
  save();render();
 }
}
document.addEventListener('input',onField);
document.addEventListener('change',onField);
window.addEventListener('online',()=>flush());
document.addEventListener('visibilitychange',()=>{if(!document.hidden){TODAY=mkToday();refresh()}});
setInterval(()=>{if(S&&S.outbox.length)flush()},60000);
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();window._ip=e;if(S&&S.p.screen==='inst')render()});
window.addEventListener('appinstalled',()=>{if(S){S.p.inst='ok';save()}});
setLang(detectLang(),true);
init();render();
if(S.token)refresh();
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}))}
