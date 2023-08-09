const router = require("express").Router()
const passport = require("passport")
const userService = require("../services/userServices")

//Authenticate user
router.post('/login', passport.authenticate('local', {
    successRedirect: '/api/users/success',
    failureRedirect: '/api/users/error',
    failureFlash: true
}));

router.get('/error', function (req, res) {
    res.status(401).send({ error: req.flash('loginMessage') });
});
router.get('/success', function (req, res) {
    res.send(200, { user: req.user });
});

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

router.post('/signup', async (req, res, next) => {
    const result = await userService.createUser(req.body)
    res.send(result)
})
router.get('/oauth/facebook', passport.authenticate('facebook', {
    failureRedirect: '/login'
}));
router.get('/oauth/facebook/callback', passport.authenticate('facebook',
    {
        successRedirect: '/api/users/success',
        failureRedirect: '/api/users/error',
    })); 
router.get('/oauth/google', passport.authenticate('google', {
        failureRedirect: '/signin',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ],
    }));
router.get('/oauth/google/callback', passport.authenticate('google', {
    successRedirect: '/api/users/success',
    failureRedirect: '/api/users/error'
}));

module.exports = router