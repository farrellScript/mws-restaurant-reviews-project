/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 8000; // Change this to your server port
    return `http://localhost:1337/restaurants`;
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    fetch(DBHelper.DATABASE_URL).then(function (response) {
      // Check the response status
      if (response.status === 200) {
        // Success
        return response.json();
      } else {
        // Error
        const error = `Request failed. Returned status of ${response.body}`;
        callback(error, null);
      }
    }).then(function (json) {
      callback(null, json);
    }).catch(function (e) {
      console.log('error: ', e);
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
        if (restaurant) {
          // Got the restaurant
          callback(null, restaurant);
        } else {
          // Restaurant does not exist in the database
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
    return `View Details For ${restaurant.name}`;
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return `./restaurant.html?id=${restaurant.id}`;
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return `/img/${restaurant.photograph}.jpg`;
  }

  /**
     * Restaurant image alt text
     */
  static imageTextForRestaurant(restaurant) {
    return `${restaurant.name}`;
  }

  /**
   * Restaurant image alt text
   */
  static ratingForRestaurant(restaurant) {
    fetch(`http://localhost:1337/reviews/?restaurant_id=${restaurant.id}`).then(response => {
      return response.json();
    }).then(items => {
      let reviews = 0;
      let total = 0;
      items.map(item => {
        reviews++;
        total = total + parseInt(item.rating);
      });
      console.log('review ', total / reviews);
      return Math.round(total / reviews);
    });
  }

  /**
   * Restaurant Image Source Set
   */
  static imageSrcSetForRestaurant(restaurant) {
    return `/img/${restaurant.photograph}_1x.jpg 1x, /img/${restaurant.photograph}_2x.jpg 2x`;
  }

  /**
   * Restaurant Image Source Set, jpg
   */
  static imageJpgSrcSetForRestaurant(restaurant) {
    return `/img/${restaurant.photograph}_1x.jpg 1x, /img/${restaurant.photograph}_2x.jpg 2x`;
  }

  /**
   * Restaurant Image Source Set, webp
   */
  static imageWebPSrcSetForRestaurant(restaurant) {
    return `/img/${restaurant.photograph}_1x.webp 1x, /img/${restaurant.photograph}_2x.webp 2x`;
  }

  /**
   * Restaurant Image Source Fallback
   */
  static imageSrcForRestaurant(restaurant) {
    return `/img/${restaurant.photograph}_1x.jpg`;
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    // https://leafletjs.com/reference-1.3.0.html#marker  
    const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng], { title: restaurant.name,
      alt: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant)
    });
    marker.addTo(newMap);
    return marker;
  }
  /* static mapMarkerForRestaurant(restaurant, map) {
   const marker = new google.maps.Marker({
     position: restaurant.latlng,
     title: restaurant.name,
     url: DBHelper.urlForRestaurant(restaurant),
     map: map,
     animation: google.maps.Animation.DROP}
   );
   return marker;
  }*/

}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRiaGVscGVyLmpzIl0sIm5hbWVzIjpbIkRCSGVscGVyIiwiREFUQUJBU0VfVVJMIiwicG9ydCIsImZldGNoUmVzdGF1cmFudHMiLCJjYWxsYmFjayIsImZldGNoIiwidGhlbiIsInJlc3BvbnNlIiwic3RhdHVzIiwianNvbiIsImVycm9yIiwiYm9keSIsImNhdGNoIiwiZSIsImNvbnNvbGUiLCJsb2ciLCJmZXRjaFJlc3RhdXJhbnRCeUlkIiwiaWQiLCJyZXN0YXVyYW50cyIsInJlc3RhdXJhbnQiLCJmaW5kIiwiciIsImZldGNoUmVzdGF1cmFudEJ5Q3Vpc2luZSIsImN1aXNpbmUiLCJyZXN1bHRzIiwiZmlsdGVyIiwiY3Vpc2luZV90eXBlIiwiZmV0Y2hSZXN0YXVyYW50QnlOZWlnaGJvcmhvb2QiLCJuZWlnaGJvcmhvb2QiLCJ1cmxUZXh0Rm9yUmVzdGF1cmFudCIsIm5hbWUiLCJ1cmxGb3JSZXN0YXVyYW50IiwiaW1hZ2VVcmxGb3JSZXN0YXVyYW50IiwicGhvdG9ncmFwaCIsImltYWdlVGV4dEZvclJlc3RhdXJhbnQiLCJyYXRpbmdGb3JSZXN0YXVyYW50IiwiaXRlbXMiLCJyZXZpZXdzIiwidG90YWwiLCJtYXAiLCJpdGVtIiwicGFyc2VJbnQiLCJyYXRpbmciLCJNYXRoIiwicm91bmQiLCJpbWFnZVNyY1NldEZvclJlc3RhdXJhbnQiLCJpbWFnZUpwZ1NyY1NldEZvclJlc3RhdXJhbnQiLCJpbWFnZVdlYlBTcmNTZXRGb3JSZXN0YXVyYW50IiwiaW1hZ2VTcmNGb3JSZXN0YXVyYW50IiwibWFwTWFya2VyRm9yUmVzdGF1cmFudCIsIm1hcmtlciIsIkwiLCJsYXRsbmciLCJsYXQiLCJsbmciLCJ0aXRsZSIsImFsdCIsInVybCIsImFkZFRvIiwibmV3TWFwIl0sIm1hcHBpbmdzIjoiQUFBQTs7O0FBR0EsTUFBTUEsUUFBTixDQUFlOztBQUViOzs7O0FBSUEsYUFBV0MsWUFBWCxHQUEwQjtBQUN4QixVQUFNQyxPQUFPLElBQWIsQ0FEd0IsQ0FDTjtB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QUFJQyxFQUFFRCxNQUFOLENBQWEsQ0FBQy9CLFdBQVdpQyxNQUFYLENBQWtCQyxHQUFuQixFQUF3QmxDLFdBQVdpQyxNQUFYLENBQWtCRSxHQUExQyxDQUFiLEVBQ2IsRUFBQ0MsT0FBT3BDLFdBQVdXLElBQW5CO0FBQ0EwQixXQUFLckMsV0FBV1csSUFEaEI7QUFFQTJCLFdBQUt6RCxTQUFTK0IsZ0JBQVQsQ0FBMEJaLFVBQTFCO0FBRkwsS0FEYSxDQUFmO0FBS0UrQixXQUFPUSxLQUFQLENBQWFDLE1BQWI7QUFDRixXQUFPVCxNQUFQO0FBQ0E7QUFDRDs7Ozs7Ozs7Ozs7QUE3S1kiLCJmaWxlIjoiZGJoZWxwZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQ29tbW9uIGRhdGFiYXNlIGhlbHBlciBmdW5jdGlvbnMuXHJcbiAqL1xyXG5jbGFzcyBEQkhlbHBlciB7XHJcblxyXG4gIC8qKlxyXG4gICAqIERhdGFiYXNlIFVSTC5cclxuICAgKiBDaGFuZ2UgdGhpcyB0byByZXN0YXVyYW50cy5qc29uIGZpbGUgbG9jYXRpb24gb24geW91ciBzZXJ2ZXIuXHJcbiAgICovXHJcbiAgc3RhdGljIGdldCBEQVRBQkFTRV9VUkwoKSB7XHJcbiAgICBjb25zdCBwb3J0ID0gODAwMCAvLyBDaGFuZ2UgdGhpcyB0byB5b3VyIHNlcnZlciBwb3J0XHJcbiAgICByZXR1cm4gYGh0dHA6Ly9sb2NhbGhvc3Q6MTMzNy9yZXN0YXVyYW50c2A7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBGZXRjaCBhbGwgcmVzdGF1cmFudHMuXHJcbiAgICovXHJcbiAgc3RhdGljIGZldGNoUmVzdGF1cmFudHMoY2FsbGJhY2spIHtcclxuICAgIGZldGNoKERCSGVscGVyLkRBVEFCQVNFX1VSTCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAvLyBDaGVjayB0aGUgcmVzcG9uc2Ugc3RhdHVzXHJcbiAgICAgIGlmKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKXtcclxuICAgICAgICAvLyBTdWNjZXNzXHJcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgLy8gRXJyb3JcclxuICAgICAgICBjb25zdCBlcnJvciA9IChgUmVxdWVzdCBmYWlsZWQuIFJldHVybmVkIHN0YXR1cyBvZiAke3Jlc3BvbnNlLmJvZHl9YCk7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsbnVsbClcclxuICAgICAgfVxyXG4gICAgfSkudGhlbihmdW5jdGlvbihqc29uKSB7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCxqc29uKTtcclxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcjogJyxlKVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBGZXRjaCBhIHJlc3RhdXJhbnQgYnkgaXRzIElELlxyXG4gICAqL1xyXG4gIHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRCeUlkKGlkLCBjYWxsYmFjaykge1xyXG4gICAgLy8gZmV0Y2ggYWxsIHJlc3RhdXJhbnRzIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxyXG4gICAgREJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCByZXN0YXVyYW50ID0gcmVzdGF1cmFudHMuZmluZChyID0+IHIuaWQgPT0gaWQpO1xyXG4gICAgICAgIGlmIChyZXN0YXVyYW50KSB7IC8vIEdvdCB0aGUgcmVzdGF1cmFudFxyXG4gICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdGF1cmFudCk7XHJcbiAgICAgICAgfSBlbHNlIHsgLy8gUmVzdGF1cmFudCBkb2VzIG5vdCBleGlzdCBpbiB0aGUgZGF0YWJhc2VcclxuICAgICAgICAgIGNhbGxiYWNrKCdSZXN0YXVyYW50IGRvZXMgbm90IGV4aXN0JywgbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZldGNoIHJlc3RhdXJhbnRzIGJ5IGEgY3Vpc2luZSB0eXBlIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxyXG4gICAqL1xyXG4gIHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRCeUN1aXNpbmUoY3Vpc2luZSwgY2FsbGJhY2spIHtcclxuICAgIC8vIEZldGNoIGFsbCByZXN0YXVyYW50cyAgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmdcclxuICAgIERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gRmlsdGVyIHJlc3RhdXJhbnRzIHRvIGhhdmUgb25seSBnaXZlbiBjdWlzaW5lIHR5cGVcclxuICAgICAgICBjb25zdCByZXN1bHRzID0gcmVzdGF1cmFudHMuZmlsdGVyKHIgPT4gci5jdWlzaW5lX3R5cGUgPT0gY3Vpc2luZSk7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdWx0cyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRmV0Y2ggcmVzdGF1cmFudHMgYnkgYSBuZWlnaGJvcmhvb2Qgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXHJcbiAgICovXHJcbiAgc3RhdGljIGZldGNoUmVzdGF1cmFudEJ5TmVpZ2hib3Job29kKG5laWdoYm9yaG9vZCwgY2FsbGJhY2spIHtcclxuICAgIC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xyXG4gICAgREJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBGaWx0ZXIgcmVzdGF1cmFudHMgdG8gaGF2ZSBvbmx5IGdpdmVuIG5laWdoYm9yaG9vZFxyXG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSByZXN0YXVyYW50cy5maWx0ZXIociA9PiByLm5laWdoYm9yaG9vZCA9PSBuZWlnaGJvcmhvb2QpO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdHMpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG5cclxuICAvKipcclxuICAgKiBSZXN0YXVyYW50IHBhZ2UgVVJMLlxyXG4gICAqL1xyXG4gIHN0YXRpYyB1cmxUZXh0Rm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSB7XHJcbiAgICByZXR1cm4gKGBWaWV3IERldGFpbHMgRm9yICR7cmVzdGF1cmFudC5uYW1lfWApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVzdGF1cmFudCBwYWdlIFVSTC5cclxuICAgKi9cclxuICBzdGF0aWMgdXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSB7XHJcbiAgICByZXR1cm4gKGAuL3Jlc3RhdXJhbnQuaHRtbD9pZD0ke3Jlc3RhdXJhbnQuaWR9YCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXN0YXVyYW50IGltYWdlIFVSTC5cclxuICAgKi9cclxuICBzdGF0aWMgaW1hZ2VVcmxGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpIHtcclxuICAgIHJldHVybiAoYC9pbWcvJHtyZXN0YXVyYW50LnBob3RvZ3JhcGh9LmpwZ2ApO1xyXG4gIH1cclxuXHJcbi8qKlxyXG4gICAqIFJlc3RhdXJhbnQgaW1hZ2UgYWx0IHRleHRcclxuICAgKi9cclxuICBzdGF0aWMgaW1hZ2VUZXh0Rm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSB7XHJcbiAgICByZXR1cm4gKGAke3Jlc3RhdXJhbnQubmFtZX1gKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlc3RhdXJhbnQgaW1hZ2UgYWx0IHRleHRcclxuICAgKi9cclxuICBzdGF0aWMgcmF0aW5nRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSB7XHJcbiAgICBmZXRjaChgaHR0cDovL2xvY2FsaG9zdDoxMzM3L3Jldmlld3MvP3Jlc3RhdXJhbnRfaWQ9JHtyZXN0YXVyYW50LmlkfWApLnRoZW4oKHJlc3BvbnNlKT0+e1xyXG4gICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xyXG4gICAgfSkudGhlbigoaXRlbXMpPT57XHJcbiAgICAgIGxldCByZXZpZXdzID0gMDtcclxuICAgICAgbGV0IHRvdGFsID0gMDtcclxuICAgICAgaXRlbXMubWFwKChpdGVtKT0+e1xyXG4gICAgICAgIHJldmlld3MrKztcclxuICAgICAgICB0b3RhbCA9IHRvdGFsICsgcGFyc2VJbnQoaXRlbS5yYXRpbmcpXHJcbiAgICAgIH0pXHJcbiAgICAgIGNvbnNvbGUubG9nKCdyZXZpZXcgJyx0b3RhbC9yZXZpZXdzKVxyXG4gICAgICByZXR1cm4gKE1hdGgucm91bmQodG90YWwvcmV2aWV3cykpO1xyXG4gICAgfSlcclxuXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXN0YXVyYW50IEltYWdlIFNvdXJjZSBTZXRcclxuICAgKi9cclxuICBzdGF0aWMgaW1hZ2VTcmNTZXRGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpIHtcclxuICAgIHJldHVybiAoYC9pbWcvJHtyZXN0YXVyYW50LnBob3RvZ3JhcGh9XzF4LmpwZyAxeCwgL2ltZy8ke3Jlc3RhdXJhbnQucGhvdG9ncmFwaH1fMnguanBnIDJ4YCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXN0YXVyYW50IEltYWdlIFNvdXJjZSBTZXQsIGpwZ1xyXG4gICAqL1xyXG4gIHN0YXRpYyBpbWFnZUpwZ1NyY1NldEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCkge1xyXG4gICAgcmV0dXJuIChgL2ltZy8ke3Jlc3RhdXJhbnQucGhvdG9ncmFwaH1fMXguanBnIDF4LCAvaW1nLyR7cmVzdGF1cmFudC5waG90b2dyYXBofV8yeC5qcGcgMnhgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlc3RhdXJhbnQgSW1hZ2UgU291cmNlIFNldCwgd2VicFxyXG4gICAqL1xyXG4gIHN0YXRpYyBpbWFnZVdlYlBTcmNTZXRGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpIHtcclxuICAgIHJldHVybiAoYC9pbWcvJHtyZXN0YXVyYW50LnBob3RvZ3JhcGh9XzF4LndlYnAgMXgsIC9pbWcvJHtyZXN0YXVyYW50LnBob3RvZ3JhcGh9XzJ4LndlYnAgMnhgKTtcclxuICB9XHJcblxyXG5cclxuICAvKipcclxuICAgKiBSZXN0YXVyYW50IEltYWdlIFNvdXJjZSBGYWxsYmFja1xyXG4gICAqL1xyXG4gIHN0YXRpYyBpbWFnZVNyY0ZvclJlc3RhdXJhbnQocmVzdGF1cmFudCkge1xyXG4gICAgcmV0dXJuIChgL2ltZy8ke3Jlc3RhdXJhbnQucGhvdG9ncmFwaH1fMXguanBnYCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNYXAgbWFya2VyIGZvciBhIHJlc3RhdXJhbnQuXHJcbiAgICovXHJcbiAgc3RhdGljIG1hcE1hcmtlckZvclJlc3RhdXJhbnQocmVzdGF1cmFudCwgbWFwKSB7XHJcbiAgICAvLyBodHRwczovL2xlYWZsZXRqcy5jb20vcmVmZXJlbmNlLTEuMy4wLmh0bWwjbWFya2VyICBcclxuICAgIGNvbnN0IG1hcmtlciA9IG5ldyBMLm1hcmtlcihbcmVzdGF1cmFudC5sYXRsbmcubGF0LCByZXN0YXVyYW50LmxhdGxuZy5sbmddLFxyXG4gICAgICB7dGl0bGU6IHJlc3RhdXJhbnQubmFtZSxcclxuICAgICAgYWx0OiByZXN0YXVyYW50Lm5hbWUsXHJcbiAgICAgIHVybDogREJIZWxwZXIudXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KVxyXG4gICAgICB9KVxyXG4gICAgICBtYXJrZXIuYWRkVG8obmV3TWFwKTtcclxuICAgIHJldHVybiBtYXJrZXI7XHJcbiAgIH0gXHJcbiAgIC8qIHN0YXRpYyBtYXBNYXJrZXJGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQsIG1hcCkge1xyXG4gICAgY29uc3QgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XHJcbiAgICAgIHBvc2l0aW9uOiByZXN0YXVyYW50LmxhdGxuZyxcclxuICAgICAgdGl0bGU6IHJlc3RhdXJhbnQubmFtZSxcclxuICAgICAgdXJsOiBEQkhlbHBlci51cmxGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpLFxyXG4gICAgICBtYXA6IG1hcCxcclxuICAgICAgYW5pbWF0aW9uOiBnb29nbGUubWFwcy5BbmltYXRpb24uRFJPUH1cclxuICAgICk7XHJcbiAgICByZXR1cm4gbWFya2VyO1xyXG4gIH0qL1xyXG5cclxufVxyXG4iXX0=
