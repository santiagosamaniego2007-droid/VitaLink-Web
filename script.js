'use strict';
const menu=document.querySelector('.menu'),nav=document.querySelector('#navigation');
const groups=[...nav.querySelectorAll('.mega-group')];
const desktop=window.matchMedia('(min-width:851px)');
let active=null,hoverTimer,pinned=false;
function closeMega(){clearTimeout(hoverTimer);for(const g of groups){g.querySelector('.mega-panel').hidden=true;g.querySelector('button').setAttribute('aria-expanded','false');}active=null;pinned=false;}
function positionPanel(g){if(!desktop.matches)return;const panel=g.querySelector('.mega-panel'), shell=g.closest('.nav').getBoundingClientRect(), button=g.querySelector('button').getBoundingClientRect();const w=panel.offsetWidth;const center=Math.max(12+w/2,Math.min(innerWidth-12-w/2,button.left+button.width/2));panel.style.left=(center-shell.left)+'px';}
function openMega(g,pin=false){clearTimeout(hoverTimer);if(active!==g){closeMega();active=g;}pinned=pin;g.querySelector('.mega-panel').hidden=false;g.querySelector('button').setAttribute('aria-expanded','true');positionPanel(g);}
function closeMenu(){closeMega();nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menú');}
menu.addEventListener('click',()=>{if(nav.classList.contains('open')){closeMenu();return;}nav.classList.add('open');menu.setAttribute('aria-expanded','true');menu.setAttribute('aria-label','Cerrar menú');});
for(const g of groups){const b=g.querySelector('button');b.addEventListener('click',()=>{if(active===g&&(!desktop.matches||pinned))closeMega();else openMega(g,true);});g.addEventListener('pointerenter',e=>{if(desktop.matches&&e.pointerType==='mouse'){clearTimeout(hoverTimer);if(active!==g)openMega(g);}});g.addEventListener('pointerleave',e=>{if(desktop.matches&&e.pointerType==='mouse')hoverTimer=setTimeout(()=>{if(active===g&&!pinned&&!g.contains(document.activeElement))closeMega();},140);});g.addEventListener('focusout',e=>{if(active===g&&!nav.contains(e.relatedTarget))closeMega();});}
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',e=>{if(a.dataset.featureLink!==undefined){if(featureTravel>0)e.preventDefault();showFeature(Number(a.dataset.featureLink));}closeMenu();}));
document.addEventListener('pointerdown',e=>{if(active&&!nav.contains(e.target))closeMega();if(!e.target.closest('.header')&&nav.classList.contains('open'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(active){const b=active.querySelector('button');closeMega();b.focus();}else if(nav.classList.contains('open')){closeMenu();menu.focus();}});
desktop.addEventListener('change',closeMenu);window.addEventListener('resize',()=>{if(active)positionPanel(active);});
const trigger=document.getElementById('trigger'),confirmButton=document.getElementById('confirm'),reset=document.getElementById('reset'),screen=document.getElementById('demo-screen');const states={idle:['En espera','Horario de ejemplo programado.','0%'],alert:['Aviso activo','¡Es la hora programada! Puedes confirmar que atendiste el aviso.','55%'],confirmed:['Confirmado','Aviso registrado como atendido. No verifica la ingesta.','100%']};function setState(s){screen.dataset.state=s;document.getElementById('status-label').textContent=states[s][0];document.getElementById('demo-message').textContent=states[s][1];document.getElementById('demo-progress').style.width=states[s][2];trigger.disabled=s!=='idle';confirmButton.disabled=s!=='alert';}trigger.addEventListener('click',()=>setState('alert'));confirmButton.addEventListener('click',()=>setState('confirmed'));reset.addEventListener('click',()=>setState('idle'));setState('idle');

// Presentación de producto: tres modos, sin conexión a datos reales.
const heroModes=[...document.querySelectorAll('[data-hero-mode]')];
const showcase=document.querySelector('.showcase');
const heroStates=[['PRÓXIMO AVISO','Horario programado','◷','Horario programado','Ejemplo de organización','Programado','·'],['AVISO ACTIVO','Es la hora programada','!','Recordatorio activo','Ejemplo de alerta','Aviso activo','!'],['AVISO ATENDIDO','Confirmación registrada','✓','Aviso registrado','Ejemplo de confirmación','Atendido','✓']];
const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
const journey=document.getElementById('showcase-journey');
let heroIndex=-1, heroSwipeStart=null, transitionTimer, scrollStage=-1;
function showHeroMode(index,animate=true){
  if(!Number.isInteger(index)||index<0||index>=heroStates.length||index===heroIndex)return;
  const dir=heroIndex<0?0:Math.sign(index-heroIndex);
  heroIndex=index;
  const state=heroStates[index];
  showcase.style.setProperty('--hero-dir',String(dir));
  showcase.dataset.mode=String(index);
  heroModes.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));
  document.getElementById('mode-description').textContent=['Programa tus horarios.','Recibe avisos a tiempo.','Registra la atención del aviso.'][index];
  ['hero-lcd-title','hero-lcd-state','hero-float-icon','hero-float-title','hero-float-text','hero-phone-state','hero-phone-icon'].forEach((id,i)=>document.getElementById(id).textContent=state[i]);
  document.getElementById('hero-phone-icon').classList.toggle('waiting',index!==2);
  document.getElementById('hero-count').textContent=`0${index+1} / 03`;
  if(animate&&dir&&!motion.matches){
    clearTimeout(transitionTimer);
    showcase.classList.remove('is-transitioning');
    void showcase.offsetWidth;
    showcase.classList.add('is-transitioning');
    transitionTimer=setTimeout(()=>showcase.classList.remove('is-transitioning'),450);
  }
}
function selectHero(index){
  const target=Math.max(0,Math.min(heroStates.length-1,index));
  showHeroMode(target);
  document.dispatchEvent(new CustomEvent('vl:mode',{detail:target}));
}
showHeroMode(0,false);
heroModes.forEach((b,i)=>{
 b.addEventListener('click',()=>selectHero(i));
 b.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')showHeroMode(i);});
 b.addEventListener('focus',()=>{if(b.matches(':focus-visible'))showHeroMode(i);});
});
document.addEventListener('vl:restore-mode',e=>showHeroMode(e.detail,false));
// Scroll nativo: no se captura ni se cancela la rueda. El panel solo se fija si cabe.
let journeyFrame=0, journeyTravel=0, journeyTop=0;
function readJourney(){
  journeyFrame=0;
  if(motion.matches)return;
  const rect=journey.getBoundingClientRect();
  let progress;
  if(journeyTravel>0){
    progress=(journeyTop-rect.top)/journeyTravel;
  }else{
    const start=innerHeight*.65;
    const end=journeyTop-showcase.offsetHeight*.58;
    progress=(start-rect.top)/Math.max(1,start-end);
  }
  const stage=Math.min(2,Math.max(0,Math.floor(progress*3)));
  if(stage!==scrollStage){scrollStage=stage;showHeroMode(stage);}
}
function measureJourney(){
  const header=document.querySelector('.header');
  const headerHeight=header.getBoundingClientRect().height;
  const available=innerHeight-headerHeight-32;
  const height=showcase.offsetHeight;
  const pin=!motion.matches&&height<=available;
  journeyTop=headerHeight+Math.max(16,(innerHeight-headerHeight-height)/2);
  journeyTravel=pin?Math.round(Math.min(720,Math.max(390,innerHeight*.76))):0;
  journey.style.setProperty('--journey-top',`${journeyTop}px`);
  journey.style.setProperty('--journey-travel',`${journeyTravel}px`);
  journey.classList.toggle('is-pinned',pin);
  if(!motion.matches)readJourney();
}
function queueJourney(){if(!journeyFrame)journeyFrame=requestAnimationFrame(readJourney);}
window.addEventListener('scroll',queueJourney,{passive:true});
window.addEventListener('resize',measureJourney);
motion.addEventListener('change',()=>{scrollStage=-1;measureJourney();});
if('ResizeObserver' in window)new ResizeObserver(measureJourney).observe(showcase);
measureJourney();
// Narrativa de funciones: un solo panel persistente, sin carrusel horizontal.
const featureJourney=document.getElementById('feature-journey'),featureStory=document.getElementById('feature-story');
const featureHint=document.getElementById('feature-hint'),prev=document.getElementById('feature-prev'),next=document.getElementById('feature-next'),counter=document.getElementById('feature-count');
const featureStates=[
 ['01 / ORGANIZA TU RUTINA','Programa','Registra los medicamentos y horarios indicados por tu profesional de salud.','Programado','PRÓXIMO RECORDATORIO','◷','Horario de ejemplo','Agenda de medicación','30%'],
 ['02 / UN AVISO A TIEMPO','Recibe el aviso','El dispositivo está diseñado para emitir señales luminosas y sonoras al llegar la hora programada.','Aviso activo','RECORDATORIO ACTIVO','!','Es la hora programada','Alerta de ejemplo','65%'],
 ['03 / CONSULTA TUS REGISTROS','Confirma','Registra que atendiste el aviso y consulta el historial. La confirmación no demuestra la ingesta.','Atendido','AVISO CONFIRMADO','✓','Confirmación registrada','Historial de avisos','100%']
];
let current=-1,featureTravel=0,featureTop=0,featureFrame=0,lastFeatureStage=-1,featureTimer=0,featureGesture=null;
function renderFeature(i,animate=true){
 i=Math.max(0,Math.min(featureStates.length-1,i));if(i===current)return;
 const direction=current<0?0:Math.sign(i-current);current=i;const state=featureStates[i];
 featureStory.dataset.mode=String(i);featureStory.style.setProperty('--story-dir',String(direction));
 ['story-kicker','story-title','story-text','story-badge','story-caption','story-icon','story-message','story-bottom'].forEach((id,j)=>document.getElementById(id).textContent=state[j]);
 document.getElementById('story-fill').style.width=state[8];counter.textContent=`0${i+1} / 03`;prev.disabled=i===0;next.disabled=i===2;
 if(animate&&direction&&!motion.matches){clearTimeout(featureTimer);featureStory.classList.remove('story-changing');void featureStory.offsetWidth;featureStory.classList.add('story-changing');featureTimer=setTimeout(()=>featureStory.classList.remove('story-changing'),460);}
}
function showFeature(i){
 i=Math.max(0,Math.min(featureStates.length-1,i));
 if(featureTravel>0&&!motion.matches){const start=featureJourney.getBoundingClientRect().top+scrollY-featureTop;window.scrollTo({top:start+featureTravel*(i+.5)/3,behavior:'smooth'});}
 else renderFeature(i);
}
function readFeatureJourney(){
 featureFrame=0;if(!featureTravel||motion.matches)return;
 const p=(featureTop-featureJourney.getBoundingClientRect().top)/featureTravel;
 const stage=Math.max(0,Math.min(2,Math.floor(p*3)));
 if(stage!==lastFeatureStage){lastFeatureStage=stage;renderFeature(stage);}
}
function measureFeatureJourney(){
 const headerHeight=document.querySelector('.header').getBoundingClientRect().height,height=featureStory.offsetHeight;
 const pin=!motion.matches&&height<=innerHeight-headerHeight-24;
 featureTop=headerHeight+Math.max(12,(innerHeight-headerHeight-height)/2);
 featureTravel=pin?Math.round(Math.max(390,Math.min(800,innerHeight*.8))):0;
 featureJourney.style.setProperty('--feature-top',`${featureTop}px`);featureJourney.style.setProperty('--feature-travel',`${featureTravel}px`);
 featureJourney.classList.toggle('is-pinned',pin);featureHint.textContent=pin?'Desplázate para explorar':'Explora con las flechas o desliza';
 lastFeatureStage=-1;readFeatureJourney();
}
function queueFeatureJourney(){if(!featureFrame)featureFrame=requestAnimationFrame(readFeatureJourney);}
prev.addEventListener('click',()=>showFeature(current-1));next.addEventListener('click',()=>showFeature(current+1));
featureStory.addEventListener('keydown',e=>{if(e.target!==featureStory)return;let i;if(e.key==='ArrowRight')i=current+1;else if(e.key==='ArrowLeft')i=current-1;else if(e.key==='Home')i=0;else if(e.key==='End')i=2;else return;e.preventDefault();showFeature(i);});
featureStory.addEventListener('pointerdown',e=>{if(e.button!==0||e.target.closest('button'))return;featureGesture={x:e.clientX,y:e.clientY,id:e.pointerId};try{featureStory.setPointerCapture(e.pointerId);}catch{}});
featureStory.addEventListener('pointerup',e=>{if(!featureGesture||featureGesture.id!==e.pointerId)return;const dx=e.clientX-featureGesture.x,dy=e.clientY-featureGesture.y;featureGesture=null;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.5)showFeature(current+(dx<0?1:-1));});
featureStory.addEventListener('pointercancel',()=>featureGesture=null);
window.addEventListener('scroll',queueFeatureJourney,{passive:true});window.addEventListener('resize',measureFeatureJourney);motion.addEventListener('change',measureFeatureJourney);
renderFeature(0,false);measureFeatureJourney();if('ResizeObserver' in window)new ResizeObserver(measureFeatureJourney).observe(featureStory);
// Navegación manual accesible sin interceptar desplazamiento vertical.
showcase.addEventListener('keydown',e=>{
  if(e.key==='ArrowRight'){e.preventDefault();selectHero(heroIndex+1);}
  else if(e.key==='ArrowLeft'){e.preventDefault();selectHero(heroIndex-1);}
});
showcase.addEventListener('pointerdown',e=>{
  if(e.button!==0)return;
  heroSwipeStart={x:e.clientX,y:e.clientY,id:e.pointerId};
});
showcase.addEventListener('pointerup',e=>{
  if(!heroSwipeStart||heroSwipeStart.id!==e.pointerId)return;
  const dx=e.clientX-heroSwipeStart.x,dy=e.clientY-heroSwipeStart.y;
  heroSwipeStart=null;
  if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.5)selectHero(heroIndex+(dx<0?1:-1));
});
showcase.addEventListener('pointercancel',()=>heroSwipeStart=null);
if('IntersectionObserver' in window && !motion.matches){
 const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target);}}),{threshold:.08});
 document.querySelectorAll('.section-intro,.benefits article,.demo,.video-frame,.tech-grid article,.app-block,.faq,.closing').forEach(el=>{el.classList.add('reveal');revealObserver.observe(el);});
}
if(!motion.matches){let scheduled=false;function updateParallax(){scheduled=false;const rect=showcase.getBoundingClientRect();if(rect.bottom>0 && rect.top<innerHeight){showcase.style.setProperty('--parallax',`${Math.max(-24,Math.min(24,(innerHeight/2-rect.top-rect.height/2)*.055))}px`);}}window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateParallax);}},{passive:true});updateParallax();}
// Video explicativo: carga diferida, reproducción silenciosa una sola vez.
const VIDEO_SRC = '/assets/video/vitalink-demo.mp4';
const player=document.getElementById('product-video'),placeholder=document.getElementById('video-placeholder'),videoStatus=document.getElementById('video-status');
const videoFrame=document.getElementById('video-frame'),videoStart=document.getElementById('video-start'),videoAudio=document.getElementById('video-audio');
if(player&&placeholder&&videoFrame&&videoStart&&videoAudio){
 let requested=false,autoAttempted=false,visible=false,manual=false;
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
 function loadVideo(){if(!requested){requested=true;player.src=VIDEO_SRC;}}
 function audioLabel(){videoAudio.textContent=player.paused?'Reproducir con sonido':player.muted?'Activar sonido':'Silenciar video';}
 function playWithSound(){manual=true;autoAttempted=true;loadVideo();player.muted=false;player.play().catch(()=>{if(player.error)return;videoStatus.textContent='Pulsa reproducir para iniciar el video.';});}
 videoStart.addEventListener('click',playWithSound);
 videoAudio.addEventListener('click',()=>{if(player.paused){playWithSound();}else{manual=true;autoAttempted=true;player.muted=!player.muted;audioLabel();}});
 player.addEventListener('loadedmetadata',()=>{placeholder.hidden=true;player.hidden=false;videoAudio.hidden=false;audioLabel();});
 player.addEventListener('error',()=>{player.hidden=true;placeholder.hidden=false;videoAudio.hidden=true;videoStart.disabled=true;videoStatus.textContent='El video no está disponible en este momento.';});
 for(const name of ['playing','pause','volumechange','ended'])player.addEventListener(name,audioLabel);
 function pauseOutside(){if(!player.paused&&!document.fullscreenElement&&!player.webkitDisplayingFullscreen&&document.pictureInPictureElement!==player)player.pause();}
 if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{for(const e of entries){
   visible=e.isIntersecting&&e.intersectionRatio>=.55;
   if(visible&&!autoAttempted&&!manual&&!reduce.matches&&!navigator.connection?.saveData&&!document.hidden){
    autoAttempted=true;loadVideo();player.muted=true;player.play().then(()=>{if(!visible||document.hidden)pauseOutside();}).catch(()=>{});
   }
   if(!e.isIntersecting||e.intersectionRatio<.1)pauseOutside();
  }},{threshold:[0,.1,.55]});
  observer.observe(videoFrame);
 }
 document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseOutside();});
}

// Fondo Vitalink: se desvanece progresivamente al desplazarse.
const ambient=document.querySelector('.ambient-backdrop');
if(ambient){
  let bgScheduled=false;
  const maxFadeDistance=860;
  function updateAmbient(){
    bgScheduled=false;
    const y=Math.max(0,window.scrollY||window.pageYOffset||0);
    const fade=Math.max(0,1-(y/maxFadeDistance));
    document.documentElement.style.setProperty('--bg-fade',fade.toFixed(3));
    document.documentElement.style.setProperty('--bg-shift',`${Math.min(42,y*0.08)}px`);
  }
  updateAmbient();
  window.addEventListener('scroll',()=>{if(!bgScheduled){bgScheduled=true;requestAnimationFrame(updateAmbient);}}, {passive:true});
  window.addEventListener('resize',updateAmbient);
}
