importScripts('./dbhelper.js');
import idb from 'idb';

// Versioning of the IndexedDB database, to be used if the database needs to change
const dbPromise = idb.open('mwsrestaurants',2,function(upgradeDb){
    switch(upgradeDb.oldVersion){
        case 0:
            upgradeDb.createObjectStore('restaurants',{keyPath:'id'});
        case 1:
            upgradeDb.createObjectStore('reviews',{keyPath:'id'});
    }
})

self.addEventListener('message', function(e) {
    switch(e.data.action){
        case 'fetchNeighborhoods':
            // Fetch all restaurants
            DBHelper.fetchRestaurants((error, restaurants) => {
                if (error) {
                    self.postMessage('error');
                } else {
                    // Get all neighborhoods from all restaurants
                    const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
                    // Remove duplicates from neighborhoods
                    const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
                    self.postMessage({'neighborhoods':uniqueNeighborhoods});
                }
            });
            break;
        case 'fetchCuisines':
              // Fetch all restaurants
            DBHelper.fetchRestaurants((error, restaurants) => {

                if (error) {
                    self.postMessage('error');
                } else {
                    // Get all cuisines from all restaurants
                    const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
                    // Remove duplicates from cuisines
                    const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
                    self.postMessage({'cuisines':uniqueCuisines});
                }
            });
            break;
        case 'fetchRestaurantByCuisineAndNeighborhood':

            // Fetch all restaurants
            DBHelper.fetchRestaurants((error, restaurants) => {
                if (error) {
                    self.postMessage('error');
                } else {
                    let results = restaurants
                    if (e.data.cuisine != 'all') { // filter by cuisine
                        results = results.filter(r => r.cuisine_type == e.data.cuisine);
                    }
                    if (e.data.neighborhood != 'all') { // filter by neighborhood
                        results = results.filter(r => r.neighborhood == e.data.neighborhood);
                    }
                    self.postMessage({'results':results});
                }
            });

            break; 
        case 'createRestaurantHTML':
            const restaurant = e.data.restaurant;
            const webpsrcset = DBHelper.imageWebPSrcSetForRestaurant(restaurant);
            const jpgsrcset = DBHelper.imageJpgSrcSetForRestaurant(restaurant);
            const imagetext = DBHelper.imageTextForRestaurant(restaurant);
            const imageurl = DBHelper.imageUrlForRestaurant(restaurant);
            const urltext = DBHelper.urlTextForRestaurant(restaurant)
            const url = DBHelper.urlForRestaurant(restaurant)
            const fetchResults = fetch(`http://localhost:1337/restaurants/${e.data.restaurant.id}`)
                .then((res)=>{
                    return res.json();
                })
                .then((results)=>{
                    return results
                })
            const fetchReviews = fetch(`http://localhost:1337/reviews/?restaurant_id=${e.data.restaurant.id}`)
                .then((res)=>{
                    return res.json();
                })
                .then((results)=>{
                    let total = 0;
                    let sum = 0;
                    results.map((item)=>{
                        total += 1;
                        sum += parseInt(item.rating)
                    })
                    return Math.round(sum/total);
                })
            Promise.all([fetchResults,fetchReviews,webpsrcset, jpgsrcset, imagetext,imageurl,urltext,url]).then((values)=>{
                self.postMessage({'restaurant':values[0], 'reviews': values[1],webpsrcset, jpgsrcset, imagetext,imageurl,urltext,url});
            })
            break;
        case 'fetchRestaurantById':
            

            const restaurantDetails = fetch(`http://localhost:1337/restaurants/${e.data.id}`)
                .then((res)=>{
                    return res.json();
                }).then((res)=>{
                    const webpsrcset = DBHelper.imageWebPSrcSetForRestaurant(res);
                    const jpgsrcset = DBHelper.imageJpgSrcSetForRestaurant(res);
                    const imagetext = DBHelper.imageTextForRestaurant(res);
                    const imageurl = DBHelper.imageUrlForRestaurant(res);
                    return Promise.all([res,webpsrcset,jpgsrcset,imagetext,imageurl]).then((values)=>{
                        return values;
                    });
                });
            const restaurantReviews = fetch(`http://localhost:1337/reviews/?restaurant_id=${e.data.id}`)
                .then((res)=>{
                    return res.json();
                })
                .then((results)=>{
                    let total = 0;
                    let sum = 0;
                    results.map((item)=>{
                        total += 1;
                        sum += parseInt(item.rating)
                    })
                    return Math.round(sum/total);
                })
            Promise.all([restaurantDetails,restaurantReviews]).then((values)=>{
                self.postMessage({'restaurant':values[0][0], 'reviews': values[1],'webpsrcset':values[0][1],'jpgsrcset':values[0][2],'imagetext':values[0][3],'imageurl':values[0][4]});
            });
            break;
        case 'fillReviewsHTML':
            // make ajax request to get reviews for a given restaurant
            fetch(`http://localhost:1337/reviews/?restaurant_id=${e.data.id}`)
                .then((res)=>{
                    return res.json();
                })
                .then((results)=>{
                    self.postMessage({reviews:results});
                });
        case 'postReview':
            fetch(`http://localhost:1337/reviews/`,{
                method: 'post',
                body: JSON.stringify(e.data.data),
                headers:{
                    'Content-Type': 'application/json'
                }
            }).then((response)=>{
                return response.json();
            }).then((response)=>{
                self.postMessage({restaurant_id:response.restaurant_id});
            })

            // Do we have ServiceWorker
            navigator.serviceWorker.ready.then(registration => {
                // Put the dream in IndexedDB for later syncing
                return dreamDb().then(db => {
                    const tx = db.transaction('dream', 'readwrite');
                    tx.objectStore('dream').put(value, key);
                    return tx.complete;
                });

                return putDream(dream, dream.id).then(() => {
                // Register a sync with the ServiceWorker
                return registration.sync.register('add-dream')
                });
            })
            break;
        default:
          console.log('none of the above')
    }



    
}, false);