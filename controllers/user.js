'use strict';

const userModel = require('../models/user');
const userMiddleware = require('../middlewares/user');
const md5 = require('md5');
const emailValidate = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const userController = {

    signin: function(req, res) {
        
        let errors = 0;
        let errorData = {};

        const current = new Date();

        if(!req.body.firstname){
            errorData.firstname = "El campo nombre es requerido";
            errors++;
        }
        if(!req.body.lastname){
            errorData.lastname = "El campo apellido es requerido";
            errors++;
        }
        if(!req.body.phone){
            errorData.phone = "El campo telefono es requerido";
            errors++;
        }
        if(!req.body.email){
            errorData.email = "El campo email es requerido";
            errors++;
        } else {
            if(!emailValidate.test(req.body.email)) {
                errorData.email = "El campo email no es valido";
                errors++;
            }
        }
        if(!req.body.sex){
            errorData.sex = "El campo genero es requerido";
            errors++;
        }
        if(!req.body.password){
            errorData.password = "El campo clave es requerido";
            errors++;
        }
        if(!req.body.password_repeat){
            errorData.password_repeat = "El campo repite clave es requerido";
            errors++;
        } else {
            if(req.body.password_repeat != req.body.password){
                errorData.password_repeat = "Las claves no coinciden";
                errors++;
            }
        }

        if(errors){
            return res.status(403).send({
                status: 403,
                errors: errorData,
                message: 'Por favor completa tus datos',
            });
        }

        var sex = (req.body.sex).replace(/^\w/, (c) => c.toUpperCase());
        var email = req.body.email;
        var password = req.body.password;
        var firstname = (req.body.firstname).replace(/^\w/, (c) => c.toUpperCase());
        var lastname = (req.body.lastname).replace(/^\w/, (c) => c.toUpperCase());
        var phone = req.body.phone;

        userModel.findOne({ phone: req.body.phone }, function(error, searchPhone){
            
            if(error){
                return res.status(500).send({
                    status: 500,
                    message: 'Error interno del servidor',
                });
            }
            if(searchPhone){
                return res.status(409).send({
                    status: 409,
                    errors: { phone: 'El campo telefono ya existe' },
                    message: 'Parece que ya te has registrado',
                });
            }

            userModel.findOne({ email: req.body.email }, function(error, searchEmail){

                if(error){
                    return res.status(500).send({
                        status: 500,
                        message: 'Error interno del servidor',
                    });
                }
                if(searchEmail){
                    return res.status(409).send({
                        status: 409,
                        errors: { email: 'El campo email ya existe' },
                        message: 'Parece que ya te has registrado',
                    });
                }

                var newUser = new userModel({
                    firstname: firstname,
                    lastname: lastname,
                    phone: phone,
                    email: email,
                    sex: sex,
                    password: md5(password),
                    status: true,
                });

                newUser.save(function(error, userData){

                    if(error){
                        return res.status(500).send({
                            status: 500,
                            message: 'Parece que no se pudo crear tu cuenta',
                        });
                    }

                    return res.status(201).send({
                        status: 201,
                        data: userMiddleware.setToken(userData),
                        message: `Bienvenido ${userData.firstname}`,
                    });

                });
            
            });
            
        });
    },

    login: function(req, res) {

        if(!req.body.email || !req.body.password){
            return res.status(403).send({
                status: 403,
                message: 'Parece que no se enviaron los parametros',
            });
        }

        userModel.findOne({ email: req.body.email, password: md5(req.body.password) }, function(error, userData){
             
            if(error){
                return res.status(500).send({
                    status: 500,
                    message: 'Error interno del servidor',
                });
            }

            if(!userData){
                return res.status(409).send({
                    status: 409,
                    message: `Combinacion de email y contraseña incorrectos`,
                });
            }

            if(!userData.status){
                return res.status(409).send({
                    status: 409,
                    message: `Tu cuenta ha sido bloqueada por un administrador`,
                });
            }

            return res.status(201).send({
                status: 201,
                data: userMiddleware.setToken(userData),
                message: `Bienvenido ${userData.firstname}`,
            });

        });

    },

    logout: function(req, res) {
        
        userMiddleware.removeToken(req.token);
        
        return res.status(200).send({
            status: 200,
            message: 'Se ha terminado la sesion correctamente',
        });

    },

};

module.exports = userController;