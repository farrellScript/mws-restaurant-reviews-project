import idb from 'idb'
const staticCacheName = "mwsrestaurantreview-v1";

// Versioning of the IndexedDB database, to be used if the database needs to change
const dbPromise = idb.open('mwsrestaurantreviews',1,function(upgradeDb){
    switch(upgradeDb.oldVersion){
        case 0:
            upgradeDb.createObjectStore('restaurants',{keyPath:'id'});
    }
})

self.addEventListener('install',function(event){
	event.waitUntil(
		caches.open(staticCacheName)
		.then(function(cache){
			// Static Assets to Cache
			return cache.addAll([
				'/',
				'/restaurant.html',
				'/manifest.json',
				'/js/main.js',
				'/js/restaurant_info.js',
				'/js/dbhelper.js',
				'/js/leaflet.js',
				'/css/styles.css',
				'/img/avatar.svg',
				'/img/back.svg',
				'/img/clock.svg',
				'/img/cuisine.svg',
				'/img/downarrow.svg',
				'/img/downcaret.svg',
				'/img/emptystar.svg',
				'/img/fullstar.svg',
				'/img/waypoint.svg',
				'/img/marker-icon.png',
				'/img/marker-icon-2x.png',
				'/img/marker-shadow.png',
				'/img/logo_1x.png',
				'/img/logo_2x.png',
				'/img/undefined_1x.jpg',
				'/img/undefined_2x.jpg',
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
	// check the event request url, and if it ends in restaurants set an id that will be used for IndexedDB
	const requestUrl = new URL(event.request.url);
	const id = requestUrl.href.endsWith('restaurants') ? "-1" : requestUrl.href.split('/').pop();
	// Check to see if the request is to the remote server
	if(requestUrl.port === '1337'){
		event.respondWith(
			// Check IndexedDB to see if a response for this request is in IndexedDB
			dbPromise.then(function(db){
				return db.transaction('restaurants').objectStore('restaurants').get(id);
			}).then(function(data){
				// If it is, return it otherwise make the fetch request and put it into IndexedDB
				if(data && data.data){
					return data.data;
				}else{
					return fetch(event.request).then(function(response){
						return response.json();
					}).then(function(json){
						return dbPromise.then(function(db){
							var tx = db.transaction('restaurants','readwrite');
							var keyValStore = tx.objectStore('restaurants');
							keyValStore.put({
								id: id,
								data: json
							});
							return json;
						})
					});
				}
				
			}).then(function(response){
				return new Response(JSON.stringify(response));
			})
		)
	}
	else if(requestUrl.origin === location.origin){
		// Check to see if the request is to a restaurant page
		if(requestUrl.pathname.match('/restaurant.html(.?)')){
			event.respondWith(
				// Check to see if the restaurant page has been cached, if it is return the cached version otherwise get it from the network
				caches.match('/restaurant.html(.?)').then(function(response){
					if(response) return response;
					return fetch(event.request);
				})
			)
		}else{
			event.respondWith(
				// Check to see if a response to this has been cached, if it is serve the cached response otherwise make a request to the network
				caches.match(event.request).then(function(response) {
					return response || fetch(event.request);
				})
			);
		}
	}

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
