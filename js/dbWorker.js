/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dbhelper_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_idb__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_idb___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_idb__);
importScripts('./dbhelper.js');




// Versioning of the IndexedDB database, to be used if the database needs to change
const dbPromise = __WEBPACK_IMPORTED_MODULE_1_idb___default.a.open('mwsrestaurants',2,function(upgradeDb){
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
            __WEBPACK_IMPORTED_MODULE_0__dbhelper_js__["a" /* default */].fetchRestaurants((error, restaurants) => {
                if (error) {
                    self.postMessage('error');
                } else {
                    // Get all neighborhoods from all restaurants
                    const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
                    // Remove duplicates from neighborhoods
                    const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
                    self.postMessage({'action':'fetchNeighborhoods','neighborhoods':uniqueNeighborhoods});
                }
            });
            break;
        case 'fetchCuisines':
              // Fetch all restaurants
            __WEBPACK_IMPORTED_MODULE_0__dbhelper_js__["a" /* default */].fetchRestaurants((error, restaurants) => {

                if (error) {
                    self.postMessage('error');
                } else {
                    // Get all cuisines from all restaurants
                    const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
                    // Remove duplicates from cuisines
                    const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
                    self.postMessage({'action':'fetchCuisines','cuisines':uniqueCuisines});
                }
            });
            break;
        case 'fetchRestaurantByCuisineAndNeighborhood':

            // Fetch all restaurants
            __WEBPACK_IMPORTED_MODULE_0__dbhelper_js__["a" /* default */].fetchRestaurants((error, restaurants) => {
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
                    self.postMessage({'action':'fetchRestaurantByCuisineAndNeighborhood','results':results});
                }
            });

            break; 
        case 'createRestaurantHTML':
            const restaurant = e.data.restaurant;
            const webpsrcset = __WEBPACK_IMPORTED_MODULE_0__dbhelper_js__["a" /* default */].imageWebPSrcSetForRestaurant(restaurant);
            const jpgsrcset = __WEBPACK_IMPORTED_MODULE_0__dbhelper_js__["a" /* default */].imageJpgSrcSetForRestaurant(restaurant);
            const imagetext = __WEBPACK_IMPORTED_MODULE_0__dbhelper_js__["a" /* default */].imageTextForRestaurant(restaurant);
            const imageurl = __WEBPACK_IMPORTED_MODULE_0__dbhelper_js__["a" /* default */].imageUrlForRestaurant(restaurant);
            const urltext = __WEBPACK_IMPORTED_MODULE_0__dbhelper_js__["a" /* default */].urlTextForRestaurant(restaurant)
            const url = __WEBPACK_IMPORTED_MODULE_0__dbhelper_js__["a" /* default */].urlForRestaurant(restaurant)
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
                }).catch(function(){
                    return dbPromise.then(function(db){
                        return db
                            .transaction('reviews')
                            .objectStore('reviews')
                            .get(`?restaurant_id=${e.data.restaurant.id}`)
                    }).then(function(results){
                        let total = 0;
                        let sum = 0;
                        results.data.map((item)=>{
                            total += 1;
                            sum += parseInt(item.rating)
                        })
                        return Math.round(sum/total);
                    })
                    console.log('error')
                })
            Promise.all([fetchResults,fetchReviews,webpsrcset, jpgsrcset, imagetext,imageurl,urltext,url]).then((values)=>{
                self.postMessage({'action':'createRestaurantHTML','restaurant':values[0], 'reviews': values[1],webpsrcset, jpgsrcset, imagetext,imageurl,urltext,url});
            })
            break;
        case 'fetchRestaurantById':
            

            const restaurantDetails = fetch(`http://localhost:1337/restaurants/${e.data.id}`)
                .then((res)=>{
                    return res.json();
                }).then((res)=>{
                    const webpsrcset = __WEBPACK_IMPORTED_MODULE_0__dbhelper_js__["a" /* default */].imageWebPSrcSetForRestaurant(res);
                    const jpgsrcset = __WEBPACK_IMPORTED_MODULE_0__dbhelper_js__["a" /* default */].imageJpgSrcSetForRestaurant(res);
                    const imagetext = __WEBPACK_IMPORTED_MODULE_0__dbhelper_js__["a" /* default */].imageTextForRestaurant(res);
                    const imageurl = __WEBPACK_IMPORTED_MODULE_0__dbhelper_js__["a" /* default */].imageUrlForRestaurant(res);
                    return Promise.all([res,webpsrcset,jpgsrcset,imagetext,imageurl]).then((values)=>{
                        return values;
                    });
                }).catch(()=>{
                    console.log('error')
                })
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
                }).catch(()=>{
                    return dbPromise.then(function(db){
                        return db
                            .transaction('reviews')
                            .objectStore('reviews')
                            .get(`?restaurant_id=${e.data.id}`)
                    }).then(function(results){
                        let total = 0;
                        let sum = 0;
                        results.data.map((item)=>{
                            total += 1;
                            sum += parseInt(item.rating)
                        })
                        return Math.round(sum/total);
                    })
                })
            Promise.all([restaurantDetails,restaurantReviews]).then((values)=>{
                self.postMessage({'action':'fetchRestaurantById','restaurant':values[0][0], 'reviews': values[1],'webpsrcset':values[0][1],'jpgsrcset':values[0][2],'imagetext':values[0][3],'imageurl':values[0][4]});
            });
            break;
        case 'fillReviewsHTML':
            // make ajax request to get reviews for a given restaurant
            fetch(`http://localhost:1337/reviews/?restaurant_id=${e.data.id}`)
                .then((res)=>{
                    return res.json();
                })
                .then((results)=>{
                    self.postMessage({'action':'fillReviewsHTML',reviews:results.data ? results.data:results});
                }).catch(()=>{
                    console.log('error')
                })
        case 'postReview':
            if(e.data.data){
                fetch(`http://localhost:1337/reviews/`,{
                    method: 'post',
                    body: JSON.stringify(e.data.data),
                }).then((response)=>{
                    return response.json();
                }).then((response)=>{

                    let firstResponse = response
                    return dbPromise.then(function(db){
                        return db
                            .transaction('reviews')
                            .objectStore('reviews')
                            .get(`?restaurant_id=${e.data.data.restaurant_id}`)
                    }).then(function(response){
  
                        let reviews = response.data;
                        reviews.push(firstResponse);
                        let newReviews = {id:response.id,data:reviews}
                        return __WEBPACK_IMPORTED_MODULE_1_idb___default.a.open('mwsrestaurants').then((db)=>{
                            var tx = db.transaction('reviews','readwrite')
                            var store = tx.objectStore('reviews')
                            return store.put(newReviews)
                        })      
                    }).then(function(){
                        self.postMessage({'action':'postReview',restaurant_id:response.restaurant_id});
                    });      
                }).catch((error)=>{                
                    return dbPromise.then(function(db){
                        return db
                            .transaction('reviews')
                            .objectStore('reviews')
                            .get(`?restaurant_id=${e.data.data.restaurant_id}`)
                    }).then(function(response){
                        let reviews = response.data;
                        reviews.push(e.data.data);

                        let newReviews = {id:response.id,data:reviews}
                        return __WEBPACK_IMPORTED_MODULE_1_idb___default.a.open('mwsrestaurants').then((db)=>{
                            var tx = db.transaction('reviews','readwrite')
                            var store = tx.objectStore('reviews')
                            return store.put(newReviews)
                        })      
                    }).then(function(){
                        console.log('time to add a sync')
                        //self.postMessage({action:'sync'});
                    });          
                })
            }
            break;
        case 'favoriteRestaurant':
        console.log('favorite')
        
            fetch(`http://localhost:1337/restaurants/${e.data.id}/?is_favorite=${e.data.value}`, {
                method: 'PUT'
            }).then(function(res){
                return res.json()
            }).then(function(res){
                console.log('res',res)
                let returnedResult = res
                return dbPromise.then(function(db){
                    return db
                        .transaction('restaurants')
                        .objectStore('restaurants')
                        .get(`${e.data.id}`)
                }).then(function(result){

                    let newReviews = {id:`${returnedResult.id}`,data:returnedResult}
                    console.log('newReviews',newReviews)
                    return __WEBPACK_IMPORTED_MODULE_1_idb___default.a.open('mwsrestaurants').then((db)=>{
                        var tx = db.transaction('restaurants','readwrite')
                        var store = tx.objectStore('restaurants')
                        return store.put(newReviews)
                    }) 
                }).then(function(){
                    self.postMessage({'action':'favoriteRestaurant',favorite:e.data.value});
                }) 
            }).catch(function(){
                console.log('whoops')
                return dbPromise.then(function(db){
                    return db
                        .transaction('restaurants')
                        .objectStore('restaurants')
                        .get(`${e.data.id}`)
                }).then(function(result){
                    let newResult = result
                    newResult.data.is_favorite = `${e.data.value}`
                    let newReviews = {id:e.data.id,data:newResult.data}
                    console.log('newReviews',newReviews.data)
                    return __WEBPACK_IMPORTED_MODULE_1_idb___default.a.open('mwsrestaurants').then((db)=>{
                        var tx = db.transaction('restaurants','readwrite')
                        var store = tx.objectStore('restaurants')
                        return store.put(newReviews)
                    }) 
                }).then(function(){
                    self.postMessage({'action':'favoriteRestaurant',favorite:e.data.value});
                })       
            })
            break;
        default:
          console.log('none of the above')
    }



    
}, false);

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 8000 // Change this to your server port
    return `http://localhost:1337/restaurants`;
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    fetch(DBHelper.DATABASE_URL).then(function(response) {
      // Check the response status
      if(response.status === 200){
        // Success
        return response.json();
      }else{
        // Error
        const error = (`Request failed. Returned status of ${response.body}`);
        callback(error,null)
      }
    }).then(function(json) {
        callback(null,json);
    }).catch(function(e){
        console.log('error: ',e)
    });
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }


  /**
   * Restaurant page URL.
   */
  static urlTextForRestaurant(restaurant) {
    return (`View Details For ${restaurant.name}`);
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return (`/img/${restaurant.photograph}.jpg`);
  }

/**
   * Restaurant image alt text
   */
  static imageTextForRestaurant(restaurant) {
    return (`${restaurant.name}`);
  }

  /**
   * Restaurant image alt text
   */
  static ratingForRestaurant(restaurant) {
    fetch(`http://localhost:1337/reviews/?restaurant_id=${restaurant.id}`).then((response)=>{
      return response.json();
    }).then((items)=>{
      let reviews = 0;
      let total = 0;
      items.map((item)=>{
        reviews++;
        total = total + parseInt(item.rating)
      })
      return (Math.round(total/reviews));
    })

  }

  /**
   * Restaurant Image Source Set
   */
  static imageSrcSetForRestaurant(restaurant) {
    return (`/img/${restaurant.photograph}_1x.jpg 1x, /img/${restaurant.photograph}_2x.jpg 2x`);
  }

  /**
   * Restaurant Image Source Set, jpg
   */
  static imageJpgSrcSetForRestaurant(restaurant) {
    return (`/img/${restaurant.photograph}_1x.jpg 1x, /img/${restaurant.photograph}_2x.jpg 2x`);
  }

  /**
   * Restaurant Image Source Set, webp
   */
  static imageWebPSrcSetForRestaurant(restaurant) {
    return (`/img/${restaurant.photograph}_1x.webp 1x, /img/${restaurant.photograph}_2x.webp 2x`);
  }


  /**
   * Restaurant Image Source Fallback
   */
  static imageSrcForRestaurant(restaurant) {
    return (`/img/${restaurant.photograph}_1x.jpg`);
  }

  /**
   * Map marker for a restaurant.
   */
  // static mapMarkerForRestaurant(restaurant, map) {
  //   // https://leafletjs.com/reference-1.3.0.html#marker  
  //   const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
  //     {title: restaurant.name,
  //     alt: restaurant.name,
  //     url: DBHelper.urlForRestaurant(restaurant)
  //     })
  //     marker.addTo(newMap);
  //   return marker;
  //  } 

}
/* harmony export (immutable) */ __webpack_exports__["a"] = DBHelper;



/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function() {
  function toArray(arr) {
    return Array.prototype.slice.call(arr);
  }

  function promisifyRequest(request) {
    return new Promise(function(resolve, reject) {
      request.onsuccess = function() {
        resolve(request.result);
      };

      request.onerror = function() {
        reject(request.error);
      };
    });
  }

  function promisifyRequestCall(obj, method, args) {
    var request;
    var p = new Promise(function(resolve, reject) {
      request = obj[method].apply(obj, args);
      promisifyRequest(request).then(resolve, reject);
    });

    p.request = request;
    return p;
  }

  function promisifyCursorRequestCall(obj, method, args) {
    var p = promisifyRequestCall(obj, method, args);
    return p.then(function(value) {
      if (!value) return;
      return new Cursor(value, p.request);
    });
  }

  function proxyProperties(ProxyClass, targetProp, properties) {
    properties.forEach(function(prop) {
      Object.defineProperty(ProxyClass.prototype, prop, {
        get: function() {
          return this[targetProp][prop];
        },
        set: function(val) {
          this[targetProp][prop] = val;
        }
      });
    });
  }

  function proxyRequestMethods(ProxyClass, targetProp, Constructor, properties) {
    properties.forEach(function(prop) {
      if (!(prop in Constructor.prototype)) return;
      ProxyClass.prototype[prop] = function() {
        return promisifyRequestCall(this[targetProp], prop, arguments);
      };
    });
  }

  function proxyMethods(ProxyClass, targetProp, Constructor, properties) {
    properties.forEach(function(prop) {
      if (!(prop in Constructor.prototype)) return;
      ProxyClass.prototype[prop] = function() {
        return this[targetProp][prop].apply(this[targetProp], arguments);
      };
    });
  }

  function proxyCursorRequestMethods(ProxyClass, targetProp, Constructor, properties) {
    properties.forEach(function(prop) {
      if (!(prop in Constructor.prototype)) return;
      ProxyClass.prototype[prop] = function() {
        return promisifyCursorRequestCall(this[targetProp], prop, arguments);
      };
    });
  }

  function Index(index) {
    this._index = index;
  }

  proxyProperties(Index, '_index', [
    'name',
    'keyPath',
    'multiEntry',
    'unique'
  ]);

  proxyRequestMethods(Index, '_index', IDBIndex, [
    'get',
    'getKey',
    'getAll',
    'getAllKeys',
    'count'
  ]);

  proxyCursorRequestMethods(Index, '_index', IDBIndex, [
    'openCursor',
    'openKeyCursor'
  ]);

  function Cursor(cursor, request) {
    this._cursor = cursor;
    this._request = request;
  }

  proxyProperties(Cursor, '_cursor', [
    'direction',
    'key',
    'primaryKey',
    'value'
  ]);

  proxyRequestMethods(Cursor, '_cursor', IDBCursor, [
    'update',
    'delete'
  ]);

  // proxy 'next' methods
  ['advance', 'continue', 'continuePrimaryKey'].forEach(function(methodName) {
    if (!(methodName in IDBCursor.prototype)) return;
    Cursor.prototype[methodName] = function() {
      var cursor = this;
      var args = arguments;
      return Promise.resolve().then(function() {
        cursor._cursor[methodName].apply(cursor._cursor, args);
        return promisifyRequest(cursor._request).then(function(value) {
          if (!value) return;
          return new Cursor(value, cursor._request);
        });
      });
    };
  });

  function ObjectStore(store) {
    this._store = store;
  }

  ObjectStore.prototype.createIndex = function() {
    return new Index(this._store.createIndex.apply(this._store, arguments));
  };

  ObjectStore.prototype.index = function() {
    return new Index(this._store.index.apply(this._store, arguments));
  };

  proxyProperties(ObjectStore, '_store', [
    'name',
    'keyPath',
    'indexNames',
    'autoIncrement'
  ]);

  proxyRequestMethods(ObjectStore, '_store', IDBObjectStore, [
    'put',
    'add',
    'delete',
    'clear',
    'get',
    'getAll',
    'getKey',
    'getAllKeys',
    'count'
  ]);

  proxyCursorRequestMethods(ObjectStore, '_store', IDBObjectStore, [
    'openCursor',
    'openKeyCursor'
  ]);

  proxyMethods(ObjectStore, '_store', IDBObjectStore, [
    'deleteIndex'
  ]);

  function Transaction(idbTransaction) {
    this._tx = idbTransaction;
    this.complete = new Promise(function(resolve, reject) {
      idbTransaction.oncomplete = function() {
        resolve();
      };
      idbTransaction.onerror = function() {
        reject(idbTransaction.error);
      };
      idbTransaction.onabort = function() {
        reject(idbTransaction.error);
      };
    });
  }

  Transaction.prototype.objectStore = function() {
    return new ObjectStore(this._tx.objectStore.apply(this._tx, arguments));
  };

  proxyProperties(Transaction, '_tx', [
    'objectStoreNames',
    'mode'
  ]);

  proxyMethods(Transaction, '_tx', IDBTransaction, [
    'abort'
  ]);

  function UpgradeDB(db, oldVersion, transaction) {
    this._db = db;
    this.oldVersion = oldVersion;
    this.transaction = new Transaction(transaction);
  }

  UpgradeDB.prototype.createObjectStore = function() {
    return new ObjectStore(this._db.createObjectStore.apply(this._db, arguments));
  };

  proxyProperties(UpgradeDB, '_db', [
    'name',
    'version',
    'objectStoreNames'
  ]);

  proxyMethods(UpgradeDB, '_db', IDBDatabase, [
    'deleteObjectStore',
    'close'
  ]);

  function DB(db) {
    this._db = db;
  }

  DB.prototype.transaction = function() {
    return new Transaction(this._db.transaction.apply(this._db, arguments));
  };

  proxyProperties(DB, '_db', [
    'name',
    'version',
    'objectStoreNames'
  ]);

  proxyMethods(DB, '_db', IDBDatabase, [
    'close'
  ]);

  // Add cursor iterators
  // TODO: remove this once browsers do the right thing with promises
  ['openCursor', 'openKeyCursor'].forEach(function(funcName) {
    [ObjectStore, Index].forEach(function(Constructor) {
      // Don't create iterateKeyCursor if openKeyCursor doesn't exist.
      if (!(funcName in Constructor.prototype)) return;

      Constructor.prototype[funcName.replace('open', 'iterate')] = function() {
        var args = toArray(arguments);
        var callback = args[args.length - 1];
        var nativeObject = this._store || this._index;
        var request = nativeObject[funcName].apply(nativeObject, args.slice(0, -1));
        request.onsuccess = function() {
          callback(request.result);
        };
      };
    });
  });

  // polyfill getAll
  [Index, ObjectStore].forEach(function(Constructor) {
    if (Constructor.prototype.getAll) return;
    Constructor.prototype.getAll = function(query, count) {
      var instance = this;
      var items = [];

      return new Promise(function(resolve) {
        instance.iterateCursor(query, function(cursor) {
          if (!cursor) {
            resolve(items);
            return;
          }
          items.push(cursor.value);

          if (count !== undefined && items.length == count) {
            resolve(items);
            return;
          }
          cursor.continue();
        });
      });
    };
  });

  var exp = {
    open: function(name, version, upgradeCallback) {
      var p = promisifyRequestCall(indexedDB, 'open', [name, version]);
      var request = p.request;

      if (request) {
        request.onupgradeneeded = function(event) {
          if (upgradeCallback) {
            upgradeCallback(new UpgradeDB(request.result, event.oldVersion, request.transaction));
          }
        };
      }

      return p.then(function(db) {
        return new DB(db);
      });
    },
    delete: function(name) {
      return promisifyRequestCall(indexedDB, 'deleteDatabase', [name]);
    }
  };

  if (true) {
    module.exports = exp;
    module.exports.default = module.exports;
  }
  else {
    self.idb = exp;
  }
}());


/***/ })
/******/ ]);