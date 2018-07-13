importScripts('./dbhelper.js');

self.addEventListener('message', function (e) {
    switch (e.data.action) {
        case 'fetchNeighborhoods':
            // Fetch all restaurants
            DBHelper.fetchRestaurants((error, restaurants) => {
                if (error) {
                    self.postMessage('error');
                } else {
                    // Get all neighborhoods from all restaurants
                    const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
                    // Remove duplicates from neighborhoods
                    const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i);
                    self.postMessage({ 'neighborhoods': uniqueNeighborhoods });
                }
            });
            break;
        case 'fetchCuisines':
            // Fetch all restaurants
            DBHelper.fetchRestaurants((error, restaurants) => {

                if (error) {
                    self.postMessage('error');
                } else {
                    // Get all cuisines from all restaurants
                    const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
                    // Remove duplicates from cuisines
                    const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i);
                    self.postMessage({ 'cuisines': uniqueCuisines });
                }
            });
            break;
        case 'fetchRestaurantByCuisineAndNeighborhood':

            // Fetch all restaurants
            DBHelper.fetchRestaurants((error, restaurants) => {
                if (error) {
                    self.postMessage('error');
                } else {
                    console.log('e.data', e.data.neighborhood);
                    let results = restaurants;
                    console.log('results', results);
                    if (e.data.cuisine != 'all') {
                        // filter by cuisine
                        results = results.filter(r => r.cuisine_type == e.data.cuisine);
                    }
                    if (e.data.neighborhood != 'all') {
                        // filter by neighborhood
                        results = results.filter(r => r.neighborhood == e.data.neighborhood);
                    }
                    self.postMessage({ 'results': results });
                }
            });

            break;
        case 'createRestaurantHTML':
            const restaurant = e.data.restaurant;
            const webpsrcset = DBHelper.imageWebPSrcSetForRestaurant(restaurant);
            const jpgsrcset = DBHelper.imageJpgSrcSetForRestaurant(restaurant);
            const imagetext = DBHelper.imageTextForRestaurant(restaurant);
            const imageurl = DBHelper.imageUrlForRestaurant(restaurant);
            const urltext = DBHelper.urlTextForRestaurant(restaurant);
            const url = DBHelper.urlForRestaurant(restaurant);
            const fetchResults = fetch(`http://localhost:1337/restaurants/${e.data.restaurant.id}`).then(res => {
                return res.json();
            }).then(results => {
                return results;
            });
            const fetchReviews = fetch(`http://localhost:1337/reviews/?restaurant_id=${e.data.restaurant.id}`).then(res => {
                return res.json();
            }).then(results => {
                let total = 0;
                let sum = 0;
                results.map(item => {
                    total += 1;
                    sum += parseInt(item.rating);
                });
                return Math.round(sum / total);
            });
            Promise.all([fetchResults, fetchReviews, webpsrcset, jpgsrcset, imagetext, imageurl, urltext, url]).then(values => {
                self.postMessage({ 'restaurant': values[0], 'reviews': values[1], webpsrcset, jpgsrcset, imagetext, imageurl, urltext, url });
            });
            break;
        default:
            console.log('none of the above');
    }
}, false);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRiV29ya2VyLmpzIl0sIm5hbWVzIjpbImltcG9ydFNjcmlwdHMiLCJzZWxmIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJkYXRhIiwiYWN0aW9uIiwiREJIZWxwZXIiLCJmZXRjaFJlc3RhdXJhbnRzIiwiZXJyb3IiLCJyZXN0YXVyYW50cyIsInBvc3RNZXNzYWdlIiwibmVpZ2hib3Job29kcyIsIm1hcCIsInYiLCJpIiwibmVpZ2hib3Job29kIiwidW5pcXVlTmVpZ2hib3Job29kcyIsImZpbHRlciIsImluZGV4T2YiLCJjdWlzaW5lcyIsImN1aXNpbmVfdHlwZSIsInVuaXF1ZUN1aXNpbmVzIiwiY29uc29sZSIsImxvZyIsInJlc3VsdHMiLCJjdWlzaW5lIiwiciIsInJlc3RhdXJhbnQiLCJ3ZWJwc3Jjc2V0IiwiaW1hZ2VXZWJQU3JjU2V0Rm9yUmVzdGF1cmFudCIsImpwZ3NyY3NldCIsImltYWdlSnBnU3JjU2V0Rm9yUmVzdGF1cmFudCIsImltYWdldGV4dCIsImltYWdlVGV4dEZvclJlc3RhdXJhbnQiLCJpbWFnZXVybCIsImltYWdlVXJsRm9yUmVzdGF1cmFudCIsInVybHRleHQiLCJ1cmxUZXh0Rm9yUmVzdGF1cmFudCIsInVybCIsInVybEZvclJlc3RhdXJhbnQiLCJmZXRjaFJlc3VsdHMiLCJmZXRjaCIsImlkIiwidGhlbiIsInJlcyIsImpzb24iLCJmZXRjaFJldmlld3MiLCJ0b3RhbCIsInN1bSIsIml0ZW0iLCJwYXJzZUludCIsInJhdGluZyIsIk1hdGgiLCJyb3VuZCIsIlByb21pc2UiLCJhbGwiLCJ2YWx1ZXMiXSwibWFwcGluZ3MiOiJBQUFBQSxjQUFjLGVBQWQ7O0FBRUFDLEtBQUtDLGdCQUFMLENBQXNCLFNBQXRCLEVBQWlDLFVBQVNDLENBQVQsRUFBWTtBQUN6QyxZQUFPQSxFQUFFQyxJQUFGLENBQU9DLE1BQWQ7QUFDSSxhQUFLLG9CQUFMO0FBQ0k7QUFDQUMscUJBQVNDLGdCQUFULENBQTBCLENBQUNDLEtBQUQsRUFBUUMsV0FB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O0FBQ0VoQixvQkFBUUMsR0FBUixDQUFZLG1CQUFaO0FBcEZOO0FBMEZILENBM0ZELEVBMkZHLEtBM0ZIIiwiZmlsZSI6ImRiV29ya2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0U2NyaXB0cygnLi9kYmhlbHBlci5qcycpO1xuXG5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbihlKSB7XG4gICAgc3dpdGNoKGUuZGF0YS5hY3Rpb24pe1xuICAgICAgICBjYXNlICdmZXRjaE5laWdoYm9yaG9vZHMnOlxuICAgICAgICAgICAgLy8gRmV0Y2ggYWxsIHJlc3RhdXJhbnRzXG4gICAgICAgICAgICBEQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5wb3N0TWVzc2FnZSgnZXJyb3InKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBHZXQgYWxsIG5laWdoYm9yaG9vZHMgZnJvbSBhbGwgcmVzdGF1cmFudHNcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmVpZ2hib3Job29kcyA9IHJlc3RhdXJhbnRzLm1hcCgodiwgaSkgPT4gcmVzdGF1cmFudHNbaV0ubmVpZ2hib3Job29kKVxuICAgICAgICAgICAgICAgICAgICAvLyBSZW1vdmUgZHVwbGljYXRlcyBmcm9tIG5laWdoYm9yaG9vZHNcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdW5pcXVlTmVpZ2hib3Job29kcyA9IG5laWdoYm9yaG9vZHMuZmlsdGVyKCh2LCBpKSA9PiBuZWlnaGJvcmhvb2RzLmluZGV4T2YodikgPT0gaSlcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7J25laWdoYm9yaG9vZHMnOnVuaXF1ZU5laWdoYm9yaG9vZHN9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdmZXRjaEN1aXNpbmVzJzpcbiAgICAgICAgICAgICAgLy8gRmV0Y2ggYWxsIHJlc3RhdXJhbnRzXG4gICAgICAgICAgICBEQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcblxuICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKCdlcnJvcicpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEdldCBhbGwgY3Vpc2luZXMgZnJvbSBhbGwgcmVzdGF1cmFudHNcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3Vpc2luZXMgPSByZXN0YXVyYW50cy5tYXAoKHYsIGkpID0+IHJlc3RhdXJhbnRzW2ldLmN1aXNpbmVfdHlwZSlcbiAgICAgICAgICAgICAgICAgICAgLy8gUmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbSBjdWlzaW5lc1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB1bmlxdWVDdWlzaW5lcyA9IGN1aXNpbmVzLmZpbHRlcigodiwgaSkgPT4gY3Vpc2luZXMuaW5kZXhPZih2KSA9PSBpKVxuICAgICAgICAgICAgICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKHsnY3Vpc2luZXMnOnVuaXF1ZUN1aXNpbmVzfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZmV0Y2hSZXN0YXVyYW50QnlDdWlzaW5lQW5kTmVpZ2hib3Job29kJzpcblxuICAgICAgICAgICAgLy8gRmV0Y2ggYWxsIHJlc3RhdXJhbnRzXG4gICAgICAgICAgICBEQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5wb3N0TWVzc2FnZSgnZXJyb3InKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZS5kYXRhJyxlLmRhdGEubmVpZ2hib3Job29kKVxuICAgICAgICAgICAgICAgICAgICBsZXQgcmVzdWx0cyA9IHJlc3RhdXJhbnRzXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyZXN1bHRzJyxyZXN1bHRzKVxuICAgICAgICAgICAgICAgICAgICBpZiAoZS5kYXRhLmN1aXNpbmUgIT0gJ2FsbCcpIHsgLy8gZmlsdGVyIGJ5IGN1aXNpbmVcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdHMgPSByZXN1bHRzLmZpbHRlcihyID0+IHIuY3Vpc2luZV90eXBlID09IGUuZGF0YS5jdWlzaW5lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoZS5kYXRhLm5laWdoYm9yaG9vZCAhPSAnYWxsJykgeyAvLyBmaWx0ZXIgYnkgbmVpZ2hib3Job29kXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRzID0gcmVzdWx0cy5maWx0ZXIociA9PiByLm5laWdoYm9yaG9vZCA9PSBlLmRhdGEubmVpZ2hib3Job29kKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKHsncmVzdWx0cyc6cmVzdWx0c30pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBicmVhazsgXG4gICAgICAgIGNhc2UgJ2NyZWF0ZVJlc3RhdXJhbnRIVE1MJzpcbiAgICAgICAgICAgIGNvbnN0IHJlc3RhdXJhbnQgPSBlLmRhdGEucmVzdGF1cmFudDtcbiAgICAgICAgICAgIGNvbnN0IHdlYnBzcmNzZXQgPSBEQkhlbHBlci5pbWFnZVdlYlBTcmNTZXRGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpO1xuICAgICAgICAgICAgY29uc3QganBnc3Jjc2V0ID0gREJIZWxwZXIuaW1hZ2VKcGdTcmNTZXRGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpO1xuICAgICAgICAgICAgY29uc3QgaW1hZ2V0ZXh0ID0gREJIZWxwZXIuaW1hZ2VUZXh0Rm9yUmVzdGF1cmFudChyZXN0YXVyYW50KTtcbiAgICAgICAgICAgIGNvbnN0IGltYWdldXJsID0gREJIZWxwZXIuaW1hZ2VVcmxGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpO1xuICAgICAgICAgICAgY29uc3QgdXJsdGV4dCA9IERCSGVscGVyLnVybFRleHRGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpXG4gICAgICAgICAgICBjb25zdCB1cmwgPSBEQkhlbHBlci51cmxGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpXG4gICAgICAgICAgICBjb25zdCBmZXRjaFJlc3VsdHMgPSBmZXRjaChgaHR0cDovL2xvY2FsaG9zdDoxMzM3L3Jlc3RhdXJhbnRzLyR7ZS5kYXRhLnJlc3RhdXJhbnQuaWR9YClcbiAgICAgICAgICAgICAgICAudGhlbigocmVzKT0+e1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzLmpzb24oKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHRzKT0+e1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBjb25zdCBmZXRjaFJldmlld3MgPSBmZXRjaChgaHR0cDovL2xvY2FsaG9zdDoxMzM3L3Jldmlld3MvP3Jlc3RhdXJhbnRfaWQ9JHtlLmRhdGEucmVzdGF1cmFudC5pZH1gKVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXMpPT57XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdHMpPT57XG4gICAgICAgICAgICAgICAgICAgIGxldCB0b3RhbCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzdW0gPSAwO1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRzLm1hcCgoaXRlbSk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdW0gKz0gcGFyc2VJbnQoaXRlbS5yYXRpbmcpXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLnJvdW5kKHN1bS90b3RhbCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIFByb21pc2UuYWxsKFtmZXRjaFJlc3VsdHMsZmV0Y2hSZXZpZXdzLHdlYnBzcmNzZXQsIGpwZ3NyY3NldCwgaW1hZ2V0ZXh0LGltYWdldXJsLHVybHRleHQsdXJsXSkudGhlbigodmFsdWVzKT0+e1xuICAgICAgICAgICAgICAgIHNlbGYucG9zdE1lc3NhZ2UoeydyZXN0YXVyYW50Jzp2YWx1ZXNbMF0sICdyZXZpZXdzJzogdmFsdWVzWzFdLHdlYnBzcmNzZXQsIGpwZ3NyY3NldCwgaW1hZ2V0ZXh0LGltYWdldXJsLHVybHRleHQsdXJsfSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgY29uc29sZS5sb2coJ25vbmUgb2YgdGhlIGFib3ZlJylcbiAgICB9XG5cblxuXG4gICAgXG59LCBmYWxzZSk7Il19
