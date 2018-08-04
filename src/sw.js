import idb from 'idb'
const staticCacheName = "mwsrestaurantreview-v4";

// Versioning of the IndexedDB database, to be used if the database needs to change
const dbPromise = idb.open('mwsrestaurants',2,function(upgradeDb){
    switch(upgradeDb.oldVersion){
        case 0:
			upgradeDb.createObjectStore('restaurants',{keyPath:'id'});
		case 1:
            upgradeDb.createObjectStore('reviews',{keyPath:'id'});
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
				'/js/dbworker.js',
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
				'/marker-icon.png',
				'/marker-icon-2x.png',
				'/marker-shadow.png',
				'/img/logo_1x.png',
				'/img/logo_2x.png',
				'/img/undefined_1x.jpg',
				'/img/undefined_2x.jpg',
			]).catch(function(e){
				console.error('e',e)
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
	if(requestUrl.port === '1337' && requestUrl.pathname === "/reviews/" && event.request.method === "GET"){
		
		event.respondWith(
			// Check IndexedDB to see if a response for this request is in IndexedDB
			dbPromise.then(function(db){
				return db.transaction('reviews').objectStore('reviews').get(id);
			}).then(function(reviews){

				if(reviews){
					let unsynced = reviews.data.filter(review => {
						return typeof review.createdAt === "undefined"
					});		


					return Promise.all(unsynced.map(function(review){
						fetch('http://localhost:1337/reviews/', {
							method: 'POST',
							body: JSON.stringify(review)
						}).then(function(response){
							return response.json();
						}).then(function(response){
							return response;
						});
					})).then(function(){
						return reviews;
					})
				}else{
					return
				}
		
			}).then(function(){
			return fetch(event.request).then(function(response){
				return response.json();
			}).then(function(json){
				return dbPromise.then(function(db){
					var tx = db.transaction('reviews','readwrite');
					var keyValStore = tx.objectStore('reviews');
					keyValStore.put({
						id: id,
						data: json
					});
					return json;
				})
			}).catch(function(){
				// there was an error, just respond with what was in the cache
				return dbPromise.then(function(db){
					return db.transaction('reviews').objectStore('reviews').get(id);
				}).then(function(reviews){
					return reviews;
				})
				
			});
				
				
			}).then(function(response){
				return new Response(JSON.stringify(response));
			}).catch(function(response){
				return new Response(JSON.stringify(response));
			})
		)
	}
	else if(requestUrl.port === '1337' && requestUrl.pathname != "/reviews/" && event.request.method === "GET"){

		event.respondWith(
			
			// Check IndexedDB to see if a response for this request is in IndexedDB
			dbPromise.then(function(db){
				return db.transaction('restaurants').objectStore('restaurants').get(id);
			}).then(function(data){
				return fetch(event.request).then(function(response){
					return response.json();
				}).then(function(json){
					
					let serverFavorite = json.is_favorite
					return dbPromise.then(function(db){
						var tx = db.transaction('restaurants','readwrite');
						var keyValStore = tx.objectStore('restaurants');
						return keyValStore.get(id).then(function(response){

							// The local and server don't match, try to update the server
							if(response.data.is_favorite != serverFavorite){
								console.log('they do not match')
								if(response.data.is_favorite == 'true'){
									console.log('making favorite')
									fetch('http://localhost:1337/restaurants/1/?is_favorite=true', {
										method: 'PUT'
									}).then(function(json){
										return json.json()
									}).then(function(response){
										console.log('response: ',response)
										return dbPromise.then((db) => {
											const tx = db.transaction('restaurants', 'readwrite');
											tx.objectStore('restaurants').put({id:`${response.id}`,data:response});
											return tx.complete;
										});
									}).then(function(){
										self.clients.matchAll().then(function (clients){
											clients.forEach(function(client){
												client.postMessage({favorite:true});
											});
										}); 
										
										
									})
								}else{
									console.log('making unfavorite')
									fetch('http://localhost:1337/restaurants/1/?is_favorite=false', {
										method: 'PUT'
									}).then(function(json){
										return json.json()
									}).then(function(response){
										console.log('response: ',response)
										return dbPromise.then((db) => {
											const tx = db.transaction('restaurants', 'readwrite');
											tx.objectStore('restaurants').put({id:`${response.id}`,data:response});
											return tx.complete;
										});
									}).then(function(){
										self.clients.matchAll().then(function (clients){
											clients.forEach(function(client){
												client.postMessage({favorite:false});
											});
										}); 
									})
								}
							}
							;
							return json;
						})
		
					
					}).catch(function(){
						return dbPromise.then(function(db){
							var tx = db.transaction('restaurants','readwrite');
							var keyValStore = tx.objectStore('restaurants');
							keyValStore.put({
								id: id,
								data: json
							});
							return json;
						})
					})
				}).catch(function(){
					// there was an error, just respond with what was in the cache
					return data.data;
				});
				
				
			}).then(function(response){
				return new Response(JSON.stringify(response));
			})
		)
	}	
	else if(requestUrl.origin === location.origin && event.request.method === "GET"){
		// Check to see if the request is to a restaurant page
		if(requestUrl.pathname.substr(requestUrl.pathname.lastIndexOf('/') + 1) === 'restaurant.html'){
			event.respondWith(
				// Check to see if the restaurant page has been cached, if it is return the cached version otherwise get it from the network
				caches.match('/restaurant.html').then((response)=>{
					return fetch(event.request).then(function(response){
						return caches.open(staticCacheName).then(function(cache){
							cache.put(event.request,response.clone());
							return response;
						})
					}).catch(function() {
						return caches.match(event.request);
					});
				})
			)
		}else{
			event.respondWith(
				caches.match(event.request).then((response)=>{
					return fetch(event.request).then(function(response){
						return caches.open(staticCacheName).then(function(cache){
							cache.put(event.request,response.clone());
							return response;
						})
					}).catch(function() {
						return caches.match(event.request);
					})
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
			console.error('error ',e)
		});
	}
});

self.addEventListener('sync', (event) => {

	if (event.tag == "add-review") {
		console.log('attempting sync', event.tag);
		console.log('syncing', event.tag);		
		event.waitUntil(
			dbPromise.then(function(db){
				return db.transaction('reviews').objectStore('reviews').getAll();
			}).then(reviews => {
				const unsynced = reviews[0].data.filter(review => review.unsynced);
				console.log('pending sync', unsynced);
				return Promise.all(unsynced.map(review => {
					console.log('Attempting fetch', review);
					fetch('http://localhost:1337/reviews/', {
					method: 'POST',
					body: JSON.stringify(review)
				})
				.then((res) => {
					const synced = Object.assign({}, review, { unsynced: false });
					return dbPromise.then((db) => {
						const tx = db.transaction('reviews', 'readwrite');
						tx.objectStore('reviews').put(synced);
						return tx.complete;
					});

					})
				}))
			})
		)
	}
});

