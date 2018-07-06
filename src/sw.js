import idb from 'idb'
const staticCacheName = "mwsrestaurantreview-v1";

// Versioning of the IndexedDB database, to be used if the database needs to change
const dbPromise = idb.open('mwsrestaurantreviews',1,function(upgradeDb){
    switch(upgradeDb.oldVersion){
        case 0:
            upgradeDb.createObjectStore('restaurants',{keyPath:'id'});
    }
})

// Install event for Service Worker
self.addEventListener('install',function(event){
	event.waitUntil(
		caches.open(staticCacheName)
		.then(function(cache){
			// Static assets that will allow the app to run offline
			return cache.addAll([
				'/',
				'/restaurant.html',
				'/manifest.json',
				'/js/main.js',
				'/js/restaurant_info.js',
				'/js/dbhelper.js',
				'/js/leaflet.js',
				'/css/styles.css',
				'/css/leaflet.css',
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

// Activate event for the service worker
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

// Fetch event for the service worker
self.addEventListener('fetch',function(event){
	// Get the event request url
	const requestUrl = new URL(event.request.url);
	// define and id for requests to the remote server
	const id = requestUrl.href.endsWith('restaurants') ? "-1" : requestUrl.href.split('/').pop();
	// Check to see if the fetch request is to the remote server
	if(requestUrl.port === '1337'){
		event.respondWith(
			// Check IndexedDB to see if a response for this request has been stored
			dbPromise.then(function(db){
				return db.transaction('restaurants').objectStore('restaurants').get(id);
			}).then(function(data){
				// if it is, return what was last stored
				if(data && data.data){
					return data.data;
				}else{
					// if it's not, make a fetch request and store that in IndexedDB
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
				// Return the final response
				return new Response(JSON.stringify(response));
			})
		)
	}
	else if(requestUrl.origin === location.origin){
		// Check to see if the request is to one of the restaurant pages
		if(requestUrl.pathname.match('/restaurant.html(.?)')){
			event.respondWith(
				// The request is for a restaurant page, check to see if its in the cache otherwise make the fetch request
				caches.match('/restaurant.html(.?)').then(function(response){
					if(response) return response;
					return fetch(event.request);
				})
			)
		}else{
			// The request is not to one of the restaurant pages
			event.respondWith(
				// Check the cache to see if this is stored, return what's stored if it's there otherwise make the fetch request
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
