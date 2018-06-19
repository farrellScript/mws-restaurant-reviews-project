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
  * Initialize map as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {  
  initMap();
  });
  
  /**
   * Initialize leaflet map
   */
  initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
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
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'    
      }).addTo(newMap);
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
    }
  });
  }  
  
  /* window.initMap = () => {
  } */

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img'
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.alt = DBHelper.imageTextForRestaurant(restaurant);
  image.srcset = DBHelper.imageSrcSetForRestaurant(restaurant);

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h3');
  title.innerHTML = 'Reviews';
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
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.innerHTML = review.name;
  li.appendChild(name);

  const date = document.createElement('p');
  date.innerHTML = review.date;
  li.appendChild(date);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.setAttribute('aria-current','page')
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
