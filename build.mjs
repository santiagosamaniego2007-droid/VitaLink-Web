import {mkdir,cp,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist');
for(const path of ['index.html','legal.html','analytics.html','styles.css','script.js','privacy.js','analytics.js','analytics-admin.js','assets'])await cp(path,'dist/'+path,{recursive:true});
