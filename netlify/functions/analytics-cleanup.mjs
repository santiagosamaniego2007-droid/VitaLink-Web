import {getStore} from '@netlify/blobs';
import {update,response} from '../lib/analytics-core.mjs';
export const config={schedule:'0 6 * * *'};
export default async function(){
 if(process.env.VL_ANALYTICS_ENABLED==='true')await update(getStore({name:'vitalink-analytics-test',consistency:'strong'}),null);
 return response(204,null);
}
