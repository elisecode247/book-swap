'use strict';

(function() {

    var collection = document.querySelector('#collection');
    var collectionUrl = appUrl + '/api/books';

    function showCollection(data) {
        var booksObject = JSON.parse(data);
        for (var i = 0; i < booksObject.length; i++) {
            var bookContainer = document.createElement('div');
            bookContainer.className = 'book';
            var newstr = booksObject[i].image.replace(/http/g, 'https');
            var image = document.createElement("img");
            image.className = 'book__img';
            image.src = newstr;
            image.alt = booksObject[i].title;
            image.title = booksObject[i].title;
            bookContainer.appendChild(image);
            collection.appendChild(bookContainer);
        }
    }

    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', collectionUrl, showCollection));

})();
