'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var bodyParser = require('body-parser');

module.exports = function(app, passport) {
	app.use(bodyParser.urlencoded({
		extended: false
	}))

	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var clickHandler = new ClickHandler();

	app.route('/')
		.get(isLoggedIn, function(req, res) {
			res.render('index');
		});

	app.route('/signup')
		.get(function(req, res) {
			res.render('signup', {message: req.flash('signupMessage')})
		})
		.post(passport.authenticate('local-signup', {
			successRedirect:'/profile', 
			failureRedirect: '/signup', 
			failureFlash: true
		}));

	app.route('/login')
		.get(function(req, res) {
			res.render('login', {message: req.flash('loginMessage')});
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
			res.render('profile', {username: req.username});
		});

	app.route('/api/:id')
		.get(isLoggedIn, function(req, res) {
			res.json(req.user.github);
		});

	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);
};
