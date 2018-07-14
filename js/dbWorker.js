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
        case 'fetchRestaurantById':
            DBHelper.fetchRestaurantById(e.data.id, (error, restaurant) => {
                if (!restaurant) {
                    console.error(error);
                    return;
                }
                self.postMessage({ restaurant });
            });
            break;
        case 'fillReviewsHTML':
            // make ajax request to get reviews for a given restaurant
            fetch(`http://localhost:1337/reviews/?restaurant_id=${e.data.id}`).then(res => {
                return res.json();
            }).then(results => {
                self.postMessage({ reviews: results });
            });
        default:
            console.log('none of the above');
    }
}, false);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRiV29ya2VyLmpzIl0sIm5hbWVzIjpbImltcG9ydFNjcmlwdHMiLCJzZWxmIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJkYXRhIiwiYWN0aW9uIiwiREJIZWxwZXIiLCJmZXRjaFJlc3RhdXJhbnRzIiwiZXJyb3IiLCJyZXN0YXVyYW50cyIsInBvc3RNZXNzYWdlIiwibmVpZ2hib3Job29kcyIsIm1hcCIsInYiLCJpIiwibmVpZ2hib3Job29kIiwidW5pcXVlTmVpZ2hib3Job29kcyIsImZpbHRlciIsImluZGV4T2YiLCJjdWlzaW5lcyIsImN1aXNpbmVfdHlwZSIsInVuaXF1ZUN1aXNpbmVzIiwiY29uc29sZSIsImxvZyIsInJlc3VsdHMiLCJjdWlzaW5lIiwiciIsInJlc3RhdXJhbnQiLCJ3ZWJwc3Jjc2V0IiwiaW1hZ2VXZWJQU3JjU2V0Rm9yUmVzdGF1cmFudCIsImpwZ3NyY3NldCIsImltYWdlSnBnU3JjU2V0Rm9yUmVzdGF1cmFudCIsImltYWdldGV4dCIsImltYWdlVGV4dEZvclJlc3RhdXJhbnQiLCJpbWFnZXVybCIsImltYWdlVXJsRm9yUmVzdGF1cmFudCIsInVybHRleHQiLCJ1cmxUZXh0Rm9yUmVzdGF1cmFudCIsInVybCIsInVybEZvclJlc3RhdXJhbnQiLCJmZXRjaFJlc3VsdHMiLCJmZXRjaCIsImlkIiwidGhlbiIsInJlcyIsImpzb24iLCJmZXRjaFJldmlld3MiLCJ0b3RhbCIsInN1bSIsIml0ZW0iLCJwYXJzZUludCIsInJhdGluZyIsIk1hdGgiLCJyb3VuZCIsIlByb21pc2UiLCJhbGwiLCJ2YWx1ZXMiLCJmZXRjaFJlc3RhdXJhbnRCeUlkIiwicmV2aWV3cyJdLCJtYXBwaW5ncyI6IkFBQUFBLGNBQWMsZUFBZDs7QUFFQUMsS0FBS0MsZ0JBQUwsQ0FBc0IsU0FBdEIsRUFBaUMsVUFBU0MsQ0FBVCxFQUFZO0FBQ3pDLFlBQU9BLEVBQUVDLElBQUYsQ0FBT0MsTUFBZDtBQUNJLGFBQUssb0JBQUw7QUFDSTtBQUNBQyxxQkFBU0Ms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LEdBQWhHLEVBQWpCO0FBQ0gsYUFGRDtBQUdBO0FBQ0osYUFBSyxxQkFBTDtBQUNJaEMscUJBQVNtRCxtQkFBVCxDQUE2QnRELEVBQUVDLElBQUYsQ0FBT3NDLEVBQXBDLEVBQXdDLENBQUNsQyxLQUFELEVBQVFtQixVQUFSLEtBQXVCO0FBQzNELG9CQUFJLENBQUNBLFVBQUwsRUFBaUI7QUFDYkwsNEJBQVFkLEtBQVIsQ0FBY0EsS0FBZDtBQUNBO0FBQ0g7QUFDRFAscUJBQUtTLFdBQUwsQ0FBaUIsRUFBQ2lCLFVBQUQsRUFBakI7QUFDSCxhQU5EO0FBT0E7QUFDSixhQUFLLGlCQUFMO0FBQ0k7QUFDQWMsa0JBQU8sZ0RBQStDdEMsRUFBRUMsSUFBRixDQUFPc0MsRUFBRyxFQUFoRSxFQUNLQyxJQURMLENBQ1dDLEdBQUQsSUFBTztBQUNULHVCQUFPQSxJQUFJQyxJQUFKLEVBQVA7QUFDSCxhQUhMLEVBSUtGLElBSkwsQ0FJV25CLE9BQUQsSUFBVztBQUNidkIscUJBQUtTLFdBQUwsQ0FBaUIsRUFBQ2dELFNBQVFsQyxPQUFULEVBQWpCO0FBQ0gsYUFOTDtBQU9KO0FBQ0VGLG9CQUFRQyxHQUFSLENBQVksbUJBQVo7QUF0R047QUE0R0gsQ0E3R0QsRUE2R0csS0E3R0giLCJmaWxlIjoiZGJXb3JrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnRTY3JpcHRzKCcuL2RiaGVscGVyLmpzJyk7XG5cbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uKGUpIHtcbiAgICBzd2l0Y2goZS5kYXRhLmFjdGlvbil7XG4gICAgICAgIGNhc2UgJ2ZldGNoTmVpZ2hib3Job29kcyc6XG4gICAgICAgICAgICAvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHNcbiAgICAgICAgICAgIERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKCdlcnJvcicpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEdldCBhbGwgbmVpZ2hib3Job29kcyBmcm9tIGFsbCByZXN0YXVyYW50c1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZWlnaGJvcmhvb2RzID0gcmVzdGF1cmFudHMubWFwKCh2LCBpKSA9PiByZXN0YXVyYW50c1tpXS5uZWlnaGJvcmhvb2QpXG4gICAgICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBkdXBsaWNhdGVzIGZyb20gbmVpZ2hib3Job29kc1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB1bmlxdWVOZWlnaGJvcmhvb2RzID0gbmVpZ2hib3Job29kcy5maWx0ZXIoKHYsIGkpID0+IG5laWdoYm9yaG9vZHMuaW5kZXhPZih2KSA9PSBpKVxuICAgICAgICAgICAgICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKHsnbmVpZ2hib3Job29kcyc6dW5pcXVlTmVpZ2hib3Job29kc30pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2ZldGNoQ3Vpc2luZXMnOlxuICAgICAgICAgICAgICAvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHNcbiAgICAgICAgICAgIERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xuXG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYucG9zdE1lc3NhZ2UoJ2Vycm9yJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IGFsbCBjdWlzaW5lcyBmcm9tIGFsbCByZXN0YXVyYW50c1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdWlzaW5lcyA9IHJlc3RhdXJhbnRzLm1hcCgodiwgaSkgPT4gcmVzdGF1cmFudHNbaV0uY3Vpc2luZV90eXBlKVxuICAgICAgICAgICAgICAgICAgICAvLyBSZW1vdmUgZHVwbGljYXRlcyBmcm9tIGN1aXNpbmVzXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHVuaXF1ZUN1aXNpbmVzID0gY3Vpc2luZXMuZmlsdGVyKCh2LCBpKSA9PiBjdWlzaW5lcy5pbmRleE9mKHYpID09IGkpXG4gICAgICAgICAgICAgICAgICAgIHNlbGYucG9zdE1lc3NhZ2UoeydjdWlzaW5lcyc6dW5pcXVlQ3Vpc2luZXN9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdmZXRjaFJlc3RhdXJhbnRCeUN1aXNpbmVBbmROZWlnaGJvcmhvb2QnOlxuXG4gICAgICAgICAgICAvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHNcbiAgICAgICAgICAgIERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKCdlcnJvcicpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlLmRhdGEnLGUuZGF0YS5uZWlnaGJvcmhvb2QpXG4gICAgICAgICAgICAgICAgICAgIGxldCByZXN1bHRzID0gcmVzdGF1cmFudHNcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3Jlc3VsdHMnLHJlc3VsdHMpXG4gICAgICAgICAgICAgICAgICAgIGlmIChlLmRhdGEuY3Vpc2luZSAhPSAnYWxsJykgeyAvLyBmaWx0ZXIgYnkgY3Vpc2luZVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMuZmlsdGVyKHIgPT4gci5jdWlzaW5lX3R5cGUgPT0gZS5kYXRhLmN1aXNpbmUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChlLmRhdGEubmVpZ2hib3Job29kICE9ICdhbGwnKSB7IC8vIGZpbHRlciBieSBuZWlnaGJvcmhvb2RcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdHMgPSByZXN1bHRzLmZpbHRlcihyID0+IHIubmVpZ2hib3Job29kID09IGUuZGF0YS5uZWlnaGJvcmhvb2QpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNlbGYucG9zdE1lc3NhZ2UoeydyZXN1bHRzJzpyZXN1bHRzfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGJyZWFrOyBcbiAgICAgICAgY2FzZSAnY3JlYXRlUmVzdGF1cmFudEhUTUwnOlxuICAgICAgICAgICAgY29uc3QgcmVzdGF1cmFudCA9IGUuZGF0YS5yZXN0YXVyYW50O1xuICAgICAgICAgICAgY29uc3Qgd2VicHNyY3NldCA9IERCSGVscGVyLmltYWdlV2ViUFNyY1NldEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCk7XG4gICAgICAgICAgICBjb25zdCBqcGdzcmNzZXQgPSBEQkhlbHBlci5pbWFnZUpwZ1NyY1NldEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCk7XG4gICAgICAgICAgICBjb25zdCBpbWFnZXRleHQgPSBEQkhlbHBlci5pbWFnZVRleHRGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpO1xuICAgICAgICAgICAgY29uc3QgaW1hZ2V1cmwgPSBEQkhlbHBlci5pbWFnZVVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCk7XG4gICAgICAgICAgICBjb25zdCB1cmx0ZXh0ID0gREJIZWxwZXIudXJsVGV4dEZvclJlc3RhdXJhbnQocmVzdGF1cmFudClcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IERCSGVscGVyLnVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudClcbiAgICAgICAgICAgIGNvbnN0IGZldGNoUmVzdWx0cyA9IGZldGNoKGBodHRwOi8vbG9jYWxob3N0OjEzMzcvcmVzdGF1cmFudHMvJHtlLmRhdGEucmVzdGF1cmFudC5pZH1gKVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXMpPT57XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdHMpPT57XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGNvbnN0IGZldGNoUmV2aWV3cyA9IGZldGNoKGBodHRwOi8vbG9jYWxob3N0OjEzMzcvcmV2aWV3cy8/cmVzdGF1cmFudF9pZD0ke2UuZGF0YS5yZXN0YXVyYW50LmlkfWApXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlcyk9PntcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0cyk9PntcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRvdGFsID0gMDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN1bSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMubWFwKChpdGVtKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWwgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1bSArPSBwYXJzZUludChpdGVtLnJhdGluZylcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE1hdGgucm91bmQoc3VtL3RvdGFsKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgUHJvbWlzZS5hbGwoW2ZldGNoUmVzdWx0cyxmZXRjaFJldmlld3Msd2VicHNyY3NldCwganBnc3Jjc2V0LCBpbWFnZXRleHQsaW1hZ2V1cmwsdXJsdGV4dCx1cmxdKS50aGVuKCh2YWx1ZXMpPT57XG4gICAgICAgICAgICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7J3Jlc3RhdXJhbnQnOnZhbHVlc1swXSwgJ3Jldmlld3MnOiB2YWx1ZXNbMV0sd2VicHNyY3NldCwganBnc3Jjc2V0LCBpbWFnZXRleHQsaW1hZ2V1cmwsdXJsdGV4dCx1cmx9KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZmV0Y2hSZXN0YXVyYW50QnlJZCc6XG4gICAgICAgICAgICBEQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRCeUlkKGUuZGF0YS5pZCwgKGVycm9yLCByZXN0YXVyYW50KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFyZXN0YXVyYW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNlbGYucG9zdE1lc3NhZ2Uoe3Jlc3RhdXJhbnR9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2ZpbGxSZXZpZXdzSFRNTCc6XG4gICAgICAgICAgICAvLyBtYWtlIGFqYXggcmVxdWVzdCB0byBnZXQgcmV2aWV3cyBmb3IgYSBnaXZlbiByZXN0YXVyYW50XG4gICAgICAgICAgICBmZXRjaChgaHR0cDovL2xvY2FsaG9zdDoxMzM3L3Jldmlld3MvP3Jlc3RhdXJhbnRfaWQ9JHtlLmRhdGEuaWR9YClcbiAgICAgICAgICAgICAgICAudGhlbigocmVzKT0+e1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzLmpzb24oKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHRzKT0+e1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKHtyZXZpZXdzOnJlc3VsdHN9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBjb25zb2xlLmxvZygnbm9uZSBvZiB0aGUgYWJvdmUnKVxuICAgIH1cblxuXG5cbiAgICBcbn0sIGZhbHNlKTsiXX0=
