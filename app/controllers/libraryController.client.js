'use strict';

(function() {

   var searchButton = document.querySelector('.search-button');
   var resultImage = document.querySelector('#search-result-img');
   var library = document.querySelector('#library');
   var outgoingRequests = document.querySelector('#outgoing-requests');
   var incomingRequests = document.querySelector('#incoming-requests');
   var apiUrl = appUrl + '/api/book/';
   var libraryUrl = appUrl + '/api/book';
   var getRequestsUrl = appUrl + '/api/book/requests';
   var getRequestUrl = appUrl + '/api/book/request/'
   var getLendingsUrl = appUrl + '/api/book/lendingRequests';
   var getLendingUrl = appUrl + '/api/book/lending/';

   function showBook(data) {
      var bookObject = JSON.parse(data);
      resultImage.src = bookObject.image;
   }
   
   function showLibrary(data) {
      var booksObject = JSON.parse(data);
      for (let i = 0; i < booksObject.length; i++) {
         var bookContainer = document.createElement('div');
         var image = document.createElement("img");
         var newstr = booksObject[i].image.replace(/http/g, 'https');
         image.id = booksObject[i]._id;
         image.src = newstr;
         image.alt = booksObject[i].title;
         image.title = booksObject[i].title;
         var deleteButton = document.createElement('button');
         deleteButton.id = 'btn-' + image.id;
         deleteButton.className = 'delete-button';
         deleteButton.innerHTML = 'x';
         deleteButton.addEventListener('click', function() {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open('DELETE', apiUrl + booksObject[i]._id, true);
            xmlhttp.send();
            this.style.backgroundColor = 'red';
         });
         bookContainer.appendChild(deleteButton);
         bookContainer.appendChild(image);
         library.appendChild(bookContainer);
      }
   }


   function showOutgoingRequests(data) {
      var booksObject = JSON.parse(data);
      for (let i = 0; i < booksObject.length; i++) {
         var bookContainer = document.createElement('div');
         var image = document.createElement("img");
         var newstr = booksObject[i].image.replace(/http/g, 'https');
         image.id = booksObject[i]._id;
         image.src = newstr;
         image.alt = booksObject[i].title;
         image.title = booksObject[i].title;
         var deleteButton = document.createElement('button');
         deleteButton.id = 'btn-' + image.id;
         deleteButton.className = 'delete-button';
         deleteButton.innerHTML = 'x';
         deleteButton.addEventListener('click', function() {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open('DELETE', getRequestUrl + booksObject[i]._id, true);
            xmlhttp.send();
            this.style.backgroundColor = 'red';
         });
         bookContainer.appendChild(deleteButton);
         bookContainer.appendChild(image);
         outgoingRequests.appendChild(bookContainer);
      }
   }
   
   function showIncomingRequests(data) {
      var booksObject = JSON.parse(data);
      for (let i = 0; i < booksObject.length; i++) {
         var bookContainer = document.createElement('div');
         var image = document.createElement("img");
         var newstr = booksObject[i].image.replace(/http/g, 'https');
         image.id = booksObject[i]._id;
         image.src = newstr;
         image.alt = booksObject[i].title;
         image.title = booksObject[i].title;
         var deleteButton = document.createElement('button');
         deleteButton.id = 'del-btn-' + image.id;
         deleteButton.className = 'delete-button';
         deleteButton.innerHTML = 'x';
         deleteButton.addEventListener('click', function() {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open('DELETE', getLendingUrl + booksObject[i]._id, true);
            xmlhttp.send();
            this.style.backgroundColor = 'red';
         });
         if (!booksObject[i].borrower){
            var addButton = document.createElement('button');
            addButton.id = 'add-btn-' + image.id;
            addButton.className = 'add-button';
            addButton.innerHTML = 'Y';
            addButton.addEventListener('click', function() {
               var xmlhttp = new XMLHttpRequest();
               xmlhttp.open('POST', getLendingUrl + booksObject[i]._id, true);
               xmlhttp.send();
               this.style.backgroundColor = 'green';
            });
            bookContainer.appendChild(addButton);
         }
         bookContainer.appendChild(deleteButton);
         
         bookContainer.appendChild(image);
         incomingRequests.appendChild(bookContainer);
      }
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', libraryUrl, showLibrary));
   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', getRequestsUrl, showOutgoingRequests));
   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', getLendingsUrl, showIncomingRequests));
   
   searchButton.addEventListener('click', function() {
      var searchUrl = apiUrl + document.querySelector("#title").value;
      ajaxFunctions.ajaxRequest('POST', searchUrl, showBook)
   }, false);

})();
