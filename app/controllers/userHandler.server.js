'use strict';

var Users = require('../models/users.js');

function UserHandler() {

    this.updateUser = function(req, res) {
        Users.findOne({
                'local.username': req.user.local.username
            },
            function(err, user) {
                if (err) {
                    throw err;
                }
                if (req.body.fullName) {
                    user.fullName = req.body.fullName;
                }
                if (req.body.city && req.body.state) {
                    user.city = req.body.city;
                    user.state = req.body.state;
                }
                if (req.body.password) {
                    user.local.password = user.generateHash(req.body.password);
                }
                user.save(function(err) {
                    if (err) throw err;
                    res.render('profile', {
                        loggedIn: req.isAuthenticated(),
        				username: req.user.local.username,
        				fullName: req.user.fullName,
        				city: req.user.city,
        				state: req.user.state,
        				message: 'Password Changed'
                    })
                });
            })
    };
}

module.exports = UserHandler;
