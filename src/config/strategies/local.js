const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require("../../models/User")

module.exports = function () {
    passport.use(new LocalStrategy(async function (username, password, done) {
        const user = await User.findOne({ username });

        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }

        if (!user.authenticate(password)) {
            return done(null, false, {
           message: 'Invalid password'
        });
        }

        return done(null, user);

    }));
};