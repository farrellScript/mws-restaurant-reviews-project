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

}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRiaGVscGVyLmpzIl0sIm5hbWVzIjpbIkRCSGVscGVyIiwiREFUQUJBU0VfVVJMIiwicG9ydCIsImZldGNoUmVzdGF1cmFudHMiLCJjYWxsYmFjayIsImZldGNoIiwidGhlbiIsInJlc3BvbnNlIiwic3RhdHVzIiwianNvbiIsImVycm9yIiwiYm9keSIsImNhdGNoIiwiZSIsImNvbnNvbGUiLCJsb2ciLCJmZXRjaFJlc3RhdXJhbnRCeUlkIiwiaWQiLCJyZXN0YXVyYW50cyIsInJlc3RhdXJhbnQiLCJmaW5kIiwiciIsImZldGNoUmVzdGF1cmFudEJ5Q3Vpc2luZSIsImN1aXNpbmUiLCJyZXN1bHRzIiwiZmlsdGVyIiwiY3Vpc2luZV90eXBlIiwiZmV0Y2hSZXN0YXVyYW50QnlOZWlnaGJvcmhvb2QiLCJuZWlnaGJvcmhvb2QiLCJ1cmxUZXh0Rm9yUmVzdGF1cmFudCIsIm5hbWUiLCJ1cmxGb3JSZXN0YXVyYW50IiwiaW1hZ2VVcmxGb3JSZXN0YXVyYW50IiwicGhvdG9ncmFwaCIsImltYWdlVGV4dEZvclJlc3RhdXJhbnQiLCJyYXRpbmdGb3JSZXN0YXVyYW50IiwiaXRlbXMiLCJyZXZpZXdzIiwidG90YWwiLCJtYXAiLCJpdGVtIiwicGFyc2VJbnQiLCJyYXRpbmciLCJNYXRoIiwicm91bmQiLCJpbWFnZVNyY1NldEZvclJlc3RhdXJhbnQiLCJpbWFnZUpwZ1NyY1NldEZvclJlc3RhdXJhbnQiLCJpbWFnZVdlYlBTcmNTZXRGb3JSZXN0YXVyYW50IiwiaW1hZ2VTcmNGb3JSZXN0YXVyYW50IiwibWFwTWFya2VyRm9yUmVzdGF1cmFudCIsIm1hcmtlciIsIkwiLCJsYXRsbmciLCJsYXQiLCJsbmciLCJ0aXRsZSIsImFsdCIsInVybCIsImFkZFRvIiwibmV3TWFwIl0sIm1hcHBpbmdzIjoiQUFBQTs7O0FBR0EsTUFBTUEsUUFBTixDQUFlOztBQUViOzs7O0FBSUEsYUFBV0MsWUFBWCxHQUEwQjtBQUN4QixVQUFNQyxPQUFPLElBQWIsQ0FEd0IsQ0FDTjtB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QUFJQyxFQUFFRCxNQUFOLENBQWEsQ0FBQy9CLFdBQVdpQyxNQUFYLENBQWtCQyxHQUFuQixFQUF3QmxDLFdBQVdpQyxNQUFYLENBQWtCRSxHQUExQyxDQUFiLEVBQ2IsRUFBQ0MsT0FBT3BDLFdBQVdXLElBQW5CO0FBQ0EwQixXQUFLckMsV0FBV1csSUFEaEI7QUFFQTJCLFdBQUt6RCxTQUFTK0IsZ0JBQVQsQ0FBMEJaLFVBQTFCO0FBRkwsS0FEYSxDQUFmO0FBS0UrQixXQUFPUSxLQUFQLENBQWFDLE1BQWI7QUFDRixXQUFPVCxNQUFQO0FBQ0E7O0FBNUtXIiwiZmlsZSI6ImRiaGVscGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIENvbW1vbiBkYXRhYmFzZSBoZWxwZXIgZnVuY3Rpb25zLlxyXG4gKi9cclxuY2xhc3MgREJIZWxwZXIge1xyXG5cclxuICAvKipcclxuICAgKiBEYXRhYmFzZSBVUkwuXHJcbiAgICogQ2hhbmdlIHRoaXMgdG8gcmVzdGF1cmFudHMuanNvbiBmaWxlIGxvY2F0aW9uIG9uIHlvdXIgc2VydmVyLlxyXG4gICAqL1xyXG4gIHN0YXRpYyBnZXQgREFUQUJBU0VfVVJMKCkge1xyXG4gICAgY29uc3QgcG9ydCA9IDgwMDAgLy8gQ2hhbmdlIHRoaXMgdG8geW91ciBzZXJ2ZXIgcG9ydFxyXG4gICAgcmV0dXJuIGBodHRwOi8vbG9jYWxob3N0OjEzMzcvcmVzdGF1cmFudHNgO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRmV0Y2ggYWxsIHJlc3RhdXJhbnRzLlxyXG4gICAqL1xyXG4gIHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRzKGNhbGxiYWNrKSB7XHJcbiAgICBmZXRjaChEQkhlbHBlci5EQVRBQkFTRV9VUkwpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgLy8gQ2hlY2sgdGhlIHJlc3BvbnNlIHN0YXR1c1xyXG4gICAgICBpZihyZXNwb25zZS5zdGF0dXMgPT09IDIwMCl7XHJcbiAgICAgICAgLy8gU3VjY2Vzc1xyXG4gICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgIC8vIEVycm9yXHJcbiAgICAgICAgY29uc3QgZXJyb3IgPSAoYFJlcXVlc3QgZmFpbGVkLiBSZXR1cm5lZCBzdGF0dXMgb2YgJHtyZXNwb25zZS5ib2R5fWApO1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLG51bGwpXHJcbiAgICAgIH1cclxuICAgIH0pLnRoZW4oZnVuY3Rpb24oanNvbikge1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsanNvbik7XHJcbiAgICB9KS5jYXRjaChmdW5jdGlvbihlKXtcclxuICAgICAgICBjb25zb2xlLmxvZygnZXJyb3I6ICcsZSlcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRmV0Y2ggYSByZXN0YXVyYW50IGJ5IGl0cyBJRC5cclxuICAgKi9cclxuICBzdGF0aWMgZmV0Y2hSZXN0YXVyYW50QnlJZChpZCwgY2FsbGJhY2spIHtcclxuICAgIC8vIGZldGNoIGFsbCByZXN0YXVyYW50cyB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cclxuICAgIERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgcmVzdGF1cmFudCA9IHJlc3RhdXJhbnRzLmZpbmQociA9PiByLmlkID09IGlkKTtcclxuICAgICAgICBpZiAocmVzdGF1cmFudCkgeyAvLyBHb3QgdGhlIHJlc3RhdXJhbnRcclxuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3RhdXJhbnQpO1xyXG4gICAgICAgIH0gZWxzZSB7IC8vIFJlc3RhdXJhbnQgZG9lcyBub3QgZXhpc3QgaW4gdGhlIGRhdGFiYXNlXHJcbiAgICAgICAgICBjYWxsYmFjaygnUmVzdGF1cmFudCBkb2VzIG5vdCBleGlzdCcsIG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBGZXRjaCByZXN0YXVyYW50cyBieSBhIGN1aXNpbmUgdHlwZSB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cclxuICAgKi9cclxuICBzdGF0aWMgZmV0Y2hSZXN0YXVyYW50QnlDdWlzaW5lKGN1aXNpbmUsIGNhbGxiYWNrKSB7XHJcbiAgICAvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHMgIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nXHJcbiAgICBEQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIEZpbHRlciByZXN0YXVyYW50cyB0byBoYXZlIG9ubHkgZ2l2ZW4gY3Vpc2luZSB0eXBlXHJcbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IHJlc3RhdXJhbnRzLmZpbHRlcihyID0+IHIuY3Vpc2luZV90eXBlID09IGN1aXNpbmUpO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdHMpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZldGNoIHJlc3RhdXJhbnRzIGJ5IGEgbmVpZ2hib3Job29kIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxyXG4gICAqL1xyXG4gIHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRCeU5laWdoYm9yaG9vZChuZWlnaGJvcmhvb2QsIGNhbGxiYWNrKSB7XHJcbiAgICAvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHNcclxuICAgIERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gRmlsdGVyIHJlc3RhdXJhbnRzIHRvIGhhdmUgb25seSBnaXZlbiBuZWlnaGJvcmhvb2RcclxuICAgICAgICBjb25zdCByZXN1bHRzID0gcmVzdGF1cmFudHMuZmlsdGVyKHIgPT4gci5uZWlnaGJvcmhvb2QgPT0gbmVpZ2hib3Job29kKTtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCByZXN1bHRzKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogUmVzdGF1cmFudCBwYWdlIFVSTC5cclxuICAgKi9cclxuICBzdGF0aWMgdXJsVGV4dEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCkge1xyXG4gICAgcmV0dXJuIChgVmlldyBEZXRhaWxzIEZvciAke3Jlc3RhdXJhbnQubmFtZX1gKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlc3RhdXJhbnQgcGFnZSBVUkwuXHJcbiAgICovXHJcbiAgc3RhdGljIHVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCkge1xyXG4gICAgcmV0dXJuIChgLi9yZXN0YXVyYW50Lmh0bWw/aWQ9JHtyZXN0YXVyYW50LmlkfWApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVzdGF1cmFudCBpbWFnZSBVUkwuXHJcbiAgICovXHJcbiAgc3RhdGljIGltYWdlVXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSB7XHJcbiAgICByZXR1cm4gKGAvaW1nLyR7cmVzdGF1cmFudC5waG90b2dyYXBofS5qcGdgKTtcclxuICB9XHJcblxyXG4vKipcclxuICAgKiBSZXN0YXVyYW50IGltYWdlIGFsdCB0ZXh0XHJcbiAgICovXHJcbiAgc3RhdGljIGltYWdlVGV4dEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCkge1xyXG4gICAgcmV0dXJuIChgJHtyZXN0YXVyYW50Lm5hbWV9YCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXN0YXVyYW50IGltYWdlIGFsdCB0ZXh0XHJcbiAgICovXHJcbiAgc3RhdGljIHJhdGluZ0ZvclJlc3RhdXJhbnQocmVzdGF1cmFudCkge1xyXG4gICAgZmV0Y2goYGh0dHA6Ly9sb2NhbGhvc3Q6MTMzNy9yZXZpZXdzLz9yZXN0YXVyYW50X2lkPSR7cmVzdGF1cmFudC5pZH1gKS50aGVuKChyZXNwb25zZSk9PntcclxuICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcclxuICAgIH0pLnRoZW4oKGl0ZW1zKT0+e1xyXG4gICAgICBsZXQgcmV2aWV3cyA9IDA7XHJcbiAgICAgIGxldCB0b3RhbCA9IDA7XHJcbiAgICAgIGl0ZW1zLm1hcCgoaXRlbSk9PntcclxuICAgICAgICByZXZpZXdzKys7XHJcbiAgICAgICAgdG90YWwgPSB0b3RhbCArIHBhcnNlSW50KGl0ZW0ucmF0aW5nKVxyXG4gICAgICB9KVxyXG4gICAgICBjb25zb2xlLmxvZygncmV2aWV3ICcsdG90YWwvcmV2aWV3cylcclxuICAgICAgcmV0dXJuIChNYXRoLnJvdW5kKHRvdGFsL3Jldmlld3MpKTtcclxuICAgIH0pXHJcblxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVzdGF1cmFudCBJbWFnZSBTb3VyY2UgU2V0XHJcbiAgICovXHJcbiAgc3RhdGljIGltYWdlU3JjU2V0Rm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSB7XHJcbiAgICByZXR1cm4gKGAvaW1nLyR7cmVzdGF1cmFudC5waG90b2dyYXBofV8xeC5qcGcgMXgsIC9pbWcvJHtyZXN0YXVyYW50LnBob3RvZ3JhcGh9XzJ4LmpwZyAyeGApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVzdGF1cmFudCBJbWFnZSBTb3VyY2UgU2V0LCBqcGdcclxuICAgKi9cclxuICBzdGF0aWMgaW1hZ2VKcGdTcmNTZXRGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpIHtcclxuICAgIHJldHVybiAoYC9pbWcvJHtyZXN0YXVyYW50LnBob3RvZ3JhcGh9XzF4LmpwZyAxeCwgL2ltZy8ke3Jlc3RhdXJhbnQucGhvdG9ncmFwaH1fMnguanBnIDJ4YCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXN0YXVyYW50IEltYWdlIFNvdXJjZSBTZXQsIHdlYnBcclxuICAgKi9cclxuICBzdGF0aWMgaW1hZ2VXZWJQU3JjU2V0Rm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSB7XHJcbiAgICByZXR1cm4gKGAvaW1nLyR7cmVzdGF1cmFudC5waG90b2dyYXBofV8xeC53ZWJwIDF4LCAvaW1nLyR7cmVzdGF1cmFudC5waG90b2dyYXBofV8yeC53ZWJwIDJ4YCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgLyoqXHJcbiAgICogUmVzdGF1cmFudCBJbWFnZSBTb3VyY2UgRmFsbGJhY2tcclxuICAgKi9cclxuICBzdGF0aWMgaW1hZ2VTcmNGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpIHtcclxuICAgIHJldHVybiAoYC9pbWcvJHtyZXN0YXVyYW50LnBob3RvZ3JhcGh9XzF4LmpwZ2ApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTWFwIG1hcmtlciBmb3IgYSByZXN0YXVyYW50LlxyXG4gICAqL1xyXG4gIHN0YXRpYyBtYXBNYXJrZXJGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQsIG1hcCkge1xyXG4gICAgLy8gaHR0cHM6Ly9sZWFmbGV0anMuY29tL3JlZmVyZW5jZS0xLjMuMC5odG1sI21hcmtlciAgXHJcbiAgICBjb25zdCBtYXJrZXIgPSBuZXcgTC5tYXJrZXIoW3Jlc3RhdXJhbnQubGF0bG5nLmxhdCwgcmVzdGF1cmFudC5sYXRsbmcubG5nXSxcclxuICAgICAge3RpdGxlOiByZXN0YXVyYW50Lm5hbWUsXHJcbiAgICAgIGFsdDogcmVzdGF1cmFudC5uYW1lLFxyXG4gICAgICB1cmw6IERCSGVscGVyLnVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudClcclxuICAgICAgfSlcclxuICAgICAgbWFya2VyLmFkZFRvKG5ld01hcCk7XHJcbiAgICByZXR1cm4gbWFya2VyO1xyXG4gICB9IFxyXG5cclxufVxyXG4iXX0=
