const router = require("express").Router()
const passport = require("passport")
const userService = require("../services/userServices")



router.get('/', async (req, res, next) => {
    
    res.status(201).send("I am here")
})
router.post('/', async (req, res, next) => {
    const result = await userService.createUser(req.body)
    res.status(201).send(result)
})
//Authenticate user
router.post('/login', passport.authenticate('local', {
    successRedirect: '/api/user/success',
    failureRedirect: '/api/user/error',
    failureFlash: true
}));



router.get('/error', function (req, res) {
    res.status(401).send({ error: req.flash('loginMessage') });
});
router.get('/success', function (req, res) {
    res.status(200).send({ user: req.user });
});

router.get('/all',async(req,res)=>{
    const result = await userService.getAllUsers()
    res.status(200).send(result)
})

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});


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

router.delete('/:uname',async(req,res) =>{
    const id = req.params.uname
    const result = await userService.deleteUser(id)
    res.status(200).send(result)
})

router.put('/updateUser/:uname',async(req,res) =>{
    const uname = req.params.uname
    const result = await userService.deleteUser(uname)
    res.status(200).send(result)
})

router.get('/:uname',async(req,res) =>{
    const uname = req.params.uname
    const result = await userService.getUser(uname)
    res.status(200).send(result)
})

module.exports = router