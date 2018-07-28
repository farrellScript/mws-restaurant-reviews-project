import idb from 'idb'
const staticCacheName = "mwsrestaurantreview-v7";

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

function fromCache(request) {
	return caches.open(staticCacheName).then(function (cache) {
	  return cache.match(request);
	});
}

function update(request) {
	return caches.open(staticCacheName).then(function (cache) {
	  return fetch(request).then(function (response) {
		return cache.put(request, response.clone()).then(function () {
		  return response;
		});
	  });
	});
}
  

self.addEventListener('fetch',function(event){
	// check the event request url, and if it ends in restaurants set an id that will be used for IndexedDB
	const requestUrl = new URL(event.request.url);

	const id = requestUrl.href.endsWith('restaurants') ? "-1" : requestUrl.href.split('/').pop();

	// Check to see if the request is to the remote server
	if(requestUrl.port === '1337' && requestUrl.pathname === "/reviews/" && event.request.method === "GET"){
		
		event.respondWith(

				// console.log('got reviews', reviews.data);
				// if(reviews && reviews.data){
				// 	let unsynced2 = reviews.data.filter(review => {
				// 		console.log('review: ',review)
				// 		return review.unsynced === true
				// 	});
				// 	let unsynced = []
				// 	return Promise.all(unsynced.map(function(review){
				// 		fetch('http://localhost:1337/reviews/', {
				// 			method: 'POST',
				// 			body: JSON.stringify(review)
				// 		}).then(function(response){
				// 			return response.json();
				// 		}).then(function(response){
				// 			let synced = Object.assign({}, reviews);
				// 			reviews.data.map((review,index) => {
				// 				if((review.unsynced === true)&&(review.id == response.id)){
				// 					synced.data[index].unsynced = false
				// 				}
				// 			});
				// 			console.log('---',synced)
				// 			return dbPromise.then((db) => {
				// 				const tx = db.transaction('reviews', 'readwrite');
				// 				console.log('+++ ',synced)
				// 				tx.objectStore('reviews').put(synced);
				// 				return tx.complete;
				// 			});
				// 		});
				// 	}))
				// }else{
				// 	return reviews	
				// }

				// console.log('pending sync', unsynced);
		
				// return Promise.all(unsynced.map(review => {
				// 	console.log('Attempting fetch', review);
				// 	fetch('http://localhost:1337/reviews/', {
				// 	method: 'POST',
				// 	body: JSON.stringify(review)
				// })
				// .then((res) => {
				// 	console.log('Sent to server');
				// 	console.log('res',res)
				// 	const synced = Object.assign({}, review, { unsynced: false });
				// 	return dbPromise.then((db) => {
				// 		const tx = db.transaction('reviews', 'readwrite');
				// 		tx.objectStore('reviews').put(synced);
				// 		return tx.complete;
				// 	});

				// 	})
				// }))			
			// }).then(function(response){
			// 	return new Response(JSON.stringify(response));
			// }).catch(function(e){
			// 	console.log('e',e)
			// })
			// Check IndexedDB to see if a response for this request is in IndexedDB
			dbPromise.then(function(db){
				return db.transaction('reviews').objectStore('reviews').get(id);
			}).then(function(reviews){

				if(reviews){
					let unsynced = reviews.data.filter(review => {
						return typeof review.createdAt === "undefined"
					});		
					console.log('unsynced reviews:',unsynced)

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
				// return data;
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
					return dbPromise.then(function(db){
						var tx = db.transaction('restaurants','readwrite');
						var keyValStore = tx.objectStore('restaurants');
						keyValStore.put({
							id: id,
							data: json
						});
						return json;
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
					return response || fetch(event.request).then((response)=>{
						caches.open(staticCacheName).then(function(cache){
							cache.put(event.request,response.clone());
							return response;
						})
					});
				})
			)
		}else{
			event.respondWith(
				// Check to see if a response to this has been cached, if it is serve the cached response otherwise make a request to the network
				// caches.match(event.request).then(function(response) {
				// 	return response || fetch(event.request).then(function(response) {
				// 		caches.open(staticCacheName).then(function(cache){
				// 			cache.put(event.request, response.clone());
				// 			return response;
				// 		});
				// 	});
				// })
				caches.match(event.request).then((response)=>{
					return response || fetch(event.request).then((response)=>{
						caches.open(staticCacheName).then(function(cache){
							cache.put(event.request,response.clone());
							return response;
						})
					});
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

