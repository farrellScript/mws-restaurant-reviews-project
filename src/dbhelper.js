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
      console.log('review ',total/reviews)
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
