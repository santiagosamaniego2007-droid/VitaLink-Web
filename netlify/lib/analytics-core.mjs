import { timingSafeEqual } from 'node:crypto';
export const events=['pageview','platform_click','video_start'];
export const day=(date=new Date())=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Guayaquil',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
export function cutoff(date=new Date()){return day(new Date(date.getTime()-89*86400000));}
export function prune(data,date=new Date()){return Object.fromEntries(Object.entries(data||{}).filter(([key])=>/^\d{4}-\d{2}-\d{2}$/.test(key)&&key>=cutoff(date)&&key<=day(date)));}
export function consent(cookie,now=Date.now()){try{const v=JSON.parse(decodeURIComponent(cookie.split(/;\s*/).find(x=>x.startsWith('vl_privacy_v2='))?.slice('vl_privacy_v2='.length)||''));return v.analytics===true&&Number.isFinite(v.expires)&&v.expires>now&&v.expires<=now+181*86400000;}catch{return false;}}
export function authorized(header,secret){if(typeof secret!=='string'||secret.length<32)return false;const a=Buffer.from(header||''),b=Buffer.from('Bearer '+secret);return a.length===b.length&&timingSafeEqual(a,b);}
export async function update(store,event,date=new Date()){
 for(let i=0;i<6;i++){
  const existing=await store.getWithMetadata('daily',{type:'json'});
  const data=prune(existing?.data,date);
  if(event){const k=day(date);const row=data[k]??={pageview:0,platform_click:0,video_start:0};if(row[event]>=10000)return false;row[event]++;}
  const result=await store.setJSON('daily',data,existing?{onlyIfMatch:existing.etag}:{onlyIfNew:true});
  if(result.modified)return true;
 }
 throw new Error('Concurrent update');
}
export const response=(status,body)=>new Response(body==null?null:JSON.stringify(body),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
