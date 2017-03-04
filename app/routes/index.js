'use strict';

var path = process.cwd();
var BookHandler = require(path + '/app/controllers/bookHandler.server.js');
var UserHandler = require(path + '/app/controllers/userHandler.server.js');
var bodyParser = require('body-parser');

module.exports = function(app, passport) {

	var bookHandler = new BookHandler();
	var userHandler = new UserHandler();
	app.use(bodyParser.urlencoded({
		extended: false
	}));

	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	app.route('/')
		.get(function(req, res) {
			res.render('allbooks', {
				loggedIn: req.isAuthenticated()
			});
		});

	app.route('/signup')
		.get(function(req, res) {
			res.render('signup', {
				loggedIn: req.isAuthenticated() || false,
				message: req.flash('signupMessage')
			});
		})
		.post(passport.authenticate('local-signup', {
			successRedirect: '/profile',
			failureRedirect: '/signup',
			failureFlash: true
		}));

	app.route('/login')
		.get(function(req, res) {
			res.render('login', {
				loggedIn: req.isAuthenticated(),
				message: req.flash('loginMessage')
			});
		})
		.post(passport.authenticate('local-login', {
			successRedirect: '/profile',
			failureRedirect: '/login',
			failureFlash: true
		}));

	app.route('/logout')
		.get(function(req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function(req, res) {
			res.render('profile', {
				loggedIn: req.isAuthenticated(),
				username: req.user.local.username,
				fullName: req.user.fullName,
				city: req.user.city,
				state: req.user.state
			});
		})
		.post(isLoggedIn, userHandler.updateUser)

	app.route('/allbooks')
		.get(function(req, res) {
			res.render('allbooks', {
				loggedIn: req.isAuthenticated()
			});
		});

	app.route('/mybooks')
		.get(isLoggedIn, function(req, res) {
			res.render('mybooks', {
				loggedIn: req.isAuthenticated(),
				username: req.user.local.username,
				password: req.user.local.password
			});
		});

	app.route('/api/book/:title')
		.post(bookHandler.addBook)
		.delete(bookHandler.deleteBook);

	app.route('/api/book')
		.get(isLoggedIn, bookHandler.getLibrary);

	app.route('/api/book/requests')
		.get(isLoggedIn, bookHandler.getOutgoingRequests);

	app.route('/api/book/request/:request')
		.post(isLoggedIn, bookHandler.requestBook)
		.delete(isLoggedIn, bookHandler.deleteOutgoingRequest);

	app.route('/api/book/lending/:request')
		.post(isLoggedIn, bookHandler.approveIncomingRequest)
		.delete(isLoggedIn, bookHandler.rejectIncomingRequest);

	app.route('/api/book/lendingRequests')
		.get(isLoggedIn, bookHandler.getIncomingRequests);

	app.route('/api/books')
		.get(bookHandler.getCollection);


};
