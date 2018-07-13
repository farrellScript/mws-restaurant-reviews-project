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
                let total = 0;
                let sum = 0;
                results.map(item => {
                    total += 1;
                    sum += parseInt(item.rating);
                });
                return Math.round(sum / total);
            });
            Promise.all([fetchResults, fetchReviews]).then(values => {
                self.postMessage({ 'restaurant': values[0], 'reviews': values[1] });
            });
            break;
        default:
            console.log('none of the above');
    }
}, false);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRiV29ya2VyLmpzIl0sIm5hbWVzIjpbImltcG9ydFNjcmlwdHMiLCJzZWxmIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJkYXRhIiwiYWN0aW9uIiwiREJIZWxwZXIiLCJmZXRjaFJlc3RhdXJhbnRzIiwiZXJyb3IiLCJyZXN0YXVyYW50cyIsInBvc3RNZXNzYWdlIiwibmVpZ2hib3Job29kcyIsIm1hcCIsInYiLCJpIiwibmVpZ2hib3Job29kIiwidW5pcXVlTmVpZ2hib3Job29kcyIsImZpbHRlciIsImluZGV4T2YiLCJjdWlzaW5lcyIsImN1aXNpbmVfdHlwZSIsInVuaXF1ZUN1aXNpbmVzIiwiY29uc29sZSIsImxvZyIsInJlc3VsdHMiLCJjdWlzaW5lIiwiciIsImZldGNoUmVzdWx0cyIsImZldGNoIiwicmVzdGF1cmFudCIsImlkIiwidGhlbiIsInJlcyIsImpzb24iLCJmZXRjaFJldmlld3MiLCJ0b3RhbCIsInN1bSIsIml0ZW0iLCJwYXJzZUludCIsInJhdGluZyIsIk1hdGgiLCJyb3VuZCIsIlByb21pc2UiLCJhbGwiLCJ2YWx1ZXMiXSwibWFwcGluZ3MiOiJBQUFBQSxjQUFjLGVBQWQ7O0FBRUFDLEtBQUtDLGdCQUFMLENBQXNCLFNBQXRCLEVBQWlDLFVBQVNDLENBQVQsRUFBWTtBQUN6QyxZQUFPQSxFQUFFQyxJQUFGLENBQU9DLE1BQWQ7QUFDSSxhQUFLLG9CQUFMO0FBQ0k7QUFDQUMscUJBQVNDLGdCQUFULENBQTBCLENBQUNDLEtBQUQsRUFBUUMsV0FBUixLQUF3QjtBQUM5QyxvQkFBSUQsS0FBSixFQUFXO0FBQ1BQLHlCQUFLUyxXQUFMLENBQWlCLE9BQWpCO0FBQ0gsaUJBRkQsTUFFTztBQUNIO0FBQ0EsMEJBQU1DLGdCQUFnQkYsWUFBWUcsR0FBWixDQUFnQixDQUFDQyxDQUFELEVBQUlDLENBQUosS0FBVUwsWUFBWUssQ0FBWixFQUFlQyxZQUF6QyxDQUF0QjtBQUNBO0FBQ0EsMEJBQU1DLHNCQUFzQkwsY0FBY00sTUFBZCxDQUFx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LEdBQVIsQ0FBWSxDQUFDaEIsWUFBRCxFQUFjTyxZQUFkLENBQVosRUFBeUNILElBQXpDLENBQStDYSxNQUFELElBQVU7QUFDcEQzQyxxQkFBS1MsV0FBTCxDQUFpQixFQUFDLGNBQWFrQyxPQUFPLENBQVAsQ0FBZCxFQUF5QixXQUFXQSxPQUFPLENBQVAsQ0FBcEMsRUFBakI7QUFDSCxhQUZEO0FBR0E7QUFDSjtBQUNFdEIsb0JBQVFDLEdBQVIsQ0FBWSxtQkFBWjtBQTlFTjtBQW9GSCxDQXJGRCxFQXFGRyxLQXJGSCIsImZpbGUiOiJkYldvcmtlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydFNjcmlwdHMoJy4vZGJoZWxwZXIuanMnKTtcblxuc2VsZi5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24oZSkge1xuICAgIHN3aXRjaChlLmRhdGEuYWN0aW9uKXtcbiAgICAgICAgY2FzZSAnZmV0Y2hOZWlnaGJvcmhvb2RzJzpcbiAgICAgICAgICAgIC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xuICAgICAgICAgICAgREJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYucG9zdE1lc3NhZ2UoJ2Vycm9yJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IGFsbCBuZWlnaGJvcmhvb2RzIGZyb20gYWxsIHJlc3RhdXJhbnRzXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5laWdoYm9yaG9vZHMgPSByZXN0YXVyYW50cy5tYXAoKHYsIGkpID0+IHJlc3RhdXJhbnRzW2ldLm5laWdoYm9yaG9vZClcbiAgICAgICAgICAgICAgICAgICAgLy8gUmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbSBuZWlnaGJvcmhvb2RzXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHVuaXF1ZU5laWdoYm9yaG9vZHMgPSBuZWlnaGJvcmhvb2RzLmZpbHRlcigodiwgaSkgPT4gbmVpZ2hib3Job29kcy5pbmRleE9mKHYpID09IGkpXG4gICAgICAgICAgICAgICAgICAgIHNlbGYucG9zdE1lc3NhZ2UoeyduZWlnaGJvcmhvb2RzJzp1bmlxdWVOZWlnaGJvcmhvb2RzfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZmV0Y2hDdWlzaW5lcyc6XG4gICAgICAgICAgICAgIC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xuICAgICAgICAgICAgREJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XG5cbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5wb3N0TWVzc2FnZSgnZXJyb3InKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBHZXQgYWxsIGN1aXNpbmVzIGZyb20gYWxsIHJlc3RhdXJhbnRzXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1aXNpbmVzID0gcmVzdGF1cmFudHMubWFwKCh2LCBpKSA9PiByZXN0YXVyYW50c1tpXS5jdWlzaW5lX3R5cGUpXG4gICAgICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBkdXBsaWNhdGVzIGZyb20gY3Vpc2luZXNcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdW5pcXVlQ3Vpc2luZXMgPSBjdWlzaW5lcy5maWx0ZXIoKHYsIGkpID0+IGN1aXNpbmVzLmluZGV4T2YodikgPT0gaSlcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7J2N1aXNpbmVzJzp1bmlxdWVDdWlzaW5lc30pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2ZldGNoUmVzdGF1cmFudEJ5Q3Vpc2luZUFuZE5laWdoYm9yaG9vZCc6XG5cbiAgICAgICAgICAgIC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xuICAgICAgICAgICAgREJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYucG9zdE1lc3NhZ2UoJ2Vycm9yJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2UuZGF0YScsZS5kYXRhLm5laWdoYm9yaG9vZClcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3VsdHMgPSByZXN0YXVyYW50c1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygncmVzdWx0cycscmVzdWx0cylcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUuZGF0YS5jdWlzaW5lICE9ICdhbGwnKSB7IC8vIGZpbHRlciBieSBjdWlzaW5lXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRzID0gcmVzdWx0cy5maWx0ZXIociA9PiByLmN1aXNpbmVfdHlwZSA9PSBlLmRhdGEuY3Vpc2luZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGUuZGF0YS5uZWlnaGJvcmhvb2QgIT0gJ2FsbCcpIHsgLy8gZmlsdGVyIGJ5IG5laWdoYm9yaG9vZFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMuZmlsdGVyKHIgPT4gci5uZWlnaGJvcmhvb2QgPT0gZS5kYXRhLm5laWdoYm9yaG9vZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7J3Jlc3VsdHMnOnJlc3VsdHN9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYnJlYWs7IFxuICAgICAgICBjYXNlICdjcmVhdGVSZXN0YXVyYW50SFRNTCc6XG5cbiAgICAgICAgICAgIGNvbnN0IGZldGNoUmVzdWx0cyA9IGZldGNoKGBodHRwOi8vbG9jYWxob3N0OjEzMzcvcmVzdGF1cmFudHMvJHtlLmRhdGEucmVzdGF1cmFudC5pZH1gKVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXMpPT57XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdHMpPT57XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGNvbnN0IGZldGNoUmV2aWV3cyA9IGZldGNoKGBodHRwOi8vbG9jYWxob3N0OjEzMzcvcmV2aWV3cy8/cmVzdGF1cmFudF9pZD0ke2UuZGF0YS5yZXN0YXVyYW50LmlkfWApXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlcyk9PntcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0cyk9PntcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRvdGFsID0gMDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN1bSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMubWFwKChpdGVtKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWwgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1bSArPSBwYXJzZUludChpdGVtLnJhdGluZylcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE1hdGgucm91bmQoc3VtL3RvdGFsKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgUHJvbWlzZS5hbGwoW2ZldGNoUmVzdWx0cyxmZXRjaFJldmlld3NdKS50aGVuKCh2YWx1ZXMpPT57XG4gICAgICAgICAgICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7J3Jlc3RhdXJhbnQnOnZhbHVlc1swXSwgJ3Jldmlld3MnOiB2YWx1ZXNbMV19KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBjb25zb2xlLmxvZygnbm9uZSBvZiB0aGUgYWJvdmUnKVxuICAgIH1cblxuXG5cbiAgICBcbn0sIGZhbHNlKTsiXX0=
