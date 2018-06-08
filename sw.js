var staticCacheName = "mws-v12";

self.addEventListener('install',function(event){
	event.waitUntil(
		caches.open(staticCacheName)
		.then(function(cache){
			return cache.addAll([
				'/',
				'/restaurant.html',
				'/js/main.js',
				'/js/restaurant_info.js',
				'/js/dbhelper.js',
				'/data/restaurants.json',
				'/css/styles.css',
			]).catch(function(e){
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
		if(requestUrl.pathname.match('/restaurant.html(.?)')){
			event.respondWith(caches.match('/restaurant.html'))
			return;
		}
	}
	event.respondWith(
		caches.match(event.request).then(function(response){
			if(response) return response;
			return fetch(event.request).catch(function(e){
				console.log('e',e);
			});
		})
	)
});

self.addEventListener('message', function(event) {
	if (event.data.action == 'skipWaiting') {
		self.skipWaiting().then(function() {
			console.log('skipped')
		}).catch(function(e){
			console.log('error ',e)
		});
	}
});
