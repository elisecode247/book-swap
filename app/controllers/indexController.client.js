'use strict';

(function () {

   var collection = document.querySelector('#collection');
   var collectionUrl = appUrl + '/api/books';
   var requestUrl = collectionUrl + '/';

   function showCollection(data) {
       var test = JSON.stringify(data);
       var booksObject = JSON.parse(data);
       for (var i = 0; i < booksObject.length; i++) {
           var newstr = booksObject[i].image.replace(/http/g, 'https');
           var image = document.createElement("img");
           image.src = newstr;
           image.alt = booksObject[i].title;
           image.title = booksObject[i].title;
           collection.appendChild(image);
       }
   }
   
    function requestBook (data) {
       var booksObject = JSON.stringify(data);
       collection.innerHTML = booksObject;
       
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', collectionUrl, showCollection));


})();
