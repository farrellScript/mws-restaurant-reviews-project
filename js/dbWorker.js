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

            const fetchResults = fetch(`http://localhost:1337/restaurants/${e.data.restaurant.id}`).then(res => {
                return res.json();
            }).then(results => {
                return results;
            });
            const fetchReviews = fetch(`http://localhost:1337/reviews/?restaurant_id=${e.data.restaurant.id}`).then(res => {
                return res.json();
            }).then(results => {
                return results;
            });
            Promise.all([fetchResults, fetchReviews]).then(values => {
                self.postMessage({ 'results': values[0], 'reviews': values[1] });
            });

            break;
        default:
            console.log('none of the above');
    }
}, false);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRiV29ya2VyLmpzIl0sIm5hbWVzIjpbImltcG9ydFNjcmlwdHMiLCJzZWxmIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJkYXRhIiwiYWN0aW9uIiwiREJIZWxwZXIiLCJmZXRjaFJlc3RhdXJhbnRzIiwiZXJyb3IiLCJyZXN0YXVyYW50cyIsInBvc3RNZXNzYWdlIiwibmVpZ2hib3Job29kcyIsIm1hcCIsInYiLCJpIiwibmVpZ2hib3Job29kIiwidW5pcXVlTmVpZ2hib3Job29kcyIsImZpbHRlciIsImluZGV4T2YiLCJjdWlzaW5lcyIsImN1aXNpbmVfdHlwZSIsInVuaXF1ZUN1aXNpbmVzIiwiY29uc29sZSIsImxvZyIsInJlc3VsdHMiLCJjdWlzaW5lIiwiciIsImZldGNoUmVzdWx0cyIsImZldGNoIiwicmVzdGF1cmFudCIsImlkIiwidGhlbiIsInJlcyIsImpzb24iLCJmZXRjaFJldmlld3MiLCJQcm9taXNlIiwiYWxsIiwidmFsdWVzIl0sIm1hcHBpbmdzIjoiQUFBQUEsY0FBYyxlQUFkOztBQUVBQyxLQUFLQyxnQkFBTCxDQUFzQixTQUF0QixFQUFpQyxVQUFTQyxDQUFULEVBQVk7QUFDekMsWUFBT0EsRUFBRUMsSUFBRixDQUFPQyxNQUFkO0FBQ0ksYUFBSyxvQkFBTDtBQUNJO0FBQ0FDLHFCQUFTQyxnQkFBVCxDQUEwQixDQUFDQyxLQUFELEVBQVFDLFdBQVIsS0FBd0I7QUFDOUMsb0JBQUlELEtBQUosRUFBVztBQUNQUCx5QkFBS1MsV0FBTCxDQUFpQixPQUFqQjtBQUNILGlCQUZELE1BRU87QUFDSDtBQUNBLDBCQUFNQyxnQkFBZ0JGLFlBQVlHLEdBQVosQ0FBZ0IsQ0FBQ0MsQ0FBRCxFQUFJQyxDQUFKLEtBQVVMLFlBQVlLLENBQVosRUFBZUMsWUFBekMsQ0FBdEI7QUFDQTtBQUNBLDBCQUFNQyxzQkFBc0JMLGNBQWNNLE1BQWQsQ0FBcUIsQ0FBQ0osQ0FBRCxFQUFJQyxDQUFKLEtBQVVILGNBQWNPLE9BQWQsQ0FBc0JMLENBQXRCLEtB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RyxLQWxGSCIsImZpbGUiOiJkYldvcmtlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydFNjcmlwdHMoJy4vZGJoZWxwZXIuanMnKTtcblxuc2VsZi5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24oZSkge1xuICAgIHN3aXRjaChlLmRhdGEuYWN0aW9uKXtcbiAgICAgICAgY2FzZSAnZmV0Y2hOZWlnaGJvcmhvb2RzJzpcbiAgICAgICAgICAgIC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xuICAgICAgICAgICAgREJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYucG9zdE1lc3NhZ2UoJ2Vycm9yJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IGFsbCBuZWlnaGJvcmhvb2RzIGZyb20gYWxsIHJlc3RhdXJhbnRzXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5laWdoYm9yaG9vZHMgPSByZXN0YXVyYW50cy5tYXAoKHYsIGkpID0+IHJlc3RhdXJhbnRzW2ldLm5laWdoYm9yaG9vZClcbiAgICAgICAgICAgICAgICAgICAgLy8gUmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbSBuZWlnaGJvcmhvb2RzXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHVuaXF1ZU5laWdoYm9yaG9vZHMgPSBuZWlnaGJvcmhvb2RzLmZpbHRlcigodiwgaSkgPT4gbmVpZ2hib3Job29kcy5pbmRleE9mKHYpID09IGkpXG4gICAgICAgICAgICAgICAgICAgIHNlbGYucG9zdE1lc3NhZ2UoeyduZWlnaGJvcmhvb2RzJzp1bmlxdWVOZWlnaGJvcmhvb2RzfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZmV0Y2hDdWlzaW5lcyc6XG4gICAgICAgICAgICAgIC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xuICAgICAgICAgICAgREJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XG5cbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5wb3N0TWVzc2FnZSgnZXJyb3InKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBHZXQgYWxsIGN1aXNpbmVzIGZyb20gYWxsIHJlc3RhdXJhbnRzXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1aXNpbmVzID0gcmVzdGF1cmFudHMubWFwKCh2LCBpKSA9PiByZXN0YXVyYW50c1tpXS5jdWlzaW5lX3R5cGUpXG4gICAgICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBkdXBsaWNhdGVzIGZyb20gY3Vpc2luZXNcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdW5pcXVlQ3Vpc2luZXMgPSBjdWlzaW5lcy5maWx0ZXIoKHYsIGkpID0+IGN1aXNpbmVzLmluZGV4T2YodikgPT0gaSlcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7J2N1aXNpbmVzJzp1bmlxdWVDdWlzaW5lc30pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2ZldGNoUmVzdGF1cmFudEJ5Q3Vpc2luZUFuZE5laWdoYm9yaG9vZCc6XG5cbiAgICAgICAgICAgIC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xuICAgICAgICAgICAgREJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYucG9zdE1lc3NhZ2UoJ2Vycm9yJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2UuZGF0YScsZS5kYXRhLm5laWdoYm9yaG9vZClcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3VsdHMgPSByZXN0YXVyYW50c1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygncmVzdWx0cycscmVzdWx0cylcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUuZGF0YS5jdWlzaW5lICE9ICdhbGwnKSB7IC8vIGZpbHRlciBieSBjdWlzaW5lXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRzID0gcmVzdWx0cy5maWx0ZXIociA9PiByLmN1aXNpbmVfdHlwZSA9PSBlLmRhdGEuY3Vpc2luZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGUuZGF0YS5uZWlnaGJvcmhvb2QgIT0gJ2FsbCcpIHsgLy8gZmlsdGVyIGJ5IG5laWdoYm9yaG9vZFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMuZmlsdGVyKHIgPT4gci5uZWlnaGJvcmhvb2QgPT0gZS5kYXRhLm5laWdoYm9yaG9vZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7J3Jlc3VsdHMnOnJlc3VsdHN9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYnJlYWs7IFxuICAgICAgICBjYXNlICdjcmVhdGVSZXN0YXVyYW50SFRNTCc6XG5cbiAgICAgICAgICAgIGNvbnN0IGZldGNoUmVzdWx0cyA9IGZldGNoKGBodHRwOi8vbG9jYWxob3N0OjEzMzcvcmVzdGF1cmFudHMvJHtlLmRhdGEucmVzdGF1cmFudC5pZH1gKVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXMpPT57XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdHMpPT57XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGNvbnN0IGZldGNoUmV2aWV3cyA9IGZldGNoKGBodHRwOi8vbG9jYWxob3N0OjEzMzcvcmV2aWV3cy8/cmVzdGF1cmFudF9pZD0ke2UuZGF0YS5yZXN0YXVyYW50LmlkfWApXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlcyk9PntcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0cyk9PntcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgUHJvbWlzZS5hbGwoW2ZldGNoUmVzdWx0cyxmZXRjaFJldmlld3NdKS50aGVuKCh2YWx1ZXMpPT57XG4gICAgICAgICAgICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7J3Jlc3VsdHMnOnZhbHVlc1swXSwgJ3Jldmlld3MnOnZhbHVlc1sxXX0pO1xuICAgICAgICAgICAgfSlcblxuXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGNvbnNvbGUubG9nKCdub25lIG9mIHRoZSBhYm92ZScpXG4gICAgfVxuXG5cblxuICAgIFxufSwgZmFsc2UpOyJdfQ==
