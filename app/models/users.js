'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var User = new Schema({
            local: {
                username: {type: String, required: true},
                password: {type: String,required: true}
            },
            fullName: {type: String, required: false},
            city: {type: String, required: false},
            state: {type: String, required: false}
});

User.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

User.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', User);
