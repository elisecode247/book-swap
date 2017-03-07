'use strict';

var usernameInput = document.querySelector('#username');
var usernameMessage = document.querySelector('#usernameMessage');
var passwordInput = document.querySelector('#password');
var passwordMessage = document.querySelector('#passwordMessage');
var passwordCheckInput = document.querySelector('#passwordCheck');
var passwordCheckMessage = document.querySelector('#passwordCheckMessage');
var form = document.querySelector('form');
var formMessage = document.querySelector('.form__message');

var formFunctions = {

    checkUsername: function() {
        if (usernameInput.value === '') {
            usernameMessage.innerHTML = ' Username is blank.';
            return false;
        } else {
            usernameMessage.innerHTML = '';
            return true;
        }
    },

    checkPasswordStrength: function() {
        if (passwordInput.value === "") {
            passwordMessage.innerHTML = ' Password is blank.';
            return false;
        } else {
            passwordMessage.innerHTML = '';
            return true;
        }
    },

    checkPassword: function() {

        if (passwordInput.value !== passwordCheckInput.value) {
            passwordCheckMessage.innerHTML = ' Password doesn\'t match. Try again.';
            return false;
        } else {
            passwordCheckMessage.innerHTML = '';
            return true;
        }
    }
};

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (usernameInput) {
        formFunctions.checkUsername();
    }
    if (passwordInput.value !== ""){
        if (formFunctions.checkPassword() && formFunctions.checkPasswordStrength()) {
            form.submit();
        } else {
            formMessage.textContent = 'There is an error in your form.';
        }
    } else if (form.name === 'profile'){
            form.submit();
        }

}, false);

if (usernameInput) {
    usernameInput
        .addEventListener('change', formFunctions.checkUsername, false);
}
passwordInput
    .addEventListener('change', formFunctions.checkPasswordStrength, false);

passwordCheckInput
    .addEventListener('change', formFunctions.checkPassword, false);
    
form.onkeydown = function(e){
   if(e.keyCode == 13){
     form.submit();
   }
};
