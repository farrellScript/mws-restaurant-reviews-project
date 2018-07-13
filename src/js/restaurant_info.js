// Create Link Element for Stylesheet
let myCSS = document.createElement( "link" );
myCSS.rel = "stylesheet";
myCSS.href = "/css/leaflet.css";
// insert it at the end of the head in a legacy-friendly manner
document.head.insertBefore( myCSS, document.head.childNodes[ document.head.childNodes.length - 1 ].nextSibling ); 

let restaurant;
var newMap;

/**
 * Check to see if service worker is supported by the browser 
 */
if ('serviceWorker' in navigator) {
  
  /* if it is, register the service worker */
  navigator.serviceWorker.register('/sw.js').then(function(res){

    // Already on the latest version, bail
    if(!navigator.serviceWorker.controller){
      return;
    }
    // Check to see if there's a waiting service worker
    if (res.waiting){
      _updateReady();
      return 
    }

    if (res.installing) {
      _trackInstalling(res.installing);
      return;
    }
    
    res.addEventListener('updatefound', function() {
      _trackInstalling(res.installing);
    });
    
  }).catch(function(error){
    console.log('error registering service worker: ',error)
  });
  
  function _trackInstalling(worker){
    worker.addEventListener('statechange',function(){
      if (worker.state == 'installed'){
        _updateReady(worker);
      }
    })
  }

  var focusedElement;
  /**
   * Notifies the user that an updated SW is available
   */
  function _updateReady(worker){
    // If the user clicks on the update button, update the service worker
    document.getElementById('update-version').addEventListener('click',function(){
      worker.postMessage({action:'skipWaiting'});
    });
    // If the user clicks the dismiss button, hide the toast
    document.getElementById('dismiss-version').addEventListener('click',function(){
      document.getElementById('toast').classList.remove('active');
      focusedElement.focus()
    });
    // If the toast is displaying, listen for keyboard events
    document.getElementById('toast').addEventListener('keydown',function(e){
      //Check for Tab key press
      if(e.keyCode === 9){
        
        if (e.shiftKey) {
          //Pressed Shift Tab
          if(document.activeElement === firstTabStop) {
            e.preventDefault();
            lastTabStop.focus();
          }
        }else{
          //Pressed Tab
          if(document.activeElement === lastTabStop) {
            e.preventDefault();
            firstTabStop.focus();
          }
        }
      }
      // Escape Key
      if (e.keyCode === 27){
        document.getElementById('toast').classList.remove('active');
        focusedElement.focus()
      } 
    });

    // Remember what the last element that was focused was, and make it focusable so we can return to it
    focusedElement = document.activeElement;
    focusedElement.tabindex = 1;
   
    // When the toast is visible, this is what we'll use to temporarily trap focus
    var focusableElementsString = '#toast p, #update-version, #dismiss-version';
    var focusableElements = document.querySelectorAll(focusableElementsString);
    focusableElements = Array.prototype.slice.call(focusableElements);
    
    var firstTabStop = focusableElements[0];
    var lastTabStop = focusableElements[focusableElements.length -1];

    // Ok time to show the toast and focus on it
    document.getElementById('toast').classList.add('active');
    document.querySelector('#toast p').focus();

  }
  

  /**
   * Listens for a change in the SW, reloads the page as a result
   */
  var refreshing;
  navigator.serviceWorker.addEventListener('controllerchange', function() {
    console.log('controller change')
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
  });
}



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

  // Review of the restaurant
  const rating = document.getElementById('rating');
  const emptyStars = 5 - DBHelper.ratingForRestaurant(restaurant);
  for(let i=0; i < DBHelper.ratingForRestaurant(restaurant); i++){
    const fullstar = document.createElement('img');
    fullstar.className="restaurant__star restaurant__star--full";
    fullstar.src = "/img/fullstar.svg";
    fullstar.alt = ""
    rating.append(fullstar);
  }
  for(let i=0; i < emptyStars; i++){
    const emptystar = document.createElement('img');
    emptystar.className="restaurant__star restaurant__star--empty";
    emptystar.src = "/img/emptystar.svg";
    emptystar.alt= ""
    rating.append(emptystar);
  }

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const addressicon = document.createElement('img');
  addressicon.className = 'restaurantdetail__icon';
  addressicon.src = '/img/waypoint.svg';
  addressicon.alt = '';
  address.prepend(addressicon)

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img'
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.alt = DBHelper.imageTextForRestaurant(restaurant);
  image.srcset = DBHelper.imageSrcSetForRestaurant(restaurant);

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  const cuisineicon = document.createElement('img');
  cuisineicon.className = 'restaurantdetail__icon';
  cuisineicon.src = '/img/cuisine.svg';
  cuisineicon.alt = '';
  cuisine.prepend(cuisineicon)

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();

    const hours = document.getElementById('restaurantdetail__hourscontainer');
  
    const hoursicon = document.createElement('img');
    hoursicon.className = 'restaurantdetail__icon';
    hoursicon.src = '/img/clock.svg';
    hoursicon.alt = '';
    hours.prepend(hoursicon)

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
    day.className = 'restaurantdetail__day';
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.className = 'restaurantdetail__hour';
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
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  li.className = 'restaurantdetail__review';
  const commentHeader = document.createElement('div');
  commentHeader.className = 'restaurantdetail__commentheader';

  const leftdiv = document.createElement('div');
  leftdiv.className = 'restaurantdetail__avatarcontainer';

  const avatar = document.createElement('img');
  avatar.src  = '/img/avatar.svg';
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
  for(let i=0; i < review.rating; i++){
    const fullstar = document.createElement('img');
    fullstar.className="restaurant__star restaurant__star--full";
    fullstar.src = "/img/fullstar.svg";
    fullstar.alt = ""
    individualrating.append(fullstar);
  }
  for(let i=0; i < emptyStars; i++){
    const emptystar = document.createElement('img');
    emptystar.className="restaurant__star restaurant__star--empty";
    emptystar.src = "/img/emptystar.svg";
    emptystar.alt= ""
    individualrating.append(emptystar);
  }

  rightdiv.appendChild(individualrating);
  const date = document.createElement('p');
  date.className = 'restaurantdetail__reviewdate'
  const reviewdate = new Date(review.date);
  const todaydate = new Date();
  // Subtract todays date from the date of the review, then format into days
  const daysdifference = Math.round((todaydate - reviewdate)/1000/60/60/24)
  date.innerHTML = `${daysdifference} ago`;
  rightdiv.appendChild(date);

  commentHeader.appendChild(rightdiv); 
  li.appendChild(commentHeader);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
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
