import {getStore} from '@netlify/blobs';
import {authorized,prune,response} from '../lib/analytics-core.mjs';
export const config={rateLimit:{action:'rate_limit',aggregateBy:'ip',windowSize:60,windowLimit:10}};
export default async function(req){
 // Rama de pruebas: aceptar solamente la URL canónica de Deploy Preview.
 if(!/^deploy-preview-\d+--webvitalink\.netlify\.app$/.test(new URL(req.url).hostname))return response(403,{error:'Disponible solo en vista previa de pruebas'});
 if(req.method!=='GET')return response(405,null);
 if(!authorized(req.headers.get('authorization'),process.env.VL_ANALYTICS_ADMIN_TOKEN))return response(401,{error:'Acceso no autorizado'});
 if(process.env.VL_ANALYTICS_ENABLED!=='true')return response(503,{error:'Analítica desactivada'});
 try{const data=await getStore({name:'vitalink-analytics-test',consistency:'strong'}).get('daily',{type:'json'});return response(200,{days:prune(data)});}catch{return response(503,{error:'No se pudo leer el informe'});}
}
