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
