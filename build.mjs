import {mkdir,cp,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist');
for(const path of ['index.html','producto.html','simulacion.html','monitoreo.html','desarrollo.html','resultados.html','equipo.html','contacto.html','como-funciona.html','tecnologia.html','guia.html','app.html','faq.html','subnav.js','guide-journey.js','subpages.css','legal.html','analytics.html','styles.css','script.js','privacy.js','analytics.js','analytics-admin.js','assets'])await cp(path,'dist/'+path,{recursive:true});

await cp('_headers','dist/_headers');
await cp('404.html','dist/404.html');
