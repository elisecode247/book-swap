'use strict';

(function() {
   var searchInput = document.querySelector('#title');
   var searchButton = document.querySelector('.search-button');
   var library = document.querySelector('#library');
   var outgoingRequests = document.querySelector('#outgoing-requests');
   var incomingRequests = document.querySelector('#incoming-requests');
   var apiUrl = appUrl + '/api/book/';
   var libraryUrl = appUrl + '/api/book';
   var getRequestsUrl = appUrl + '/api/book/requests';
   var getRequestUrl = appUrl + '/api/book/request/'
   var getLendingsUrl = appUrl + '/api/book/lendingRequests';
   var getLendingUrl = appUrl + '/api/book/lending/';

   function createBookContainer(myBooksObject) {
      var bookContainer = document.createElement('div');
      bookContainer.className = 'book';
      var image = document.createElement('img');
      var newstr = myBooksObject.image.replace(/http/g, 'https');
      image.className = 'book__img';
      image.id = myBooksObject._id;
      image.src = newstr;
      image.alt = myBooksObject.title;
      image.title = myBooksObject.title;
      bookContainer.appendChild(image);
      return bookContainer;
   }

   function createDeleteButton(myBooksObject, myUrl) {
      var deleteButton = document.createElement('button');
      deleteButton.id = 'btn-' + myBooksObject._id;
      deleteButton.className = 'book__button book__button--delete';
      deleteButton.innerHTML = 'X';
      deleteButton.addEventListener('click', function() {
         var xmlhttp = new XMLHttpRequest();
         xmlhttp.open('DELETE', myUrl + myBooksObject._id, true);
         xmlhttp.send();
         this.style.backgroundColor = 'red';
      });
      return deleteButton;
   }

   function createAddButton(myBooksObject, getLendingUrl) {
      var addButton = document.createElement('button');
      addButton.id = 'add-btn-' + myBooksObject._id;
      addButton.className = 'book__button book__button--add';
      addButton.innerHTML = 'Y';
      addButton.addEventListener('click', function() {
         var xmlhttp = new XMLHttpRequest();
         xmlhttp.open('POST', getLendingUrl + myBooksObject._id, true);
         xmlhttp.send();
         this.style.backgroundColor = 'green';
      });
      return addButton;
   }

   function showBook(data) {
      var booksObject = JSON.parse(data);
      var bookContainer = createBookContainer(booksObject);
      var deleteButton = createDeleteButton(booksObject, apiUrl);
      bookContainer.appendChild(deleteButton);
      if (!library.hasChildNodes()) {
         library.appendChild(bookContainer);
      } else {
         library.insertBefore(bookContainer, library.firstChild);
      }
   }

   function showLibrary(data) {
      var booksObject = JSON.parse(data);
      for (let i = 0; i < booksObject.length; i++) {
         var bookContainer = createBookContainer(booksObject[i]);
         var deleteButton = createDeleteButton(booksObject[i], apiUrl);
         bookContainer.appendChild(deleteButton);
         library.appendChild(bookContainer);
      }
   }

   function showOutgoingRequests(data) {
      var booksObject = JSON.parse(data);
      for (let i = 0; i < booksObject.length; i++) {
         var bookContainer = createBookContainer(booksObject[i]);
         var deleteButton = createDeleteButton(booksObject[i], apiUrl);
         bookContainer.appendChild(deleteButton);
         outgoingRequests.appendChild(bookContainer);
      }
   }

   function showIncomingRequests(data) {
      var booksObject = JSON.parse(data);
      for (let i = 0; i < booksObject.length; i++) {
         var bookContainer = createBookContainer(booksObject[i]);
         var deleteButton = createDeleteButton(booksObject[i], getLendingUrl);
         bookContainer.appendChild(deleteButton);
         if (!booksObject[i].borrower) {
            var addButton = createAddButton(booksObject[i], getLendingUrl);
            bookContainer.appendChild(addButton);
         } else {
            var approvedMessage = document.createElement('div');
            approvedMessage.className = 'book__message';
            approvedMessage.innerHTML = 'APPROVED';
            bookContainer.appendChild(approvedMessage);
         }
         incomingRequests.appendChild(bookContainer);
      }
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', libraryUrl, showLibrary));
   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', getRequestsUrl, showOutgoingRequests));
   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', getLendingsUrl, showIncomingRequests));

   searchButton.addEventListener('click', function() {
      var searchUrl = apiUrl + document.querySelector('#title').value;
      ajaxFunctions.ajaxRequest('POST', searchUrl, showBook)
   }, false);
   
   searchInput.onkeydown = function(e){
   if(e.keyCode == 13){
     searchButton.click();
   }
};

})();
