'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Book = new Schema({
            bookid: {type: String, required: true},
            title: {type: String, required: true},
            image: {type: String, required: true},
            owner: {type: String, required: true},
            borrower: {type: String, required: false},
            request: {type: String, required: false}
});

module.exports = mongoose.model('Book', Book);