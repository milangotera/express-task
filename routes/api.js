'use strict';

const router = require('express').Router();
const userController = require('../controllers/user');
const userMiddleware = require('../middlewares/user');

router.post('/signin', function(req, res) {
    DriverController.signin(req, res);
});

router.post('/login', function(req, res) {
    userController.login(req, res);
});

router.get('/logout', function(req, res) {
    userController.logout(req, res);
});

router.get('/profile', userMiddleware.getToken, function(req, res) {
    return res.status(200).send({
        status: 200,
        data: req.token
    });
});

module.exports = router;