/* FITKNOW V10. Always retrieve current HTML while online; cache app shell for offline use. */
const CACHE_NAME='fitknow-v17-dashboard';
const APP_SHELL=[
 './index.html','./manifest.webmanifest','./icon.svg',
 './assets/fitness-couple-approved.webp',
 './assets/fitness-couple-hero-v14.webp', './assets/fitness-couple-fullbody-v16.webp',
 './assets/dashboard-icons/nutrition.webp',
 './assets/dashboard-icons/training.webp',
 './assets/dashboard-icons/supplements.webp',
 './assets/dashboard-icons/analyses.webp',
 './assets/dashboard-icons/cardio.webp',
 './assets/dashboard-icons/protocol.webp',
 './assets/dashboard-icons/data.webp',
 './assets/dashboard-icons/settings.webp',
 './stickers/dumbbell.svg','./stickers/apple.svg','./stickers/chart.svg',
 './stickers/heart.svg','./stickers/clipboard.svg','./stickers/flame.svg',
 './stickers/water.svg','./stickers/check.svg'
];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('fitknow-')&&key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
 const url=new URL(request.url);
 const isDocument=request.mode==='navigate'||url.pathname.endsWith('/index.html')||url.pathname.endsWith('/FITKNOW/');
 if(isDocument){
  event.respondWith(fetch(new Request(request,{cache:'no-store'})).then(response=>{
   if(response.ok){const clone=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put('./index.html',clone));}
   return response;
  }).catch(async()=>await caches.match('./index.html')||Response.error()));
  return;
 }
 event.respondWith(fetch(new Request(request,{cache:'no-cache'})).then(response=>{
  if(response.ok){const clone=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(request,clone));}
  return response;
 }).catch(async()=>await caches.match(request)||Response.error()));
});
