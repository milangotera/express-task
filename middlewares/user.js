'use strict';

const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

const key = "b94cd846f7297d818a969344e82f3a19";

const userMiddleware = {

    getToken: function(req, res, next) {
        if(!req.headers.authorization) {
            return res.status(401).send({
                status: 401,
                message: "Sin autorizacion para ver el contenido",
            });
        }
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, key, function(error, data) {
            if(error) {
                return res.status(401).send({
                    status: 401,
                    message: 'El token de acceso ha expirado'
                });
            }
            else{
                userModel.findOne({'token': `${token}`}, function(err, userData){
                    if(userData == null){
                        return res.status(401).send({
                            status: 401,
                            message: 'Parece que tu session ha expirad'
                        });
                    }
                    if(userData.status){
                        return res.status(401).send({
                            status: 401,
                            message: 'Parece que tu cuenta ha sido bloqueada'
                        });
                    }
                    req.token = userData;
                    next();
                });
            }
        });
    },

    setToken: function(data) {
        
        const token = jwt.sign({ id: data.id }, key, {
            expiresIn: 60 * 60 * 24 * 30 // expire in 30 days
        });

        userModel.findById(data.id, function(err, userData){
            userData.token = token;
            userData.save();
        });

        const profile = {
            firstname: data.firstname,
            lastname: data.lastname,
            phone: data.phone,
            email: data.email,
        };

        return ({ token: token, profile: profile });
    },

    removeToken: function(token) {
        userModel.findById(`${token.id}`, function(err, userData){
            userData.token = null;
            userData.save();
        });
        return true;
    }
};

module.exports = userMiddleware;