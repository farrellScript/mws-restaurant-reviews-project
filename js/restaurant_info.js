// Create Link Element for Stylesheet
let myCSS = document.createElement("link");
myCSS.rel = "stylesheet";
myCSS.href = "/css/leaflet.css";
// insert it at the end of the head in a legacy-friendly manner
document.head.insertBefore(myCSS, document.head.childNodes[document.head.childNodes.length - 1].nextSibling);

const dbWorker = new Worker('./js/dbworker.js');

let restaurant;
var newMap;

// /**
//  * Check to see if service worker is supported by the browser 
//  */
// if ('serviceWorker' in navigator) {

//   /* if it is, register the service worker */
//   navigator.serviceWorker.register('/sw.js').then(function(res){

//     // Already on the latest version, bail
//     if(!navigator.serviceWorker.controller){
//       return;
//     }
//     // Check to see if there's a waiting service worker
//     if (res.waiting){
//       _updateReady();
//       return 
//     }

//     if (res.installing) {
//       _trackInstalling(res.installing);
//       return;
//     }

//     res.addEventListener('updatefound', function() {
//       _trackInstalling(res.installing);
//     });

//   }).catch(function(error){
//     console.log('error registering service worker: ',error)
//   });

//   function _trackInstalling(worker){
//     worker.addEventListener('statechange',function(){
//       if (worker.state == 'installed'){
//         _updateReady(worker);
//       }
//     })
//   }

//   var focusedElement;
//   /**
//    * Notifies the user that an updated SW is available
//    */
//   function _updateReady(worker){
//     // If the user clicks on the update button, update the service worker
//     document.getElementById('update-version').addEventListener('click',function(){
//       worker.postMessage({action:'skipWaiting'});
//     });
//     // If the user clicks the dismiss button, hide the toast
//     document.getElementById('dismiss-version').addEventListener('click',function(){
//       document.getElementById('toast').classList.remove('active');
//       focusedElement.focus()
//     });
//     // If the toast is displaying, listen for keyboard events
//     document.getElementById('toast').addEventListener('keydown',function(e){
//       //Check for Tab key press
//       if(e.keyCode === 9){

//         if (e.shiftKey) {
//           //Pressed Shift Tab
//           if(document.activeElement === firstTabStop) {
//             e.preventDefault();
//             lastTabStop.focus();
//           }
//         }else{
//           //Pressed Tab
//           if(document.activeElement === lastTabStop) {
//             e.preventDefault();
//             firstTabStop.focus();
//           }
//         }
//       }
//       // Escape Key
//       if (e.keyCode === 27){
//         document.getElementById('toast').classList.remove('active');
//         focusedElement.focus()
//       } 
//     });

//     // Remember what the last element that was focused was, and make it focusable so we can return to it
//     focusedElement = document.activeElement;
//     focusedElement.tabindex = 1;

//     // When the toast is visible, this is what we'll use to temporarily trap focus
//     var focusableElementsString = '#toast p, #update-version, #dismiss-version';
//     var focusableElements = document.querySelectorAll(focusableElementsString);
//     focusableElements = Array.prototype.slice.call(focusableElements);

//     var firstTabStop = focusableElements[0];
//     var lastTabStop = focusableElements[focusableElements.length -1];

//     // Ok time to show the toast and focus on it
//     document.getElementById('toast').classList.add('active');
//     document.querySelector('#toast p').focus();

//   }


//   /**
//    * Listens for a change in the SW, reloads the page as a result
//    */
//   var refreshing;
//   navigator.serviceWorker.addEventListener('controllerchange', function() {
//     console.log('controller change')
//     if (refreshing) return;
//     window.location.reload();
//     refreshing = true;
//   });
// }

/**
 * Initialize leaflet map
 */
initMap = () => {
  // const id = getParameterByName('id');
  // dbWorker.addEventListener('message', function(e) {
  //   if (e.data == 'error') { // Got an error
  //     console.error(e.data);
  //   } else {
  //     self.newMap = L.map('map', {
  //       center: [e.data.restaurant.latlng.lat, e.data.restaurant.latlng.lng],
  //       zoom: 16,
  //       scrollWheelZoom: false
  //     });
  //     L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
  //       mapboxToken: 'pk.eyJ1IjoiZmFycmVsbHNjcmlwdCIsImEiOiJjamJiaTl3dHMxOGxsMzJwZTlmYnN4ZHN5In0.6Ey50el0atwjDygO_cO0sA',
  //       maxZoom: 18,
  //       attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
  //         '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
  //         'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  //       id: 'mapbox.streets'    
  //     }).addTo(newMap);
  //     mapMarkerForRestaurant(e.data.restaurant, self.newMap);
  //   }
  // }, false);
  // dbWorker.postMessage({action:'fetchRestaurantById', id});


  fetchRestaurantFromURL((error, restaurant) => {
    if (error) {
      // Got an error!
      console.error(error);
    } else {
      self.newMap = L.map('map', {
        center: [restaurant.latlng.lat, restaurant.latlng.lng],
        zoom: 16,
        scrollWheelZoom: false
      });
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
        mapboxToken: 'pk.eyJ1IjoiZmFycmVsbHNjcmlwdCIsImEiOiJjamJiaTl3dHMxOGxsMzJwZTlmYnN4ZHN5In0.6Ey50el0atwjDygO_cO0sA',
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' + '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
      }).addTo(newMap);
      mapMarkerForRestaurant(restaurant, self.newMap);
    }
  });
};

/**
 * Get the map marker for the restaurant
 */
mapMarkerForRestaurant = (restaurant, map) => {
  // https://leafletjs.com/reference-1.3.0.html#marker  
  const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng], { title: restaurant.name,
    alt: restaurant.name
  });
  marker.addTo(newMap);
  return marker;
};

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = callback => {
  if (self.restaurant) {
    // restaurant already fetched!
    callback(null, self.restaurant);
    return;
  }
  const id = getParameterByName('id');
  if (!id) {
    // no id found in URL
    error = 'No restaurant id in URL';
    callback(error, null);
  } else {
    // DBHelper.fetchRestaurantById(id, (error, restaurant) => {
    //   self.restaurant = restaurant;
    //   if (!restaurant) {
    //     console.error(error);
    //     return;
    //   }
    //   fillRestaurantHTML();
    //   callback(null, restaurant)
    // });
    // Comment
    dbWorker.addEventListener('message', function (e) {
      if (e.data == 'error') {
        // Got an error
        console.error(e.data);
      } else {
        console.log('got back: ', e.data.restaurant);
        if (e.data.restaurant) {
          fillRestaurantHTML(e.data.restaurant, e.data.reviews);
          callback(null, e.data.restaurant);
        }
      }
    }, false);
    dbWorker.postMessage({ action: 'fetchRestaurantById', id });
  }
};

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant, reviews) => {
  console.log('restaurant', restaurant);
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  // Review of the restaurant
  const rating = document.getElementById('rating');

  let emptyhearts = 5 - reviews;

  for (let i = 0; i < reviews; i++) {
    const emptystar = document.createElement('img');
    emptystar.className = "restaurant__star restaurant__star--full";
    emptystar.src = "/img/fullstar.svg";
    emptystar.alt = "";
    rating.append(emptystar);
  }

  for (let i = 0; i < emptyhearts; i++) {
    const emptystar = document.createElement('img');
    emptystar.className = "restaurant__star restaurant__star--empty";
    emptystar.src = "/img/emptystar.svg";
    emptystar.alt = "";
    rating.append(emptystar);
  }

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const addressicon = document.createElement('img');
  addressicon.className = 'restaurantdetail__icon';
  addressicon.src = '/img/waypoint.svg';
  addressicon.alt = '';
  address.prepend(addressicon);

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img';
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.alt = DBHelper.imageTextForRestaurant(restaurant);
  image.srcset = DBHelper.imageSrcSetForRestaurant(restaurant);

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  const cuisineicon = document.createElement('img');
  cuisineicon.className = 'restaurantdetail__icon';
  cuisineicon.src = '/img/cuisine.svg';
  cuisineicon.alt = '';
  cuisine.prepend(cuisineicon);

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML(restaurant.operating_hours);

    const hours = document.getElementById('restaurantdetail__hourscontainer');

    const hoursicon = document.createElement('img');
    hoursicon.className = 'restaurantdetail__icon';
    hoursicon.src = '/img/clock.svg';
    hoursicon.alt = '';
    hours.prepend(hoursicon);
  }
  // fill reviews

  dbWorker.addEventListener('message', function (e) {
    if (e.data == 'error') {
      // Got an error
      console.error(e.data);
    } else {
      console.log('got back: ', e.data.reviews);
      fillReviewsHTML(e.data.reviews);
    }
  }, false);
  dbWorker.postMessage({ action: 'fillReviewsHTML', id: restaurant.id });
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = operatingHours => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.className = 'restaurantdetail__day';
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.className = 'restaurantdetail__hour';
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
};

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = reviews => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h3');
  title.innerHTML = 'Reviews';
  title.className = 'restaurantdetail__reviewstitle';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
};

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = review => {
  const li = document.createElement('li');
  li.className = 'restaurantdetail__review';
  const commentHeader = document.createElement('div');
  commentHeader.className = 'restaurantdetail__commentheader';

  const leftdiv = document.createElement('div');
  leftdiv.className = 'restaurantdetail__avatarcontainer';

  const avatar = document.createElement('img');
  avatar.src = '/img/avatar.svg';
  avatar.className = 'restaurantdetail__avatar';
  avatar.alt = 'Avatar photo';
  leftdiv.appendChild(avatar);
  commentHeader.appendChild(leftdiv);

  const rightdiv = document.createElement('div');
  rightdiv.className = 'restaurantdetail__namecontainer';

  const name = document.createElement('p');
  name.innerHTML = review.name;
  rightdiv.appendChild(name);

  // Create Stars for Review
  const individualrating = document.createElement('p');
  individualrating.className = 'restaurantdetail__individualreviewrating';
  const emptyStars = 5 - parseInt(review.rating);
  for (let i = 0; i < review.rating; i++) {
    const fullstar = document.createElement('img');
    fullstar.className = "restaurant__star restaurant__star--full";
    fullstar.src = "/img/fullstar.svg";
    fullstar.alt = "";
    individualrating.append(fullstar);
  }
  for (let i = 0; i < emptyStars; i++) {
    const emptystar = document.createElement('img');
    emptystar.className = "restaurant__star restaurant__star--empty";
    emptystar.src = "/img/emptystar.svg";
    emptystar.alt = "";
    individualrating.append(emptystar);
  }

  rightdiv.appendChild(individualrating);
  const date = document.createElement('p');
  date.className = 'restaurantdetail__reviewdate';
  const reviewdate = new Date(review.createdAt);
  const todaydate = new Date();
  // Subtract todays date from the date of the review, then format into days
  const daysdifference = Math.round((todaydate - reviewdate) / 1000 / 60 / 60 / 24);
  date.innerHTML = `${daysdifference} ago`;
  rightdiv.appendChild(date);

  commentHeader.appendChild(rightdiv);
  li.appendChild(commentHeader);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
};

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
        results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

/**
  * Initialize map as soon as the page is loaded.
 */
setTimeout(() => {
  initMap();
}, 100);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc3RhdXJhbnRfaW5mby5qcyJdLCJuYW1lcyI6WyJteUNTUyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInJlbCIsImhyZWYiLCJoZWFkIiwiaW5zZXJ0QmVmb3JlIiwiY2hpbGROb2RlcyIsImxlbmd0aCIsIm5leHRTaWJsaW5nIiwiZGJXb3JrZXIiLCJXb3JrZXIiLCJyZXN0YXVyYW50IiwibmV3TWFwIiwiaW5pdE1hcCIsImZldGNoUmVzdGF1cmFudEZyb21VUkwiLCJlcnJvciIsImNvbnNvbGUiLCJzZWxmIiwiTCIsIm1hcCIsImNlbnRlciIsImxhdGxuZyIsImxhdCIsImxuZyIsInpvb20iLCJzY3JvbGxXaGVlbFpvb20iLCJ0aWxlTGF5ZXIiLCJtYXBib3hUb2tlbiIsIm1heFpvb20iLCJhdHRyaWJ1dGlvbiIsImlkIiwiYWRkVG8iLCJtYXBNYXJrZXJGb3JSZXN0YXVyYW50IiwibWFya2VyIiwidGl0bGUiLCJuYW1lIiwiYWx0IiwiY2FsbGJhY2siLCJnZXRQYXJhbWV0ZXJCeU5hbWUiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsImRhdGEiLCJsb2ciLCJmaWxsUmVzdGF1cmFudEhUTUwiLCJyZXZpZXdzIiwicG9zdE1lc3NhZ2UiLCJhY3Rpb24iLCJnZXRFbGVtZW50QnlJZCIsImlubmVySFRNTCIsInJhdGluZyIsImVtcHR5aGVhcnRzIiwiaSIsImVtcHR5c3RhciIsImNsYXNzTmFtZSIsInNyYyIsImFwcGVuZCIsImFkZHJlc3MiLCJhZGRyZXNzaWNvbiIsInByZXBlbmQiLCJpbWFnZSIsIkRCSGVscGVyIiwiaW1hZ2VVcmxGb3JSZXN0YXVyYW50IiwiaW1hZ2VUZXh0Rm9yUmVzdGF1cmFudCIsInNyY3NldCIsImltYWdlU3JjU2V0Rm9yUmVzdGF1cmFudCIsImN1aXNpbmUiLCJjdWlzaW5lX3R5cGUiLCJjdWlzaW5laWNvbiIsIm9wZXJhdGluZ19ob3VycyIsImZpbGxSZXN0YXVyYW50SG91cnNIVE1MIiwiaG91cnMiLCJob3Vyc2ljb24iLCJmaWxsUmV2aWV3c0hUTUwiLCJvcGVyYXRpbmdIb3VycyIsImtleSIsInJvdyIsImRheSIsImFwcGVuZENoaWxkIiwidGltZSIsImNvbnRhaW5lciIsIm5vUmV2aWV3cyIsInVsIiwiZm9yRWFjaCIsInJldmlldyIsImNyZWF0ZVJldmlld0hUTUwiLCJsaSIsImNvbW1lbnRIZWFkZXIiLCJsZWZ0ZGl2IiwiYXZhdGFyIiwicmlnaHRkaXYiLCJpbmRpdmlkdWFscmF0aW5nIiwiZW1wdHlTdGFycyIsInBhcnNlSW50IiwiZnVsbHN0YXIiLCJkYXRlIiwicmV2aWV3ZGF0ZSIsIkRhdGUiLCJjcmVhdGVkQXQiLCJ0b2RheWRhdGUiLCJkYXlzZGlmZmVyZW5jZSIsIk1hdGgiLCJyb3VuZCIsImNvbW1lbnRzIiwidXJsIiwid2luZG93IiwibG9jYXRpb24iLCJyZXBsYWNlIiwicmVnZXgiLCJSZWdFeHAiLCJyZXN1bHRzIiwiZXhlYyIsImRlY29kZVVSSUNvbXBvbmVudCIsInNldFRpbWVvdXQiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0EsSUFBSUEsUUFBUUMsU0FBU0MsYUFBVCxDQUF3QixNQUF4QixDQUFaO0FBQ0FGLE1BQU1HLEdBQU4sR0FBWSxZQUFaO0FBQ0FILE1BQU1JLElBQU4sR0FBYSxrQkFBYjtBQUNBO0FBQ0FILFNBQVNJLElBQVQsQ0FBY0MsWUFBZCxDQUE0Qk4sS0FBNUIsRUFBbUNDLFNBQVNJLElBQVQsQ0FBY0UsVUFBZCxDQUEwQk4sU0FBU0ksSUFBVCxDQUFjRSxVQUFkLENBQXlCQyxNQUF6QixHQUFrQyxDQUE1RCxFQUFnRUMsV0FBbkc7O0FBRUEsTUFBTUMsV0FBVyxJQUFJQyxNQUFKLENBQVcsa0JBQVgsQ0FBakI7O0FBRUEsSUFBSUMsVUFBSjtBQUNBLElBQUlDLE1BQUo7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNB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O0FBR0EvQyxxQkFBcUIsQ0FBQ0gsSUFBRCxFQUFPb0UsR0FBUCxLQUFlO0FBQ2xDLE1BQUksQ0FBQ0EsR0FBTCxFQUNFQSxNQUFNQyxPQUFPQyxRQUFQLENBQWdCdEcsSUFBdEI7QUFDRmdDLFNBQU9BLEtBQUt1RSxPQUFMLENBQWEsU0FBYixFQUF3QixNQUF4QixDQUFQO0FBQ0EsUUFBTUMsUUFBUSxJQUFJQyxNQUFKLENBQVksT0FBTXpFLElBQUssbUJBQXZCLENBQWQ7QUFBQSxRQUNFMEUsVUFBVUYsTUFBTUcsSUFBTixDQUFXUCxHQUFYLENBRFo7QUFFQSxNQUFJLENBQUNNLE9BQUwsRUFDRSxPQUFPLElBQVA7QUFDRixNQUFJLENBQUNBLFFBQVEsQ0FBUixDQUFMLEVBQ0UsT0FBTyxFQUFQO0FBQ0YsU0FBT0UsbUJBQW1CRixRQUFRLENBQVIsRUFBV0gsT0FBWCxDQUFtQixLQUFuQixFQUEwQixHQUExQixDQUFuQixDQUFQO0FBQ0QsQ0FYRDs7QUFhQTs7O0FBR0FNLFdBQVcsTUFBSTtBQUNibkc7QUFDRCxDQUZELEVBRUUsR0FGRiIsImZpbGUiOiJyZXN0YXVyYW50X2luZm8uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDcmVhdGUgTGluayBFbGVtZW50IGZvciBTdHlsZXNoZWV0XG5sZXQgbXlDU1MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImxpbmtcIiApO1xubXlDU1MucmVsID0gXCJzdHlsZXNoZWV0XCI7XG5teUNTUy5ocmVmID0gXCIvY3NzL2xlYWZsZXQuY3NzXCI7XG4vLyBpbnNlcnQgaXQgYXQgdGhlIGVuZCBvZiB0aGUgaGVhZCBpbiBhIGxlZ2FjeS1mcmllbmRseSBtYW5uZXJcbmRvY3VtZW50LmhlYWQuaW5zZXJ0QmVmb3JlKCBteUNTUywgZG9jdW1lbnQuaGVhZC5jaGlsZE5vZGVzWyBkb2N1bWVudC5oZWFkLmNoaWxkTm9kZXMubGVuZ3RoIC0gMSBdLm5leHRTaWJsaW5nICk7IFxuXG5jb25zdCBkYldvcmtlciA9IG5ldyBXb3JrZXIoJy4vanMvZGJ3b3JrZXIuanMnKTtcblxubGV0IHJlc3RhdXJhbnQ7XG52YXIgbmV3TWFwO1xuXG4vLyAvKipcbi8vICAqIENoZWNrIHRvIHNlZSBpZiBzZXJ2aWNlIHdvcmtlciBpcyBzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIgXG4vLyAgKi9cbi8vIGlmICgnc2VydmljZVdvcmtlcicgaW4gbmF2aWdhdG9yKSB7XG4gIFxuLy8gICAvKiBpZiBpdCBpcywgcmVnaXN0ZXIgdGhlIHNlcnZpY2Ugd29ya2VyICovXG4vLyAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKCcvc3cuanMnKS50aGVuKGZ1bmN0aW9uKHJlcyl7XG5cbi8vICAgICAvLyBBbHJlYWR5IG9uIHRoZSBsYXRlc3QgdmVyc2lvbiwgYmFpbFxuLy8gICAgIGlmKCFuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5jb250cm9sbGVyKXtcbi8vICAgICAgIHJldHVybjtcbi8vICAgICB9XG4vLyAgICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZXJlJ3MgYSB3YWl0aW5nIHNlcnZpY2Ugd29ya2VyXG4vLyAgICAgaWYgKHJlcy53YWl0aW5nKXtcbi8vICAgICAgIF91cGRhdGVSZWFkeSgpO1xuLy8gICAgICAgcmV0dXJuIFxuLy8gICAgIH1cblxuLy8gICAgIGlmIChyZXMuaW5zdGFsbGluZykge1xuLy8gICAgICAgX3RyYWNrSW5zdGFsbGluZyhyZXMuaW5zdGFsbGluZyk7XG4vLyAgICAgICByZXR1cm47XG4vLyAgICAgfVxuICAgIFxuLy8gICAgIHJlcy5hZGRFdmVudExpc3RlbmVyKCd1cGRhdGVmb3VuZCcsIGZ1bmN0aW9uKCkge1xuLy8gICAgICAgX3RyYWNrSW5zdGFsbGluZyhyZXMuaW5zdGFsbGluZyk7XG4vLyAgICAgfSk7XG4gICAgXG4vLyAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKXtcbi8vICAgICBjb25zb2xlLmxvZygnZXJyb3IgcmVnaXN0ZXJpbmcgc2VydmljZSB3b3JrZXI6ICcsZXJyb3IpXG4vLyAgIH0pO1xuICBcbi8vICAgZnVuY3Rpb24gX3RyYWNrSW5zdGFsbGluZyh3b3JrZXIpe1xuLy8gICAgIHdvcmtlci5hZGRFdmVudExpc3RlbmVyKCdzdGF0ZWNoYW5nZScsZnVuY3Rpb24oKXtcbi8vICAgICAgIGlmICh3b3JrZXIuc3RhdGUgPT0gJ2luc3RhbGxlZCcpe1xuLy8gICAgICAgICBfdXBkYXRlUmVhZHkod29ya2VyKTtcbi8vICAgICAgIH1cbi8vICAgICB9KVxuLy8gICB9XG5cbi8vICAgdmFyIGZvY3VzZWRFbGVtZW50O1xuLy8gICAvKipcbi8vICAgICogTm90aWZpZXMgdGhlIHVzZXIgdGhhdCBhbiB1cGRhdGVkIFNXIGlzIGF2YWlsYWJsZVxuLy8gICAgKi9cbi8vICAgZnVuY3Rpb24gX3VwZGF0ZVJlYWR5KHdvcmtlcil7XG4vLyAgICAgLy8gSWYgdGhlIHVzZXIgY2xpY2tzIG9uIHRoZSB1cGRhdGUgYnV0dG9uLCB1cGRhdGUgdGhlIHNlcnZpY2Ugd29ya2VyXG4vLyAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VwZGF0ZS12ZXJzaW9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLGZ1bmN0aW9uKCl7XG4vLyAgICAgICB3b3JrZXIucG9zdE1lc3NhZ2Uoe2FjdGlvbjonc2tpcFdhaXRpbmcnfSk7XG4vLyAgICAgfSk7XG4vLyAgICAgLy8gSWYgdGhlIHVzZXIgY2xpY2tzIHRoZSBkaXNtaXNzIGJ1dHRvbiwgaGlkZSB0aGUgdG9hc3Rcbi8vICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGlzbWlzcy12ZXJzaW9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLGZ1bmN0aW9uKCl7XG4vLyAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9hc3QnKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbi8vICAgICAgIGZvY3VzZWRFbGVtZW50LmZvY3VzKClcbi8vICAgICB9KTtcbi8vICAgICAvLyBJZiB0aGUgdG9hc3QgaXMgZGlzcGxheWluZywgbGlzdGVuIGZvciBrZXlib2FyZCBldmVudHNcbi8vICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9hc3QnKS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJyxmdW5jdGlvbihlKXtcbi8vICAgICAgIC8vQ2hlY2sgZm9yIFRhYiBrZXkgcHJlc3Ncbi8vICAgICAgIGlmKGUua2V5Q29kZSA9PT0gOSl7XG4gICAgICAgIFxuLy8gICAgICAgICBpZiAoZS5zaGlmdEtleSkge1xuLy8gICAgICAgICAgIC8vUHJlc3NlZCBTaGlmdCBUYWJcbi8vICAgICAgICAgICBpZihkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBmaXJzdFRhYlN0b3ApIHtcbi8vICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbi8vICAgICAgICAgICAgIGxhc3RUYWJTdG9wLmZvY3VzKCk7XG4vLyAgICAgICAgICAgfVxuLy8gICAgICAgICB9ZWxzZXtcbi8vICAgICAgICAgICAvL1ByZXNzZWQgVGFiXG4vLyAgICAgICAgICAgaWYoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gbGFzdFRhYlN0b3ApIHtcbi8vICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbi8vICAgICAgICAgICAgIGZpcnN0VGFiU3RvcC5mb2N1cygpO1xuLy8gICAgICAgICAgIH1cbi8vICAgICAgICAgfVxuLy8gICAgICAgfVxuLy8gICAgICAgLy8gRXNjYXBlIEtleVxuLy8gICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMjcpe1xuLy8gICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9hc3QnKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbi8vICAgICAgICAgZm9jdXNlZEVsZW1lbnQuZm9jdXMoKVxuLy8gICAgICAgfSBcbi8vICAgICB9KTtcblxuLy8gICAgIC8vIFJlbWVtYmVyIHdoYXQgdGhlIGxhc3QgZWxlbWVudCB0aGF0IHdhcyBmb2N1c2VkIHdhcywgYW5kIG1ha2UgaXQgZm9jdXNhYmxlIHNvIHdlIGNhbiByZXR1cm4gdG8gaXRcbi8vICAgICBmb2N1c2VkRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4vLyAgICAgZm9jdXNlZEVsZW1lbnQudGFiaW5kZXggPSAxO1xuICAgXG4vLyAgICAgLy8gV2hlbiB0aGUgdG9hc3QgaXMgdmlzaWJsZSwgdGhpcyBpcyB3aGF0IHdlJ2xsIHVzZSB0byB0ZW1wb3JhcmlseSB0cmFwIGZvY3VzXG4vLyAgICAgdmFyIGZvY3VzYWJsZUVsZW1lbnRzU3RyaW5nID0gJyN0b2FzdCBwLCAjdXBkYXRlLXZlcnNpb24sICNkaXNtaXNzLXZlcnNpb24nO1xuLy8gICAgIHZhciBmb2N1c2FibGVFbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoZm9jdXNhYmxlRWxlbWVudHNTdHJpbmcpO1xuLy8gICAgIGZvY3VzYWJsZUVsZW1lbnRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZm9jdXNhYmxlRWxlbWVudHMpO1xuICAgIFxuLy8gICAgIHZhciBmaXJzdFRhYlN0b3AgPSBmb2N1c2FibGVFbGVtZW50c1swXTtcbi8vICAgICB2YXIgbGFzdFRhYlN0b3AgPSBmb2N1c2FibGVFbGVtZW50c1tmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggLTFdO1xuXG4vLyAgICAgLy8gT2sgdGltZSB0byBzaG93IHRoZSB0b2FzdCBhbmQgZm9jdXMgb24gaXRcbi8vICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9hc3QnKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbi8vICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdG9hc3QgcCcpLmZvY3VzKCk7XG5cbi8vICAgfVxuICBcblxuLy8gICAvKipcbi8vICAgICogTGlzdGVucyBmb3IgYSBjaGFuZ2UgaW4gdGhlIFNXLCByZWxvYWRzIHRoZSBwYWdlIGFzIGEgcmVzdWx0XG4vLyAgICAqL1xuLy8gICB2YXIgcmVmcmVzaGluZztcbi8vICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignY29udHJvbGxlcmNoYW5nZScsIGZ1bmN0aW9uKCkge1xuLy8gICAgIGNvbnNvbGUubG9nKCdjb250cm9sbGVyIGNoYW5nZScpXG4vLyAgICAgaWYgKHJlZnJlc2hpbmcpIHJldHVybjtcbi8vICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4vLyAgICAgcmVmcmVzaGluZyA9IHRydWU7XG4vLyAgIH0pO1xuLy8gfVxuICBcbiAgLyoqXG4gICAqIEluaXRpYWxpemUgbGVhZmxldCBtYXBcbiAgICovXG4gIGluaXRNYXAgPSAoKSA9PiB7XG4gIC8vIGNvbnN0IGlkID0gZ2V0UGFyYW1ldGVyQnlOYW1lKCdpZCcpO1xuICAvLyBkYldvcmtlci5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24oZSkge1xuICAvLyAgIGlmIChlLmRhdGEgPT0gJ2Vycm9yJykgeyAvLyBHb3QgYW4gZXJyb3JcbiAgLy8gICAgIGNvbnNvbGUuZXJyb3IoZS5kYXRhKTtcbiAgLy8gICB9IGVsc2Uge1xuICAvLyAgICAgc2VsZi5uZXdNYXAgPSBMLm1hcCgnbWFwJywge1xuICAvLyAgICAgICBjZW50ZXI6IFtlLmRhdGEucmVzdGF1cmFudC5sYXRsbmcubGF0LCBlLmRhdGEucmVzdGF1cmFudC5sYXRsbmcubG5nXSxcbiAgLy8gICAgICAgem9vbTogMTYsXG4gIC8vICAgICAgIHNjcm9sbFdoZWVsWm9vbTogZmFsc2VcbiAgLy8gICAgIH0pO1xuICAvLyAgICAgTC50aWxlTGF5ZXIoJ2h0dHBzOi8vYXBpLnRpbGVzLm1hcGJveC5jb20vdjQve2lkfS97en0ve3h9L3t5fS5qcGc3MD9hY2Nlc3NfdG9rZW49e21hcGJveFRva2VufScsIHtcbiAgLy8gICAgICAgbWFwYm94VG9rZW46ICdway5leUoxSWpvaVptRnljbVZzYkhOamNtbHdkQ0lzSW1FaU9pSmphbUppYVRsM2RITXhPR3hzTXpKd1pUbG1Zbk40WkhONUluMC42RXk1MGVsMGF0d2pEeWdPX2NPMHNBJyxcbiAgLy8gICAgICAgbWF4Wm9vbTogMTgsXG4gIC8vICAgICAgIGF0dHJpYnV0aW9uOiAnTWFwIGRhdGEgJmNvcHk7IDxhIGhyZWY9XCJodHRwczovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9cIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnMsICcgK1xuICAvLyAgICAgICAgICc8YSBocmVmPVwiaHR0cHM6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LXNhLzIuMC9cIj5DQy1CWS1TQTwvYT4sICcgK1xuICAvLyAgICAgICAgICdJbWFnZXJ5IMKpIDxhIGhyZWY9XCJodHRwczovL3d3dy5tYXBib3guY29tL1wiPk1hcGJveDwvYT4nLFxuICAvLyAgICAgICBpZDogJ21hcGJveC5zdHJlZXRzJyAgICBcbiAgLy8gICAgIH0pLmFkZFRvKG5ld01hcCk7XG4gIC8vICAgICBtYXBNYXJrZXJGb3JSZXN0YXVyYW50KGUuZGF0YS5yZXN0YXVyYW50LCBzZWxmLm5ld01hcCk7XG4gIC8vICAgfVxuICAvLyB9LCBmYWxzZSk7XG4gIC8vIGRiV29ya2VyLnBvc3RNZXNzYWdlKHthY3Rpb246J2ZldGNoUmVzdGF1cmFudEJ5SWQnLCBpZH0pO1xuXG5cbiAgZmV0Y2hSZXN0YXVyYW50RnJvbVVSTCgoZXJyb3IsIHJlc3RhdXJhbnQpID0+IHtcbiAgICBpZiAoZXJyb3IpIHsgLy8gR290IGFuIGVycm9yIVxuICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgfSBlbHNlIHsgICAgICBcbiAgICAgIHNlbGYubmV3TWFwID0gTC5tYXAoJ21hcCcsIHtcbiAgICAgICAgY2VudGVyOiBbcmVzdGF1cmFudC5sYXRsbmcubGF0LCByZXN0YXVyYW50LmxhdGxuZy5sbmddLFxuICAgICAgICB6b29tOiAxNixcbiAgICAgICAgc2Nyb2xsV2hlZWxab29tOiBmYWxzZVxuICAgICAgfSk7XG4gICAgICBMLnRpbGVMYXllcignaHR0cHM6Ly9hcGkudGlsZXMubWFwYm94LmNvbS92NC97aWR9L3t6fS97eH0ve3l9LmpwZzcwP2FjY2Vzc190b2tlbj17bWFwYm94VG9rZW59Jywge1xuICAgICAgICBtYXBib3hUb2tlbjogJ3BrLmV5SjFJam9pWm1GeWNtVnNiSE5qY21sd2RDSXNJbUVpT2lKamFtSmlhVGwzZEhNeE9HeHNNekp3WlRsbVluTjRaSE41SW4wLjZFeTUwZWwwYXR3akR5Z09fY08wc0EnLFxuICAgICAgICBtYXhab29tOiAxOCxcbiAgICAgICAgYXR0cmlidXRpb246ICdNYXAgZGF0YSAmY29weTsgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL1wiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycywgJyArXG4gICAgICAgICAgJzxhIGhyZWY9XCJodHRwczovL2NyZWF0aXZlY29tbW9ucy5vcmcvbGljZW5zZXMvYnktc2EvMi4wL1wiPkNDLUJZLVNBPC9hPiwgJyArXG4gICAgICAgICAgJ0ltYWdlcnkgwqkgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm1hcGJveC5jb20vXCI+TWFwYm94PC9hPicsXG4gICAgICAgIGlkOiAnbWFwYm94LnN0cmVldHMnICAgIFxuICAgICAgfSkuYWRkVG8obmV3TWFwKTtcbiAgICAgIG1hcE1hcmtlckZvclJlc3RhdXJhbnQocmVzdGF1cmFudCwgc2VsZi5uZXdNYXApO1xuICAgIH1cbiAgfSk7XG4gIH0gIFxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIG1hcCBtYXJrZXIgZm9yIHRoZSByZXN0YXVyYW50XG4gICAqL1xuICBtYXBNYXJrZXJGb3JSZXN0YXVyYW50ID0gKHJlc3RhdXJhbnQsIG1hcCk9PntcbiAgICAvLyBodHRwczovL2xlYWZsZXRqcy5jb20vcmVmZXJlbmNlLTEuMy4wLmh0bWwjbWFya2VyICBcbiAgICBjb25zdCBtYXJrZXIgPSBuZXcgTC5tYXJrZXIoW3Jlc3RhdXJhbnQubGF0bG5nLmxhdCwgcmVzdGF1cmFudC5sYXRsbmcubG5nXSxcbiAgICAgIHt0aXRsZTogcmVzdGF1cmFudC5uYW1lLFxuICAgICAgYWx0OiByZXN0YXVyYW50Lm5hbWVcbiAgICAgIH0pO1xuICAgICAgbWFya2VyLmFkZFRvKG5ld01hcCk7XG4gICAgcmV0dXJuIG1hcmtlcjtcbiAgfSBcblxuLyoqXG4gKiBHZXQgY3VycmVudCByZXN0YXVyYW50IGZyb20gcGFnZSBVUkwuXG4gKi9cbmZldGNoUmVzdGF1cmFudEZyb21VUkwgPSAoY2FsbGJhY2spID0+IHtcbiAgaWYgKHNlbGYucmVzdGF1cmFudCkgeyAvLyByZXN0YXVyYW50IGFscmVhZHkgZmV0Y2hlZCFcbiAgICBjYWxsYmFjayhudWxsLCBzZWxmLnJlc3RhdXJhbnQpXG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IGlkID0gZ2V0UGFyYW1ldGVyQnlOYW1lKCdpZCcpO1xuICBpZiAoIWlkKSB7IC8vIG5vIGlkIGZvdW5kIGluIFVSTFxuICAgIGVycm9yID0gJ05vIHJlc3RhdXJhbnQgaWQgaW4gVVJMJ1xuICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBEQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRCeUlkKGlkLCAoZXJyb3IsIHJlc3RhdXJhbnQpID0+IHtcbiAgICAvLyAgIHNlbGYucmVzdGF1cmFudCA9IHJlc3RhdXJhbnQ7XG4gICAgLy8gICBpZiAoIXJlc3RhdXJhbnQpIHtcbiAgICAvLyAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgLy8gICAgIHJldHVybjtcbiAgICAvLyAgIH1cbiAgICAvLyAgIGZpbGxSZXN0YXVyYW50SFRNTCgpO1xuICAgIC8vICAgY2FsbGJhY2sobnVsbCwgcmVzdGF1cmFudClcbiAgICAvLyB9KTtcbiAgICAvLyBDb21tZW50XG4gICAgZGJXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGlmIChlLmRhdGEgPT0gJ2Vycm9yJykgeyAvLyBHb3QgYW4gZXJyb3JcbiAgICAgICAgY29uc29sZS5lcnJvcihlLmRhdGEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2dvdCBiYWNrOiAnLGUuZGF0YS5yZXN0YXVyYW50KVxuICAgICAgICBpZihlLmRhdGEucmVzdGF1cmFudCl7XG4gICAgICAgICAgZmlsbFJlc3RhdXJhbnRIVE1MKGUuZGF0YS5yZXN0YXVyYW50LGUuZGF0YS5yZXZpZXdzKTtcbiAgICAgICAgICBjYWxsYmFjayhudWxsLCBlLmRhdGEucmVzdGF1cmFudCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCBmYWxzZSk7XG4gICAgZGJXb3JrZXIucG9zdE1lc3NhZ2Uoe2FjdGlvbjonZmV0Y2hSZXN0YXVyYW50QnlJZCcsIGlkfSk7XG4gICAgfSAgICBcbn1cblxuLyoqXG4gKiBDcmVhdGUgcmVzdGF1cmFudCBIVE1MIGFuZCBhZGQgaXQgdG8gdGhlIHdlYnBhZ2VcbiAqL1xuZmlsbFJlc3RhdXJhbnRIVE1MID0gKHJlc3RhdXJhbnQscmV2aWV3cykgPT4ge1xuICBjb25zb2xlLmxvZygncmVzdGF1cmFudCcscmVzdGF1cmFudClcbiAgY29uc3QgbmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50LW5hbWUnKTtcbiAgbmFtZS5pbm5lckhUTUwgPSByZXN0YXVyYW50Lm5hbWU7XG5cbiAgLy8gUmV2aWV3IG9mIHRoZSByZXN0YXVyYW50XG4gIGNvbnN0IHJhdGluZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyYXRpbmcnKTtcblxuXG4gIGxldCBlbXB0eWhlYXJ0cyA9IDUgLSByZXZpZXdzO1xuICBcbiAgZm9yKGxldCBpPTA7IGkgPCByZXZpZXdzOyBpKyspe1xuICAgIGNvbnN0IGVtcHR5c3RhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGVtcHR5c3Rhci5jbGFzc05hbWU9XCJyZXN0YXVyYW50X19zdGFyIHJlc3RhdXJhbnRfX3N0YXItLWZ1bGxcIjtcbiAgICBlbXB0eXN0YXIuc3JjID0gXCIvaW1nL2Z1bGxzdGFyLnN2Z1wiO1xuICAgIGVtcHR5c3Rhci5hbHQ9IFwiXCJcbiAgICByYXRpbmcuYXBwZW5kKGVtcHR5c3Rhcik7XG4gIH1cblxuICBmb3IobGV0IGk9MDsgaSA8IGVtcHR5aGVhcnRzOyBpKyspe1xuICAgIGNvbnN0IGVtcHR5c3RhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGVtcHR5c3Rhci5jbGFzc05hbWU9XCJyZXN0YXVyYW50X19zdGFyIHJlc3RhdXJhbnRfX3N0YXItLWVtcHR5XCI7XG4gICAgZW1wdHlzdGFyLnNyYyA9IFwiL2ltZy9lbXB0eXN0YXIuc3ZnXCI7XG4gICAgZW1wdHlzdGFyLmFsdD0gXCJcIlxuICAgIHJhdGluZy5hcHBlbmQoZW1wdHlzdGFyKTtcbiAgfVxuXG5cbiAgY29uc3QgYWRkcmVzcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50LWFkZHJlc3MnKTtcbiAgYWRkcmVzcy5pbm5lckhUTUwgPSByZXN0YXVyYW50LmFkZHJlc3M7XG5cbiAgY29uc3QgYWRkcmVzc2ljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgYWRkcmVzc2ljb24uY2xhc3NOYW1lID0gJ3Jlc3RhdXJhbnRkZXRhaWxfX2ljb24nO1xuICBhZGRyZXNzaWNvbi5zcmMgPSAnL2ltZy93YXlwb2ludC5zdmcnO1xuICBhZGRyZXNzaWNvbi5hbHQgPSAnJztcbiAgYWRkcmVzcy5wcmVwZW5kKGFkZHJlc3NpY29uKVxuXG4gIGNvbnN0IGltYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnQtaW1nJyk7XG4gIGltYWdlLmNsYXNzTmFtZSA9ICdyZXN0YXVyYW50LWltZydcbiAgaW1hZ2Uuc3JjID0gREJIZWxwZXIuaW1hZ2VVcmxGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpO1xuICBpbWFnZS5hbHQgPSBEQkhlbHBlci5pbWFnZVRleHRGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpO1xuICBpbWFnZS5zcmNzZXQgPSBEQkhlbHBlci5pbWFnZVNyY1NldEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCk7XG5cbiAgY29uc3QgY3Vpc2luZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50LWN1aXNpbmUnKTtcbiAgY3Vpc2luZS5pbm5lckhUTUwgPSByZXN0YXVyYW50LmN1aXNpbmVfdHlwZTtcblxuICBjb25zdCBjdWlzaW5laWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICBjdWlzaW5laWNvbi5jbGFzc05hbWUgPSAncmVzdGF1cmFudGRldGFpbF9faWNvbic7XG4gIGN1aXNpbmVpY29uLnNyYyA9ICcvaW1nL2N1aXNpbmUuc3ZnJztcbiAgY3Vpc2luZWljb24uYWx0ID0gJyc7XG4gIGN1aXNpbmUucHJlcGVuZChjdWlzaW5laWNvbilcblxuICAvLyBmaWxsIG9wZXJhdGluZyBob3Vyc1xuICBpZiAocmVzdGF1cmFudC5vcGVyYXRpbmdfaG91cnMpIHtcbiAgICBmaWxsUmVzdGF1cmFudEhvdXJzSFRNTChyZXN0YXVyYW50Lm9wZXJhdGluZ19ob3Vycyk7XG5cbiAgICBjb25zdCBob3VycyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50ZGV0YWlsX19ob3Vyc2NvbnRhaW5lcicpO1xuICBcbiAgICBjb25zdCBob3Vyc2ljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBob3Vyc2ljb24uY2xhc3NOYW1lID0gJ3Jlc3RhdXJhbnRkZXRhaWxfX2ljb24nO1xuICAgIGhvdXJzaWNvbi5zcmMgPSAnL2ltZy9jbG9jay5zdmcnO1xuICAgIGhvdXJzaWNvbi5hbHQgPSAnJztcbiAgICBob3Vycy5wcmVwZW5kKGhvdXJzaWNvbilcblxuICB9XG4gIC8vIGZpbGwgcmV2aWV3c1xuICBcbiAgZGJXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoZS5kYXRhID09ICdlcnJvcicpIHsgLy8gR290IGFuIGVycm9yXG4gICAgICBjb25zb2xlLmVycm9yKGUuZGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCdnb3QgYmFjazogJyxlLmRhdGEucmV2aWV3cylcbiAgICAgIGZpbGxSZXZpZXdzSFRNTChlLmRhdGEucmV2aWV3cyk7XG4gICAgfVxuICB9LCBmYWxzZSk7XG4gIGRiV29ya2VyLnBvc3RNZXNzYWdlKHthY3Rpb246J2ZpbGxSZXZpZXdzSFRNTCcsIGlkOnJlc3RhdXJhbnQuaWR9KTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgcmVzdGF1cmFudCBvcGVyYXRpbmcgaG91cnMgSFRNTCB0YWJsZSBhbmQgYWRkIGl0IHRvIHRoZSB3ZWJwYWdlLlxuICovXG5maWxsUmVzdGF1cmFudEhvdXJzSFRNTCA9IChvcGVyYXRpbmdIb3VycykgPT4ge1xuICBjb25zdCBob3VycyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50LWhvdXJzJyk7XG4gIGZvciAobGV0IGtleSBpbiBvcGVyYXRpbmdIb3Vycykge1xuICAgIGNvbnN0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJyk7XG5cbiAgICBjb25zdCBkYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgIGRheS5jbGFzc05hbWUgPSAncmVzdGF1cmFudGRldGFpbF9fZGF5JztcbiAgICBkYXkuaW5uZXJIVE1MID0ga2V5O1xuICAgIHJvdy5hcHBlbmRDaGlsZChkYXkpO1xuXG4gICAgY29uc3QgdGltZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgdGltZS5jbGFzc05hbWUgPSAncmVzdGF1cmFudGRldGFpbF9faG91cic7XG4gICAgdGltZS5pbm5lckhUTUwgPSBvcGVyYXRpbmdIb3Vyc1trZXldO1xuICAgIHJvdy5hcHBlbmRDaGlsZCh0aW1lKTtcblxuICAgIGhvdXJzLmFwcGVuZENoaWxkKHJvdyk7XG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGUgYWxsIHJldmlld3MgSFRNTCBhbmQgYWRkIHRoZW0gdG8gdGhlIHdlYnBhZ2UuXG4gKi9cbmZpbGxSZXZpZXdzSFRNTCA9IChyZXZpZXdzKSA9PiB7XG4gIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXZpZXdzLWNvbnRhaW5lcicpO1xuICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gzJyk7XG4gIHRpdGxlLmlubmVySFRNTCA9ICdSZXZpZXdzJztcbiAgdGl0bGUuY2xhc3NOYW1lID0gJ3Jlc3RhdXJhbnRkZXRhaWxfX3Jldmlld3N0aXRsZSc7XG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aXRsZSk7XG5cbiAgaWYgKCFyZXZpZXdzKSB7XG4gICAgY29uc3Qgbm9SZXZpZXdzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIG5vUmV2aWV3cy5pbm5lckhUTUwgPSAnTm8gcmV2aWV3cyB5ZXQhJztcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQobm9SZXZpZXdzKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgdWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmV2aWV3cy1saXN0Jyk7XG4gIHJldmlld3MuZm9yRWFjaChyZXZpZXcgPT4ge1xuICAgIHVsLmFwcGVuZENoaWxkKGNyZWF0ZVJldmlld0hUTUwocmV2aWV3KSk7XG4gIH0pO1xuICBjb250YWluZXIuYXBwZW5kQ2hpbGQodWwpO1xufVxuXG4vKipcbiAqIENyZWF0ZSByZXZpZXcgSFRNTCBhbmQgYWRkIGl0IHRvIHRoZSB3ZWJwYWdlLlxuICovXG5jcmVhdGVSZXZpZXdIVE1MID0gKHJldmlldykgPT4ge1xuICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gIGxpLmNsYXNzTmFtZSA9ICdyZXN0YXVyYW50ZGV0YWlsX19yZXZpZXcnO1xuICBjb25zdCBjb21tZW50SGVhZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbW1lbnRIZWFkZXIuY2xhc3NOYW1lID0gJ3Jlc3RhdXJhbnRkZXRhaWxfX2NvbW1lbnRoZWFkZXInO1xuXG4gIGNvbnN0IGxlZnRkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgbGVmdGRpdi5jbGFzc05hbWUgPSAncmVzdGF1cmFudGRldGFpbF9fYXZhdGFyY29udGFpbmVyJztcblxuICBjb25zdCBhdmF0YXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgYXZhdGFyLnNyYyAgPSAnL2ltZy9hdmF0YXIuc3ZnJztcbiAgYXZhdGFyLmNsYXNzTmFtZSA9ICdyZXN0YXVyYW50ZGV0YWlsX19hdmF0YXInO1xuICBhdmF0YXIuYWx0ID0gJ0F2YXRhciBwaG90byc7XG4gIGxlZnRkaXYuYXBwZW5kQ2hpbGQoYXZhdGFyKTtcbiAgY29tbWVudEhlYWRlci5hcHBlbmRDaGlsZChsZWZ0ZGl2KTtcblxuICBjb25zdCByaWdodGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICByaWdodGRpdi5jbGFzc05hbWUgPSAncmVzdGF1cmFudGRldGFpbF9fbmFtZWNvbnRhaW5lcic7XG5cbiAgY29uc3QgbmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgbmFtZS5pbm5lckhUTUwgPSByZXZpZXcubmFtZTtcbiAgcmlnaHRkaXYuYXBwZW5kQ2hpbGQobmFtZSk7XG4gIFxuICAvLyBDcmVhdGUgU3RhcnMgZm9yIFJldmlld1xuICBjb25zdCBpbmRpdmlkdWFscmF0aW5nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBpbmRpdmlkdWFscmF0aW5nLmNsYXNzTmFtZSA9ICdyZXN0YXVyYW50ZGV0YWlsX19pbmRpdmlkdWFscmV2aWV3cmF0aW5nJztcbiAgY29uc3QgZW1wdHlTdGFycyA9IDUgLSBwYXJzZUludChyZXZpZXcucmF0aW5nKTtcbiAgZm9yKGxldCBpPTA7IGkgPCByZXZpZXcucmF0aW5nOyBpKyspe1xuICAgIGNvbnN0IGZ1bGxzdGFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgZnVsbHN0YXIuY2xhc3NOYW1lPVwicmVzdGF1cmFudF9fc3RhciByZXN0YXVyYW50X19zdGFyLS1mdWxsXCI7XG4gICAgZnVsbHN0YXIuc3JjID0gXCIvaW1nL2Z1bGxzdGFyLnN2Z1wiO1xuICAgIGZ1bGxzdGFyLmFsdCA9IFwiXCJcbiAgICBpbmRpdmlkdWFscmF0aW5nLmFwcGVuZChmdWxsc3Rhcik7XG4gIH1cbiAgZm9yKGxldCBpPTA7IGkgPCBlbXB0eVN0YXJzOyBpKyspe1xuICAgIGNvbnN0IGVtcHR5c3RhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGVtcHR5c3Rhci5jbGFzc05hbWU9XCJyZXN0YXVyYW50X19zdGFyIHJlc3RhdXJhbnRfX3N0YXItLWVtcHR5XCI7XG4gICAgZW1wdHlzdGFyLnNyYyA9IFwiL2ltZy9lbXB0eXN0YXIuc3ZnXCI7XG4gICAgZW1wdHlzdGFyLmFsdD0gXCJcIlxuICAgIGluZGl2aWR1YWxyYXRpbmcuYXBwZW5kKGVtcHR5c3Rhcik7XG4gIH1cblxuICByaWdodGRpdi5hcHBlbmRDaGlsZChpbmRpdmlkdWFscmF0aW5nKTtcbiAgY29uc3QgZGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgZGF0ZS5jbGFzc05hbWUgPSAncmVzdGF1cmFudGRldGFpbF9fcmV2aWV3ZGF0ZSdcbiAgY29uc3QgcmV2aWV3ZGF0ZSA9IG5ldyBEYXRlKHJldmlldy5jcmVhdGVkQXQpO1xuICBjb25zdCB0b2RheWRhdGUgPSBuZXcgRGF0ZSgpO1xuICAvLyBTdWJ0cmFjdCB0b2RheXMgZGF0ZSBmcm9tIHRoZSBkYXRlIG9mIHRoZSByZXZpZXcsIHRoZW4gZm9ybWF0IGludG8gZGF5c1xuICBjb25zdCBkYXlzZGlmZmVyZW5jZSA9IE1hdGgucm91bmQoKHRvZGF5ZGF0ZSAtIHJldmlld2RhdGUpLzEwMDAvNjAvNjAvMjQpXG4gIGRhdGUuaW5uZXJIVE1MID0gYCR7ZGF5c2RpZmZlcmVuY2V9IGFnb2A7XG4gIHJpZ2h0ZGl2LmFwcGVuZENoaWxkKGRhdGUpO1xuXG4gIGNvbW1lbnRIZWFkZXIuYXBwZW5kQ2hpbGQocmlnaHRkaXYpOyBcbiAgbGkuYXBwZW5kQ2hpbGQoY29tbWVudEhlYWRlcik7XG5cbiAgY29uc3QgY29tbWVudHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gIGNvbW1lbnRzLmlubmVySFRNTCA9IHJldmlldy5jb21tZW50cztcbiAgbGkuYXBwZW5kQ2hpbGQoY29tbWVudHMpO1xuXG4gIHJldHVybiBsaTtcbn1cblxuLyoqXG4gKiBHZXQgYSBwYXJhbWV0ZXIgYnkgbmFtZSBmcm9tIHBhZ2UgVVJMLlxuICovXG5nZXRQYXJhbWV0ZXJCeU5hbWUgPSAobmFtZSwgdXJsKSA9PiB7XG4gIGlmICghdXJsKVxuICAgIHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICBuYW1lID0gbmFtZS5yZXBsYWNlKC9bXFxbXFxdXS9nLCAnXFxcXCQmJyk7XG4gIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChgWz8mXSR7bmFtZX0oPShbXiYjXSopfCZ8I3wkKWApLFxuICAgIHJlc3VsdHMgPSByZWdleC5leGVjKHVybCk7XG4gIGlmICghcmVzdWx0cylcbiAgICByZXR1cm4gbnVsbDtcbiAgaWYgKCFyZXN1bHRzWzJdKVxuICAgIHJldHVybiAnJztcbiAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChyZXN1bHRzWzJdLnJlcGxhY2UoL1xcKy9nLCAnICcpKTtcbn1cblxuLyoqXG4gICogSW5pdGlhbGl6ZSBtYXAgYXMgc29vbiBhcyB0aGUgcGFnZSBpcyBsb2FkZWQuXG4gKi9cbnNldFRpbWVvdXQoKCk9PntcbiAgaW5pdE1hcCgpO1xufSwxMDApIFxuICAiXX0=
