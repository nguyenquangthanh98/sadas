var express = require('express');
var router = express.Router();
var path = require('path');
var userMiddleware = require('../middleware/userMiddleware');

/* GET home page. */
router.get('/sign-up', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../views/signup.html'))
});

router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../views/signin.html'))
});

router.get('/sign-in-admin', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../views/signinAdmin.html'))
});


router.get('/admin', userMiddleware.checkXacThuc, userMiddleware.checkAdmin, function(req, res, next) {
    res.sendFile(path.join(__dirname, '../views/home.html'))
});

router.get('/user', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../views/home-type2.html'))
});
router.get('/checkAdmin', userMiddleware.checkAdmin, function(req, res, next) {
    // res.sendFile(path.join(__dirname, '../views/home.html'))np
    res.json('admin')
});



module.exports = router;