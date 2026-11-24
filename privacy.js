// Consentimiento local: no envía datos a servidores. Cookie de primera parte, 180 días.
'use strict';
(()=>{
const KEY='vl_privacy_v2', MODE='vl_hero_mode_v1', DAYS=180, lifetime=DAYS*86400000;
const get=id=>document.getElementById(id), dialog=get('cookie-dialog'), banner=get('privacy-banner'), optional=get('pref-optional'), analytics=get('pref-analytics'), status=get('privacy-status');
let choice=null, opener=null;
function valid(v){return v && typeof v.optional==='boolean' && typeof v.analytics==='boolean' && Number.isFinite(v.expires) && v.expires>Date.now();}
function read(){try {const raw=document.cookie.split('; ').find(x=>x.startsWith(KEY+'='));if(raw){const v=JSON.parse(decodeURIComponent(raw.slice(KEY.length+1)));if(valid(v))return v;}}catch{} try{const v=JSON.parse(localStorage.getItem(KEY));if(valid(v))return v;}catch{}return null;}
function removeMode(){try{localStorage.removeItem(MODE);}catch{}}
function store(allow,measure){choice={optional:allow,analytics:measure,expires:Date.now()+lifetime};let persisted=false;try{document.cookie=KEY+'='+encodeURIComponent(JSON.stringify(choice))+'; Max-Age='+DAYS*86400+'; Path=/; SameSite=Lax'+(location.protocol==='https:'?'; Secure':'');persisted=document.cookie.split('; ').some(x=>x.startsWith(KEY+'='));}catch{}try{if(persisted)localStorage.removeItem(KEY);else{localStorage.setItem(KEY,JSON.stringify(choice));persisted=true;}}catch{} if(!allow)removeMode(); else {try{const active=document.querySelector('[data-hero-mode][aria-pressed=true]');if(active)localStorage.setItem(MODE,String([...document.querySelectorAll('[data-hero-mode]')].indexOf(active)));}catch{}}banner.hidden=true;if(dialog.open)dialog.close();document.dispatchEvent(new CustomEvent('vl:privacy-change'));if(!persisted)console.info('VitaLink: elección válida solo en esta visita.');}
function open(e){opener=e?.currentTarget||get('cookie-open');optional.checked=!!choice?.optional;analytics.checked=!!choice?.analytics;status.textContent=choice?'Puedes cambiar tu selección.':'Todavía no has guardado una elección.';dialog.showModal();}
try{document.cookie="vl_privacy_v1=; Max-Age=0; Path=/; SameSite=Lax";localStorage.removeItem("vl_privacy_v1");}catch{}
choice=read();
window.vlAnalyticsAllowed=()=>!!choice?.analytics&&choice.expires>Date.now();if(!choice?.optional)removeMode();else{try{const mode=localStorage.getItem(MODE);if(mode!==null&&/^[012]$/.test(mode))document.dispatchEvent(new CustomEvent('vl:restore-mode',{detail:Number(mode)}));}catch{}}
banner.hidden=!!choice; if(location.hash==='#privacidad-control')open();
for(const id of ['cookie-open','banner-settings'])get(id).addEventListener('click',open);
for(const id of ['cookie-reject','banner-reject'])get(id).addEventListener('click',()=>store(false,false));
for(const id of ['cookie-accept','banner-accept'])get(id).addEventListener('click',()=>store(true,true));
get('cookie-save').addEventListener('click',()=>store(optional.checked,analytics.checked));get('cookie-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{(opener?.isConnected&&!banner.contains(opener)||!banner.hidden?opener:get('cookie-open'))?.focus();});
document.addEventListener('vl:mode',e=>{if(!choice?.optional||choice.expires<=Date.now())return;try{localStorage.setItem(MODE,String(e.detail));}catch{}});
})();
