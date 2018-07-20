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

  const name = document.getElementById('restaurantdetail__id');
  name.value = restaurant.id;

  const id = document.getElementById('restaurant-name');
  id.innerHTML = restaurant.name;

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

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  ul.innerHTML = '';
  reviews.reverse().forEach(review => {
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
  date.innerHTML = `${daysdifference} days ago`;
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

document.querySelector('.restaurantdetails__reviewform').addEventListener('submit', function (e) {
  e.preventDefault();
  let restaurantid = document.querySelector('.restaurantdetail__id').value;
  let rating = document.querySelector('.restaurantdetail__star--selected').getAttribute('data-value');
  let name = document.querySelector('.restaurantdetail__reviewnameinput').value;
  let comment = document.querySelector('.restaurantdetail__reviewinput').value;

  let data = {
    "restaurant_id": parseInt(restaurantid),
    "name": name,
    "rating": parseInt(rating),
    "comments": comment,
    "createdAt": new Date().getTime(),
    "updatedAt": new Date().getTime()
  };

  fetch(`http://localhost:1337/reviews/`, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => {
    return response.json();
  }).then(response => {
    dbWorker.postMessage({ action: 'fillReviewsHTML', id: restaurantid });
  });
});

const hoverlinks = document.querySelectorAll('.restaurantdetail__star');

for (var i = 0; i < hoverlinks.length; i++) {
  hoverlinks[i].addEventListener('click', function (event) {
    const highlightedStars = document.querySelectorAll('.restaurantdetail__star');
    const starLimit = this.getAttribute('data-value');

    for (var i = 1; i <= highlightedStars.length; i++) {
      document.querySelector(`.restaurantdetail__star[data-value="${i}"]`).classList.remove('restaurantdetail__star--selected');
      if (i <= starLimit) {
        document.querySelector(`.restaurantdetail__star[data-value="${i}"]`).classList.add('restaurantdetail__star--active');
      } else {
        document.querySelector(`.restaurantdetail__star[data-value="${i}"]`).classList.remove('restaurantdetail__star--active');
      }
    }
    document.querySelector(`.restaurantdetail__star[data-value="${starLimit}"]`).classList.add('restaurantdetail__star--selected');
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc3RhdXJhbnRfaW5mby5qcyJdLCJuYW1lcyI6WyJteUNTUyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInJlbCIsImhyZWYiLCJoZWFkIiwiaW5zZXJ0QmVmb3JlIiwiY2hpbGROb2RlcyIsImxlbmd0aCIsIm5leHRTaWJsaW5nIiwiZGJXb3JrZXIiLCJXb3JrZXIiLCJyZXN0YXVyYW50IiwibmV3TWFwIiwiaW5pdE1hcCIsImZldGNoUmVzdGF1cmFudEZyb21VUkwiLCJlcnJvciIsImNvbnNvbGUiLCJzZWxmIiwiTCIsIm1hcCIsImNlbnRlciIsImxhdGxuZyIsImxhdCIsImxuZyIsInpvb20iLCJzY3JvbGxXaGVlbFpvb20iLCJ0aWxlTGF5ZXIiLCJtYXBib3hUb2tlbiIsIm1heFpvb20iLCJhdHRyaWJ1dGlvbiIsImlkIiwiYWRkVG8iLCJtYXBNYXJrZXJGb3JSZXN0YXVyYW50IiwibWFya2VyIiwidGl0bGUiLCJuYW1lIiwiYWx0IiwiY2FsbGJhY2siLCJnZXRQYXJhbWV0ZXJCeU5hbWUiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsImRhdGEiLCJsb2ciLCJmaWxsUmVzdGF1cmFudEhUTUwiLCJyZXZpZXdzIiwicG9zdE1lc3NhZ2UiLCJhY3Rpb24iLCJnZXRFbGVtZW50QnlJZCIsInZhbHVlIiwiaW5uZXJIVE1MIiwicmF0aW5nIiwiZW1wdHloZWFydHMiLCJpIiwiZW1wdHlzdGFyIiwiY2xhc3NOYW1lIiwic3JjIiwiYXBwZW5kIiwiYWRkcmVzcyIsImFkZHJlc3NpY29uIiwicHJlcGVuZCIsImltYWdlIiwiREJIZWxwZXIiLCJpbWFnZVVybEZvclJlc3RhdXJhbnQiLCJpbWFnZVRleHRGb3JSZXN0YXVyYW50Iiwic3Jjc2V0IiwiaW1hZ2VTcmNTZXRGb3JSZXN0YXVyYW50IiwiY3Vpc2luZSIsImN1aXNpbmVfdHlwZSIsImN1aXNpbmVpY29uIiwib3BlcmF0aW5nX2hvdXJzIiwiZmlsbFJlc3RhdXJhbnRIb3Vyc0hUTUwiLCJob3VycyIsImhvdXJzaWNvbiIsImZpbGxSZXZpZXdzSFRNTCIsIm9wZXJhdGluZ0hvdXJzIiwia2V5Iiwicm93IiwiZGF5IiwiYXBwZW5kQ2hpbGQiLCJ0aW1lIiwiY29udGFpbmVyIiwibm9SZXZpZXdzIiwidWwiLCJyZXZlcnNlIiwiZm9yRWFjaCIsInJldmlldyIsImNyZWF0ZVJldmlld0hUTUwiLCJsaSIsImNvbW1lbnRIZWFkZXIiLCJsZWZ0ZGl2IiwiYXZhdGFyIiwicmlnaHRkaXYiLCJpbmRpdmlkdWFscmF0aW5nIiwiZW1wdHlTdGFycyIsInBhcnNlSW50IiwiZnVsbHN0YXIiLCJkYXRlIiwicmV2aWV3ZGF0ZSIsIkRhdGUiLCJjcmVhdGVkQXQiLCJ0b2RheWRhdGUiLCJkYXlzZGlmZmVyZW5jZSIsIk1hdGgiLCJyb3VuZCIsImNvbW1lbnRzIiwidXJsIiwid2luZG93IiwibG9jYXRpb24iLCJyZXBsYWNlIiwicmVnZXgiLCJSZWdFeHAiLCJyZXN1bHRzIiwiZXhlYyIsImRlY29kZVVSSUNvbXBvbmVudCIsInF1ZXJ5U2VsZWN0b3IiLCJwcmV2aW91c0VsZW1lbnRTaWJsaW5nIiwiY2xhc3NMaXN0IiwiYWRkIiwicmVtb3ZlIiwicHJldmVudERlZmF1bHQiLCJyZXN0YXVyYW50aWQiLCJnZXRBdHRyaWJ1dGUiLCJjb21tZW50IiwiZ2V0VGltZSIsImZldGNoIiwibWV0aG9kIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJoZWFkZXJzIiwidGhlbiIsInJlc3BvbnNlIiwianNvbiIsImhvdmVybGlua3MiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZXZlbnQiLCJoaWdobGlnaHRlZFN0YXJzIiwic3RhckxpbWl0Iiwic2V0VGltZW91dCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQSxJQUFJQSxRQUFRQyxTQUFTQyxhQUFULENBQXdCLE1BQXhCLENBQVo7QUFDQUYsTUFBTUcsR0FBTixHQUFZLFlBQVo7QUFDQUgsTUFBTUksSUFBTixHQUFhLGtCQUFiO0FBQ0E7QUFDQUgsU0FBU0ksSUFBVCxDQUFjQyxZQUFk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RUFBa0I7QUFDaEJ6SSxpQkFBU2tILGFBQVQsQ0FBd0IsdUNBQXNDOUQsQ0FBRSxJQUFoRSxFQUFxRWdFLFNBQXJFLENBQStFQyxHQUEvRSxDQUFtRixnQ0FBbkY7QUFDRCxPQUZELE1BRUs7QUFDSHJILGlCQUFTa0gsYUFBVCxDQUF3Qix1Q0FBc0M5RCxDQUFFLElBQWhFLEVBQXFFZ0UsU0FBckUsQ0FBK0VFLE1BQS9FLENBQXNGLGdDQUF0RjtBQUNEO0FBQ0Y7QUFDRHRILGFBQVNrSCxhQUFULENBQXdCLHVDQUFzQ3VCLFNBQVUsSUFBeEUsRUFBNkVyQixTQUE3RSxDQUF1RkMsR0FBdkYsQ0FBMkYsa0NBQTNGO0FBQ0QsR0FiRDtBQWNEOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7QUFHQXFCLFdBQVcsTUFBSTtBQUNiN0g7QUFDRCxDQUZELEVBRUUsR0FGRiIsImZpbGUiOiJyZXN0YXVyYW50X2luZm8uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDcmVhdGUgTGluayBFbGVtZW50IGZvciBTdHlsZXNoZWV0XG5sZXQgbXlDU1MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImxpbmtcIiApO1xubXlDU1MucmVsID0gXCJzdHlsZXNoZWV0XCI7XG5teUNTUy5ocmVmID0gXCIvY3NzL2xlYWZsZXQuY3NzXCI7XG4vLyBpbnNlcnQgaXQgYXQgdGhlIGVuZCBvZiB0aGUgaGVhZCBpbiBhIGxlZ2FjeS1mcmllbmRseSBtYW5uZXJcbmRvY3VtZW50LmhlYWQuaW5zZXJ0QmVmb3JlKCBteUNTUywgZG9jdW1lbnQuaGVhZC5jaGlsZE5vZGVzWyBkb2N1bWVudC5oZWFkLmNoaWxkTm9kZXMubGVuZ3RoIC0gMSBdLm5leHRTaWJsaW5nICk7IFxuXG5jb25zdCBkYldvcmtlciA9IG5ldyBXb3JrZXIoJy4vanMvZGJ3b3JrZXIuanMnKTtcblxubGV0IHJlc3RhdXJhbnQ7XG52YXIgbmV3TWFwO1xuXG4vLyAvKipcbi8vICAqIENoZWNrIHRvIHNlZSBpZiBzZXJ2aWNlIHdvcmtlciBpcyBzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIgXG4vLyAgKi9cbi8vIGlmICgnc2VydmljZVdvcmtlcicgaW4gbmF2aWdhdG9yKSB7XG4gIFxuLy8gICAvKiBpZiBpdCBpcywgcmVnaXN0ZXIgdGhlIHNlcnZpY2Ugd29ya2VyICovXG4vLyAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKCcvc3cuanMnKS50aGVuKGZ1bmN0aW9uKHJlcyl7XG5cbi8vICAgICAvLyBBbHJlYWR5IG9uIHRoZSBsYXRlc3QgdmVyc2lvbiwgYmFpbFxuLy8gICAgIGlmKCFuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5jb250cm9sbGVyKXtcbi8vICAgICAgIHJldHVybjtcbi8vICAgICB9XG4vLyAgICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZXJlJ3MgYSB3YWl0aW5nIHNlcnZpY2Ugd29ya2VyXG4vLyAgICAgaWYgKHJlcy53YWl0aW5nKXtcbi8vICAgICAgIF91cGRhdGVSZWFkeSgpO1xuLy8gICAgICAgcmV0dXJuIFxuLy8gICAgIH1cblxuLy8gICAgIGlmIChyZXMuaW5zdGFsbGluZykge1xuLy8gICAgICAgX3RyYWNrSW5zdGFsbGluZyhyZXMuaW5zdGFsbGluZyk7XG4vLyAgICAgICByZXR1cm47XG4vLyAgICAgfVxuICAgIFxuLy8gICAgIHJlcy5hZGRFdmVudExpc3RlbmVyKCd1cGRhdGVmb3VuZCcsIGZ1bmN0aW9uKCkge1xuLy8gICAgICAgX3RyYWNrSW5zdGFsbGluZyhyZXMuaW5zdGFsbGluZyk7XG4vLyAgICAgfSk7XG4gICAgXG4vLyAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKXtcbi8vICAgICBjb25zb2xlLmxvZygnZXJyb3IgcmVnaXN0ZXJpbmcgc2VydmljZSB3b3JrZXI6ICcsZXJyb3IpXG4vLyAgIH0pO1xuICBcbi8vICAgZnVuY3Rpb24gX3RyYWNrSW5zdGFsbGluZyh3b3JrZXIpe1xuLy8gICAgIHdvcmtlci5hZGRFdmVudExpc3RlbmVyKCdzdGF0ZWNoYW5nZScsZnVuY3Rpb24oKXtcbi8vICAgICAgIGlmICh3b3JrZXIuc3RhdGUgPT0gJ2luc3RhbGxlZCcpe1xuLy8gICAgICAgICBfdXBkYXRlUmVhZHkod29ya2VyKTtcbi8vICAgICAgIH1cbi8vICAgICB9KVxuLy8gICB9XG5cbi8vICAgdmFyIGZvY3VzZWRFbGVtZW50O1xuLy8gICAvKipcbi8vICAgICogTm90aWZpZXMgdGhlIHVzZXIgdGhhdCBhbiB1cGRhdGVkIFNXIGlzIGF2YWlsYWJsZVxuLy8gICAgKi9cbi8vICAgZnVuY3Rpb24gX3VwZGF0ZVJlYWR5KHdvcmtlcil7XG4vLyAgICAgLy8gSWYgdGhlIHVzZXIgY2xpY2tzIG9uIHRoZSB1cGRhdGUgYnV0dG9uLCB1cGRhdGUgdGhlIHNlcnZpY2Ugd29ya2VyXG4vLyAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3VwZGF0ZS12ZXJzaW9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLGZ1bmN0aW9uKCl7XG4vLyAgICAgICB3b3JrZXIucG9zdE1lc3NhZ2Uoe2FjdGlvbjonc2tpcFdhaXRpbmcnfSk7XG4vLyAgICAgfSk7XG4vLyAgICAgLy8gSWYgdGhlIHVzZXIgY2xpY2tzIHRoZSBkaXNtaXNzIGJ1dHRvbiwgaGlkZSB0aGUgdG9hc3Rcbi8vICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGlzbWlzcy12ZXJzaW9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLGZ1bmN0aW9uKCl7XG4vLyAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9hc3QnKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbi8vICAgICAgIGZvY3VzZWRFbGVtZW50LmZvY3VzKClcbi8vICAgICB9KTtcbi8vICAgICAvLyBJZiB0aGUgdG9hc3QgaXMgZGlzcGxheWluZywgbGlzdGVuIGZvciBrZXlib2FyZCBldmVudHNcbi8vICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9hc3QnKS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJyxmdW5jdGlvbihlKXtcbi8vICAgICAgIC8vQ2hlY2sgZm9yIFRhYiBrZXkgcHJlc3Ncbi8vICAgICAgIGlmKGUua2V5Q29kZSA9PT0gOSl7XG4gICAgICAgIFxuLy8gICAgICAgICBpZiAoZS5zaGlmdEtleSkge1xuLy8gICAgICAgICAgIC8vUHJlc3NlZCBTaGlmdCBUYWJcbi8vICAgICAgICAgICBpZihkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBmaXJzdFRhYlN0b3ApIHtcbi8vICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbi8vICAgICAgICAgICAgIGxhc3RUYWJTdG9wLmZvY3VzKCk7XG4vLyAgICAgICAgICAgfVxuLy8gICAgICAgICB9ZWxzZXtcbi8vICAgICAgICAgICAvL1ByZXNzZWQgVGFiXG4vLyAgICAgICAgICAgaWYoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gbGFzdFRhYlN0b3ApIHtcbi8vICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbi8vICAgICAgICAgICAgIGZpcnN0VGFiU3RvcC5mb2N1cygpO1xuLy8gICAgICAgICAgIH1cbi8vICAgICAgICAgfVxuLy8gICAgICAgfVxuLy8gICAgICAgLy8gRXNjYXBlIEtleVxuLy8gICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMjcpe1xuLy8gICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9hc3QnKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbi8vICAgICAgICAgZm9jdXNlZEVsZW1lbnQuZm9jdXMoKVxuLy8gICAgICAgfSBcbi8vICAgICB9KTtcblxuLy8gICAgIC8vIFJlbWVtYmVyIHdoYXQgdGhlIGxhc3QgZWxlbWVudCB0aGF0IHdhcyBmb2N1c2VkIHdhcywgYW5kIG1ha2UgaXQgZm9jdXNhYmxlIHNvIHdlIGNhbiByZXR1cm4gdG8gaXRcbi8vICAgICBmb2N1c2VkRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4vLyAgICAgZm9jdXNlZEVsZW1lbnQudGFiaW5kZXggPSAxO1xuICAgXG4vLyAgICAgLy8gV2hlbiB0aGUgdG9hc3QgaXMgdmlzaWJsZSwgdGhpcyBpcyB3aGF0IHdlJ2xsIHVzZSB0byB0ZW1wb3JhcmlseSB0cmFwIGZvY3VzXG4vLyAgICAgdmFyIGZvY3VzYWJsZUVsZW1lbnRzU3RyaW5nID0gJyN0b2FzdCBwLCAjdXBkYXRlLXZlcnNpb24sICNkaXNtaXNzLXZlcnNpb24nO1xuLy8gICAgIHZhciBmb2N1c2FibGVFbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoZm9jdXNhYmxlRWxlbWVudHNTdHJpbmcpO1xuLy8gICAgIGZvY3VzYWJsZUVsZW1lbnRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZm9jdXNhYmxlRWxlbWVudHMpO1xuICAgIFxuLy8gICAgIHZhciBmaXJzdFRhYlN0b3AgPSBmb2N1c2FibGVFbGVtZW50c1swXTtcbi8vICAgICB2YXIgbGFzdFRhYlN0b3AgPSBmb2N1c2FibGVFbGVtZW50c1tmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggLTFdO1xuXG4vLyAgICAgLy8gT2sgdGltZSB0byBzaG93IHRoZSB0b2FzdCBhbmQgZm9jdXMgb24gaXRcbi8vICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9hc3QnKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbi8vICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdG9hc3QgcCcpLmZvY3VzKCk7XG5cbi8vICAgfVxuICBcblxuLy8gICAvKipcbi8vICAgICogTGlzdGVucyBmb3IgYSBjaGFuZ2UgaW4gdGhlIFNXLCByZWxvYWRzIHRoZSBwYWdlIGFzIGEgcmVzdWx0XG4vLyAgICAqL1xuLy8gICB2YXIgcmVmcmVzaGluZztcbi8vICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignY29udHJvbGxlcmNoYW5nZScsIGZ1bmN0aW9uKCkge1xuLy8gICAgIGNvbnNvbGUubG9nKCdjb250cm9sbGVyIGNoYW5nZScpXG4vLyAgICAgaWYgKHJlZnJlc2hpbmcpIHJldHVybjtcbi8vICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4vLyAgICAgcmVmcmVzaGluZyA9IHRydWU7XG4vLyAgIH0pO1xuLy8gfVxuICBcbiAgLyoqXG4gICAqIEluaXRpYWxpemUgbGVhZmxldCBtYXBcbiAgICovXG4gIGluaXRNYXAgPSAoKSA9PiB7XG4gIC8vIGNvbnN0IGlkID0gZ2V0UGFyYW1ldGVyQnlOYW1lKCdpZCcpO1xuICAvLyBkYldvcmtlci5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24oZSkge1xuICAvLyAgIGlmIChlLmRhdGEgPT0gJ2Vycm9yJykgeyAvLyBHb3QgYW4gZXJyb3JcbiAgLy8gICAgIGNvbnNvbGUuZXJyb3IoZS5kYXRhKTtcbiAgLy8gICB9IGVsc2Uge1xuICAvLyAgICAgc2VsZi5uZXdNYXAgPSBMLm1hcCgnbWFwJywge1xuICAvLyAgICAgICBjZW50ZXI6IFtlLmRhdGEucmVzdGF1cmFudC5sYXRsbmcubGF0LCBlLmRhdGEucmVzdGF1cmFudC5sYXRsbmcubG5nXSxcbiAgLy8gICAgICAgem9vbTogMTYsXG4gIC8vICAgICAgIHNjcm9sbFdoZWVsWm9vbTogZmFsc2VcbiAgLy8gICAgIH0pO1xuICAvLyAgICAgTC50aWxlTGF5ZXIoJ2h0dHBzOi8vYXBpLnRpbGVzLm1hcGJveC5jb20vdjQve2lkfS97en0ve3h9L3t5fS5qcGc3MD9hY2Nlc3NfdG9rZW49e21hcGJveFRva2VufScsIHtcbiAgLy8gICAgICAgbWFwYm94VG9rZW46ICdway5leUoxSWpvaVptRnljbVZzYkhOamNtbHdkQ0lzSW1FaU9pSmphbUppYVRsM2RITXhPR3hzTXpKd1pUbG1Zbk40WkhONUluMC42RXk1MGVsMGF0d2pEeWdPX2NPMHNBJyxcbiAgLy8gICAgICAgbWF4Wm9vbTogMTgsXG4gIC8vICAgICAgIGF0dHJpYnV0aW9uOiAnTWFwIGRhdGEgJmNvcHk7IDxhIGhyZWY9XCJodHRwczovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9cIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnMsICcgK1xuICAvLyAgICAgICAgICc8YSBocmVmPVwiaHR0cHM6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LXNhLzIuMC9cIj5DQy1CWS1TQTwvYT4sICcgK1xuICAvLyAgICAgICAgICdJbWFnZXJ5IMKpIDxhIGhyZWY9XCJodHRwczovL3d3dy5tYXBib3guY29tL1wiPk1hcGJveDwvYT4nLFxuICAvLyAgICAgICBpZDogJ21hcGJveC5zdHJlZXRzJyAgICBcbiAgLy8gICAgIH0pLmFkZFRvKG5ld01hcCk7XG4gIC8vICAgICBtYXBNYXJrZXJGb3JSZXN0YXVyYW50KGUuZGF0YS5yZXN0YXVyYW50LCBzZWxmLm5ld01hcCk7XG4gIC8vICAgfVxuICAvLyB9LCBmYWxzZSk7XG4gIC8vIGRiV29ya2VyLnBvc3RNZXNzYWdlKHthY3Rpb246J2ZldGNoUmVzdGF1cmFudEJ5SWQnLCBpZH0pO1xuXG5cbiAgZmV0Y2hSZXN0YXVyYW50RnJvbVVSTCgoZXJyb3IsIHJlc3RhdXJhbnQpID0+IHtcbiAgICBpZiAoZXJyb3IpIHsgLy8gR290IGFuIGVycm9yIVxuICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgfSBlbHNlIHsgICAgICBcbiAgICAgIHNlbGYubmV3TWFwID0gTC5tYXAoJ21hcCcsIHtcbiAgICAgICAgY2VudGVyOiBbcmVzdGF1cmFudC5sYXRsbmcubGF0LCByZXN0YXVyYW50LmxhdGxuZy5sbmddLFxuICAgICAgICB6b29tOiAxNixcbiAgICAgICAgc2Nyb2xsV2hlZWxab29tOiBmYWxzZVxuICAgICAgfSk7XG4gICAgICBMLnRpbGVMYXllcignaHR0cHM6Ly9hcGkudGlsZXMubWFwYm94LmNvbS92NC97aWR9L3t6fS97eH0ve3l9LmpwZzcwP2FjY2Vzc190b2tlbj17bWFwYm94VG9rZW59Jywge1xuICAgICAgICBtYXBib3hUb2tlbjogJ3BrLmV5SjFJam9pWm1GeWNtVnNiSE5qY21sd2RDSXNJbUVpT2lKamFtSmlhVGwzZEhNeE9HeHNNekp3WlRsbVluTjRaSE41SW4wLjZFeTUwZWwwYXR3akR5Z09fY08wc0EnLFxuICAgICAgICBtYXhab29tOiAxOCxcbiAgICAgICAgYXR0cmlidXRpb246ICdNYXAgZGF0YSAmY29weTsgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm9wZW5zdHJlZXRtYXAub3JnL1wiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycywgJyArXG4gICAgICAgICAgJzxhIGhyZWY9XCJodHRwczovL2NyZWF0aXZlY29tbW9ucy5vcmcvbGljZW5zZXMvYnktc2EvMi4wL1wiPkNDLUJZLVNBPC9hPiwgJyArXG4gICAgICAgICAgJ0ltYWdlcnkgwqkgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm1hcGJveC5jb20vXCI+TWFwYm94PC9hPicsXG4gICAgICAgIGlkOiAnbWFwYm94LnN0cmVldHMnICAgIFxuICAgICAgfSkuYWRkVG8obmV3TWFwKTtcbiAgICAgIG1hcE1hcmtlckZvclJlc3RhdXJhbnQocmVzdGF1cmFudCwgc2VsZi5uZXdNYXApO1xuICAgIH1cbiAgfSk7XG4gIH0gIFxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIG1hcCBtYXJrZXIgZm9yIHRoZSByZXN0YXVyYW50XG4gICAqL1xuICBtYXBNYXJrZXJGb3JSZXN0YXVyYW50ID0gKHJlc3RhdXJhbnQsIG1hcCk9PntcbiAgICAvLyBodHRwczovL2xlYWZsZXRqcy5jb20vcmVmZXJlbmNlLTEuMy4wLmh0bWwjbWFya2VyICBcbiAgICBjb25zdCBtYXJrZXIgPSBuZXcgTC5tYXJrZXIoW3Jlc3RhdXJhbnQubGF0bG5nLmxhdCwgcmVzdGF1cmFudC5sYXRsbmcubG5nXSxcbiAgICAgIHt0aXRsZTogcmVzdGF1cmFudC5uYW1lLFxuICAgICAgYWx0OiByZXN0YXVyYW50Lm5hbWVcbiAgICAgIH0pO1xuICAgICAgbWFya2VyLmFkZFRvKG5ld01hcCk7XG4gICAgcmV0dXJuIG1hcmtlcjtcbiAgfSBcblxuLyoqXG4gKiBHZXQgY3VycmVudCByZXN0YXVyYW50IGZyb20gcGFnZSBVUkwuXG4gKi9cbmZldGNoUmVzdGF1cmFudEZyb21VUkwgPSAoY2FsbGJhY2spID0+IHtcbiAgaWYgKHNlbGYucmVzdGF1cmFudCkgeyAvLyByZXN0YXVyYW50IGFscmVhZHkgZmV0Y2hlZCFcbiAgICBjYWxsYmFjayhudWxsLCBzZWxmLnJlc3RhdXJhbnQpXG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IGlkID0gZ2V0UGFyYW1ldGVyQnlOYW1lKCdpZCcpO1xuICBpZiAoIWlkKSB7IC8vIG5vIGlkIGZvdW5kIGluIFVSTFxuICAgIGVycm9yID0gJ05vIHJlc3RhdXJhbnQgaWQgaW4gVVJMJ1xuICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBEQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRCeUlkKGlkLCAoZXJyb3IsIHJlc3RhdXJhbnQpID0+IHtcbiAgICAvLyAgIHNlbGYucmVzdGF1cmFudCA9IHJlc3RhdXJhbnQ7XG4gICAgLy8gICBpZiAoIXJlc3RhdXJhbnQpIHtcbiAgICAvLyAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgLy8gICAgIHJldHVybjtcbiAgICAvLyAgIH1cbiAgICAvLyAgIGZpbGxSZXN0YXVyYW50SFRNTCgpO1xuICAgIC8vICAgY2FsbGJhY2sobnVsbCwgcmVzdGF1cmFudClcbiAgICAvLyB9KTtcbiAgICAvLyBDb21tZW50XG4gICAgZGJXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGlmIChlLmRhdGEgPT0gJ2Vycm9yJykgeyAvLyBHb3QgYW4gZXJyb3JcbiAgICAgICAgY29uc29sZS5lcnJvcihlLmRhdGEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2dvdCBiYWNrOiAnLGUuZGF0YS5yZXN0YXVyYW50KVxuICAgICAgICBpZihlLmRhdGEucmVzdGF1cmFudCl7XG4gICAgICAgICAgZmlsbFJlc3RhdXJhbnRIVE1MKGUuZGF0YS5yZXN0YXVyYW50LGUuZGF0YS5yZXZpZXdzKTtcbiAgICAgICAgICBjYWxsYmFjayhudWxsLCBlLmRhdGEucmVzdGF1cmFudCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCBmYWxzZSk7XG4gICAgZGJXb3JrZXIucG9zdE1lc3NhZ2Uoe2FjdGlvbjonZmV0Y2hSZXN0YXVyYW50QnlJZCcsIGlkfSk7XG4gICAgfSAgICBcbn1cblxuLyoqXG4gKiBDcmVhdGUgcmVzdGF1cmFudCBIVE1MIGFuZCBhZGQgaXQgdG8gdGhlIHdlYnBhZ2VcbiAqL1xuZmlsbFJlc3RhdXJhbnRIVE1MID0gKHJlc3RhdXJhbnQscmV2aWV3cykgPT4ge1xuICBjb25zb2xlLmxvZygncmVzdGF1cmFudCcscmVzdGF1cmFudClcbiAgXG4gIGNvbnN0IG5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGF1cmFudGRldGFpbF9faWQnKTtcbiAgbmFtZS52YWx1ZSA9IHJlc3RhdXJhbnQuaWQ7XG5cbiAgY29uc3QgaWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGF1cmFudC1uYW1lJyk7XG4gIGlkLmlubmVySFRNTCA9IHJlc3RhdXJhbnQubmFtZTtcblxuICAvLyBSZXZpZXcgb2YgdGhlIHJlc3RhdXJhbnRcbiAgY29uc3QgcmF0aW5nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JhdGluZycpO1xuXG5cbiAgbGV0IGVtcHR5aGVhcnRzID0gNSAtIHJldmlld3M7XG4gIFxuICBmb3IobGV0IGk9MDsgaSA8IHJldmlld3M7IGkrKyl7XG4gICAgY29uc3QgZW1wdHlzdGFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgZW1wdHlzdGFyLmNsYXNzTmFtZT1cInJlc3RhdXJhbnRfX3N0YXIgcmVzdGF1cmFudF9fc3Rhci0tZnVsbFwiO1xuICAgIGVtcHR5c3Rhci5zcmMgPSBcIi9pbWcvZnVsbHN0YXIuc3ZnXCI7XG4gICAgZW1wdHlzdGFyLmFsdD0gXCJcIlxuICAgIHJhdGluZy5hcHBlbmQoZW1wdHlzdGFyKTtcbiAgfVxuXG4gIGZvcihsZXQgaT0wOyBpIDwgZW1wdHloZWFydHM7IGkrKyl7XG4gICAgY29uc3QgZW1wdHlzdGFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgZW1wdHlzdGFyLmNsYXNzTmFtZT1cInJlc3RhdXJhbnRfX3N0YXIgcmVzdGF1cmFudF9fc3Rhci0tZW1wdHlcIjtcbiAgICBlbXB0eXN0YXIuc3JjID0gXCIvaW1nL2VtcHR5c3Rhci5zdmdcIjtcbiAgICBlbXB0eXN0YXIuYWx0PSBcIlwiXG4gICAgcmF0aW5nLmFwcGVuZChlbXB0eXN0YXIpO1xuICB9XG5cblxuICBjb25zdCBhZGRyZXNzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnQtYWRkcmVzcycpO1xuICBhZGRyZXNzLmlubmVySFRNTCA9IHJlc3RhdXJhbnQuYWRkcmVzcztcblxuICBjb25zdCBhZGRyZXNzaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICBhZGRyZXNzaWNvbi5jbGFzc05hbWUgPSAncmVzdGF1cmFudGRldGFpbF9faWNvbic7XG4gIGFkZHJlc3NpY29uLnNyYyA9ICcvaW1nL3dheXBvaW50LnN2Zyc7XG4gIGFkZHJlc3NpY29uLmFsdCA9ICcnO1xuICBhZGRyZXNzLnByZXBlbmQoYWRkcmVzc2ljb24pXG5cbiAgY29uc3QgaW1hZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGF1cmFudC1pbWcnKTtcbiAgaW1hZ2UuY2xhc3NOYW1lID0gJ3Jlc3RhdXJhbnQtaW1nJ1xuICBpbWFnZS5zcmMgPSBEQkhlbHBlci5pbWFnZVVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCk7XG4gIGltYWdlLmFsdCA9IERCSGVscGVyLmltYWdlVGV4dEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCk7XG4gIGltYWdlLnNyY3NldCA9IERCSGVscGVyLmltYWdlU3JjU2V0Rm9yUmVzdGF1cmFudChyZXN0YXVyYW50KTtcblxuICBjb25zdCBjdWlzaW5lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnQtY3Vpc2luZScpO1xuICBjdWlzaW5lLmlubmVySFRNTCA9IHJlc3RhdXJhbnQuY3Vpc2luZV90eXBlO1xuXG4gIGNvbnN0IGN1aXNpbmVpY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gIGN1aXNpbmVpY29uLmNsYXNzTmFtZSA9ICdyZXN0YXVyYW50ZGV0YWlsX19pY29uJztcbiAgY3Vpc2luZWljb24uc3JjID0gJy9pbWcvY3Vpc2luZS5zdmcnO1xuICBjdWlzaW5laWNvbi5hbHQgPSAnJztcbiAgY3Vpc2luZS5wcmVwZW5kKGN1aXNpbmVpY29uKVxuXG4gIC8vIGZpbGwgb3BlcmF0aW5nIGhvdXJzXG4gIGlmIChyZXN0YXVyYW50Lm9wZXJhdGluZ19ob3Vycykge1xuICAgIGZpbGxSZXN0YXVyYW50SG91cnNIVE1MKHJlc3RhdXJhbnQub3BlcmF0aW5nX2hvdXJzKTtcblxuICAgIGNvbnN0IGhvdXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnRkZXRhaWxfX2hvdXJzY29udGFpbmVyJyk7XG4gIFxuICAgIGNvbnN0IGhvdXJzaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGhvdXJzaWNvbi5jbGFzc05hbWUgPSAncmVzdGF1cmFudGRldGFpbF9faWNvbic7XG4gICAgaG91cnNpY29uLnNyYyA9ICcvaW1nL2Nsb2NrLnN2Zyc7XG4gICAgaG91cnNpY29uLmFsdCA9ICcnO1xuICAgIGhvdXJzLnByZXBlbmQoaG91cnNpY29uKVxuXG4gIH1cbiAgLy8gZmlsbCByZXZpZXdzXG4gIFxuICBkYldvcmtlci5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24oZSkge1xuICAgIGlmIChlLmRhdGEgPT0gJ2Vycm9yJykgeyAvLyBHb3QgYW4gZXJyb3JcbiAgICAgIGNvbnNvbGUuZXJyb3IoZS5kYXRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ2dvdCBiYWNrOiAnLGUuZGF0YS5yZXZpZXdzKVxuICAgICAgZmlsbFJldmlld3NIVE1MKGUuZGF0YS5yZXZpZXdzKTtcbiAgICB9XG4gIH0sIGZhbHNlKTtcbiAgZGJXb3JrZXIucG9zdE1lc3NhZ2Uoe2FjdGlvbjonZmlsbFJldmlld3NIVE1MJywgaWQ6cmVzdGF1cmFudC5pZH0pO1xufVxuXG4vKipcbiAqIENyZWF0ZSByZXN0YXVyYW50IG9wZXJhdGluZyBob3VycyBIVE1MIHRhYmxlIGFuZCBhZGQgaXQgdG8gdGhlIHdlYnBhZ2UuXG4gKi9cbmZpbGxSZXN0YXVyYW50SG91cnNIVE1MID0gKG9wZXJhdGluZ0hvdXJzKSA9PiB7XG4gIGNvbnN0IGhvdXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnQtaG91cnMnKTtcbiAgZm9yIChsZXQga2V5IGluIG9wZXJhdGluZ0hvdXJzKSB7XG4gICAgY29uc3Qgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHInKTtcblxuICAgIGNvbnN0IGRheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XG4gICAgZGF5LmNsYXNzTmFtZSA9ICdyZXN0YXVyYW50ZGV0YWlsX19kYXknO1xuICAgIGRheS5pbm5lckhUTUwgPSBrZXk7XG4gICAgcm93LmFwcGVuZENoaWxkKGRheSk7XG5cbiAgICBjb25zdCB0aW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICB0aW1lLmNsYXNzTmFtZSA9ICdyZXN0YXVyYW50ZGV0YWlsX19ob3VyJztcbiAgICB0aW1lLmlubmVySFRNTCA9IG9wZXJhdGluZ0hvdXJzW2tleV07XG4gICAgcm93LmFwcGVuZENoaWxkKHRpbWUpO1xuXG4gICAgaG91cnMuYXBwZW5kQ2hpbGQocm93KTtcbiAgfVxufVxuXG4vKipcbiAqIENyZWF0ZSBhbGwgcmV2aWV3cyBIVE1MIGFuZCBhZGQgdGhlbSB0byB0aGUgd2VicGFnZS5cbiAqL1xuZmlsbFJldmlld3NIVE1MID0gKHJldmlld3MpID0+IHtcbiAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jldmlld3MtY29udGFpbmVyJyk7XG5cbiAgaWYgKCFyZXZpZXdzKSB7XG4gICAgY29uc3Qgbm9SZXZpZXdzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIG5vUmV2aWV3cy5pbm5lckhUTUwgPSAnTm8gcmV2aWV3cyB5ZXQhJztcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQobm9SZXZpZXdzKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgdWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmV2aWV3cy1saXN0Jyk7XG4gIHVsLmlubmVySFRNTCA9ICcnO1xuICByZXZpZXdzLnJldmVyc2UoKS5mb3JFYWNoKHJldmlldyA9PiB7XG4gICAgdWwuYXBwZW5kQ2hpbGQoY3JlYXRlUmV2aWV3SFRNTChyZXZpZXcpKTtcbiAgfSk7XG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh1bCk7XG59XG5cbi8qKlxuICogQ3JlYXRlIHJldmlldyBIVE1MIGFuZCBhZGQgaXQgdG8gdGhlIHdlYnBhZ2UuXG4gKi9cbmNyZWF0ZVJldmlld0hUTUwgPSAocmV2aWV3KSA9PiB7XG4gIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgbGkuY2xhc3NOYW1lID0gJ3Jlc3RhdXJhbnRkZXRhaWxfX3Jldmlldyc7XG4gIGNvbnN0IGNvbW1lbnRIZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29tbWVudEhlYWRlci5jbGFzc05hbWUgPSAncmVzdGF1cmFudGRldGFpbF9fY29tbWVudGhlYWRlcic7XG5cbiAgY29uc3QgbGVmdGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBsZWZ0ZGl2LmNsYXNzTmFtZSA9ICdyZXN0YXVyYW50ZGV0YWlsX19hdmF0YXJjb250YWluZXInO1xuXG4gIGNvbnN0IGF2YXRhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICBhdmF0YXIuc3JjICA9ICcvaW1nL2F2YXRhci5zdmcnO1xuICBhdmF0YXIuY2xhc3NOYW1lID0gJ3Jlc3RhdXJhbnRkZXRhaWxfX2F2YXRhcic7XG4gIGF2YXRhci5hbHQgPSAnQXZhdGFyIHBob3RvJztcbiAgbGVmdGRpdi5hcHBlbmRDaGlsZChhdmF0YXIpO1xuICBjb21tZW50SGVhZGVyLmFwcGVuZENoaWxkKGxlZnRkaXYpO1xuXG4gIGNvbnN0IHJpZ2h0ZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHJpZ2h0ZGl2LmNsYXNzTmFtZSA9ICdyZXN0YXVyYW50ZGV0YWlsX19uYW1lY29udGFpbmVyJztcblxuICBjb25zdCBuYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBuYW1lLmlubmVySFRNTCA9IHJldmlldy5uYW1lO1xuICByaWdodGRpdi5hcHBlbmRDaGlsZChuYW1lKTtcbiAgXG4gIC8vIENyZWF0ZSBTdGFycyBmb3IgUmV2aWV3XG4gIGNvbnN0IGluZGl2aWR1YWxyYXRpbmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gIGluZGl2aWR1YWxyYXRpbmcuY2xhc3NOYW1lID0gJ3Jlc3RhdXJhbnRkZXRhaWxfX2luZGl2aWR1YWxyZXZpZXdyYXRpbmcnO1xuICBjb25zdCBlbXB0eVN0YXJzID0gNSAtIHBhcnNlSW50KHJldmlldy5yYXRpbmcpO1xuICBmb3IobGV0IGk9MDsgaSA8IHJldmlldy5yYXRpbmc7IGkrKyl7XG4gICAgY29uc3QgZnVsbHN0YXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBmdWxsc3Rhci5jbGFzc05hbWU9XCJyZXN0YXVyYW50X19zdGFyIHJlc3RhdXJhbnRfX3N0YXItLWZ1bGxcIjtcbiAgICBmdWxsc3Rhci5zcmMgPSBcIi9pbWcvZnVsbHN0YXIuc3ZnXCI7XG4gICAgZnVsbHN0YXIuYWx0ID0gXCJcIlxuICAgIGluZGl2aWR1YWxyYXRpbmcuYXBwZW5kKGZ1bGxzdGFyKTtcbiAgfVxuICBmb3IobGV0IGk9MDsgaSA8IGVtcHR5U3RhcnM7IGkrKyl7XG4gICAgY29uc3QgZW1wdHlzdGFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgZW1wdHlzdGFyLmNsYXNzTmFtZT1cInJlc3RhdXJhbnRfX3N0YXIgcmVzdGF1cmFudF9fc3Rhci0tZW1wdHlcIjtcbiAgICBlbXB0eXN0YXIuc3JjID0gXCIvaW1nL2VtcHR5c3Rhci5zdmdcIjtcbiAgICBlbXB0eXN0YXIuYWx0PSBcIlwiXG4gICAgaW5kaXZpZHVhbHJhdGluZy5hcHBlbmQoZW1wdHlzdGFyKTtcbiAgfVxuXG4gIHJpZ2h0ZGl2LmFwcGVuZENoaWxkKGluZGl2aWR1YWxyYXRpbmcpO1xuICBjb25zdCBkYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBkYXRlLmNsYXNzTmFtZSA9ICdyZXN0YXVyYW50ZGV0YWlsX19yZXZpZXdkYXRlJ1xuICBjb25zdCByZXZpZXdkYXRlID0gbmV3IERhdGUocmV2aWV3LmNyZWF0ZWRBdCk7XG4gIGNvbnN0IHRvZGF5ZGF0ZSA9IG5ldyBEYXRlKCk7XG4gIC8vIFN1YnRyYWN0IHRvZGF5cyBkYXRlIGZyb20gdGhlIGRhdGUgb2YgdGhlIHJldmlldywgdGhlbiBmb3JtYXQgaW50byBkYXlzXG4gIGNvbnN0IGRheXNkaWZmZXJlbmNlID0gTWF0aC5yb3VuZCgodG9kYXlkYXRlIC0gcmV2aWV3ZGF0ZSkvMTAwMC82MC82MC8yNClcbiAgZGF0ZS5pbm5lckhUTUwgPSBgJHtkYXlzZGlmZmVyZW5jZX0gZGF5cyBhZ29gO1xuICByaWdodGRpdi5hcHBlbmRDaGlsZChkYXRlKTtcblxuICBjb21tZW50SGVhZGVyLmFwcGVuZENoaWxkKHJpZ2h0ZGl2KTsgXG4gIGxpLmFwcGVuZENoaWxkKGNvbW1lbnRIZWFkZXIpO1xuXG4gIGNvbnN0IGNvbW1lbnRzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBjb21tZW50cy5pbm5lckhUTUwgPSByZXZpZXcuY29tbWVudHM7XG4gIGxpLmFwcGVuZENoaWxkKGNvbW1lbnRzKTtcblxuICByZXR1cm4gbGk7XG59XG5cbi8qKlxuICogR2V0IGEgcGFyYW1ldGVyIGJ5IG5hbWUgZnJvbSBwYWdlIFVSTC5cbiAqL1xuZ2V0UGFyYW1ldGVyQnlOYW1lID0gKG5hbWUsIHVybCkgPT4ge1xuICBpZiAoIXVybClcbiAgICB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgbmFtZSA9IG5hbWUucmVwbGFjZSgvW1xcW1xcXV0vZywgJ1xcXFwkJicpO1xuICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoYFs/Jl0ke25hbWV9KD0oW14mI10qKXwmfCN8JClgKSxcbiAgICByZXN1bHRzID0gcmVnZXguZXhlYyh1cmwpO1xuICBpZiAoIXJlc3VsdHMpXG4gICAgcmV0dXJuIG51bGw7XG4gIGlmICghcmVzdWx0c1syXSlcbiAgICByZXR1cm4gJyc7XG4gIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQocmVzdWx0c1syXS5yZXBsYWNlKC9cXCsvZywgJyAnKSk7XG59XG5cbi8qKlxuICogRXZlbnQgbGlzdGVuZXJzIGZvciByZXZpZXcgZm9ybVxuICovXG5cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZXN0YXVyYW50ZGV0YWlsX19yZXZpZXdpbnB1dCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJyxmdW5jdGlvbigpe1xuICB0aGlzLnByZXZpb3VzRWxlbWVudFNpYmxpbmcuY2xhc3NMaXN0LmFkZCgncmVzdGF1cmFudGRldGFpbF9fcmV2aWV3bGFiZWwtLWFjdGl2ZScpXG59KTtcblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJlc3RhdXJhbnRkZXRhaWxfX3Jldmlld2lucHV0JykuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsZnVuY3Rpb24oKXtcbiAgaWYodGhpcy52YWx1ZSA9PT0gJycpe1xuICAgIHRoaXMucHJldmlvdXNFbGVtZW50U2libGluZy5jbGFzc0xpc3QucmVtb3ZlKCdyZXN0YXVyYW50ZGV0YWlsX19yZXZpZXdsYWJlbC0tYWN0aXZlJylcbiAgfVxufSk7XG5cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZXN0YXVyYW50ZGV0YWlsX19yZXZpZXduYW1laW5wdXQnKS5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsZnVuY3Rpb24oKXtcbiAgdGhpcy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLmNsYXNzTGlzdC5hZGQoJ3Jlc3RhdXJhbnRkZXRhaWxfX3Jldmlld25hbWVsYWJlbC0tYWN0aXZlJylcbn0pO1xuXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmVzdGF1cmFudGRldGFpbF9fcmV2aWV3bmFtZWlucHV0JykuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsZnVuY3Rpb24oKXtcbiAgaWYodGhpcy52YWx1ZSA9PT0gJycpe1xuICAgIHRoaXMucHJldmlvdXNFbGVtZW50U2libGluZy5jbGFzc0xpc3QucmVtb3ZlKCdyZXN0YXVyYW50ZGV0YWlsX19yZXZpZXduYW1lbGFiZWwtLWFjdGl2ZScpXG4gIH1cbn0pO1xuXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmVzdGF1cmFudGRldGFpbHNfX3Jldmlld2Zvcm0nKS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLGZ1bmN0aW9uKGUpe1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIGxldCByZXN0YXVyYW50aWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmVzdGF1cmFudGRldGFpbF9faWQnKS52YWx1ZTtcbiAgbGV0IHJhdGluZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZXN0YXVyYW50ZGV0YWlsX19zdGFyLS1zZWxlY3RlZCcpLmdldEF0dHJpYnV0ZSgnZGF0YS12YWx1ZScpO1xuICBsZXQgbmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZXN0YXVyYW50ZGV0YWlsX19yZXZpZXduYW1laW5wdXQnKS52YWx1ZTtcbiAgbGV0IGNvbW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmVzdGF1cmFudGRldGFpbF9fcmV2aWV3aW5wdXQnKS52YWx1ZTtcblxuICBsZXQgZGF0YSA9IHtcbiAgICBcInJlc3RhdXJhbnRfaWRcIjogcGFyc2VJbnQocmVzdGF1cmFudGlkKSxcbiAgICBcIm5hbWVcIjogbmFtZSxcbiAgICBcInJhdGluZ1wiOiBwYXJzZUludChyYXRpbmcpLFxuICAgIFwiY29tbWVudHNcIjogY29tbWVudCxcbiAgICBcImNyZWF0ZWRBdFwiOm5ldyBEYXRlKCkuZ2V0VGltZSgpLFxuICAgIFwidXBkYXRlZEF0XCI6bmV3IERhdGUoKS5nZXRUaW1lKClcbiAgfTtcblxuICBmZXRjaChgaHR0cDovL2xvY2FsaG9zdDoxMzM3L3Jldmlld3MvYCx7XG4gICAgbWV0aG9kOiAncG9zdCcsXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgaGVhZGVyczp7XG4gICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgfVxuICB9KS50aGVuKChyZXNwb25zZSk9PntcbiAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG4gICAgfSkudGhlbigocmVzcG9uc2UpPT57XG4gICAgICBkYldvcmtlci5wb3N0TWVzc2FnZSh7YWN0aW9uOidmaWxsUmV2aWV3c0hUTUwnLCBpZDpyZXN0YXVyYW50aWR9KTtcbiAgICB9KTtcbn0pO1xuXG5jb25zdCBob3ZlcmxpbmtzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnJlc3RhdXJhbnRkZXRhaWxfX3N0YXInKVxuXG5mb3IgKHZhciBpID0gMDsgaSA8IGhvdmVybGlua3MubGVuZ3RoOyBpKyspIHtcbiAgaG92ZXJsaW5rc1tpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIGNvbnN0IGhpZ2hsaWdodGVkU3RhcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucmVzdGF1cmFudGRldGFpbF9fc3RhcicpXG4gICAgY29uc3Qgc3RhckxpbWl0ID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtdmFsdWUnKTtcblxuICAgIGZvciAodmFyIGkgPSAxOyBpIDw9IGhpZ2hsaWdodGVkU3RhcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC5yZXN0YXVyYW50ZGV0YWlsX19zdGFyW2RhdGEtdmFsdWU9XCIke2l9XCJdYCkuY2xhc3NMaXN0LnJlbW92ZSgncmVzdGF1cmFudGRldGFpbF9fc3Rhci0tc2VsZWN0ZWQnKVxuICAgICAgaWYoaSA8PSBzdGFyTGltaXQpe1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAucmVzdGF1cmFudGRldGFpbF9fc3RhcltkYXRhLXZhbHVlPVwiJHtpfVwiXWApLmNsYXNzTGlzdC5hZGQoJ3Jlc3RhdXJhbnRkZXRhaWxfX3N0YXItLWFjdGl2ZScpXG4gICAgICB9ZWxzZXtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLnJlc3RhdXJhbnRkZXRhaWxfX3N0YXJbZGF0YS12YWx1ZT1cIiR7aX1cIl1gKS5jbGFzc0xpc3QucmVtb3ZlKCdyZXN0YXVyYW50ZGV0YWlsX19zdGFyLS1hY3RpdmUnKVxuICAgICAgfVxuICAgIH1cbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAucmVzdGF1cmFudGRldGFpbF9fc3RhcltkYXRhLXZhbHVlPVwiJHtzdGFyTGltaXR9XCJdYCkuY2xhc3NMaXN0LmFkZCgncmVzdGF1cmFudGRldGFpbF9fc3Rhci0tc2VsZWN0ZWQnKVxuICB9KVxufVxuXG4vLyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdjdWlzaW5lcy1zZWxlY3QnKS5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsZnVuY3Rpb24oKXtcbi8vICAgdGhpcy5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLmNsYXNzTGlzdC5hZGQoJ2ZpbHRlcl9fbGFiZWwtLWFjdGl2ZScpO1xuLy8gfSkgXG5cbi8vIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2N1aXNpbmVzLXNlbGVjdCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLGZ1bmN0aW9uKCl7XG4vLyAgIGlmKHRoaXMudmFsdWUgPT09ICdhbGwnKXtcbi8vICAgICB0aGlzLnByZXZpb3VzRWxlbWVudFNpYmxpbmcuY2xhc3NMaXN0LnJlbW92ZSgnZmlsdGVyX19sYWJlbC0tYWN0aXZlJyk7XG4vLyAgIH1cbi8vIH0pXG5cbi8qKlxuICAqIEluaXRpYWxpemUgbWFwIGFzIHNvb24gYXMgdGhlIHBhZ2UgaXMgbG9hZGVkLlxuICovXG5zZXRUaW1lb3V0KCgpPT57XG4gIGluaXRNYXAoKTtcbn0sMTAwKSBcbiAgIl19
