let restaurants,
  neighborhoods,
  cuisines
var map
var markers = []

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
  var theWorker;
  /**
   * Notifies the user that an updated SW is available
   */
  function _updateReady(worker){

    document.getElementById('update-version').addEventListener('click',function(){
      worker.postMessage({action:'skipWaiting'});
    });
    document.getElementById('dismiss-version').addEventListener('click',function(){
      document.getElementById('toast').classList.remove('active');
      focusedElement.focus()
    });

    // Remember what the last element that was focused was
    focusedElement = document.activeElement;
    focusedElement.tabindex = 1;
   
    // The 3 things that are focusable in the toast
    var focusableElementsString = '#toast p, #update-version, #dismiss-version';
    var focusableElements = document.querySelectorAll(focusableElementsString);
    focusableElements = Array.prototype.slice.call(focusableElements);
    
    var firstTabStop = focusableElements[0];
    var lastTabStop = focusableElements[focusableElements.length -1];

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
      if (e.keyCode === 27){
        document.getElementById('toast').classList.remove('active');
        focusedElement.focus()
      }   
      console.log('active elemnt is ',document.activeElement)   
    });

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
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  fetchNeighborhoods();
  fetchCuisines();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  updateRestaurants();
}

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  })
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  self.markers.forEach(m => m.setMap(null));
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');

  const image = document.createElement('img');
  image.className = 'restaurant-img';
  image.alt = DBHelper.imageTextForRestaurant(restaurant);
  image.srcset = DBHelper.imageSrcSetForRestaurant(restaurant);
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  li.append(image);

  const name = document.createElement('h1');
  name.innerHTML = restaurant.name;
  li.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  li.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  li.append(address);

  const more = document.createElement('a');
  more.innerHTML = DBHelper.urlTextForRestaurant(restaurant);
  more.href = DBHelper.urlForRestaurant(restaurant);
  li.append(more)

  return li
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    self.markers.push(marker);
  });
}
