const passport = require('passport')
const mongoose = require('mongoose')
module.exports = function () {
    var User = mongoose.model('User');
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(async function (id, done) {
        const user = await User.findOne({
            _id: id
        }, '-password -salt')
        if (user) {

            done(null, user);

        }
    });
    require('./strategies/local.js')();
    require('./strategies/facebook.js')();
    require('./strategies/google.js')();
};