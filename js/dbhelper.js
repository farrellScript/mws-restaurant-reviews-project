class DBHelper{static get DATABASE_URL(){return"http://localhost:1337/restaurants"}static fetchRestaurants(t){fetch(DBHelper.DATABASE_URL).then(function(e){if(200===e.status)return e.json();{const r=`Request failed. Returned status of ${e.body}`;t(r,null)}}).then(function(e){t(null,e)}).catch(function(t){console.log("error: ",t)})}static fetchRestaurantById(t,e){DBHelper.fetchRestaurants((r,a)=>{if(r)e(r,null);else{const r=a.find(e=>e.id==t);r?e(null,r):e("Restaurant does not exist",null)}})}static fetchRestaurantByCuisine(t,e){DBHelper.fetchRestaurants((r,a)=>{if(r)e(r,null);else{const r=a.filter(e=>e.cuisine_type==t);e(null,r)}})}static fetchRestaurantByNeighborhood(t,e){DBHelper.fetchRestaurants((r,a)=>{if(r)e(r,null);else{const r=a.filter(e=>e.neighborhood==t);e(null,r)}})}static fetchRestaurantByCuisineAndNeighborhood(t,e,r){DBHelper.fetchRestaurants((a,n)=>{if(a)r(a,null);else{let a=n;"all"!=t&&(a=a.filter(e=>e.cuisine_type==t)),"all"!=e&&(a=a.filter(t=>t.neighborhood==e)),r(null,a)}})}static fetchNeighborhoods(t){DBHelper.fetchRestaurants((e,r)=>{if(e)t(e,null);else{const e=r.map((t,e)=>r[e].neighborhood),a=e.filter((t,r)=>e.indexOf(t)==r);t(null,a)}})}static fetchCuisines(t){DBHelper.fetchRestaurants((e,r)=>{if(e)t(e,null);else{const e=r.map((t,e)=>r[e].cuisine_type),a=e.filter((t,r)=>e.indexOf(t)==r);t(null,a)}})}static urlTextForRestaurant(t){return`View Details For ${t.name}`}static urlForRestaurant(t){return`./restaurant.html?id=${t.id}`}static imageUrlForRestaurant(t){return`/img/${t.photograph}.jpg`}static imageTextForRestaurant(t){return`${t.name}`}static ratingForRestaurant(t){let e=0,r=0;return t.reviews.map(t=>{e++,r+=parseInt(t.rating)}),Math.round(r/e)}static imageSrcSetForRestaurant(t){return`/img/${t.photograph}_1x.jpg 1x, /img/${t.photograph}_2x.jpg 2x`}static imageJpgSrcSetForRestaurant(t){return`/img/${t.photograph}_1x.jpg 1x, /img/${t.photograph}_2x.jpg 2x`}static imageWebPSrcSetForRestaurant(t){return`/img/${t.photograph}_1x.webp 1x, /img/${t.photograph}_2x.webp 2x`}static imageSrcForRestaurant(t){return`/img/${t.photograph}_1x.jpg`}static mapMarkerForRestaurant(t,e){const r=new L.marker([t.latlng.lat,t.latlng.lng],{title:t.name,alt:t.name,url:DBHelper.urlForRestaurant(t)});return r.addTo(newMap),r}}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRiaGVscGVyLmpzIl0sIm5hbWVzIjpbIkRCSGVscGVyIiwiREFUQUJBU0VfVVJMIiwiW29iamVjdCBPYmplY3RdIiwiY2FsbGJhY2siLCJmZXRjaCIsInRoZW4iLCJyZXNwb25zZSIsImpzb24iLCJlcnJvciIsImJvZHkiLCJjYXRjaCIsImUiLCJjb25zb2xlIiwibG9nIiwiaWQiLCJmZXRjaFJlc3RhdXJhbnRzIiwicmVzdGF1cmFudHMiLCJyZXN0YXVyYW50IiwiZmluZCIsInIiLCJjdWlzaW5lIiwiZmV0Y2hSZXN0YXVyYW50QnlDdWlzaW5lIiwicmVzdWx0cyIsImZpbHRlciIsImN1aXNpbmVfdHlwZSIsIm5laWdoYm9yaG9vZCIsImZldGNoUmVzdGF1cmFudEJ5TmVpZ2hib3Job29kIiwiZmV0Y2hSZXN0YXVyYW50QnlDdWlzaW5lQW5kTmVpZ2hib3Job29kIiwiZmV0Y2hOZWlnaGJvcmhvb2RzIiwibWFwIiwidiIsImkiLCJ1bmlxdWVOZWlnaGJvcmhvb2RzIiwibmVpZ2hib3Job29kcyIsImluZGV4T2YiLCJmZXRjaEN1aXNpbmVzIiwidW5pcXVlQ3Vpc2luZXMiLCJjdWlzaW5lcyIsIm5hbWUiLCJwaG90b2dyYXBoIiwicmV2aWV3cyIsInRvdGFsIiwiaXRlbSIsInBhcnNlSW50IiwicmF0aW5nIiwibWFwTWFya2VyRm9yUmVzdGF1cmFudCIsImxhdCIsImxhdGxuZyIsImxuZyIsInRpdGxlIiwiYWx0IiwibWFya2VyIiwiYWRkVG8iLCJuZXdNYXAiXSwibWFwcGluZ3MiOiJNQUdNQSxTQU1KQywwQkFFRSxNQUFRLG9DQU1WQyx3QkFBd0JDLEdBQ3RCQyxNQUFNSixTQUFTQyxjQUFjSSxLQUFLLFNBQUFDLEdBRWhDLEdBQUcsTUFBSEEsRUFBR0EsT0FFRCxPQUFPQSxFQUFTQyxPQUZsQixDQUtFLE1BQU1DLHdDQUErQ0YsRUFBU0csT0FDOUROLEVBQVNLLEVBQVQsU0FFREgsS0FBSyxTQUFBRSxHQUNKSixFQUFTLEtBQUtJLEtBQ2ZHLE1BQU0s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WSxJQUFLakMsU0FBQUEsaUJBRExBLEtBSUFrQyxPQUxGQSxFQUFBQyxNQUFBQyxRQUtTRCIsImZpbGUiOiJkYmhlbHBlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBDb21tb24gZGF0YWJhc2UgaGVscGVyIGZ1bmN0aW9ucy5cclxuICovXHJcbmNsYXNzIERCSGVscGVyIHtcclxuXHJcbiAgLyoqXHJcbiAgICogRGF0YWJhc2UgVVJMLlxyXG4gICAqIENoYW5nZSB0aGlzIHRvIHJlc3RhdXJhbnRzLmpzb24gZmlsZSBsb2NhdGlvbiBvbiB5b3VyIHNlcnZlci5cclxuICAgKi9cclxuICBzdGF0aWMgZ2V0IERBVEFCQVNFX1VSTCgpIHtcclxuICAgIGNvbnN0IHBvcnQgPSA4MDAwIC8vIENoYW5nZSB0aGlzIHRvIHlvdXIgc2VydmVyIHBvcnRcclxuICAgIHJldHVybiBgaHR0cDovL2xvY2FsaG9zdDoxMzM3L3Jlc3RhdXJhbnRzYDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZldGNoIGFsbCByZXN0YXVyYW50cy5cclxuICAgKi9cclxuICBzdGF0aWMgZmV0Y2hSZXN0YXVyYW50cyhjYWxsYmFjaykge1xyXG4gICAgZmV0Y2goREJIZWxwZXIuREFUQUJBU0VfVVJMKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgIC8vIENoZWNrIHRoZSByZXNwb25zZSBzdGF0dXNcclxuICAgICAgaWYocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApe1xyXG4gICAgICAgIC8vIFN1Y2Nlc3NcclxuICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICAvLyBFcnJvclxyXG4gICAgICAgIGNvbnN0IGVycm9yID0gKGBSZXF1ZXN0IGZhaWxlZC4gUmV0dXJuZWQgc3RhdHVzIG9mICR7cmVzcG9uc2UuYm9keX1gKTtcclxuICAgICAgICBjYWxsYmFjayhlcnJvcixudWxsKVxyXG4gICAgICB9XHJcbiAgICB9KS50aGVuKGZ1bmN0aW9uKGpzb24pIHtcclxuICAgICAgICBjYWxsYmFjayhudWxsLGpzb24pO1xyXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yOiAnLGUpXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZldGNoIGEgcmVzdGF1cmFudCBieSBpdHMgSUQuXHJcbiAgICovXHJcbiAgc3RhdGljIGZldGNoUmVzdGF1cmFudEJ5SWQoaWQsIGNhbGxiYWNrKSB7XHJcbiAgICAvLyBmZXRjaCBhbGwgcmVzdGF1cmFudHMgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXHJcbiAgICBEQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IHJlc3RhdXJhbnQgPSByZXN0YXVyYW50cy5maW5kKHIgPT4gci5pZCA9PSBpZCk7XHJcbiAgICAgICAgaWYgKHJlc3RhdXJhbnQpIHsgLy8gR290IHRoZSByZXN0YXVyYW50XHJcbiAgICAgICAgICBjYWxsYmFjayhudWxsLCByZXN0YXVyYW50KTtcclxuICAgICAgICB9IGVsc2UgeyAvLyBSZXN0YXVyYW50IGRvZXMgbm90IGV4aXN0IGluIHRoZSBkYXRhYmFzZVxyXG4gICAgICAgICAgY2FsbGJhY2soJ1Jlc3RhdXJhbnQgZG9lcyBub3QgZXhpc3QnLCBudWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRmV0Y2ggcmVzdGF1cmFudHMgYnkgYSBjdWlzaW5lIHR5cGUgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXHJcbiAgICovXHJcbiAgc3RhdGljIGZldGNoUmVzdGF1cmFudEJ5Q3Vpc2luZShjdWlzaW5lLCBjYWxsYmFjaykge1xyXG4gICAgLy8gRmV0Y2ggYWxsIHJlc3RhdXJhbnRzICB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZ1xyXG4gICAgREJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBGaWx0ZXIgcmVzdGF1cmFudHMgdG8gaGF2ZSBvbmx5IGdpdmVuIGN1aXNpbmUgdHlwZVxyXG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSByZXN0YXVyYW50cy5maWx0ZXIociA9PiByLmN1aXNpbmVfdHlwZSA9PSBjdWlzaW5lKTtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCByZXN1bHRzKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBGZXRjaCByZXN0YXVyYW50cyBieSBhIG5laWdoYm9yaG9vZCB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cclxuICAgKi9cclxuICBzdGF0aWMgZmV0Y2hSZXN0YXVyYW50QnlOZWlnaGJvcmhvb2QobmVpZ2hib3Job29kLCBjYWxsYmFjaykge1xyXG4gICAgLy8gRmV0Y2ggYWxsIHJlc3RhdXJhbnRzXHJcbiAgICBEQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIEZpbHRlciByZXN0YXVyYW50cyB0byBoYXZlIG9ubHkgZ2l2ZW4gbmVpZ2hib3Job29kXHJcbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IHJlc3RhdXJhbnRzLmZpbHRlcihyID0+IHIubmVpZ2hib3Job29kID09IG5laWdoYm9yaG9vZCk7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdWx0cyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRmV0Y2ggcmVzdGF1cmFudHMgYnkgYSBjdWlzaW5lIGFuZCBhIG5laWdoYm9yaG9vZCB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cclxuICAgKi9cclxuICBzdGF0aWMgZmV0Y2hSZXN0YXVyYW50QnlDdWlzaW5lQW5kTmVpZ2hib3Job29kKGN1aXNpbmUsIG5laWdoYm9yaG9vZCwgY2FsbGJhY2spIHtcclxuICAgIC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xyXG4gICAgREJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBsZXQgcmVzdWx0cyA9IHJlc3RhdXJhbnRzXHJcbiAgICAgICAgaWYgKGN1aXNpbmUgIT0gJ2FsbCcpIHsgLy8gZmlsdGVyIGJ5IGN1aXNpbmVcclxuICAgICAgICAgIHJlc3VsdHMgPSByZXN1bHRzLmZpbHRlcihyID0+IHIuY3Vpc2luZV90eXBlID09IGN1aXNpbmUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobmVpZ2hib3Job29kICE9ICdhbGwnKSB7IC8vIGZpbHRlciBieSBuZWlnaGJvcmhvb2RcclxuICAgICAgICAgIHJlc3VsdHMgPSByZXN1bHRzLmZpbHRlcihyID0+IHIubmVpZ2hib3Job29kID09IG5laWdoYm9yaG9vZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdHMpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZldGNoIGFsbCBuZWlnaGJvcmhvb2RzIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxyXG4gICAqL1xyXG4gIHN0YXRpYyBmZXRjaE5laWdoYm9yaG9vZHMoY2FsbGJhY2spIHtcclxuICAgIC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xyXG4gICAgREJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XHJcbiAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBHZXQgYWxsIG5laWdoYm9yaG9vZHMgZnJvbSBhbGwgcmVzdGF1cmFudHNcclxuICAgICAgICBjb25zdCBuZWlnaGJvcmhvb2RzID0gcmVzdGF1cmFudHMubWFwKCh2LCBpKSA9PiByZXN0YXVyYW50c1tpXS5uZWlnaGJvcmhvb2QpXHJcbiAgICAgICAgLy8gUmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbSBuZWlnaGJvcmhvb2RzXHJcbiAgICAgICAgY29uc3QgdW5pcXVlTmVpZ2hib3Job29kcyA9IG5laWdoYm9yaG9vZHMuZmlsdGVyKCh2LCBpKSA9PiBuZWlnaGJvcmhvb2RzLmluZGV4T2YodikgPT0gaSlcclxuICAgICAgICBjYWxsYmFjayhudWxsLCB1bmlxdWVOZWlnaGJvcmhvb2RzKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBGZXRjaCBhbGwgY3Vpc2luZXMgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXHJcbiAgICovXHJcbiAgc3RhdGljIGZldGNoQ3Vpc2luZXMoY2FsbGJhY2spIHtcclxuICAgIC8vIEZldGNoIGFsbCByZXN0YXVyYW50c1xyXG4gICAgREJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XHJcblxyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gR2V0IGFsbCBjdWlzaW5lcyBmcm9tIGFsbCByZXN0YXVyYW50c1xyXG4gICAgICAgIGNvbnN0IGN1aXNpbmVzID0gcmVzdGF1cmFudHMubWFwKCh2LCBpKSA9PiByZXN0YXVyYW50c1tpXS5jdWlzaW5lX3R5cGUpXHJcbiAgICAgICAgLy8gUmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbSBjdWlzaW5lc1xyXG4gICAgICAgIGNvbnN0IHVuaXF1ZUN1aXNpbmVzID0gY3Vpc2luZXMuZmlsdGVyKCh2LCBpKSA9PiBjdWlzaW5lcy5pbmRleE9mKHYpID09IGkpXHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgdW5pcXVlQ3Vpc2luZXMpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlc3RhdXJhbnQgcGFnZSBVUkwuXHJcbiAgICovXHJcbiAgc3RhdGljIHVybFRleHRGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpIHtcclxuICAgIHJldHVybiAoYFZpZXcgRGV0YWlscyBGb3IgJHtyZXN0YXVyYW50Lm5hbWV9YCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXN0YXVyYW50IHBhZ2UgVVJMLlxyXG4gICAqL1xyXG4gIHN0YXRpYyB1cmxGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpIHtcclxuICAgIHJldHVybiAoYC4vcmVzdGF1cmFudC5odG1sP2lkPSR7cmVzdGF1cmFudC5pZH1gKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlc3RhdXJhbnQgaW1hZ2UgVVJMLlxyXG4gICAqL1xyXG4gIHN0YXRpYyBpbWFnZVVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCkge1xyXG4gICAgcmV0dXJuIChgL2ltZy8ke3Jlc3RhdXJhbnQucGhvdG9ncmFwaH0uanBnYCk7XHJcbiAgfVxyXG5cclxuLyoqXHJcbiAgICogUmVzdGF1cmFudCBpbWFnZSBhbHQgdGV4dFxyXG4gICAqL1xyXG4gIHN0YXRpYyBpbWFnZVRleHRGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpIHtcclxuICAgIHJldHVybiAoYCR7cmVzdGF1cmFudC5uYW1lfWApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVzdGF1cmFudCBpbWFnZSBhbHQgdGV4dFxyXG4gICAqL1xyXG4gIHN0YXRpYyByYXRpbmdGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpIHtcclxuICAgIGxldCByZXZpZXdzID0gMDtcclxuICAgIGxldCB0b3RhbCA9IDA7XHJcbiAgICByZXN0YXVyYW50LnJldmlld3MubWFwKChpdGVtKT0+e1xyXG4gICAgICByZXZpZXdzKys7XHJcbiAgICAgIHRvdGFsID0gdG90YWwgKyBwYXJzZUludChpdGVtLnJhdGluZylcclxuICAgIH0pXHJcblxyXG5cclxuICAgIHJldHVybiAoTWF0aC5yb3VuZCh0b3RhbC9yZXZpZXdzKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXN0YXVyYW50IEltYWdlIFNvdXJjZSBTZXRcclxuICAgKi9cclxuICBzdGF0aWMgaW1hZ2VTcmNTZXRGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpIHtcclxuICAgIHJldHVybiAoYC9pbWcvJHtyZXN0YXVyYW50LnBob3RvZ3JhcGh9XzF4LmpwZyAxeCwgL2ltZy8ke3Jlc3RhdXJhbnQucGhvdG9ncmFwaH1fMnguanBnIDJ4YCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXN0YXVyYW50IEltYWdlIFNvdXJjZSBTZXQsIGpwZ1xyXG4gICAqL1xyXG4gIHN0YXRpYyBpbWFnZUpwZ1NyY1NldEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCkge1xyXG4gICAgcmV0dXJuIChgL2ltZy8ke3Jlc3RhdXJhbnQucGhvdG9ncmFwaH1fMXguanBnIDF4LCAvaW1nLyR7cmVzdGF1cmFudC5waG90b2dyYXBofV8yeC5qcGcgMnhgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlc3RhdXJhbnQgSW1hZ2UgU291cmNlIFNldCwgd2VicFxyXG4gICAqL1xyXG4gIHN0YXRpYyBpbWFnZVdlYlBTcmNTZXRGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpIHtcclxuICAgIHJldHVybiAoYC9pbWcvJHtyZXN0YXVyYW50LnBob3RvZ3JhcGh9XzF4LndlYnAgMXgsIC9pbWcvJHtyZXN0YXVyYW50LnBob3RvZ3JhcGh9XzJ4LndlYnAgMnhgKTtcclxuICB9XHJcblxyXG5cclxuICAvKipcclxuICAgKiBSZXN0YXVyYW50IEltYWdlIFNvdXJjZSBGYWxsYmFja1xyXG4gICAqL1xyXG4gIHN0YXRpYyBpbWFnZVNyY0ZvclJlc3RhdXJhbnQocmVzdGF1cmFudCkge1xyXG4gICAgcmV0dXJuIChgL2ltZy8ke3Jlc3RhdXJhbnQucGhvdG9ncmFwaH1fMXguanBnYCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNYXAgbWFya2VyIGZvciBhIHJlc3RhdXJhbnQuXHJcbiAgICovXHJcbiAgc3RhdGljIG1hcE1hcmtlckZvclJlc3RhdXJhbnQocmVzdGF1cmFudCwgbWFwKSB7XHJcbiAgICAvLyBodHRwczovL2xlYWZsZXRqcy5jb20vcmVmZXJlbmNlLTEuMy4wLmh0bWwjbWFya2VyICBcclxuICAgIGNvbnN0IG1hcmtlciA9IG5ldyBMLm1hcmtlcihbcmVzdGF1cmFudC5sYXRsbmcubGF0LCByZXN0YXVyYW50LmxhdGxuZy5sbmddLFxyXG4gICAgICB7dGl0bGU6IHJlc3RhdXJhbnQubmFtZSxcclxuICAgICAgYWx0OiByZXN0YXVyYW50Lm5hbWUsXHJcbiAgICAgIHVybDogREJIZWxwZXIudXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KVxyXG4gICAgICB9KVxyXG4gICAgICBtYXJrZXIuYWRkVG8obmV3TWFwKTtcclxuICAgIHJldHVybiBtYXJrZXI7XHJcbiAgIH0gXHJcbiAgIC8qIHN0YXRpYyBtYXBNYXJrZXJGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQsIG1hcCkge1xyXG4gICAgY29uc3QgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XHJcbiAgICAgIHBvc2l0aW9uOiByZXN0YXVyYW50LmxhdGxuZyxcclxuICAgICAgdGl0bGU6IHJlc3RhdXJhbnQubmFtZSxcclxuICAgICAgdXJsOiBEQkhlbHBlci51cmxGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpLFxyXG4gICAgICBtYXA6IG1hcCxcclxuICAgICAgYW5pbWF0aW9uOiBnb29nbGUubWFwcy5BbmltYXRpb24uRFJPUH1cclxuICAgICk7XHJcbiAgICByZXR1cm4gbWFya2VyO1xyXG4gIH0qL1xyXG5cclxufVxyXG4iXX0=
