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
 * Event listeners for review form
 */

document.querySelector('.restaurantdetail__reviewinput').addEventListener('focus', function () {
  this.previousElementSibling.classList.add('restaurantdetail__reviewlabel--active');
});

document.querySelector('.restaurantdetail__reviewinput').addEventListener('blur', function () {
  if (this.value === '') {
    this.previousElementSibling.classList.remove('restaurantdetail__reviewlabel--active');
  }
});

document.querySelector('.restaurantdetail__reviewnameinput').addEventListener('focus', function () {
  this.previousElementSibling.classList.add('restaurantdetail__reviewnamelabel--active');
});

document.querySelector('.restaurantdetail__reviewnameinput').addEventListener('blur', function () {
  if (this.value === '') {
    this.previousElementSibling.classList.remove('restaurantdetail__reviewnamelabel--active');
  }
});

const hoverlinks = document.querySelectorAll('.restaurantdetail__star');

for (var i = 0; i < hoverlinks.length; i++) {
  hoverlinks[i].addEventListener('click', function (event) {

    const highlightedStars = document.querySelectorAll('.restaurantdetail__star');
    const starLimit = this.getAttribute('data-value');

    for (var i = 1; i <= highlightedStars.length; i++) {
      if (i <= starLimit) {
        document.querySelector(`.restaurantdetail__star[data-value="${i}"]`).classList.add('restaurantdetail__star--active');
      } else {
        document.querySelector(`.restaurantdetail__star[data-value="${i}"]`).classList.remove('restaurantdetail__star--active');
      }
    }
  });
}

// document.querySelector('cuisines-select').addEventListener('focus',function(){
//   this.previousElementSibling.classList.add('filter__label--active');
// }) 

// document.querySelector('cuisines-select').addEventListener('blur',function(){
//   if(this.value === 'all'){
//     this.previousElementSibling.classList.remove('filter__label--active');
//   }
// })

/**
  * Initialize map as soon as the page is loaded.
 */
setTimeout(() => {
  initMap();
}, 100);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc3RhdXJhbnRfaW5mby5qcyJdLCJuYW1lcyI6WyJteUNTUyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInJlbCIsImhyZWYiLCJoZWFkIiwiaW5zZXJ0QmVmb3JlIiwiY2hpbGROb2RlcyIsImxlbmd0aCIsIm5leHRTaWJsaW5nIiwiZGJXb3JrZXIiLCJXb3JrZXIiLCJyZXN0YXVyYW50IiwibmV3TWFwIiwiaW5pdE1hcCIsImZldGNoUmVzdGF1cmFudEZyb21VUkwiLCJlcnJvciIsImNvbnNvbGUiLCJzZWxmIiwiTCIsIm1hcCIsImNlbnRlciIsImxhdGxuZyIsImxhdCIsImxuZyIsInpvb20iLCJzY3JvbGxXaGVlbFpvb20iLCJ0aWxlTGF5ZXIiLCJtYXBib3hUb2tlbiIsIm1heFpvb20iLCJhdHRyaWJ1dGlvbiIsImlkIiwiYWRkVG8iLCJtYXBNYXJrZXJGb3JSZXN0YXVyYW50IiwibWFya2VyIiwidGl0bGUiLCJuYW1lIiwiYWx0IiwiY2FsbGJhY2siLCJnZXRQYXJhbWV0ZXJCeU5hbWUiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsImRhdGEiLCJsb2ciLCJmaWxsUmVzdGF1cmFudEhUTUwiLCJyZXZpZXdzIiwicG9zdE1lc3NhZ2UiLCJhY3Rpb24iLCJnZXRFbGVtZW50QnlJZCIsImlubmVySFRNTCIsInJhdGluZyIsImVtcHR5aGVhcnRzIiwiaSIsImVtcHR5c3RhciIsImNsYXNzTmFtZSIsInNyYyIsImFwcGVuZCIsImFkZHJlc3MiLCJhZGRyZXNzaWNvbiIsInByZXBlbmQiLCJpbWFnZSIsIkRCSGVscGVyIiwiaW1hZ2VVcmxGb3JSZXN0YXVyYW50IiwiaW1hZ2VUZXh0Rm9yUmVzdGF1cmFudCIsInNyY3NldCIsImltYWdlU3JjU2V0Rm9yUmVzdGF1cmFudCIsImN1aXNpbmUiLCJjdWlzaW5lX3R5cGUiLCJjdWlzaW5laWNvbiIsIm9wZXJhdGluZ19ob3VycyIsImZpbGxSZXN0YXVyYW50SG91cnNIVE1MIiwiaG91cnMiLCJob3Vyc2ljb24iLCJmaWxsUmV2aWV3c0hUTUwiLCJvcGVyYXRpbmdIb3VycyIsImtleSIsInJvdyIsImRheSIsImFwcGVuZENoaWxkIiwidGltZSIsImNvbnRhaW5lciIsIm5vUmV2aWV3cyIsInVsIiwiZm9yRWFjaCIsInJldmlldyIsImNyZWF0ZVJldmlld0hUTUwiLCJsaSIsImNvbW1lbnRIZWFkZXIiLCJsZWZ0ZGl2IiwiYXZhdGFyIiwicmlnaHRkaXYiLCJpbmRpdmlkdWFscmF0aW5nIiwiZW1wdHlTdGFycyIsInBhcnNlSW50IiwiZnVsbHN0YXIiLCJkYXRlIiwicmV2aWV3ZGF0ZSIsIkRhdGUiLCJjcmVhdGVkQXQiLCJ0b2RheWRhdGUiLCJkYXlzZGlmZmVyZW5jZSIsIk1hdGgiLCJyb3VuZCIsImNvbW1lbnRzIiwidXJsIiwid2luZG93IiwibG9jYXRpb24iLCJyZXBsYWNlIiwicmVnZXgiLCJSZWdFeHAiLCJyZXN1bHRzIiwiZXhlYyIsImRlY29kZVVSSUNvbXBvbmVudCIsInF1ZXJ5U2VsZWN0b3IiLCJwcmV2aW91c0VsZW1lbnRTaWJsaW5nIiwiY2xhc3NMaXN0IiwiYWRkIiwidmFsdWUiLCJyZW1vdmUiLCJob3ZlcmxpbmtzIiwicXVlcnlTZWxlY3RvckFsbCIsImV2ZW50IiwiaGlnaGxpZ2h0ZWRTdGFycyIsInN0YXJMaW1pdCIsImdldEF0dHJpYnV0ZSIsInNldFRpbWVvdXQiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0EsSUFBSUEsUUFBUUMsU0FBU0MsYUFBVCxDQUF3QixNQUF4QixDQUFaO0FBQ0FGLE1BQU1HLEdBQU4sR0FBWSxZQUFaO0FBQ0FILE1BQU1JLElBQU4sR0FBYSxrQkFBYjtBQUNBO0FBQ0FILFNBQVNJLElBQVQsQ0FBY0MsWUFBZCxDQUE0Qk4sS0FBNUIsRUFBbUNDLFNBQVNJLElBQVQsQ0FBY0UsVUFBZCxDQUEwQk4sU0FBU0ksSUFBVCxDQUFjRSxVQUFkLENBQXlCQyxNQUF6QixHQUFrQyxDQUE1RCxFQUFnRUMsV0FBbkc7O0FBRUEsTUFBTUMsV0FBVyxJQUFJQyxNQUFKLENBQVcsa0JBQVgsQ0FBakI7O0FBRUEsSUFBSUMsVUFBSjtBQUNBLElBQUlDLE1BQUo7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUU7OztBQUdBQyxVQUFVLE1BQU07QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBQyx5QkFBdUIsQ0FBQ0MsS0FBRCxFQUFRSixVQUFSLEtBQXVCO0FBQzVDLFFBQUlJLEtBQUosRUFBVztBQUFFO0FBQ1hDLGNBQVFELEtBQVIsQ0FBY0EsS0FBZDtBQUNELEtBRkQsTUFFTztBQUNMRSxXQUFLTCxNQUFMLEdBQWNNLEVBQUVDLEdBQUYsQ0FBTSxLQUFOLEVBQWE7QUFDekJDLGdCQUFRLENBQUNULFdBQVdVLE1BQVgsQ0FBa0JDLEdBQW5CLEVBQXdCWCxXQUFXVSxNQUFYLENBQWtCRSxHQUExQyxDQURpQjtBQUV6QkMsY0FBTSxFQUZtQjtBQUd6QkMseUJBQWlCO0FBSFEsT0FBYixDQUFkO0FBS0FQLFFBQUVRLFNBQUYsQ0FBWSxtRkFBWixFQUFpRztBQUMvRkMscUJBQWEsbUdBRGtGO0FBRS9GQyxpQkFBUyxFQUZzRjtBQUcvRkMscUJBQWEsOEZBQ1gsMEVBRFcsR0FFWCx3REFMNkY7QUFNL0ZDLFlBQUk7QUFOMkYsT0FBakcsRUFPR0MsS0FQSCxDQU9TbkIsTUFQVDtBQVFBb0IsNkJBQXVCckIsVUFBdkIsRUFBbUNNLEtBQUtMLE1BQXhDO0FBQ0Q7QUFDRixHQW5CRDtBQW9CQyxDQTdDRDs7QUErQ0E7OztBQUdBb0IseUJBQXlCLENBQUNyQixVQUFELEVBQWFRLEdBQWIsS0FBbUI7QUFDMUM7QUFDQSxRQUFNYyxTQUFTLElBQUlmLEVBQUVlLE1BQU4sQ0FBYSxDQUFDdEIsV0FBV1UsTUFBWCxDQUFrQkMsR0FBbkIsRUFBd0JYLFdBQVdVLE1BQVgsQ0FBa0JFLEdBQTFDLENBQWIsRUFDYixFQUFDVyxPQUFPdkIsV0FBV3dCLElBQW5CO0FBQ0FDLFNBQUt6QixXQUFXd0I7QUFEaEIsR0FEYSxDQUFmO0FBSUVGLFNBQU9GLEtBQVAsQ0FBYW5CLE1BQWI7QUFDRixTQUFPcUIsTUFBUDtBQUNELENBUkQ7O0FBVUY7OztBQUdBbkIseUJBQTBCdUIsUUFBRCxJQUFjO0FBQ3JDLE1BQUlwQixLQUFLTixVQUFULEVBQXFCO0FBQUU7QUFDckIwQixhQUFTLElBQVQsRUFBZXBCLEtBQUtOLFVBQXBCO0FBQ0E7QUFDRDtBQUNELFFBQU1tQixLQUFLUSxtQkFBbUIsSUFBbkIsQ0FBWDtBQUNBLE1BQUksQ0FBQ1IsRUFBTCxFQUFTO0FBQUU7QUFDVGYsWUFBUSx5QkFBUjtBQUNBc0IsYUFBU3RCLEtBQVQsRUFBZ0IsSUFBaEI7QUFDRCxHQUhELE1BR087QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBTixhQUFTOEIsZ0JBQVQsQ0FBMEIsU0FBMUIsRUFBcUMsVUFBU0MsQ0FBVCxFQUFZO0FBQy9DLFVBQUlBLEVBQUVDLElBQUYsSUFBVSxPQUFkLEVBQXVCO0FBQUU7QUFDdkJ6QixnQkFBUUQsS0FBUixDQUFjeUIsRUFBRUMsSUFBaEI7QUFDRCxPQUZELE1BRU87QUFDTHpCLGdCQUFRMEIsR0FBUixDQUFZLFlBQVosRUFBeUJGLEVBQUVDLElBQUYsQ0FBTzlCLFVBQWhDO0FBQ0EsWUFBRzZCLEVBQUVDLElBQUYsQ0FBTzlCLFVBQVYsRUFBcUI7QUFDbkJnQyw2QkFBbUJILEVBQUVDLElBQUYsQ0FBTzlCLFVBQTFCLEVBQXFDNkIsRUFBRUMsSUFBRixDQUFPRyxPQUE1QztBQUNBUCxtQkFBUyxJQUFULEVBQWVHLEVBQUVDLElBQUYsQ0FBTzlCLFVBQXRCO0FBQ0Q7QUFDRjtBQUNGLEtBVkQsRUFVRyxLQVZIO0FBV0FGLGFBQVNvQyxXQUFULENBQXFCLEVBQUNDLFFBQU8scUJBQVIsRUFBK0JoQixFQUEvQixFQUFyQjtBQUNDO0FBQ0osQ0FqQ0Q7O0FBbUNBOzs7QUFHQWEscUJBQXFCLENBQUNoQyxVQUFELEVBQVlpQyxPQUFaLEtBQXdCO0FBQzNDNUIsVUFBUTBCLEdBQVIsQ0FBWSxZQUFaLEVBQXlCL0IsVUFBekI7QUFDQSxRQUFNd0IsT0FBT25DLFNBQVMrQyxjQUFULENBQXdCLGlCQUF4QixDQUFiO0FBQ0FaLE9BQUthLFNBQUwsR0FBaUJyQyxXQUFXd0IsSUFBNUI7O0FBRUE7QUFDQSxRQUFNYyxTQUFTakQsU0FBUytDLGNBQVQsQ0FBd0IsUUFBeEIsQ0FBZjs7QUFHQSxNQUFJRyxjQUFjLElBQUlOLE9BQXRCOztBQUVBLE9BQUksSUFBSU8sSUFBRSxDQUFWLEVBQWFBLElBQUlQLE9BQWpCLEVBQTBCTyxHQUExQixFQUE4QjtBQUM1QixVQUFNQyxZQUFZcEQsU0FBU0MsYUFBVCxDQUF1QixLQUF2QixDQUFsQjtBQUNBbUQsY0FBVUMsU0FBVixHQUFvQix5Q0FBcEI7QUFDQUQsY0FBVUUsR0FBVixHQUFnQixtQkFBaEI7QUFDQUYsY0FBVWhCLEdBQVYsR0FBZSxFQUFmO0FBQ0FhLFdBQU9NLE1BQVAsQ0FBY0gsU0FBZDtBQUNEOztBQUVELE9BQUksSUFBSUQsSUFBRSxDQUFWLEVBQWFBLElBQUlELFdBQWpCLEVBQThCQyxHQUE5QixFQUFrQztBQUNoQyxVQUFNQyxZQUFZcEQsU0FBU0MsYUFBVCxDQUF1QixLQUF2QixDQUFsQjtBQUNBbUQsY0FBVUMsU0FBVixHQUFvQiwwQ0FBcEI7QUFDQUQsY0FBVUUsR0FBVixHQUFnQixvQkFBaEI7QUFDQUYsY0FBVWhCLEdBQVYsR0FBZSxFQUFmO0FBQ0FhLFdBQU9NLE1BQVAsQ0FBY0gsU0FBZDtBQUNEOztBQUdELFFBQU1JLFVBQVV4RCxTQUFTK0MsY0FBVCxDQUF3QixvQkFBeEIsQ0FBaEI7QUFDQVMsVUFBUVIsU0FBUixHQUFvQnJDLFdBQVc2QyxPQUEvQjs7QUFFQSxRQUFNQyxjQUFjekQsU0FBU0MsYUFBVCxDQUF1QixLQUF2QixDQUFwQjtBQUNBd0QsY0FBWUosU0FBWixHQUF3Qix3QkFBeEI7QUFDQUksY0FBWUgsR0FBWixHQUFrQixtQkFBbEI7QUFDQUcsY0FBWXJCLEdBQVosR0FBa0IsRUFBbEI7QUFDQW9CLFVBQVFFLE9BQVIsQ0FBZ0JELFdBQWhCOztBQUVBLFFBQU1FLFFBQVEzRCxTQUFTK0MsY0FBVCxDQUF3QixnQkFBeEIsQ0FBZDtBQUNBWSxRQUFNTixTQUFOLEdBQWtCLGdCQUFsQjtBQUNBTSxRQUFNTCxHQUFOLEdBQVlNLFNBQVNDLHFCQUFULENBQStCbEQsVUFBL0IsQ0FBWjtBQUNBZ0QsUUFBTXZCLEdBQU4sR0FBWXdCLFNBQVNFLHNCQUFULENBQWdDbkQsVUFBaEMsQ0FBWjtBQUNBZ0QsUUFBTUksTUFBTixHQUFlSCxTQUFTSSx3QkFBVCxDQUFrQ3JELFVBQWxDLENBQWY7O0FBRUEsUUFBTXNELFVBQVVqRSxTQUFTK0MsY0FBVCxDQUF3QixvQkFBeEIsQ0FBaEI7QUFDQWtCLFVBQVFqQixTQUFSLEdBQW9CckMsV0FBV3VELFlBQS9COztBQUVBLFFBQU1DLGNBQWNuRSxTQUFTQyxhQUFULENBQXVCLEtBQXZCLENBQXBCO0FBQ0FrRSxjQUFZZCxTQUFaLEdBQXdCLHdCQUF4QjtBQUNBYyxjQUFZYixHQUFaLEdBQWtCLGtCQUFsQjtBQUNBYSxjQUFZL0IsR0FBWixHQUFrQixFQUFsQjtBQUNBNkIsVUFBUVAsT0FBUixDQUFnQlMsV0FBaEI7O0FBRUE7QUFDQSxNQUFJeEQsV0FBV3lELGVBQWYsRUFBZ0M7QUFDOUJDLDRCQUF3QjFELFdBQVd5RCxlQUFuQzs7QUFFQSxVQUFNRSxRQUFRdEUsU0FBUytDLGNBQVQsQ0FBd0Isa0NBQXhCLENBQWQ7O0FBRUEsVUFBTXdCLFlBQVl2RSxTQUFTQyxhQUFULENBQXVCLEtBQXZCLENBQWxCO0FBQ0FzRSxjQUFVbEIsU0FBVixHQUFzQix3QkFBdEI7QUFDQWtCLGNBQVVqQixHQUFWLEdBQWdCLGdCQUFoQjtBQUNBaUIsY0FBVW5DLEdBQVYsR0FBZ0IsRUFBaEI7QUFDQWtDLFVBQU1aLE9BQU4sQ0FBY2EsU0FBZDtBQUVEO0FBQ0Q7O0FBRUE5RCxXQUFTOEIsZ0JBQVQsQ0FBMEIsU0FBMUIsRUFBcUMsVUFBU0MsQ0FBVCxFQUFZO0FBQy9DLFFBQUlBLEVBQUVDLElBQUYsSUFBVSxPQUFkLEVBQXVCO0FBQUU7QUFDdkJ6QixjQUFRRCxLQUFSLENBQWN5QixFQUFFQyxJQUFoQjtBQUNELEtBRkQsTUFFTztBQUNMekIsY0FBUTBCLEdBQVIsQ0FBWSxZQUFaLEVBQXlCRixFQUFFQyxJQUFGLENBQU9HLE9BQWhDO0FBQ0E0QixzQkFBZ0JoQyxFQUFFQyxJQUFGLENBQU9HLE9BQXZCO0FBQ0Q7QUFDRixHQVBELEVBT0csS0FQSDtBQVFBbkMsV0FBU29DLFdBQVQsQ0FBcUIsRUFBQ0MsUUFBTyxpQkFBUixFQUEyQmhCLElBQUduQixXQUFXbUIsRUFBekMsRUFBckI7QUFDRCxDQTVFRDs7QUE4RUE7OztBQUdBdUMsMEJBQTJCSSxjQUFELElBQW9CO0FBQzVDLFFBQU1ILFFBQVF0RSxTQUFTK0MsY0FBVCxDQUF3QixrQkFBeEIsQ0FBZDtBQUNBLE9BQUssSUFBSTJCLEdBQVQsSUFBZ0JELGNBQWhCLEVBQWdDO0FBQzlCLFVBQU1FLE1BQU0zRSxTQUFTQyxhQUFULENBQXVCLElBQXZCLENBQVo7O0FBRUEsVUFBTTJFLE1BQU01RSxTQUFTQyxhQUFULENBQXVCLElBQXZCLENBQVo7QUFDQTJFLFFBQUl2QixTQUFKLEdBQWdCLHVCQUFoQjtBQUNBdUIsUUFBSTVCLFNBQUosR0FBZ0IwQixHQUFoQjtBQUNBQyxRQUFJRSxXQUFKLENBQWdCRCxHQUFoQjs7QUFFQSxVQUFNRSxPQUFPOUUsU0FBU0MsYUFBVCxDQUF1QixJQUF2QixDQUFiO0FBQ0E2RSxTQUFLekIsU0FBTCxHQUFpQix3QkFBakI7QUFDQXlCLFNBQUs5QixTQUFMLEdBQWlCeUIsZUFBZUMsR0FBZixDQUFqQjtBQUNBQyxRQUFJRSxXQUFKLENBQWdCQyxJQUFoQjs7QUFFQVIsVUFBTU8sV0FBTixDQUFrQkYsR0FBbEI7QUFDRDtBQUNGLENBakJEOztBQW1CQTs7O0FBR0FILGtCQUFtQjVCLE9BQUQsSUFBYTtBQUM3QixRQUFNbUMsWUFBWS9FLFNBQVMrQyxjQUFULENBQXdCLG1CQUF4QixDQUFsQjtBQUNBLFFBQU1iLFFBQVFsQyxTQUFTQyxhQUFULENBQXVCLElBQXZCLENBQWQ7QUFDQWlDLFFBQU1jLFNBQU4sR0FBa0IsU0FBbEI7QUFDQWQsUUFBTW1CLFNBQU4sR0FBa0IsZ0NBQWxCO0FBQ0EwQixZQUFVRixXQUFWLENBQXNCM0MsS0FBdEI7O0FBRUEsTUFBSSxDQUFDVSxPQUFMLEVBQWM7QUFDWixVQUFNb0MsWUFBWWhGLFNBQVNDLGFBQVQsQ0FBdUIsR0FBdkIsQ0FBbEI7QUFDQStFLGNBQVVoQyxTQUFWLEdBQXNCLGlCQUF0QjtBQUNBK0IsY0FBVUYsV0FBVixDQUFzQkcsU0FBdEI7QUFDQTtBQUNEO0FBQ0QsUUFBTUMsS0FBS2pGLFNBQVMrQyxjQUFULENBQXdCLGNBQXhCLENBQVg7QUFDQUgsVUFBUXNDLE9BQVIsQ0FBZ0JDLFVBQVU7QUFDeEJGLE9BQUdKLFdBQUgsQ0FBZU8saUJBQWlCRCxNQUFqQixDQUFmO0FBQ0QsR0FGRDtBQUdBSixZQUFVRixXQUFWLENBQXNCSSxFQUF0QjtBQUNELENBbEJEOztBQW9CQTs7O0FBR0FHLG1CQUFvQkQsTUFBRCxJQUFZO0FBQzdCLFFBQU1FLEtBQUtyRixTQUFTQyxhQUFULENBQXVCLElBQXZCLENBQVg7QUFDQW9GLEtBQUdoQyxTQUFILEdBQWUsMEJBQWY7QUFDQSxRQUFNaUMsZ0JBQWdCdEYsU0FBU0MsYUFBVCxDQUF1QixLQUF2QixDQUF0QjtBQUNBcUYsZ0JBQWNqQyxTQUFkLEdBQTBCLGlDQUExQjs7QUFFQSxRQUFNa0MsVUFBVXZGLFNBQVNDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBaEI7QUFDQXNGLFVBQVFsQyxTQUFSLEdBQW9CLG1DQUFwQjs7QUFFQSxRQUFNbUMsU0FBU3hGLFNBQVNDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBZjtBQUNBdUYsU0FBT2xDLEdBQVAsR0FBYyxpQkFBZDtBQUNBa0MsU0FBT25DLFNBQVAsR0FBbUIsMEJBQW5CO0FBQ0FtQyxTQUFPcEQsR0FBUCxHQUFhLGNBQWI7QUFDQW1ELFVBQVFWLFdBQVIsQ0FBb0JXLE1BQXBCO0FBQ0FGLGdCQUFjVCxXQUFkLENBQTBCVSxPQUExQjs7QUFFQSxRQUFNRSxXQUFXekYsU0FBU0MsYUFBVCxDQUF1QixLQUF2QixDQUFqQjtBQUNBd0YsV0FBU3BDLFNBQVQsR0FBcUIsaUNBQXJCOztBQUVBLFFBQU1sQixPQUFPbkMsU0FBU0MsYUFBVCxDQUF1QixHQUF2QixDQUFiO0FBQ0FrQyxPQUFLYSxTQUFMLEdBQWlCbUMsT0FBT2hELElBQXhCO0FBQ0FzRCxXQUFTWixXQUFULENBQXFCMUMsSUFBckI7O0FBRUE7QUFDQSxRQUFNdUQsbUJBQW1CMUYsU0FBU0MsYUFBVCxDQUF1QixHQUF2QixDQUF6QjtBQUNBeUYsbUJBQWlCckMsU0FBakIsR0FBNkIsMENBQTdCO0FBQ0EsUUFBTXNDLGFBQWEsSUFBSUMsU0FBU1QsT0FBT2xDLE1BQWhCLENBQXZCO0FBQ0EsT0FBSSxJQUFJRSxJQUFFLENBQVYsRUFBYUEsSUFBSWdDLE9BQU9sQyxNQUF4QixFQUFnQ0UsR0FBaEMsRUFBb0M7QUFDbEMsVUFBTTBDLFdBQVc3RixTQUFTQyxhQUFULENBQXVCLEtBQXZCLENBQWpCO0FBQ0E0RixhQUFTeEMsU0FBVCxHQUFtQix5Q0FBbkI7QUFDQXdDLGFBQVN2QyxHQUFULEdBQWUsbUJBQWY7QUFDQXVDLGFBQVN6RCxHQUFULEdBQWUsRUFBZjtBQUNBc0QscUJBQWlCbkMsTUFBakIsQ0FBd0JzQyxRQUF4QjtBQUNEO0FBQ0QsT0FBSSxJQUFJMUMsSUFBRSxDQUFWLEVBQWFBLElBQUl3QyxVQUFqQixFQUE2QnhDLEdBQTdCLEVBQWlDO0FBQy9CLFVBQU1DLFlBQVlwRCxTQUFTQyxhQUFULENBQXVCLEtBQXZCLENBQWxCO0FBQ0FtRCxjQUFVQyxTQUFWLEdBQW9CLDBDQUFwQjtBQUNBRCxjQUFVRSxHQUFWLEdBQWdCLG9CQUFoQjtBQUNBRixjQUFVaEIsR0FBVixHQUFlLEVBQWY7QUFDQXNELHFCQUFpQm5DLE1BQWpCLENBQXdCSCxTQUF4QjtBQUNEOztBQUVEcUMsV0FBU1osV0FBVCxDQUFxQmEsZ0JBQXJCO0FBQ0EsUUFBTUksT0FBTzlGLFNBQVNDLGFBQVQsQ0FBdUIsR0FBdkIsQ0FBYjtBQUNBNkYsT0FBS3pDLFNBQUwsR0FBaUIsOEJBQWpCO0FBQ0EsUUFBTTBDLGFBQWEsSUFBSUMsSUFBSixDQUFTYixPQUFPYyxTQUFoQixDQUFuQjtBQUNBLFFBQU1DLFlBQVksSUFBSUYsSUFBSixFQUFsQjtBQUNBO0FBQ0EsUUFBTUcsaUJBQWlCQyxLQUFLQyxLQUFMLENBQVcsQ0FBQ0gsWUFBWUgsVUFBYixJQUF5QixJQUF6QixHQUE4QixFQUE5QixHQUFpQyxFQUFqQyxHQUFvQyxFQUEvQyxDQUF2QjtBQUNBRCxPQUFLOUMsU0FBTCxHQUFrQixHQUFFbUQsY0FBZSxNQUFuQztBQUNBVixXQUFTWixXQUFULENBQXFCaUIsSUFBckI7O0FBRUFSLGdCQUFjVCxXQUFkLENBQTBCWSxRQUExQjtBQUNBSixLQUFHUixXQUFILENBQWVTLGFBQWY7O0FBRUEsUUFBTWdCLFdBQVd0RyxTQUFTQyxhQUFULENBQXVCLEdBQXZCLENBQWpCO0FBQ0FxRyxXQUFTdEQsU0FBVCxHQUFxQm1DLE9BQU9tQixRQUE1QjtBQUNBakIsS0FBR1IsV0FBSCxDQUFleUIsUUFBZjs7QUFFQSxTQUFPakIsRUFBUDtBQUNELENBNUREOztBQThEQTs7O0FBR0EvQyxxQkFBcUIsQ0FBQ0gsSUFBRCxFQUFPb0UsR0FBUCxLQUFlO0FBQ2xDLE1BQUksQ0FBQ0EsR0FBTCxFQUNFQSxNQUFNQyxPQUFPQyxRQUFQLENBQWdCdEcsSUFBdEI7QUFDRmdDLFNBQU9BLEtBQUt1RSxPQUFMLENBQWEsU0FBYixFQUF3QixNQUF4QixDQUFQO0FBQ0EsUUFBTUMsUUFBUSxJQUFJQyxNQUFKLENBQVksT0FBTXpFLElBQUssbUJBQXZCLENBQWQ7QUFBQSxRQUNFMEUsVUFBVUYsTUFBTUcsSUFBTixDQUFXUCxHQUFYLENBRFo7QUFFQSxNQUFJLENBQUNNLE9BQUwsRUFDRSxPQUFPLElBQVA7QUFDRixNQUFJLENBQUNBLFFBQVEsQ0FBUixDQUFMLEVBQ0UsT0FBTyxFQUFQO0FBQ0YsU0FBT0UsbUJBQW1CRixRQUFRLENBQVIsRUFBV0gsT0FBWCxDQUFtQixLQUFuQixFQUEwQixHQUExQixDQUFuQixDQUFQO0FBQ0QsQ0FYRDs7QUFhQTs7OztBQUlBMUcsU0FBU2dILGFBQVQsQ0FBdUIsZ0NBQXZCLEVBQXlEekUsZ0JBQXpELENBQTBFLE9BQTFFLEVBQWtGLFlBQVU7QUFDMUYsT0FBSzBFLHNCQUFMLENBQTRCQyxTQUE1QixDQUFzQ0MsR0FBdEMsQ0FBMEMsdUNBQTFDO0FBQ0QsQ0FGRDs7QUFJQW5ILFNBQVNnSCxhQUFULENBQXVCLGdDQUF2QixFQUF5RHpFLGdCQUF6RCxDQUEwRSxNQUExRSxFQUFpRixZQUFVO0FBQ3pGLE1BQUcsS0FBSzZFLEtBQUwsS0FBZSxFQUFsQixFQUFxQjtBQUNuQixTQUFLSCxzQkFBTCxDQUE0QkMsU0FBNUIsQ0FBc0NHLE1BQXRDLENBQTZDLHVDQUE3QztBQUNEO0FBQ0YsQ0FKRDs7QUFNQXJILFNBQVNnSCxhQUFULENBQXVCLG9DQUF2QixFQUE2RHpFLGdCQUE3RCxDQUE4RSxPQUE5RSxFQUFzRixZQUFVO0FBQzlGLE9BQUswRSxzQkFBTCxDQUE0QkMsU0FBNUIsQ0FBc0NDLEdBQXRDLENBQTBDLDJDQUExQztBQUNELENBRkQ7O0FBSUFuSCxTQUFTZ0gsYUFBVCxDQUF1QixvQ0FBdkIsRUFBNkR6RSxnQkFBN0QsQ0FBOEUsTUFBOUUsRUFBcUYsWUFBVTtBQUM3RixNQUFHLEtBQUs2RSxLQUFMLEtBQWUsRUFBbEIsRUFBcUI7QUFDbkIsU0FBS0gsc0JBQUwsQ0FBNEJDLFNBQTVCLENBQXNDRyxNQUF0QyxDQUE2QywyQ0FBN0M7QUFDRDtBQUNGLENBSkQ7O0FBTUEsTUFBTUMsYUFBYXRILFNBQVN1SCxnQkFBVCxDQUEwQix5QkFBMUIsQ0FBbkI7O0FBRUEsS0FBSyxJQUFJcEUsSUFBSSxDQUFiLEVBQWdCQSxJQUFJbUUsV0FBVy9HLE1BQS9CLEVBQXVDNEMsR0FBdkMsRUFBNEM7QUFDMUNtRSxhQUFXbkUsQ0FBWCxFQUFjWixnQkFBZCxDQUErQixPQUEvQixFQUF3QyxVQUFVaUYsS0FBVixFQUFpQjs7QUFFdkQsVUFBTUMsbUJBQW1CekgsU0FBU3VILGdCQUFULENBQTBCLHlCQUExQixDQUF6QjtBQUNBLFVBQU1HLFlBQVksS0FBS0MsWUFBTCxDQUFrQixZQUFsQixDQUFsQjs7QUFFQSxTQUFLLElBQUl4RSxJQUFJLENBQWIsRUFBZ0JBLEtBQUtzRSxpQkFBaUJsSCxNQUF0QyxFQUE4QzRDLEdBQTlDLEVBQW1EO0FBQ2pELFVBQUdBLEtBQUt1RSxTQUFSLEVBQWtCO0FBQ2hCMUgsaUJBQVNnSCxhQUFULENBQXdCLHVDQUFzQzdELENBQUUsSUFBaEUsRUFBcUUrRCxTQUFyRSxDQUErRUMsR0FBL0UsQ0FBbUYsZ0NBQW5GO0FBQ0QsT0FGRCxNQUVLO0FBQ0huSCxpQkFBU2dILGFBQVQsQ0FBd0IsdUNBQXNDN0QsQ0FBRSxJQUFoRSxFQUFxRStELFNBQXJFLENBQStFRyxNQUEvRSxDQUFzRixnQ0FBdEY7QUFDRDtBQUNGO0FBQ0YsR0FaRDtBQWFEOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7QUFHQU8sV0FBVyxNQUFJO0FBQ2IvRztBQUNELENBRkQsRUFFRSxHQUZGIiwiZmlsZSI6InJlc3RhdXJhbnRfaW5mby5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENyZWF0ZSBMaW5rIEVsZW1lbnQgZm9yIFN0eWxlc2hlZXRcbmxldCBteUNTUyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwibGlua1wiICk7XG5teUNTUy5yZWwgPSBcInN0eWxlc2hlZXRcIjtcbm15Q1NTLmhyZWYgPSBcIi9jc3MvbGVhZmxldC5jc3NcIjtcbi8vIGluc2VydCBpdCBhdCB0aGUgZW5kIG9mIHRoZSBoZWFkIGluIGEgbGVnYWN5LWZyaWVuZGx5IG1hbm5lclxuZG9jdW1lbnQuaGVhZC5pbnNlcnRCZWZvcmUoIG15Q1NTLCBkb2N1bWVudC5oZWFkLmNoaWxkTm9kZXNbIGRvY3VtZW50LmhlYWQuY2hpbGROb2Rlcy5sZW5ndGggLSAxIF0ubmV4dFNpYmxpbmcgKTsgXG5cbmNvbnN0IGRiV29ya2VyID0gbmV3IFdvcmtlcignLi9qcy9kYndvcmtlci5qcycpO1xuXG5sZXQgcmVzdGF1cmFudDtcbnZhciBuZXdNYXA7XG5cbi8vIC8qKlxuLy8gICogQ2hlY2sgdG8gc2VlIGlmIHNlcnZpY2Ugd29ya2VyIGlzIHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlciBcbi8vICAqL1xuLy8gaWYgKCdzZXJ2aWNlV29ya2VyJyBpbiBuYXZpZ2F0b3IpIHtcbiAgXG4vLyAgIC8qIGlmIGl0IGlzLCByZWdpc3RlciB0aGUgc2VydmljZSB3b3JrZXIgKi9cbi8vICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVnaXN0ZXIoJy9zdy5qcycpLnRoZW4oZnVuY3Rpb24ocmVzKXtcblxuLy8gICAgIC8vIEFscmVhZHkgb24gdGhlIGxhdGVzdCB2ZXJzaW9uLCBiYWlsXG4vLyAgICAgaWYoIW5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXIpe1xuLy8gICAgICAgcmV0dXJuO1xuLy8gICAgIH1cbi8vICAgICAvLyBDaGVjayB0byBzZWUgaWYgdGhlcmUncyBhIHdhaXRpbmcgc2VydmljZSB3b3JrZXJcbi8vICAgICBpZiAocmVzLndhaXRpbmcpe1xuLy8gICAgICAgX3VwZGF0ZVJlYWR5KCk7XG4vLyAgICAgICByZXR1cm4gXG4vLyAgICAgfVxuXG4vLyAgICAgaWYgKHJlcy5pbnN0YWxsaW5nKSB7XG4vLyAgICAgICBfdHJhY2tJbnN0YWxsaW5nKHJlcy5pbnN0YWxsaW5nKTtcbi8vICAgICAgIHJldHVybjtcbi8vICAgICB9XG4gICAgXG4vLyAgICAgcmVzLmFkZEV2ZW50TGlzdGVuZXIoJ3VwZGF0ZWZvdW5kJywgZnVuY3Rpb24oKSB7XG4vLyAgICAgICBfdHJhY2tJbnN0YWxsaW5nKHJlcy5pbnN0YWxsaW5nKTtcbi8vICAgICB9KTtcbiAgICBcbi8vICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyb3Ipe1xuLy8gICAgIGNvbnNvbGUubG9nKCdlcnJvciByZWdpc3RlcmluZyBzZXJ2aWNlIHdvcmtlcjogJyxlcnJvcilcbi8vICAgfSk7XG4gIFxuLy8gICBmdW5jdGlvbiBfdHJhY2tJbnN0YWxsaW5nKHdvcmtlcil7XG4vLyAgICAgd29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ3N0YXRlY2hhbmdlJyxmdW5jdGlvbigpe1xuLy8gICAgICAgaWYgKHdvcmtlci5zdGF0ZSA9PSAnaW5zdGFsbGVkJyl7XG4vLyAgICAgICAgIF91cGRhdGVSZWFkeSh3b3JrZXIpO1xuLy8gICAgICAgfVxuLy8gICAgIH0pXG4vLyAgIH1cblxuLy8gICB2YXIgZm9jdXNlZEVsZW1lbnQ7XG4vLyAgIC8qKlxuLy8gICAgKiBOb3RpZmllcyB0aGUgdXNlciB0aGF0IGFuIHVwZGF0ZWQgU1cgaXMgYXZhaWxhYmxlXG4vLyAgICAqL1xuLy8gICBmdW5jdGlvbiBfdXBkYXRlUmVhZHkod29ya2VyKXtcbi8vICAgICAvLyBJZiB0aGUgdXNlciBjbGlja3Mgb24gdGhlIHVwZGF0ZSBidXR0b24sIHVwZGF0ZSB0aGUgc2VydmljZSB3b3JrZXJcbi8vICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXBkYXRlLXZlcnNpb24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsZnVuY3Rpb24oKXtcbi8vICAgICAgIHdvcmtlci5wb3N0TWVzc2FnZSh7YWN0aW9uOidza2lwV2FpdGluZyd9KTtcbi8vICAgICB9KTtcbi8vICAgICAvLyBJZiB0aGUgdXNlciBjbGlja3MgdGhlIGRpc21pc3MgYnV0dG9uLCBoaWRlIHRoZSB0b2FzdFxuLy8gICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkaXNtaXNzLXZlcnNpb24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsZnVuY3Rpb24oKXtcbi8vICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b2FzdCcpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuLy8gICAgICAgZm9jdXNlZEVsZW1lbnQuZm9jdXMoKVxuLy8gICAgIH0pO1xuLy8gICAgIC8vIElmIHRoZSB0b2FzdCBpcyBkaXNwbGF5aW5nLCBsaXN0ZW4gZm9yIGtleWJvYXJkIGV2ZW50c1xuLy8gICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b2FzdCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLGZ1bmN0aW9uKGUpe1xuLy8gICAgICAgLy9DaGVjayBmb3IgVGFiIGtleSBwcmVzc1xuLy8gICAgICAgaWYoZS5rZXlDb2RlID09PSA5KXtcbiAgICAgICAgXG4vLyAgICAgICAgIGlmIChlLnNoaWZ0S2V5KSB7XG4vLyAgICAgICAgICAgLy9QcmVzc2VkIFNoaWZ0IFRhYlxuLy8gICAgICAgICAgIGlmKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGZpcnN0VGFiU3RvcCkge1xuLy8gICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuLy8gICAgICAgICAgICAgbGFzdFRhYlN0b3AuZm9jdXMoKTtcbi8vICAgICAgICAgICB9XG4vLyAgICAgICAgIH1lbHNle1xuLy8gICAgICAgICAgIC8vUHJlc3NlZCBUYWJcbi8vICAgICAgICAgICBpZihkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBsYXN0VGFiU3RvcCkge1xuLy8gICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuLy8gICAgICAgICAgICAgZmlyc3RUYWJTdG9wLmZvY3VzKCk7XG4vLyAgICAgICAgICAgfVxuLy8gICAgICAgICB9XG4vLyAgICAgICB9XG4vLyAgICAgICAvLyBFc2NhcGUgS2V5XG4vLyAgICAgICBpZiAoZS5rZXlDb2RlID09PSAyNyl7XG4vLyAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b2FzdCcpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuLy8gICAgICAgICBmb2N1c2VkRWxlbWVudC5mb2N1cygpXG4vLyAgICAgICB9IFxuLy8gICAgIH0pO1xuXG4vLyAgICAgLy8gUmVtZW1iZXIgd2hhdCB0aGUgbGFzdCBlbGVtZW50IHRoYXQgd2FzIGZvY3VzZWQgd2FzLCBhbmQgbWFrZSBpdCBmb2N1c2FibGUgc28gd2UgY2FuIHJldHVybiB0byBpdFxuLy8gICAgIGZvY3VzZWRFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbi8vICAgICBmb2N1c2VkRWxlbWVudC50YWJpbmRleCA9IDE7XG4gICBcbi8vICAgICAvLyBXaGVuIHRoZSB0b2FzdCBpcyB2aXNpYmxlLCB0aGlzIGlzIHdoYXQgd2UnbGwgdXNlIHRvIHRlbXBvcmFyaWx5IHRyYXAgZm9jdXNcbi8vICAgICB2YXIgZm9jdXNhYmxlRWxlbWVudHNTdHJpbmcgPSAnI3RvYXN0IHAsICN1cGRhdGUtdmVyc2lvbiwgI2Rpc21pc3MtdmVyc2lvbic7XG4vLyAgICAgdmFyIGZvY3VzYWJsZUVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChmb2N1c2FibGVFbGVtZW50c1N0cmluZyk7XG4vLyAgICAgZm9jdXNhYmxlRWxlbWVudHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmb2N1c2FibGVFbGVtZW50cyk7XG4gICAgXG4vLyAgICAgdmFyIGZpcnN0VGFiU3RvcCA9IGZvY3VzYWJsZUVsZW1lbnRzWzBdO1xuLy8gICAgIHZhciBsYXN0VGFiU3RvcCA9IGZvY3VzYWJsZUVsZW1lbnRzW2ZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCAtMV07XG5cbi8vICAgICAvLyBPayB0aW1lIHRvIHNob3cgdGhlIHRvYXN0IGFuZCBmb2N1cyBvbiBpdFxuLy8gICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b2FzdCcpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuLy8gICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0b2FzdCBwJykuZm9jdXMoKTtcblxuLy8gICB9XG4gIFxuXG4vLyAgIC8qKlxuLy8gICAgKiBMaXN0ZW5zIGZvciBhIGNoYW5nZSBpbiB0aGUgU1csIHJlbG9hZHMgdGhlIHBhZ2UgYXMgYSByZXN1bHRcbi8vICAgICovXG4vLyAgIHZhciByZWZyZXNoaW5nO1xuLy8gICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5hZGRFdmVudExpc3RlbmVyKCdjb250cm9sbGVyY2hhbmdlJywgZnVuY3Rpb24oKSB7XG4vLyAgICAgY29uc29sZS5sb2coJ2NvbnRyb2xsZXIgY2hhbmdlJylcbi8vICAgICBpZiAocmVmcmVzaGluZykgcmV0dXJuO1xuLy8gICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbi8vICAgICByZWZyZXNoaW5nID0gdHJ1ZTtcbi8vICAgfSk7XG4vLyB9XG4gIFxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBsZWFmbGV0IG1hcFxuICAgKi9cbiAgaW5pdE1hcCA9ICgpID0+IHtcbiAgLy8gY29uc3QgaWQgPSBnZXRQYXJhbWV0ZXJCeU5hbWUoJ2lkJyk7XG4gIC8vIGRiV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbihlKSB7XG4gIC8vICAgaWYgKGUuZGF0YSA9PSAnZXJyb3InKSB7IC8vIEdvdCBhbiBlcnJvclxuICAvLyAgICAgY29uc29sZS5lcnJvcihlLmRhdGEpO1xuICAvLyAgIH0gZWxzZSB7XG4gIC8vICAgICBzZWxmLm5ld01hcCA9IEwubWFwKCdtYXAnLCB7XG4gIC8vICAgICAgIGNlbnRlcjogW2UuZGF0YS5yZXN0YXVyYW50LmxhdGxuZy5sYXQsIGUuZGF0YS5yZXN0YXVyYW50LmxhdGxuZy5sbmddLFxuICAvLyAgICAgICB6b29tOiAxNixcbiAgLy8gICAgICAgc2Nyb2xsV2hlZWxab29tOiBmYWxzZVxuICAvLyAgICAgfSk7XG4gIC8vICAgICBMLnRpbGVMYXllcignaHR0cHM6Ly9hcGkudGlsZXMubWFwYm94LmNvbS92NC97aWR9L3t6fS97eH0ve3l9LmpwZzcwP2FjY2Vzc190b2tlbj17bWFwYm94VG9rZW59Jywge1xuICAvLyAgICAgICBtYXBib3hUb2tlbjogJ3BrLmV5SjFJam9pWm1GeWNtVnNiSE5qY21sd2RDSXNJbUVpT2lKamFtSmlhVGwzZEhNeE9HeHNNekp3WlRsbVluTjRaSE41SW4wLjZFeTUwZWwwYXR3akR5Z09fY08wc0EnLFxuICAvLyAgICAgICBtYXhab29tOiAxOCxcbiAgLy8gICAgICAgYXR0cmlidXRpb246ICdNYXAgZGF0YSAmY29weTsgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL1wiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycywgJyArXG4gIC8vICAgICAgICAgJzxhIGhyZWY9XCJodHRwczovL2NyZWF0aXZlY29tbW9ucy5vcmcvbGljZW5zZXMvYnktc2EvMi4wL1wiPkNDLUJZLVNBPC9hPiwgJyArXG4gIC8vICAgICAgICAgJ0ltYWdlcnkgwqkgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm1hcGJveC5jb20vXCI+TWFwYm94PC9hPicsXG4gIC8vICAgICAgIGlkOiAnbWFwYm94LnN0cmVldHMnICAgIFxuICAvLyAgICAgfSkuYWRkVG8obmV3TWFwKTtcbiAgLy8gICAgIG1hcE1hcmtlckZvclJlc3RhdXJhbnQoZS5kYXRhLnJlc3RhdXJhbnQsIHNlbGYubmV3TWFwKTtcbiAgLy8gICB9XG4gIC8vIH0sIGZhbHNlKTtcbiAgLy8gZGJXb3JrZXIucG9zdE1lc3NhZ2Uoe2FjdGlvbjonZmV0Y2hSZXN0YXVyYW50QnlJZCcsIGlkfSk7XG5cblxuICBmZXRjaFJlc3RhdXJhbnRGcm9tVVJMKChlcnJvciwgcmVzdGF1cmFudCkgPT4ge1xuICAgIGlmIChlcnJvcikgeyAvLyBHb3QgYW4gZXJyb3IhXG4gICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICB9IGVsc2UgeyAgICAgIFxuICAgICAgc2VsZi5uZXdNYXAgPSBMLm1hcCgnbWFwJywge1xuICAgICAgICBjZW50ZXI6IFtyZXN0YXVyYW50LmxhdGxuZy5sYXQsIHJlc3RhdXJhbnQubGF0bG5nLmxuZ10sXG4gICAgICAgIHpvb206IDE2LFxuICAgICAgICBzY3JvbGxXaGVlbFpvb206IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIEwudGlsZUxheWVyKCdodHRwczovL2FwaS50aWxlcy5tYXBib3guY29tL3Y0L3tpZH0ve3p9L3t4fS97eX0uanBnNzA/YWNjZXNzX3Rva2VuPXttYXBib3hUb2tlbn0nLCB7XG4gICAgICAgIG1hcGJveFRva2VuOiAncGsuZXlKMUlqb2labUZ5Y21Wc2JITmpjbWx3ZENJc0ltRWlPaUpqYW1KaWFUbDNkSE14T0d4c016SndaVGxtWW5ONFpITjVJbjAuNkV5NTBlbDBhdHdqRHlnT19jTzBzQScsXG4gICAgICAgIG1heFpvb206IDE4LFxuICAgICAgICBhdHRyaWJ1dGlvbjogJ01hcCBkYXRhICZjb3B5OyA8YSBocmVmPVwiaHR0cHM6Ly93d3cub3BlbnN0cmVldG1hcC5vcmcvXCI+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzLCAnICtcbiAgICAgICAgICAnPGEgaHJlZj1cImh0dHBzOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9ieS1zYS8yLjAvXCI+Q0MtQlktU0E8L2E+LCAnICtcbiAgICAgICAgICAnSW1hZ2VyeSDCqSA8YSBocmVmPVwiaHR0cHM6Ly93d3cubWFwYm94LmNvbS9cIj5NYXBib3g8L2E+JyxcbiAgICAgICAgaWQ6ICdtYXBib3guc3RyZWV0cycgICAgXG4gICAgICB9KS5hZGRUbyhuZXdNYXApO1xuICAgICAgbWFwTWFya2VyRm9yUmVzdGF1cmFudChyZXN0YXVyYW50LCBzZWxmLm5ld01hcCk7XG4gICAgfVxuICB9KTtcbiAgfSAgXG5cbiAgLyoqXG4gICAqIEdldCB0aGUgbWFwIG1hcmtlciBmb3IgdGhlIHJlc3RhdXJhbnRcbiAgICovXG4gIG1hcE1hcmtlckZvclJlc3RhdXJhbnQgPSAocmVzdGF1cmFudCwgbWFwKT0+e1xuICAgIC8vIGh0dHBzOi8vbGVhZmxldGpzLmNvbS9yZWZlcmVuY2UtMS4zLjAuaHRtbCNtYXJrZXIgIFxuICAgIGNvbnN0IG1hcmtlciA9IG5ldyBMLm1hcmtlcihbcmVzdGF1cmFudC5sYXRsbmcubGF0LCByZXN0YXVyYW50LmxhdGxuZy5sbmddLFxuICAgICAge3RpdGxlOiByZXN0YXVyYW50Lm5hbWUsXG4gICAgICBhbHQ6IHJlc3RhdXJhbnQubmFtZVxuICAgICAgfSk7XG4gICAgICBtYXJrZXIuYWRkVG8obmV3TWFwKTtcbiAgICByZXR1cm4gbWFya2VyO1xuICB9IFxuXG4vKipcbiAqIEdldCBjdXJyZW50IHJlc3RhdXJhbnQgZnJvbSBwYWdlIFVSTC5cbiAqL1xuZmV0Y2hSZXN0YXVyYW50RnJvbVVSTCA9IChjYWxsYmFjaykgPT4ge1xuICBpZiAoc2VsZi5yZXN0YXVyYW50KSB7IC8vIHJlc3RhdXJhbnQgYWxyZWFkeSBmZXRjaGVkIVxuICAgIGNhbGxiYWNrKG51bGwsIHNlbGYucmVzdGF1cmFudClcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgaWQgPSBnZXRQYXJhbWV0ZXJCeU5hbWUoJ2lkJyk7XG4gIGlmICghaWQpIHsgLy8gbm8gaWQgZm91bmQgaW4gVVJMXG4gICAgZXJyb3IgPSAnTm8gcmVzdGF1cmFudCBpZCBpbiBVUkwnXG4gICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xuICB9IGVsc2Uge1xuICAgIC8vIERCSGVscGVyLmZldGNoUmVzdGF1cmFudEJ5SWQoaWQsIChlcnJvciwgcmVzdGF1cmFudCkgPT4ge1xuICAgIC8vICAgc2VsZi5yZXN0YXVyYW50ID0gcmVzdGF1cmFudDtcbiAgICAvLyAgIGlmICghcmVzdGF1cmFudCkge1xuICAgIC8vICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAvLyAgICAgcmV0dXJuO1xuICAgIC8vICAgfVxuICAgIC8vICAgZmlsbFJlc3RhdXJhbnRIVE1MKCk7XG4gICAgLy8gICBjYWxsYmFjayhudWxsLCByZXN0YXVyYW50KVxuICAgIC8vIH0pO1xuICAgIC8vIENvbW1lbnRcbiAgICBkYldvcmtlci5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKGUuZGF0YSA9PSAnZXJyb3InKSB7IC8vIEdvdCBhbiBlcnJvclxuICAgICAgICBjb25zb2xlLmVycm9yKGUuZGF0YSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZygnZ290IGJhY2s6ICcsZS5kYXRhLnJlc3RhdXJhbnQpXG4gICAgICAgIGlmKGUuZGF0YS5yZXN0YXVyYW50KXtcbiAgICAgICAgICBmaWxsUmVzdGF1cmFudEhUTUwoZS5kYXRhLnJlc3RhdXJhbnQsZS5kYXRhLnJldmlld3MpO1xuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIGUuZGF0YS5yZXN0YXVyYW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIGZhbHNlKTtcbiAgICBkYldvcmtlci5wb3N0TWVzc2FnZSh7YWN0aW9uOidmZXRjaFJlc3RhdXJhbnRCeUlkJywgaWR9KTtcbiAgICB9ICAgIFxufVxuXG4vKipcbiAqIENyZWF0ZSByZXN0YXVyYW50IEhUTUwgYW5kIGFkZCBpdCB0byB0aGUgd2VicGFnZVxuICovXG5maWxsUmVzdGF1cmFudEhUTUwgPSAocmVzdGF1cmFudCxyZXZpZXdzKSA9PiB7XG4gIGNvbnNvbGUubG9nKCdyZXN0YXVyYW50JyxyZXN0YXVyYW50KVxuICBjb25zdCBuYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnQtbmFtZScpO1xuICBuYW1lLmlubmVySFRNTCA9IHJlc3RhdXJhbnQubmFtZTtcblxuICAvLyBSZXZpZXcgb2YgdGhlIHJlc3RhdXJhbnRcbiAgY29uc3QgcmF0aW5nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JhdGluZycpO1xuXG5cbiAgbGV0IGVtcHR5aGVhcnRzID0gNSAtIHJldmlld3M7XG4gIFxuICBmb3IobGV0IGk9MDsgaSA8IHJldmlld3M7IGkrKyl7XG4gICAgY29uc3QgZW1wdHlzdGFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgZW1wdHlzdGFyLmNsYXNzTmFtZT1cInJlc3RhdXJhbnRfX3N0YXIgcmVzdGF1cmFudF9fc3Rhci0tZnVsbFwiO1xuICAgIGVtcHR5c3Rhci5zcmMgPSBcIi9pbWcvZnVsbHN0YXIuc3ZnXCI7XG4gICAgZW1wdHlzdGFyLmFsdD0gXCJcIlxuICAgIHJhdGluZy5hcHBlbmQoZW1wdHlzdGFyKTtcbiAgfVxuXG4gIGZvcihsZXQgaT0wOyBpIDwgZW1wdHloZWFydHM7IGkrKyl7XG4gICAgY29uc3QgZW1wdHlzdGFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgZW1wdHlzdGFyLmNsYXNzTmFtZT1cInJlc3RhdXJhbnRfX3N0YXIgcmVzdGF1cmFudF9fc3Rhci0tZW1wdHlcIjtcbiAgICBlbXB0eXN0YXIuc3JjID0gXCIvaW1nL2VtcHR5c3Rhci5zdmdcIjtcbiAgICBlbXB0eXN0YXIuYWx0PSBcIlwiXG4gICAgcmF0aW5nLmFwcGVuZChlbXB0eXN0YXIpO1xuICB9XG5cblxuICBjb25zdCBhZGRyZXNzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnQtYWRkcmVzcycpO1xuICBhZGRyZXNzLmlubmVySFRNTCA9IHJlc3RhdXJhbnQuYWRkcmVzcztcblxuICBjb25zdCBhZGRyZXNzaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICBhZGRyZXNzaWNvbi5jbGFzc05hbWUgPSAncmVzdGF1cmFudGRldGFpbF9faWNvbic7XG4gIGFkZHJlc3NpY29uLnNyYyA9ICcvaW1nL3dheXBvaW50LnN2Zyc7XG4gIGFkZHJlc3NpY29uLmFsdCA9ICcnO1xuICBhZGRyZXNzLnByZXBlbmQoYWRkcmVzc2ljb24pXG5cbiAgY29uc3QgaW1hZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGF1cmFudC1pbWcnKTtcbiAgaW1hZ2UuY2xhc3NOYW1lID0gJ3Jlc3RhdXJhbnQtaW1nJ1xuICBpbWFnZS5zcmMgPSBEQkhlbHBlci5pbWFnZVVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCk7XG4gIGltYWdlLmFsdCA9IERCSGVscGVyLmltYWdlVGV4dEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCk7XG4gIGltYWdlLnNyY3NldCA9IERCSGVscGVyLmltYWdlU3JjU2V0Rm9yUmVzdGF1cmFudChyZXN0YXVyYW50KTtcblxuICBjb25zdCBjdWlzaW5lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnQtY3Vpc2luZScpO1xuICBjdWlzaW5lLmlubmVySFRNTCA9IHJlc3RhdXJhbnQuY3Vpc2luZV90eXBlO1xuXG4gIGNvbnN0IGN1aXNpbmVpY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gIGN1aXNpbmVpY29uLmNsYXNzTmFtZSA9ICdyZXN0YXVyYW50ZGV0YWlsX19pY29uJztcbiAgY3Vpc2luZWljb24uc3JjID0gJy9pbWcvY3Vpc2luZS5zdmcnO1xuICBjdWlzaW5laWNvbi5hbHQgPSAnJztcbiAgY3Vpc2luZS5wcmVwZW5kKGN1aXNpbmVpY29uKVxuXG4gIC8vIGZpbGwgb3BlcmF0aW5nIGhvdXJzXG4gIGlmIChyZXN0YXVyYW50Lm9wZXJhdGluZ19ob3Vycykge1xuICAgIGZpbGxSZXN0YXVyYW50SG91cnNIVE1MKHJlc3RhdXJhbnQub3BlcmF0aW5nX2hvdXJzKTtcblxuICAgIGNvbnN0IGhvdXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnRkZXRhaWxfX2hvdXJzY29udGFpbmVyJyk7XG4gIFxuICAgIGNvbnN0IGhvdXJzaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGhvdXJzaWNvbi5jbGFzc05hbWUgPSAncmVzdGF1cmFudGRldGFpbF9faWNvbic7XG4gICAgaG91cnNpY29uLnNyYyA9ICcvaW1nL2Nsb2NrLnN2Zyc7XG4gICAgaG91cnNpY29uLmFsdCA9ICcnO1xuICAgIGhvdXJzLnByZXBlbmQoaG91cnNpY29uKVxuXG4gIH1cbiAgLy8gZmlsbCByZXZpZXdzXG4gIFxuICBkYldvcmtlci5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24oZSkge1xuICAgIGlmIChlLmRhdGEgPT0gJ2Vycm9yJykgeyAvLyBHb3QgYW4gZXJyb3JcbiAgICAgIGNvbnNvbGUuZXJyb3IoZS5kYXRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ2dvdCBiYWNrOiAnLGUuZGF0YS5yZXZpZXdzKVxuICAgICAgZmlsbFJldmlld3NIVE1MKGUuZGF0YS5yZXZpZXdzKTtcbiAgICB9XG4gIH0sIGZhbHNlKTtcbiAgZGJXb3JrZXIucG9zdE1lc3NhZ2Uoe2FjdGlvbjonZmlsbFJldmlld3NIVE1MJywgaWQ6cmVzdGF1cmFudC5pZH0pO1xufVxuXG4vKipcbiAqIENyZWF0ZSByZXN0YXVyYW50IG9wZXJhdGluZyBob3VycyBIVE1MIHRhYmxlIGFuZCBhZGQgaXQgdG8gdGhlIHdlYnBhZ2UuXG4gKi9cbmZpbGxSZXN0YXVyYW50SG91cnNIVE1MID0gKG9wZXJhdGluZ0hvdXJzKSA9PiB7XG4gIGNvbnN0IGhvdXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnQtaG91cnMnKTtcbiAgZm9yIChsZXQga2V5IGluIG9wZXJhdGluZ0hvdXJzKSB7XG4gICAgY29uc3Qgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHInKTtcblxuICAgIGNvbnN0IGRheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgZGF5LmNsYXNzTmFtZSA9ICdyZXN0YXVyYW50ZGV0YWlsX19kYXknO1xuICAgIGRheS5pbm5lckhUTUwgPSBrZXk7XG4gICAgcm93LmFwcGVuZENoaWxkKGRheSk7XG5cbiAgICBjb25zdCB0aW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICB0aW1lLmNsYXNzTmFtZSA9ICdyZXN0YXVyYW50ZGV0YWlsX19ob3VyJztcbiAgICB0aW1lLmlubmVySFRNTCA9IG9wZXJhdGluZ0hvdXJzW2tleV07XG4gICAgcm93LmFwcGVuZENoaWxkKHRpbWUpO1xuXG4gICAgaG91cnMuYXBwZW5kQ2hpbGQocm93KTtcbiAgfVxufVxuXG4vKipcbiAqIENyZWF0ZSBhbGwgcmV2aWV3cyBIVE1MIGFuZCBhZGQgdGhlbSB0byB0aGUgd2VicGFnZS5cbiAqL1xuZmlsbFJldmlld3NIVE1MID0gKHJldmlld3MpID0+IHtcbiAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jldmlld3MtY29udGFpbmVyJyk7XG4gIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDMnKTtcbiAgdGl0bGUuaW5uZXJIVE1MID0gJ1Jldmlld3MnO1xuICB0aXRsZS5jbGFzc05hbWUgPSAncmVzdGF1cmFudGRldGFpbF9fcmV2aWV3c3RpdGxlJztcbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRpdGxlKTtcblxuICBpZiAoIXJldmlld3MpIHtcbiAgICBjb25zdCBub1Jldmlld3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgbm9SZXZpZXdzLmlubmVySFRNTCA9ICdObyByZXZpZXdzIHlldCEnO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChub1Jldmlld3MpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCB1bCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXZpZXdzLWxpc3QnKTtcbiAgcmV2aWV3cy5mb3JFYWNoKHJldmlldyA9PiB7XG4gICAgdWwuYXBwZW5kQ2hpbGQoY3JlYXRlUmV2aWV3SFRNTChyZXZpZXcpKTtcbiAgfSk7XG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh1bCk7XG59XG5cbi8qKlxuICogQ3JlYXRlIHJldmlldyBIVE1MIGFuZCBhZGQgaXQgdG8gdGhlIHdlYnBhZ2UuXG4gKi9cbmNyZWF0ZVJldmlld0hUTUwgPSAocmV2aWV3KSA9PiB7XG4gIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgbGkuY2xhc3NOYW1lID0gJ3Jlc3RhdXJhbnRkZXRhaWxfX3Jldmlldyc7XG4gIGNvbnN0IGNvbW1lbnRIZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29tbWVudEhlYWRlci5jbGFzc05hbWUgPSAncmVzdGF1cmFudGRldGFpbF9fY29tbWVudGhlYWRlcic7XG5cbiAgY29uc3QgbGVmdGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBsZWZ0ZGl2LmNsYXNzTmFtZSA9ICdyZXN0YXVyYW50ZGV0YWlsX19hdmF0YXJjb250YWluZXInO1xuXG4gIGNvbnN0IGF2YXRhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICBhdmF0YXIuc3JjICA9ICcvaW1nL2F2YXRhci5zdmcnO1xuICBhdmF0YXIuY2xhc3NOYW1lID0gJ3Jlc3RhdXJhbnRkZXRhaWxfX2F2YXRhcic7XG4gIGF2YXRhci5hbHQgPSAnQXZhdGFyIHBob3RvJztcbiAgbGVmdGRpdi5hcHBlbmRDaGlsZChhdmF0YXIpO1xuICBjb21tZW50SGVhZGVyLmFwcGVuZENoaWxkKGxlZnRkaXYpO1xuXG4gIGNvbnN0IHJpZ2h0ZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHJpZ2h0ZGl2LmNsYXNzTmFtZSA9ICdyZXN0YXVyYW50ZGV0YWlsX19uYW1lY29udGFpbmVyJztcblxuICBjb25zdCBuYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBuYW1lLmlubmVySFRNTCA9IHJldmlldy5uYW1lO1xuICByaWdodGRpdi5hcHBlbmRDaGlsZChuYW1lKTtcbiAgXG4gIC8vIENyZWF0ZSBTdGFycyBmb3IgUmV2aWV3XG4gIGNvbnN0IGluZGl2aWR1YWxyYXRpbmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gIGluZGl2aWR1YWxyYXRpbmcuY2xhc3NOYW1lID0gJ3Jlc3RhdXJhbnRkZXRhaWxfX2luZGl2aWR1YWxyZXZpZXdyYXRpbmcnO1xuICBjb25zdCBlbXB0eVN0YXJzID0gNSAtIHBhcnNlSW50KHJldmlldy5yYXRpbmcpO1xuICBmb3IobGV0IGk9MDsgaSA8IHJldmlldy5yYXRpbmc7IGkrKyl7XG4gICAgY29uc3QgZnVsbHN0YXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBmdWxsc3Rhci5jbGFzc05hbWU9XCJyZXN0YXVyYW50X19zdGFyIHJlc3RhdXJhbnRfX3N0YXItLWZ1bGxcIjtcbiAgICBmdWxsc3Rhci5zcmMgPSBcIi9pbWcvZnVsbHN0YXIuc3ZnXCI7XG4gICAgZnVsbHN0YXIuYWx0ID0gXCJcIlxuICAgIGluZGl2aWR1YWxyYXRpbmcuYXBwZW5kKGZ1bGxzdGFyKTtcbiAgfVxuICBmb3IobGV0IGk9MDsgaSA8IGVtcHR5U3RhcnM7IGkrKyl7XG4gICAgY29uc3QgZW1wdHlzdGFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgZW1wdHlzdGFyLmNsYXNzTmFtZT1cInJlc3RhdXJhbnRfX3N0YXIgcmVzdGF1cmFudF9fc3Rhci0tZW1wdHlcIjtcbiAgICBlbXB0eXN0YXIuc3JjID0gXCIvaW1nL2VtcHR5c3Rhci5zdmdcIjtcbiAgICBlbXB0eXN0YXIuYWx0PSBcIlwiXG4gICAgaW5kaXZpZHVhbHJhdGluZy5hcHBlbmQoZW1wdHlzdGFyKTtcbiAgfVxuXG4gIHJpZ2h0ZGl2LmFwcGVuZENoaWxkKGluZGl2aWR1YWxyYXRpbmcpO1xuICBjb25zdCBkYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBkYXRlLmNsYXNzTmFtZSA9ICdyZXN0YXVyYW50ZGV0YWlsX19yZXZpZXdkYXRlJ1xuICBjb25zdCByZXZpZXdkYXRlID0gbmV3IERhdGUocmV2aWV3LmNyZWF0ZWRBdCk7XG4gIGNvbnN0IHRvZGF5ZGF0ZSA9IG5ldyBEYXRlKCk7XG4gIC8vIFN1YnRyYWN0IHRvZGF5cyBkYXRlIGZyb20gdGhlIGRhdGUgb2YgdGhlIHJldmlldywgdGhlbiBmb3JtYXQgaW50byBkYXlzXG4gIGNvbnN0IGRheXNkaWZmZXJlbmNlID0gTWF0aC5yb3VuZCgodG9kYXlkYXRlIC0gcmV2aWV3ZGF0ZSkvMTAwMC82MC82MC8yNClcbiAgZGF0ZS5pbm5lckhUTUwgPSBgJHtkYXlzZGlmZmVyZW5jZX0gYWdvYDtcbiAgcmlnaHRkaXYuYXBwZW5kQ2hpbGQoZGF0ZSk7XG5cbiAgY29tbWVudEhlYWRlci5hcHBlbmRDaGlsZChyaWdodGRpdik7IFxuICBsaS5hcHBlbmRDaGlsZChjb21tZW50SGVhZGVyKTtcblxuICBjb25zdCBjb21tZW50cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgY29tbWVudHMuaW5uZXJIVE1MID0gcmV2aWV3LmNvbW1lbnRzO1xuICBsaS5hcHBlbmRDaGlsZChjb21tZW50cyk7XG5cbiAgcmV0dXJuIGxpO1xufVxuXG4vKipcbiAqIEdldCBhIHBhcmFtZXRlciBieSBuYW1lIGZyb20gcGFnZSBVUkwuXG4gKi9cbmdldFBhcmFtZXRlckJ5TmFtZSA9IChuYW1lLCB1cmwpID0+IHtcbiAgaWYgKCF1cmwpXG4gICAgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gIG5hbWUgPSBuYW1lLnJlcGxhY2UoL1tcXFtcXF1dL2csICdcXFxcJCYnKTtcbiAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKGBbPyZdJHtuYW1lfSg9KFteJiNdKil8JnwjfCQpYCksXG4gICAgcmVzdWx0cyA9IHJlZ2V4LmV4ZWModXJsKTtcbiAgaWYgKCFyZXN1bHRzKVxuICAgIHJldHVybiBudWxsO1xuICBpZiAoIXJlc3VsdHNbMl0pXG4gICAgcmV0dXJuICcnO1xuICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdHNbMl0ucmVwbGFjZSgvXFwrL2csICcgJykpO1xufVxuXG4vKipcbiAqIEV2ZW50IGxpc3RlbmVycyBmb3IgcmV2aWV3IGZvcm1cbiAqL1xuXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmVzdGF1cmFudGRldGFpbF9fcmV2aWV3aW5wdXQnKS5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsZnVuY3Rpb24oKXtcbiAgdGhpcy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLmNsYXNzTGlzdC5hZGQoJ3Jlc3RhdXJhbnRkZXRhaWxfX3Jldmlld2xhYmVsLS1hY3RpdmUnKVxufSlcblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJlc3RhdXJhbnRkZXRhaWxfX3Jldmlld2lucHV0JykuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsZnVuY3Rpb24oKXtcbiAgaWYodGhpcy52YWx1ZSA9PT0gJycpe1xuICAgIHRoaXMucHJldmlvdXNFbGVtZW50U2libGluZy5jbGFzc0xpc3QucmVtb3ZlKCdyZXN0YXVyYW50ZGV0YWlsX19yZXZpZXdsYWJlbC0tYWN0aXZlJylcbiAgfVxufSlcblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJlc3RhdXJhbnRkZXRhaWxfX3Jldmlld25hbWVpbnB1dCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJyxmdW5jdGlvbigpe1xuICB0aGlzLnByZXZpb3VzRWxlbWVudFNpYmxpbmcuY2xhc3NMaXN0LmFkZCgncmVzdGF1cmFudGRldGFpbF9fcmV2aWV3bmFtZWxhYmVsLS1hY3RpdmUnKVxufSlcblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJlc3RhdXJhbnRkZXRhaWxfX3Jldmlld25hbWVpbnB1dCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLGZ1bmN0aW9uKCl7XG4gIGlmKHRoaXMudmFsdWUgPT09ICcnKXtcbiAgICB0aGlzLnByZXZpb3VzRWxlbWVudFNpYmxpbmcuY2xhc3NMaXN0LnJlbW92ZSgncmVzdGF1cmFudGRldGFpbF9fcmV2aWV3bmFtZWxhYmVsLS1hY3RpdmUnKVxuICB9XG59KVxuXG5jb25zdCBob3ZlcmxpbmtzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnJlc3RhdXJhbnRkZXRhaWxfX3N0YXInKVxuXG5mb3IgKHZhciBpID0gMDsgaSA8IGhvdmVybGlua3MubGVuZ3RoOyBpKyspIHtcbiAgaG92ZXJsaW5rc1tpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuXG4gICAgY29uc3QgaGlnaGxpZ2h0ZWRTdGFycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5yZXN0YXVyYW50ZGV0YWlsX19zdGFyJylcbiAgICBjb25zdCBzdGFyTGltaXQgPSB0aGlzLmdldEF0dHJpYnV0ZSgnZGF0YS12YWx1ZScpO1xuXG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gaGlnaGxpZ2h0ZWRTdGFycy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYoaSA8PSBzdGFyTGltaXQpe1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAucmVzdGF1cmFudGRldGFpbF9fc3RhcltkYXRhLXZhbHVlPVwiJHtpfVwiXWApLmNsYXNzTGlzdC5hZGQoJ3Jlc3RhdXJhbnRkZXRhaWxfX3N0YXItLWFjdGl2ZScpXG4gICAgICB9ZWxzZXtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLnJlc3RhdXJhbnRkZXRhaWxfX3N0YXJbZGF0YS12YWx1ZT1cIiR7aX1cIl1gKS5jbGFzc0xpc3QucmVtb3ZlKCdyZXN0YXVyYW50ZGV0YWlsX19zdGFyLS1hY3RpdmUnKVxuICAgICAgfVxuICAgIH1cbiAgfSlcbn1cblxuLy8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignY3Vpc2luZXMtc2VsZWN0JykuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLGZ1bmN0aW9uKCl7XG4vLyAgIHRoaXMucHJldmlvdXNFbGVtZW50U2libGluZy5jbGFzc0xpc3QuYWRkKCdmaWx0ZXJfX2xhYmVsLS1hY3RpdmUnKTtcbi8vIH0pIFxuXG4vLyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdjdWlzaW5lcy1zZWxlY3QnKS5hZGRFdmVudExpc3RlbmVyKCdibHVyJyxmdW5jdGlvbigpe1xuLy8gICBpZih0aGlzLnZhbHVlID09PSAnYWxsJyl7XG4vLyAgICAgdGhpcy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLmNsYXNzTGlzdC5yZW1vdmUoJ2ZpbHRlcl9fbGFiZWwtLWFjdGl2ZScpO1xuLy8gICB9XG4vLyB9KVxuXG4vKipcbiAgKiBJbml0aWFsaXplIG1hcCBhcyBzb29uIGFzIHRoZSBwYWdlIGlzIGxvYWRlZC5cbiAqL1xuc2V0VGltZW91dCgoKT0+e1xuICBpbml0TWFwKCk7XG59LDEwMCkgXG4gICJdfQ==
