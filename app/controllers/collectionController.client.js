'use strict';

(function() {

    var collection = document.querySelector('#collection');
    var collectionUrl = appUrl + '/api/books';
    var requestUrl = appUrl + '/api/book/request/';

    function showCollection(data) {
        var booksObject = JSON.parse(data);
        for (let i = 0; i < booksObject.length; i++) {
            var bookContainer = document.createElement('div');
            var image = document.createElement("img");
            var newstr = booksObject[i].image.replace(/http/g, 'https');
            image.id = booksObject[i]._id;
            image.src = newstr;
            image.alt = booksObject[i].title;
            image.title = booksObject[i].title;
            if (!booksObject[i].request){
                var requestButton = document.createElement('button');
                requestButton.id = 'btn-' + image.id;
                requestButton.className = 'request-button';
                requestButton.innerHTML = 'x';
                requestButton.addEventListener('click', function() {
                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.open('POST', requestUrl + booksObject[i]._id, true);
                    xmlhttp.send();
                    this.style.backgroundColor = 'red';
                });
                bookContainer.appendChild(requestButton);
            }
            bookContainer.appendChild(image);
            collection.appendChild(bookContainer);
        }
    }



    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', collectionUrl, showCollection));



})();
