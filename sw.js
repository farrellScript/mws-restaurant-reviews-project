const staticCacheName = "mws-v1";

self.addEventListener('install',(event)=>{
	event.waitUntil(
		caches.open(staticCacheName)
		.then((cache)=>{
			return cache.addAll([
				'/index.html',
				'/restaurant.html',
				'/js/main.js',
				'/js/restaurant_info.js',
				'/js/dbhelper.js',
				'/data/restaurants.json',
				'/css/styles.css',
			]).catch((e)=>{
				console.log('e',e)
			});
		})
	)
})

self.addEventListener('activate', function(event) {
	event.waitUntil(
	  caches.keys().then(function(cacheNames) {
			return Promise.all(
				cacheNames.filter(function(cacheName) {
				return cacheName.startsWith('mws-') &&
					cacheName != staticCacheName;
				}).map(function(cacheName) {
					return caches.delete(cacheName);
				})
			);
	  })
	);
});

self.addEventListener('fetch',function(event){
	const requestUrl = new URL(event.request.url);
	if(requestUrl.origin === location.origin){
		if(requestUrl.pathname === "/"){
			event.respondWith(caches.match('/index.html'))
			return;
		}
		if(requestUrl.pathname.match('/restaurant.html(.?)')){
			event.respondWith(caches.match('/restaurant.html'))
			return;
		}
	}
	event.respondWith(
		caches.match(event.request)
		.then((response)=>{
			return response || fetch(event.request)
			.catch((e)=>{
				console.log('e',e);
			});
		})
	)
})