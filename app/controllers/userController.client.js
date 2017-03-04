'use strict';

(function () {

   var profileUsername = document.querySelector('#profile-username') || null;
   var apiUrl = appUrl + '/profile';
   var updateButton = document.querySelector('#update-button') || null;
   function updateHtmlElement (data, element, userProperty) {
      element.innerHTML = data[userProperty];
   }

   updateButton.addEventListener('click', function () {
      ajaxFunctions.ajaxRequest('POST', apiUrl, function (data) {
         profileUsername.innerHTML = JSON.stringify(data);
      });

   }, false);
   
})();
