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
          fillRestaurantHTML(e.data.restaurant);
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
fillRestaurantHTML = restaurant => {
  console.log('restaurant', restaurant);
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  // Review of the restaurant
  const rating = document.getElementById('rating');
  const emptyStars = 5 - DBHelper.ratingForRestaurant(restaurant);
  for (let i = 0; i < DBHelper.ratingForRestaurant(restaurant); i++) {
    const fullstar = document.createElement('img');
    fullstar.className = "restaurant__star restaurant__star--full";
    fullstar.src = "/img/fullstar.svg";
    fullstar.alt = "";
    rating.append(fullstar);
  }
  for (let i = 0; i < emptyStars; i++) {
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
  const reviewdate = new Date(review.date);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc3RhdXJhbnRfaW5mby5qcyJdLCJuYW1lcyI6WyJteUNTUyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInJlbCIsImhyZWYiLCJoZWFkIiwiaW5zZXJ0QmVmb3JlIiwiY2hpbGROb2RlcyIsImxlbmd0aCIsIm5leHRTaWJsaW5nIiwiZGJXb3JrZXIiLCJXb3JrZXIiLCJyZXN0YXVyYW50IiwibmV3TWFwIiwiaW5pdE1hcCIsImZldGNoUmVzdGF1cmFudEZyb21VUkwiLCJlcnJvciIsImNvbnNvbGUiLCJzZWxmIiwiTCIsIm1hcCIsImNlbnRlciIsImxhdGxuZyIsImxhdCIsImxuZyIsInpvb20iLCJzY3JvbGxXaGVlbFpvb20iLCJ0aWxlTGF5ZXIiLCJtYXBib3hUb2tlbiIsIm1heFpvb20iLCJhdHRyaWJ1dGlvbiIsImlkIiwiYWRkVG8iLCJtYXBNYXJrZXJGb3JSZXN0YXVyYW50IiwibWFya2VyIiwidGl0bGUiLCJuYW1lIiwiYWx0IiwiY2FsbGJhY2siLCJnZXRQYXJhbWV0ZXJCeU5hbWUiLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsImRhdGEiLCJsb2ciLCJmaWxsUmVzdGF1cmFudEhUTUwiLCJwb3N0TWVzc2FnZSIsImFjdGlvbiIsImdldEVsZW1lbnRCeUlkIiwiaW5uZXJIVE1MIiwicmF0aW5nIiwiZW1wdHlTdGFycyIsIkRCSGVscGVyIiwicmF0aW5nRm9yUmVzdGF1cmFudCIsImkiLCJmdWxsc3RhciIsImNsYXNzTmFtZSIsInNyYyIsImFwcGVuZCIsImVtcHR5c3RhciIsImFkZHJlc3MiLCJhZGRyZXNzaWNvbiIsInByZXBlbmQiLCJpbWFnZSIsImltYWdlVXJsRm9yUmVzdGF1cmFudCIsImltYWdlVGV4dEZvclJlc3RhdXJhbnQiLCJzcmNzZXQiLCJpbWFnZVNyY1NldEZvclJlc3RhdXJhbnQiLCJjdWlzaW5lIiwiY3Vpc2luZV90eXBlIiwiY3Vpc2luZWljb24iLCJvcGVyYXRpbmdfaG91cnMiLCJmaWxsUmVzdGF1cmFudEhvdXJzSFRNTCIsImhvdXJzIiwiaG91cnNpY29uIiwicmV2aWV3cyIsImZpbGxSZXZpZXdzSFRNTCIsIm9wZXJhdGluZ0hvdXJzIiwia2V5Iiwicm93IiwiZGF5IiwiYXBwZW5kQ2hpbGQiLCJ0aW1lIiwiY29udGFpbmVyIiwibm9SZXZpZXdzIiwidWwiLCJmb3JFYWNoIiwicmV2aWV3IiwiY3JlYXRlUmV2aWV3SFRNTCIsImxpIiwiY29tbWVudEhlYWRlciIsImxlZnRkaXYiLCJhdmF0YXIiLCJyaWdodGRpdiIsImluZGl2aWR1YWxyYXRpbmciLCJwYXJzZUludCIsImRhdGUiLCJyZXZpZXdkYXRlIiwiRGF0ZSIsInRvZGF5ZGF0ZSIsImRheXNkaWZmZXJlbmNlIiwiTWF0aCIsInJvdW5kIiwiY29tbWVudHMiLCJ1cmwiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInJlcGxhY2UiLCJyZWdleCIsIlJlZ0V4cCIsInJlc3VsdHMiLCJleGVjIiwiZGVjb2RlVVJJQ29tcG9uZW50Iiwic2V0VGltZW91dCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQSxJQUFJQSxRQUFRQyxTQUFTQyxhQUFULENBQXdCLE1BQXhCLENBQVo7QUFDQUYsTUFBTUcsR0FBTixHQUFZLFlBQVo7QUFDQUgsTUFBTUksSUFBTixHQUFhLGtCQUFiO0FBQ0E7QUFDQUgsU0FBU0ksSUFBVCxDQUFjQyxZQUFkLENBQTRCTixLQUE1QixFQUFtQ0MsU0FBU0ksSUFBVCxDQUFjRSxVQUFkLENBQTBCTixTQUFTSSxJQUFULENBQWNFLFVBQWQsQ0FBeUJDLE1BQXpCLEdBQWtDLENBQTVELEVBQWdFQyxXQUFuRzs7QUFFQSxNQUFNQyxXQUFXLElBQUlDLE1BQUosQ0FBVyxrQkFBWCxDQUFqQjs7QUFFQSxJQUFJQyxVQUFKO0FBQ0EsSUFBSUMsTUFBSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FB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LElBQUQsRUFBT21FLEdBQVAsS0FBZTtBQUNsQyxNQUFJLENBQUNBLEdBQUwsRUFDRUEsTUFBTUMsT0FBT0MsUUFBUCxDQUFnQnJHLElBQXRCO0FBQ0ZnQyxTQUFPQSxLQUFLc0UsT0FBTCxDQUFhLFNBQWIsRUFBd0IsTUFBeEIsQ0FBUDtBQUNBLFFBQU1DLFFBQVEsSUFBSUMsTUFBSixDQUFZLE9BQU14RSxJQUFLLG1CQUF2QixDQUFkO0FBQUEsUUFDRXlFLFVBQVVGLE1BQU1HLElBQU4sQ0FBV1AsR0FBWCxDQURaO0FBRUEsTUFBSSxDQUFDTSxPQUFMLEVBQ0UsT0FBTyxJQUFQO0FBQ0YsTUFBSSxDQUFDQSxRQUFRLENBQVIsQ0FBTCxFQUNFLE9BQU8sRUFBUDtBQUNGLFNBQU9FLG1CQUFtQkYsUUFBUSxDQUFSLEVBQVdILE9BQVgsQ0FBbUIsS0FBbkIsRUFBMEIsR0FBMUIsQ0FBbkIsQ0FBUDtBQUNELENBWEQ7O0FBYUE7OztBQUdBTSxXQUFXLE1BQUk7QUFDYmxHO0FBQ0QsQ0FGRCxFQUVFLEdBRkYiLCJmaWxlIjoicmVzdGF1cmFudF9pbmZvLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ3JlYXRlIExpbmsgRWxlbWVudCBmb3IgU3R5bGVzaGVldFxubGV0IG15Q1NTID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJsaW5rXCIgKTtcbm15Q1NTLnJlbCA9IFwic3R5bGVzaGVldFwiO1xubXlDU1MuaHJlZiA9IFwiL2Nzcy9sZWFmbGV0LmNzc1wiO1xuLy8gaW5zZXJ0IGl0IGF0IHRoZSBlbmQgb2YgdGhlIGhlYWQgaW4gYSBsZWdhY3ktZnJpZW5kbHkgbWFubmVyXG5kb2N1bWVudC5oZWFkLmluc2VydEJlZm9yZSggbXlDU1MsIGRvY3VtZW50LmhlYWQuY2hpbGROb2Rlc1sgZG9jdW1lbnQuaGVhZC5jaGlsZE5vZGVzLmxlbmd0aCAtIDEgXS5uZXh0U2libGluZyApOyBcblxuY29uc3QgZGJXb3JrZXIgPSBuZXcgV29ya2VyKCcuL2pzL2Rid29ya2VyLmpzJyk7XG5cbmxldCByZXN0YXVyYW50O1xudmFyIG5ld01hcDtcblxuLy8gLyoqXG4vLyAgKiBDaGVjayB0byBzZWUgaWYgc2VydmljZSB3b3JrZXIgaXMgc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyIFxuLy8gICovXG4vLyBpZiAoJ3NlcnZpY2VXb3JrZXInIGluIG5hdmlnYXRvcikge1xuICBcbi8vICAgLyogaWYgaXQgaXMsIHJlZ2lzdGVyIHRoZSBzZXJ2aWNlIHdvcmtlciAqL1xuLy8gICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWdpc3RlcignL3N3LmpzJykudGhlbihmdW5jdGlvbihyZXMpe1xuXG4vLyAgICAgLy8gQWxyZWFkeSBvbiB0aGUgbGF0ZXN0IHZlcnNpb24sIGJhaWxcbi8vICAgICBpZighbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuY29udHJvbGxlcil7XG4vLyAgICAgICByZXR1cm47XG4vLyAgICAgfVxuLy8gICAgIC8vIENoZWNrIHRvIHNlZSBpZiB0aGVyZSdzIGEgd2FpdGluZyBzZXJ2aWNlIHdvcmtlclxuLy8gICAgIGlmIChyZXMud2FpdGluZyl7XG4vLyAgICAgICBfdXBkYXRlUmVhZHkoKTtcbi8vICAgICAgIHJldHVybiBcbi8vICAgICB9XG5cbi8vICAgICBpZiAocmVzLmluc3RhbGxpbmcpIHtcbi8vICAgICAgIF90cmFja0luc3RhbGxpbmcocmVzLmluc3RhbGxpbmcpO1xuLy8gICAgICAgcmV0dXJuO1xuLy8gICAgIH1cbiAgICBcbi8vICAgICByZXMuYWRkRXZlbnRMaXN0ZW5lcigndXBkYXRlZm91bmQnLCBmdW5jdGlvbigpIHtcbi8vICAgICAgIF90cmFja0luc3RhbGxpbmcocmVzLmluc3RhbGxpbmcpO1xuLy8gICAgIH0pO1xuICAgIFxuLy8gICB9KS5jYXRjaChmdW5jdGlvbihlcnJvcil7XG4vLyAgICAgY29uc29sZS5sb2coJ2Vycm9yIHJlZ2lzdGVyaW5nIHNlcnZpY2Ugd29ya2VyOiAnLGVycm9yKVxuLy8gICB9KTtcbiAgXG4vLyAgIGZ1bmN0aW9uIF90cmFja0luc3RhbGxpbmcod29ya2VyKXtcbi8vICAgICB3b3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignc3RhdGVjaGFuZ2UnLGZ1bmN0aW9uKCl7XG4vLyAgICAgICBpZiAod29ya2VyLnN0YXRlID09ICdpbnN0YWxsZWQnKXtcbi8vICAgICAgICAgX3VwZGF0ZVJlYWR5KHdvcmtlcik7XG4vLyAgICAgICB9XG4vLyAgICAgfSlcbi8vICAgfVxuXG4vLyAgIHZhciBmb2N1c2VkRWxlbWVudDtcbi8vICAgLyoqXG4vLyAgICAqIE5vdGlmaWVzIHRoZSB1c2VyIHRoYXQgYW4gdXBkYXRlZCBTVyBpcyBhdmFpbGFibGVcbi8vICAgICovXG4vLyAgIGZ1bmN0aW9uIF91cGRhdGVSZWFkeSh3b3JrZXIpe1xuLy8gICAgIC8vIElmIHRoZSB1c2VyIGNsaWNrcyBvbiB0aGUgdXBkYXRlIGJ1dHRvbiwgdXBkYXRlIHRoZSBzZXJ2aWNlIHdvcmtlclxuLy8gICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1cGRhdGUtdmVyc2lvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxmdW5jdGlvbigpe1xuLy8gICAgICAgd29ya2VyLnBvc3RNZXNzYWdlKHthY3Rpb246J3NraXBXYWl0aW5nJ30pO1xuLy8gICAgIH0pO1xuLy8gICAgIC8vIElmIHRoZSB1c2VyIGNsaWNrcyB0aGUgZGlzbWlzcyBidXR0b24sIGhpZGUgdGhlIHRvYXN0XG4vLyAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rpc21pc3MtdmVyc2lvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxmdW5jdGlvbigpe1xuLy8gICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RvYXN0JykuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4vLyAgICAgICBmb2N1c2VkRWxlbWVudC5mb2N1cygpXG4vLyAgICAgfSk7XG4vLyAgICAgLy8gSWYgdGhlIHRvYXN0IGlzIGRpc3BsYXlpbmcsIGxpc3RlbiBmb3Iga2V5Ym9hcmQgZXZlbnRzXG4vLyAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RvYXN0JykuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsZnVuY3Rpb24oZSl7XG4vLyAgICAgICAvL0NoZWNrIGZvciBUYWIga2V5IHByZXNzXG4vLyAgICAgICBpZihlLmtleUNvZGUgPT09IDkpe1xuICAgICAgICBcbi8vICAgICAgICAgaWYgKGUuc2hpZnRLZXkpIHtcbi8vICAgICAgICAgICAvL1ByZXNzZWQgU2hpZnQgVGFiXG4vLyAgICAgICAgICAgaWYoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gZmlyc3RUYWJTdG9wKSB7XG4vLyAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4vLyAgICAgICAgICAgICBsYXN0VGFiU3RvcC5mb2N1cygpO1xuLy8gICAgICAgICAgIH1cbi8vICAgICAgICAgfWVsc2V7XG4vLyAgICAgICAgICAgLy9QcmVzc2VkIFRhYlxuLy8gICAgICAgICAgIGlmKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IGxhc3RUYWJTdG9wKSB7XG4vLyAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4vLyAgICAgICAgICAgICBmaXJzdFRhYlN0b3AuZm9jdXMoKTtcbi8vICAgICAgICAgICB9XG4vLyAgICAgICAgIH1cbi8vICAgICAgIH1cbi8vICAgICAgIC8vIEVzY2FwZSBLZXlcbi8vICAgICAgIGlmIChlLmtleUNvZGUgPT09IDI3KXtcbi8vICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RvYXN0JykuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4vLyAgICAgICAgIGZvY3VzZWRFbGVtZW50LmZvY3VzKClcbi8vICAgICAgIH0gXG4vLyAgICAgfSk7XG5cbi8vICAgICAvLyBSZW1lbWJlciB3aGF0IHRoZSBsYXN0IGVsZW1lbnQgdGhhdCB3YXMgZm9jdXNlZCB3YXMsIGFuZCBtYWtlIGl0IGZvY3VzYWJsZSBzbyB3ZSBjYW4gcmV0dXJuIHRvIGl0XG4vLyAgICAgZm9jdXNlZEVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuLy8gICAgIGZvY3VzZWRFbGVtZW50LnRhYmluZGV4ID0gMTtcbiAgIFxuLy8gICAgIC8vIFdoZW4gdGhlIHRvYXN0IGlzIHZpc2libGUsIHRoaXMgaXMgd2hhdCB3ZSdsbCB1c2UgdG8gdGVtcG9yYXJpbHkgdHJhcCBmb2N1c1xuLy8gICAgIHZhciBmb2N1c2FibGVFbGVtZW50c1N0cmluZyA9ICcjdG9hc3QgcCwgI3VwZGF0ZS12ZXJzaW9uLCAjZGlzbWlzcy12ZXJzaW9uJztcbi8vICAgICB2YXIgZm9jdXNhYmxlRWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGZvY3VzYWJsZUVsZW1lbnRzU3RyaW5nKTtcbi8vICAgICBmb2N1c2FibGVFbGVtZW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZvY3VzYWJsZUVsZW1lbnRzKTtcbiAgICBcbi8vICAgICB2YXIgZmlyc3RUYWJTdG9wID0gZm9jdXNhYmxlRWxlbWVudHNbMF07XG4vLyAgICAgdmFyIGxhc3RUYWJTdG9wID0gZm9jdXNhYmxlRWxlbWVudHNbZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoIC0xXTtcblxuLy8gICAgIC8vIE9rIHRpbWUgdG8gc2hvdyB0aGUgdG9hc3QgYW5kIGZvY3VzIG9uIGl0XG4vLyAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RvYXN0JykuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4vLyAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3RvYXN0IHAnKS5mb2N1cygpO1xuXG4vLyAgIH1cbiAgXG5cbi8vICAgLyoqXG4vLyAgICAqIExpc3RlbnMgZm9yIGEgY2hhbmdlIGluIHRoZSBTVywgcmVsb2FkcyB0aGUgcGFnZSBhcyBhIHJlc3VsdFxuLy8gICAgKi9cbi8vICAgdmFyIHJlZnJlc2hpbmc7XG4vLyAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRyb2xsZXJjaGFuZ2UnLCBmdW5jdGlvbigpIHtcbi8vICAgICBjb25zb2xlLmxvZygnY29udHJvbGxlciBjaGFuZ2UnKVxuLy8gICAgIGlmIChyZWZyZXNoaW5nKSByZXR1cm47XG4vLyAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuLy8gICAgIHJlZnJlc2hpbmcgPSB0cnVlO1xuLy8gICB9KTtcbi8vIH1cbiAgXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIGxlYWZsZXQgbWFwXG4gICAqL1xuICBpbml0TWFwID0gKCkgPT4ge1xuICAvLyBjb25zdCBpZCA9IGdldFBhcmFtZXRlckJ5TmFtZSgnaWQnKTtcbiAgLy8gZGJXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uKGUpIHtcbiAgLy8gICBpZiAoZS5kYXRhID09ICdlcnJvcicpIHsgLy8gR290IGFuIGVycm9yXG4gIC8vICAgICBjb25zb2xlLmVycm9yKGUuZGF0YSk7XG4gIC8vICAgfSBlbHNlIHtcbiAgLy8gICAgIHNlbGYubmV3TWFwID0gTC5tYXAoJ21hcCcsIHtcbiAgLy8gICAgICAgY2VudGVyOiBbZS5kYXRhLnJlc3RhdXJhbnQubGF0bG5nLmxhdCwgZS5kYXRhLnJlc3RhdXJhbnQubGF0bG5nLmxuZ10sXG4gIC8vICAgICAgIHpvb206IDE2LFxuICAvLyAgICAgICBzY3JvbGxXaGVlbFpvb206IGZhbHNlXG4gIC8vICAgICB9KTtcbiAgLy8gICAgIEwudGlsZUxheWVyKCdodHRwczovL2FwaS50aWxlcy5tYXBib3guY29tL3Y0L3tpZH0ve3p9L3t4fS97eX0uanBnNzA/YWNjZXNzX3Rva2VuPXttYXBib3hUb2tlbn0nLCB7XG4gIC8vICAgICAgIG1hcGJveFRva2VuOiAncGsuZXlKMUlqb2labUZ5Y21Wc2JITmpjbWx3ZENJc0ltRWlPaUpqYW1KaWFUbDNkSE14T0d4c016SndaVGxtWW5ONFpITjVJbjAuNkV5NTBlbDBhdHdqRHlnT19jTzBzQScsXG4gIC8vICAgICAgIG1heFpvb206IDE4LFxuICAvLyAgICAgICBhdHRyaWJ1dGlvbjogJ01hcCBkYXRhICZjb3B5OyA8YSBocmVmPVwiaHR0cHM6Ly93d3cub3BlbnN0cmVldG1hcC5vcmcvXCI+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzLCAnICtcbiAgLy8gICAgICAgICAnPGEgaHJlZj1cImh0dHBzOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9ieS1zYS8yLjAvXCI+Q0MtQlktU0E8L2E+LCAnICtcbiAgLy8gICAgICAgICAnSW1hZ2VyeSDCqSA8YSBocmVmPVwiaHR0cHM6Ly93d3cubWFwYm94LmNvbS9cIj5NYXBib3g8L2E+JyxcbiAgLy8gICAgICAgaWQ6ICdtYXBib3guc3RyZWV0cycgICAgXG4gIC8vICAgICB9KS5hZGRUbyhuZXdNYXApO1xuICAvLyAgICAgbWFwTWFya2VyRm9yUmVzdGF1cmFudChlLmRhdGEucmVzdGF1cmFudCwgc2VsZi5uZXdNYXApO1xuICAvLyAgIH1cbiAgLy8gfSwgZmFsc2UpO1xuICAvLyBkYldvcmtlci5wb3N0TWVzc2FnZSh7YWN0aW9uOidmZXRjaFJlc3RhdXJhbnRCeUlkJywgaWR9KTtcblxuXG4gIGZldGNoUmVzdGF1cmFudEZyb21VUkwoKGVycm9yLCByZXN0YXVyYW50KSA9PiB7XG4gICAgaWYgKGVycm9yKSB7IC8vIEdvdCBhbiBlcnJvciFcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgIH0gZWxzZSB7ICAgICAgXG4gICAgICBzZWxmLm5ld01hcCA9IEwubWFwKCdtYXAnLCB7XG4gICAgICAgIGNlbnRlcjogW3Jlc3RhdXJhbnQubGF0bG5nLmxhdCwgcmVzdGF1cmFudC5sYXRsbmcubG5nXSxcbiAgICAgICAgem9vbTogMTYsXG4gICAgICAgIHNjcm9sbFdoZWVsWm9vbTogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgTC50aWxlTGF5ZXIoJ2h0dHBzOi8vYXBpLnRpbGVzLm1hcGJveC5jb20vdjQve2lkfS97en0ve3h9L3t5fS5qcGc3MD9hY2Nlc3NfdG9rZW49e21hcGJveFRva2VufScsIHtcbiAgICAgICAgbWFwYm94VG9rZW46ICdway5leUoxSWpvaVptRnljbVZzYkhOamNtbHdkQ0lzSW1FaU9pSmphbUppYVRsM2RITXhPR3hzTXpKd1pUbG1Zbk40WkhONUluMC42RXk1MGVsMGF0d2pEeWdPX2NPMHNBJyxcbiAgICAgICAgbWF4Wm9vbTogMTgsXG4gICAgICAgIGF0dHJpYnV0aW9uOiAnTWFwIGRhdGEgJmNvcHk7IDxhIGhyZWY9XCJodHRwczovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9cIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnMsICcgK1xuICAgICAgICAgICc8YSBocmVmPVwiaHR0cHM6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LXNhLzIuMC9cIj5DQy1CWS1TQTwvYT4sICcgK1xuICAgICAgICAgICdJbWFnZXJ5IMKpIDxhIGhyZWY9XCJodHRwczovL3d3dy5tYXBib3guY29tL1wiPk1hcGJveDwvYT4nLFxuICAgICAgICBpZDogJ21hcGJveC5zdHJlZXRzJyAgICBcbiAgICAgIH0pLmFkZFRvKG5ld01hcCk7XG4gICAgICBtYXBNYXJrZXJGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQsIHNlbGYubmV3TWFwKTtcbiAgICB9XG4gIH0pO1xuICB9ICBcblxuICAvKipcbiAgICogR2V0IHRoZSBtYXAgbWFya2VyIGZvciB0aGUgcmVzdGF1cmFudFxuICAgKi9cbiAgbWFwTWFya2VyRm9yUmVzdGF1cmFudCA9IChyZXN0YXVyYW50LCBtYXApPT57XG4gICAgLy8gaHR0cHM6Ly9sZWFmbGV0anMuY29tL3JlZmVyZW5jZS0xLjMuMC5odG1sI21hcmtlciAgXG4gICAgY29uc3QgbWFya2VyID0gbmV3IEwubWFya2VyKFtyZXN0YXVyYW50LmxhdGxuZy5sYXQsIHJlc3RhdXJhbnQubGF0bG5nLmxuZ10sXG4gICAgICB7dGl0bGU6IHJlc3RhdXJhbnQubmFtZSxcbiAgICAgIGFsdDogcmVzdGF1cmFudC5uYW1lXG4gICAgICB9KTtcbiAgICAgIG1hcmtlci5hZGRUbyhuZXdNYXApO1xuICAgIHJldHVybiBtYXJrZXI7XG4gIH0gXG5cbi8qKlxuICogR2V0IGN1cnJlbnQgcmVzdGF1cmFudCBmcm9tIHBhZ2UgVVJMLlxuICovXG5mZXRjaFJlc3RhdXJhbnRGcm9tVVJMID0gKGNhbGxiYWNrKSA9PiB7XG4gIGlmIChzZWxmLnJlc3RhdXJhbnQpIHsgLy8gcmVzdGF1cmFudCBhbHJlYWR5IGZldGNoZWQhXG4gICAgY2FsbGJhY2sobnVsbCwgc2VsZi5yZXN0YXVyYW50KVxuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBpZCA9IGdldFBhcmFtZXRlckJ5TmFtZSgnaWQnKTtcbiAgaWYgKCFpZCkgeyAvLyBubyBpZCBmb3VuZCBpbiBVUkxcbiAgICBlcnJvciA9ICdObyByZXN0YXVyYW50IGlkIGluIFVSTCdcbiAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XG4gIH0gZWxzZSB7XG4gICAgLy8gREJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50QnlJZChpZCwgKGVycm9yLCByZXN0YXVyYW50KSA9PiB7XG4gICAgLy8gICBzZWxmLnJlc3RhdXJhbnQgPSByZXN0YXVyYW50O1xuICAgIC8vICAgaWYgKCFyZXN0YXVyYW50KSB7XG4gICAgLy8gICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgIC8vICAgICByZXR1cm47XG4gICAgLy8gICB9XG4gICAgLy8gICBmaWxsUmVzdGF1cmFudEhUTUwoKTtcbiAgICAvLyAgIGNhbGxiYWNrKG51bGwsIHJlc3RhdXJhbnQpXG4gICAgLy8gfSk7XG4gICAgLy8gQ29tbWVudFxuICAgIGRiV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbihlKSB7XG4gICAgICBpZiAoZS5kYXRhID09ICdlcnJvcicpIHsgLy8gR290IGFuIGVycm9yXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZS5kYXRhKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdnb3QgYmFjazogJyxlLmRhdGEucmVzdGF1cmFudClcbiAgICAgICAgaWYoZS5kYXRhLnJlc3RhdXJhbnQpe1xuICAgICAgICAgIGZpbGxSZXN0YXVyYW50SFRNTChlLmRhdGEucmVzdGF1cmFudCk7XG4gICAgICAgICAgY2FsbGJhY2sobnVsbCwgZS5kYXRhLnJlc3RhdXJhbnQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgZmFsc2UpO1xuICAgIGRiV29ya2VyLnBvc3RNZXNzYWdlKHthY3Rpb246J2ZldGNoUmVzdGF1cmFudEJ5SWQnLCBpZH0pO1xuICAgIH0gICAgXG59XG5cbi8qKlxuICogQ3JlYXRlIHJlc3RhdXJhbnQgSFRNTCBhbmQgYWRkIGl0IHRvIHRoZSB3ZWJwYWdlXG4gKi9cbmZpbGxSZXN0YXVyYW50SFRNTCA9IChyZXN0YXVyYW50KSA9PiB7XG4gIGNvbnNvbGUubG9nKCdyZXN0YXVyYW50JyxyZXN0YXVyYW50KVxuICBjb25zdCBuYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnQtbmFtZScpO1xuICBuYW1lLmlubmVySFRNTCA9IHJlc3RhdXJhbnQubmFtZTtcblxuICAvLyBSZXZpZXcgb2YgdGhlIHJlc3RhdXJhbnRcbiAgY29uc3QgcmF0aW5nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3JhdGluZycpO1xuICBjb25zdCBlbXB0eVN0YXJzID0gNSAtIERCSGVscGVyLnJhdGluZ0ZvclJlc3RhdXJhbnQocmVzdGF1cmFudCk7XG4gIGZvcihsZXQgaT0wOyBpIDwgREJIZWxwZXIucmF0aW5nRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KTsgaSsrKXtcbiAgICBjb25zdCBmdWxsc3RhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGZ1bGxzdGFyLmNsYXNzTmFtZT1cInJlc3RhdXJhbnRfX3N0YXIgcmVzdGF1cmFudF9fc3Rhci0tZnVsbFwiO1xuICAgIGZ1bGxzdGFyLnNyYyA9IFwiL2ltZy9mdWxsc3Rhci5zdmdcIjtcbiAgICBmdWxsc3Rhci5hbHQgPSBcIlwiXG4gICAgcmF0aW5nLmFwcGVuZChmdWxsc3Rhcik7XG4gIH1cbiAgZm9yKGxldCBpPTA7IGkgPCBlbXB0eVN0YXJzOyBpKyspe1xuICAgIGNvbnN0IGVtcHR5c3RhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGVtcHR5c3Rhci5jbGFzc05hbWU9XCJyZXN0YXVyYW50X19zdGFyIHJlc3RhdXJhbnRfX3N0YXItLWVtcHR5XCI7XG4gICAgZW1wdHlzdGFyLnNyYyA9IFwiL2ltZy9lbXB0eXN0YXIuc3ZnXCI7XG4gICAgZW1wdHlzdGFyLmFsdD0gXCJcIlxuICAgIHJhdGluZy5hcHBlbmQoZW1wdHlzdGFyKTtcbiAgfVxuXG4gIGNvbnN0IGFkZHJlc3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGF1cmFudC1hZGRyZXNzJyk7XG4gIGFkZHJlc3MuaW5uZXJIVE1MID0gcmVzdGF1cmFudC5hZGRyZXNzO1xuXG4gIGNvbnN0IGFkZHJlc3NpY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gIGFkZHJlc3NpY29uLmNsYXNzTmFtZSA9ICdyZXN0YXVyYW50ZGV0YWlsX19pY29uJztcbiAgYWRkcmVzc2ljb24uc3JjID0gJy9pbWcvd2F5cG9pbnQuc3ZnJztcbiAgYWRkcmVzc2ljb24uYWx0ID0gJyc7XG4gIGFkZHJlc3MucHJlcGVuZChhZGRyZXNzaWNvbilcblxuICBjb25zdCBpbWFnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50LWltZycpO1xuICBpbWFnZS5jbGFzc05hbWUgPSAncmVzdGF1cmFudC1pbWcnXG4gIGltYWdlLnNyYyA9IERCSGVscGVyLmltYWdlVXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KTtcbiAgaW1hZ2UuYWx0ID0gREJIZWxwZXIuaW1hZ2VUZXh0Rm9yUmVzdGF1cmFudChyZXN0YXVyYW50KTtcbiAgaW1hZ2Uuc3Jjc2V0ID0gREJIZWxwZXIuaW1hZ2VTcmNTZXRGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpO1xuXG4gIGNvbnN0IGN1aXNpbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGF1cmFudC1jdWlzaW5lJyk7XG4gIGN1aXNpbmUuaW5uZXJIVE1MID0gcmVzdGF1cmFudC5jdWlzaW5lX3R5cGU7XG5cbiAgY29uc3QgY3Vpc2luZWljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgY3Vpc2luZWljb24uY2xhc3NOYW1lID0gJ3Jlc3RhdXJhbnRkZXRhaWxfX2ljb24nO1xuICBjdWlzaW5laWNvbi5zcmMgPSAnL2ltZy9jdWlzaW5lLnN2Zyc7XG4gIGN1aXNpbmVpY29uLmFsdCA9ICcnO1xuICBjdWlzaW5lLnByZXBlbmQoY3Vpc2luZWljb24pXG5cbiAgLy8gZmlsbCBvcGVyYXRpbmcgaG91cnNcbiAgaWYgKHJlc3RhdXJhbnQub3BlcmF0aW5nX2hvdXJzKSB7XG4gICAgZmlsbFJlc3RhdXJhbnRIb3Vyc0hUTUwocmVzdGF1cmFudC5vcGVyYXRpbmdfaG91cnMpO1xuXG4gICAgY29uc3QgaG91cnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGF1cmFudGRldGFpbF9faG91cnNjb250YWluZXInKTtcbiAgXG4gICAgY29uc3QgaG91cnNpY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgaG91cnNpY29uLmNsYXNzTmFtZSA9ICdyZXN0YXVyYW50ZGV0YWlsX19pY29uJztcbiAgICBob3Vyc2ljb24uc3JjID0gJy9pbWcvY2xvY2suc3ZnJztcbiAgICBob3Vyc2ljb24uYWx0ID0gJyc7XG4gICAgaG91cnMucHJlcGVuZChob3Vyc2ljb24pXG5cbiAgfVxuICAvLyBmaWxsIHJldmlld3NcbiAgXG4gIGRiV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbihlKSB7XG4gICAgaWYgKGUuZGF0YSA9PSAnZXJyb3InKSB7IC8vIEdvdCBhbiBlcnJvclxuICAgICAgY29uc29sZS5lcnJvcihlLmRhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnZ290IGJhY2s6ICcsZS5kYXRhLnJldmlld3MpXG4gICAgICBmaWxsUmV2aWV3c0hUTUwoZS5kYXRhLnJldmlld3MpO1xuICAgIH1cbiAgfSwgZmFsc2UpO1xuICBkYldvcmtlci5wb3N0TWVzc2FnZSh7YWN0aW9uOidmaWxsUmV2aWV3c0hUTUwnLCBpZDpyZXN0YXVyYW50LmlkfSk7XG59XG5cbi8qKlxuICogQ3JlYXRlIHJlc3RhdXJhbnQgb3BlcmF0aW5nIGhvdXJzIEhUTUwgdGFibGUgYW5kIGFkZCBpdCB0byB0aGUgd2VicGFnZS5cbiAqL1xuZmlsbFJlc3RhdXJhbnRIb3Vyc0hUTUwgPSAob3BlcmF0aW5nSG91cnMpID0+IHtcbiAgY29uc3QgaG91cnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdGF1cmFudC1ob3VycycpO1xuICBmb3IgKGxldCBrZXkgaW4gb3BlcmF0aW5nSG91cnMpIHtcbiAgICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0cicpO1xuXG4gICAgY29uc3QgZGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcbiAgICBkYXkuY2xhc3NOYW1lID0gJ3Jlc3RhdXJhbnRkZXRhaWxfX2RheSc7XG4gICAgZGF5LmlubmVySFRNTCA9IGtleTtcbiAgICByb3cuYXBwZW5kQ2hpbGQoZGF5KTtcblxuICAgIGNvbnN0IHRpbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpO1xuICAgIHRpbWUuY2xhc3NOYW1lID0gJ3Jlc3RhdXJhbnRkZXRhaWxfX2hvdXInO1xuICAgIHRpbWUuaW5uZXJIVE1MID0gb3BlcmF0aW5nSG91cnNba2V5XTtcbiAgICByb3cuYXBwZW5kQ2hpbGQodGltZSk7XG5cbiAgICBob3Vycy5hcHBlbmRDaGlsZChyb3cpO1xuICB9XG59XG5cbi8qKlxuICogQ3JlYXRlIGFsbCByZXZpZXdzIEhUTUwgYW5kIGFkZCB0aGVtIHRvIHRoZSB3ZWJwYWdlLlxuICovXG5maWxsUmV2aWV3c0hUTUwgPSAocmV2aWV3cykgPT4ge1xuICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmV2aWV3cy1jb250YWluZXInKTtcbiAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMycpO1xuICB0aXRsZS5pbm5lckhUTUwgPSAnUmV2aWV3cyc7XG4gIHRpdGxlLmNsYXNzTmFtZSA9ICdyZXN0YXVyYW50ZGV0YWlsX19yZXZpZXdzdGl0bGUnO1xuICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGl0bGUpO1xuXG4gIGlmICghcmV2aWV3cykge1xuICAgIGNvbnN0IG5vUmV2aWV3cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICBub1Jldmlld3MuaW5uZXJIVE1MID0gJ05vIHJldmlld3MgeWV0ISc7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKG5vUmV2aWV3cyk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IHVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jldmlld3MtbGlzdCcpO1xuICByZXZpZXdzLmZvckVhY2gocmV2aWV3ID0+IHtcbiAgICB1bC5hcHBlbmRDaGlsZChjcmVhdGVSZXZpZXdIVE1MKHJldmlldykpO1xuICB9KTtcbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKHVsKTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgcmV2aWV3IEhUTUwgYW5kIGFkZCBpdCB0byB0aGUgd2VicGFnZS5cbiAqL1xuY3JlYXRlUmV2aWV3SFRNTCA9IChyZXZpZXcpID0+IHtcbiAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICBsaS5jbGFzc05hbWUgPSAncmVzdGF1cmFudGRldGFpbF9fcmV2aWV3JztcbiAgY29uc3QgY29tbWVudEhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb21tZW50SGVhZGVyLmNsYXNzTmFtZSA9ICdyZXN0YXVyYW50ZGV0YWlsX19jb21tZW50aGVhZGVyJztcblxuICBjb25zdCBsZWZ0ZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGxlZnRkaXYuY2xhc3NOYW1lID0gJ3Jlc3RhdXJhbnRkZXRhaWxfX2F2YXRhcmNvbnRhaW5lcic7XG5cbiAgY29uc3QgYXZhdGFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gIGF2YXRhci5zcmMgID0gJy9pbWcvYXZhdGFyLnN2Zyc7XG4gIGF2YXRhci5jbGFzc05hbWUgPSAncmVzdGF1cmFudGRldGFpbF9fYXZhdGFyJztcbiAgYXZhdGFyLmFsdCA9ICdBdmF0YXIgcGhvdG8nO1xuICBsZWZ0ZGl2LmFwcGVuZENoaWxkKGF2YXRhcik7XG4gIGNvbW1lbnRIZWFkZXIuYXBwZW5kQ2hpbGQobGVmdGRpdik7XG5cbiAgY29uc3QgcmlnaHRkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgcmlnaHRkaXYuY2xhc3NOYW1lID0gJ3Jlc3RhdXJhbnRkZXRhaWxfX25hbWVjb250YWluZXInO1xuXG4gIGNvbnN0IG5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gIG5hbWUuaW5uZXJIVE1MID0gcmV2aWV3Lm5hbWU7XG4gIHJpZ2h0ZGl2LmFwcGVuZENoaWxkKG5hbWUpO1xuICBcbiAgLy8gQ3JlYXRlIFN0YXJzIGZvciBSZXZpZXdcbiAgY29uc3QgaW5kaXZpZHVhbHJhdGluZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgaW5kaXZpZHVhbHJhdGluZy5jbGFzc05hbWUgPSAncmVzdGF1cmFudGRldGFpbF9faW5kaXZpZHVhbHJldmlld3JhdGluZyc7XG4gIGNvbnN0IGVtcHR5U3RhcnMgPSA1IC0gcGFyc2VJbnQocmV2aWV3LnJhdGluZyk7XG4gIGZvcihsZXQgaT0wOyBpIDwgcmV2aWV3LnJhdGluZzsgaSsrKXtcbiAgICBjb25zdCBmdWxsc3RhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGZ1bGxzdGFyLmNsYXNzTmFtZT1cInJlc3RhdXJhbnRfX3N0YXIgcmVzdGF1cmFudF9fc3Rhci0tZnVsbFwiO1xuICAgIGZ1bGxzdGFyLnNyYyA9IFwiL2ltZy9mdWxsc3Rhci5zdmdcIjtcbiAgICBmdWxsc3Rhci5hbHQgPSBcIlwiXG4gICAgaW5kaXZpZHVhbHJhdGluZy5hcHBlbmQoZnVsbHN0YXIpO1xuICB9XG4gIGZvcihsZXQgaT0wOyBpIDwgZW1wdHlTdGFyczsgaSsrKXtcbiAgICBjb25zdCBlbXB0eXN0YXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBlbXB0eXN0YXIuY2xhc3NOYW1lPVwicmVzdGF1cmFudF9fc3RhciByZXN0YXVyYW50X19zdGFyLS1lbXB0eVwiO1xuICAgIGVtcHR5c3Rhci5zcmMgPSBcIi9pbWcvZW1wdHlzdGFyLnN2Z1wiO1xuICAgIGVtcHR5c3Rhci5hbHQ9IFwiXCJcbiAgICBpbmRpdmlkdWFscmF0aW5nLmFwcGVuZChlbXB0eXN0YXIpO1xuICB9XG5cbiAgcmlnaHRkaXYuYXBwZW5kQ2hpbGQoaW5kaXZpZHVhbHJhdGluZyk7XG4gIGNvbnN0IGRhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gIGRhdGUuY2xhc3NOYW1lID0gJ3Jlc3RhdXJhbnRkZXRhaWxfX3Jldmlld2RhdGUnXG4gIGNvbnN0IHJldmlld2RhdGUgPSBuZXcgRGF0ZShyZXZpZXcuZGF0ZSk7XG4gIGNvbnN0IHRvZGF5ZGF0ZSA9IG5ldyBEYXRlKCk7XG4gIC8vIFN1YnRyYWN0IHRvZGF5cyBkYXRlIGZyb20gdGhlIGRhdGUgb2YgdGhlIHJldmlldywgdGhlbiBmb3JtYXQgaW50byBkYXlzXG4gIGNvbnN0IGRheXNkaWZmZXJlbmNlID0gTWF0aC5yb3VuZCgodG9kYXlkYXRlIC0gcmV2aWV3ZGF0ZSkvMTAwMC82MC82MC8yNClcbiAgZGF0ZS5pbm5lckhUTUwgPSBgJHtkYXlzZGlmZmVyZW5jZX0gYWdvYDtcbiAgcmlnaHRkaXYuYXBwZW5kQ2hpbGQoZGF0ZSk7XG5cbiAgY29tbWVudEhlYWRlci5hcHBlbmRDaGlsZChyaWdodGRpdik7IFxuICBsaS5hcHBlbmRDaGlsZChjb21tZW50SGVhZGVyKTtcblxuICBjb25zdCBjb21tZW50cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgY29tbWVudHMuaW5uZXJIVE1MID0gcmV2aWV3LmNvbW1lbnRzO1xuICBsaS5hcHBlbmRDaGlsZChjb21tZW50cyk7XG5cbiAgcmV0dXJuIGxpO1xufVxuXG4vKipcbiAqIEdldCBhIHBhcmFtZXRlciBieSBuYW1lIGZyb20gcGFnZSBVUkwuXG4gKi9cbmdldFBhcmFtZXRlckJ5TmFtZSA9IChuYW1lLCB1cmwpID0+IHtcbiAgaWYgKCF1cmwpXG4gICAgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gIG5hbWUgPSBuYW1lLnJlcGxhY2UoL1tcXFtcXF1dL2csICdcXFxcJCYnKTtcbiAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKGBbPyZdJHtuYW1lfSg9KFteJiNdKil8JnwjfCQpYCksXG4gICAgcmVzdWx0cyA9IHJlZ2V4LmV4ZWModXJsKTtcbiAgaWYgKCFyZXN1bHRzKVxuICAgIHJldHVybiBudWxsO1xuICBpZiAoIXJlc3VsdHNbMl0pXG4gICAgcmV0dXJuICcnO1xuICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdHNbMl0ucmVwbGFjZSgvXFwrL2csICcgJykpO1xufVxuXG4vKipcbiAgKiBJbml0aWFsaXplIG1hcCBhcyBzb29uIGFzIHRoZSBwYWdlIGlzIGxvYWRlZC5cbiAqL1xuc2V0VGltZW91dCgoKT0+e1xuICBpbml0TWFwKCk7XG59LDEwMCkgXG4gICJdfQ==
