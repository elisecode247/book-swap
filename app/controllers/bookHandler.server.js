'use strict';

const request = require('superagent');
var Books = require('../models/books.js');

function BookHandler() {

    this.getCollection = function(req, res) {
        var value = {};
        if (req.isAuthenticated()) {
            value = {'owner': {$ne: req.user.local.username}};
        }

        Books
            .find(value, null, {sort: {_id: -1}}, function(err, result) {
                if (err) throw err;
                res.json(result);
            });
    };

    this.requestBook = function(req, res) {
        var requestedBook = req.params.request;
        Books
            .findById(requestedBook, function(err, doc) {
                if (err) throw err;
                if (!doc.request) {
                    doc.request = req.user.local.username;
                    doc.save();
                    res.send(true);
                } else {
                    res.send(false);
                }
            });
    };

    this.getLibrary = function(req, res) {
        Books
            .find({'owner': req.user.local.username}, null, {sort: {title: 1}},
                function(err, result) {
                    if (err) throw err;
                    res.json(result);
                });
    };

    this.addBook = function(req, res, next) {
        var searchTerm = req.params.title;
        request
            .get(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&` +
                `maxResults=1&printType=books&projection=lite&` +
                `key=${process.env.GOOGLE_BOOKS_KEY}&` +
                `fields=items(id,volumeInfo/title,volumeInfo/imageLinks/smallThumbnail)`)
            .end(function(err, result) {
                if (!err) {
                    var book = result.body.items[0];
                    var newBook = new Books({
                        'bookid': book.id,
                        'title': book.volumeInfo.title,
                        'image': book.volumeInfo.imageLinks.smallThumbnail || null,
                        'owner': req.user.local.username,
                        'borrower': null,
                        'request': null
                    });
                    newBook.save(function(err, result) {
                        if (err) throw err;
                        res.json(result);
                    });
                }
            });
    };

    this.deleteBook = function(req, res) {
        var id = req.params.title;
        Books
            .findByIdAndRemove(id, function(err, result) {
                if (err) throw err;
                res.send(true);
            });
    };

    this.getOutgoingRequests = function(req, res) {
        Books
            .find({'request': req.user.local.username}, function(err, result) {
                if (err) throw err;
                res.json(result);
            });
    };

    this.getIncomingRequests = function(req, res) {
        Books
            .find({$and: [{'owner': req.user.local.username}, {$or: [{
                        'request': {$ne: null}
                    }, {'borrower': {$ne: null}
                    }]
                }]
            }, function(err, result) {
                if (err) throw err;
                res.json(result);
            });
    };

    this.deleteOutgoingRequest = function(req, res) {
        var id = req.params.request;
        Books
            .findByIdAndUpdate(id, {$set: {request: null}}, function(err, result) {
                if (err) throw err;
                res.send(true);
            });
    };

    this.approveIncomingRequest = function(req, res) {
        var requestedBook = req.params.request;
        Books
            .findById(requestedBook, function(err, doc) {
                if (err) throw err;
                var requester = doc.request;
                doc.borrower = requester;
                doc.request = null;
                doc.save();
                res.send(true);
            });
    };

    this.rejectIncomingRequest = function(req, res) {
        var requestedBook = req.params.request;
        Books
            .findById(requestedBook, function(err, doc) {
                if (err) throw err;
                doc.borrower = null;
                doc.request = null;
                doc.save();
                res.send(true);
            });
    };
}

module.exports = BookHandler;
