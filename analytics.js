'use strict';
(()=>{
 const sent=new Set();
 function event(name){
  if(!window.vlAnalyticsAllowed?.()||!['https:','http:'].includes(location.protocol)||sent.has(name))return;
  // One event of each kind per page load. No user ID, URL or clinical data.
  sent.add(name);
  fetch('/api/analytics-event',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event:name}),credentials:'same-origin',keepalive:true,referrerPolicy:'no-referrer'}).catch(()=>{});
 }
 function visit(){event('pageview');}
 document.addEventListener('vl:privacy-change',visit);visit();
 document.addEventListener('click',e=>{const a=e.target.closest?.('a[href]');if(a){try{if(new URL(a.href).origin==='https://vitalink-platform.pages.dev')event('platform_click');}catch{}}},true);
 document.getElementById('product-video')?.addEventListener('playing',()=>event('video_start'));
})();
