'use strict';

var Users = require('../models/users.js');

function UserHandler() {

    this.updateUser = function(req, res) {
        Users.findOne({
                'local.username': req.user.local.username
            },
            function(err, user) {
                if (err) {throw err;}
                if (req.body.fullName) {user.fullName = req.body.fullName;}
                if (req.body.city) {user.city = req.body.city;} 
                if (req.body.state) {user.state = req.body.state;}
                if (req.body.password) {
                    user.local.password = user.generateHash(req.body.password);}
                user.save(function(err) {
                    if (err) throw err;
                    res.render('profile', {
                        loggedIn: req.isAuthenticated(),
        				username: req.user.local.username,
        				fullName: user.fullName,
        				city: user.city,
        				state: user.state,
        				message: ' Profile Updated'
                    })
                });
            })
    };
}

module.exports = UserHandler;
