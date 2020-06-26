'use strict';

const router = require('express').Router();
const userController = require('../controllers/user');
const taskController = require('../controllers/task');
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

router.get('/task', userMiddleware.getToken, function(req, res) {
    taskController.list(req, res);
});

router.post('/task', userMiddleware.getToken, function(req, res) {
    taskController.create(req, res);
});

router.put('/task', userMiddleware.getToken, function(req, res) {
    taskController.update(req, res);
});

router.delete('/task', userMiddleware.getToken, function(req, res) {
    taskController.delete(req, res);
});

module.exports = router;