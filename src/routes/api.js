// users.js
const express = require('express');
const passport = require('passport');
const user = require("../controllers/userController")
const router = express.Router();
router.use('/users', user)
module.exports = router;
