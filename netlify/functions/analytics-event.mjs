import {getStore} from '@netlify/blobs';
import {events,consent,update,response} from '../lib/analytics-core.mjs';
export const config={rateLimit:{action:'rate_limit',aggregateBy:'ip',windowSize:60,windowLimit:30}};
export default async function(req){
 if(req.method!=='POST')return response(405,{error:'Método no permitido'});
 if(process.env.VL_ANALYTICS_ENABLED!=='true')return response(503,{error:'Analítica desactivada'});
 if(req.headers.get('origin')!==new URL(req.url).origin||!consent(req.headers.get('cookie')||''))return response(403,{error:'Sin consentimiento válido'});
 if(!req.headers.get('content-type')?.startsWith('application/json'))return response(415,null);
 try{const raw=await req.text();if(raw.length>100)return response(400,null);const body=JSON.parse(raw);if(!body||Object.keys(body).length!==1||!events.includes(body.event))return response(400,null);
 const ok=await update(getStore({name:'vitalink-analytics',consistency:'strong'}),body.event);return response(ok?204:429,null);
 }catch{return response(503,{error:'No se pudo contabilizar'});}
}
