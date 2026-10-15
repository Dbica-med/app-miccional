'use strict';
const MS=864e5;
const mkToday=()=>{const d=new Date();return new Date(d.getFullYear(),d.getMonth(),d.getDate(),12)};
let TODAY=mkToday();
const P=s=>{const a=s.split('-').map(Number);return new Date(a[0],a[1]-1,a[2],12)};
const p2=n=>String(n).padStart(2,'0');
const I=d=>d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate());
const add=(d,n)=>{const r=new Date(d.getTime());r.setDate(r.getDate()+n);return r};
const diff=(a,b)=>Math.round((a-b)/MS);
const F=d=>p2(d.getDate())+'/'+p2(d.getMonth()+1);
const FY=d=>F(d)+'/'+d.getFullYear();
const DS=['dom','seg','ter','qua','qui','sex','sáb'];
const DL=['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];
const MN=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
const monday=d=>add(d,-((d.getDay()+6)%7));
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const num=(v,dec)=>{const s=(Math.round(v*10)/10).toFixed(dec==null?1:dec);return s.replace('.',',').replace(/,0$/,'')};
const MARK='<svg viewBox="50 45 480 715" aria-hidden="true"><path fill="currentColor" d="M126 52 L172 100 L172 496 C172 556 160 614 126 666 Z"/><path fill="#C8A46A" d="M205 118 C315 126 374 177 374 251 C374 315 330 350 250 371 C345 386 408 441 408 520 C408 611 333 663 198 691 C297 648 350 592 350 520 C350 450 310 403 218 374 C301 350 326 307 326 252 C326 190 285 145 205 118 Z"/><path fill="currentColor" d="M58 724 C185 720 311 690 408 629 C458 598 493 563 523 519 C503 578 467 628 418 664 C323 733 194 751 58 724 Z"/></svg>';

