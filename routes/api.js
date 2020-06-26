'use strict';

const router = require('express').Router();
const userController = require('../controllers/user');
const userMiddleware = require('../middlewares/user');

router.post('/signin', function(req, res) {
    userController.signin(req, res);
});

router.post('/login', function(req, res) {
    userController.login(req, res);
});

router.get('/logout', userMiddleware.getToken, function(req, res) {
    userController.logout(req, res);
});

router.get('/profile', userMiddleware.getToken, function(req, res) {
    return res.status(200).send({
        status: 200,
        data: {
            email: req.token.email,
            firstname: req.token.firstname,
            lastname: req.token.lastname,
            phone: req.token.phone,
            sex: req.token.sex,
        }
    });
});

module.exports = router;