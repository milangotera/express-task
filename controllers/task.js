'use strict';

const taskModel = require('../models/task');

const taskController = {

    list: function(req, res) {
        taskModel
        .find({ user: req.token.id }, ["id", "name", "priority", "expires", "status"])
        .exec(function (error, taskData) {
            
            if(error) {
                return res.status(500).send({
                    status: 500,
                    message: 'Error interno del servidor'
                });
            }

            return res.status(200).send({
                status: 200,
                data: taskData,
            });

        });
    },

    create: function(req, res) {
        
        let errors = 0;
        let errorData = {};

        if(!req.body.name){
            errorData.name = "El campo nombre es requerido";
            errors++;
        }
        if(!req.body.description){
            errorData.description = "El campo descripcion es requerido";
            errors++;
        }
        if(!req.body.priority){
            errorData.priority = "El campo prioridad es requerido";
            errors++;
        } else {
            if(req.body.priority != 'Baja' && req.body.priority != 'Normal' && req.body.priority != 'Alta') {
                errorData.priority = "El campo prioridad es incorrecto";
                errors++;
            }
        }
        if(!req.body.expires){
            errorData.expires = "El campo fecha de expiracion es requerido";
            errors++;
        } else {
            if(isNaN(req.body.expires)) {
                errorData.expires = "El campo fecha de expiracion es incorrecto";
                errors++;
            }
        }

        if(errors){
            return res.status(403).send({
                status: 403,
                errors: errorData,
                message: "Por favor completa tus datos",
            });
        }

        var newTask = new taskModel({
            name : req.body.name,
            priority : req.body.priority,
            expires : req.body.expires,
            status : req.body.status || false,
            user : req.token.id,
            description: req.body.description
        });

        newTask.save(function(error, taskData){

            if(error){
                return res.status(500).send({
                    status: 500,
                    message: "Parece que no se pudo crear tu tarea",
                });
            }

            return res.status(201).send({
                status: 201,
                data: {
                    name : taskData.name,
                    priority : taskData.priority,
                    expires : taskData.expires,
                    status : taskData.status,
                    descripcion: taskData.description
                },
                message: "Se ha creado una tarea correctamente",
            });

        });
    },

    update: function(req, res) {
        
        let errors = 0;
        let errorData = {};

        if(!req.body.id){
            errorData.id = "El campo id es requerido";
            errors++;
        }
        if(!req.body.name){
            errorData.name = "El campo nombre es requerido";
            errors++;
        }
        if(!req.body.description){
            errorData.description = "El campo descripcion es requerido";
            errors++;
        }
        if(!req.body.priority){
            errorData.priority = "El campo prioridad es requerido";
            errors++;
        } else {
            if(req.body.priority != 'Baja' && req.body.priority != 'Normal' && req.body.priority != 'Alta') {
                errorData.priority = "El campo prioridad es incorrecto";
                errors++;
            }
        }
        if(!req.body.expires){
            errorData.expires = "El campo fecha de expiracion es requerido";
            errors++;
        } else {
            if(isNaN(req.body.expires)) {
                errorData.expires = "El campo fecha de expiracion es incorrecto";
                errors++;
            }
        }

        if(errors){
            return res.status(403).send({
                status: 403,
                errors: errorData,
                message: "Por favor completa tus datos",
            });
        }

        taskModel.findOne({ 'user': `${req.token.id}`, '_id': `${req.body.id}` }, function(error, taskData){
            
            if(error){
                return res.status(500).send({
                    status: 500,
                    message: 'Error interno del servidor',
                });
            }

            if(!taskData){
                return res.status(403).send({
                    status: 403,
                    message: 'Parece que no existe la tarea que buscas',
                });
            }

            taskData.status = req.body.status;
            taskData.name = req.body.name;
            taskData.description = req.body.description;
            taskData.expires = req.body.expires;
            taskData.priority = req.body.priority;

            taskData.save(function(error, taskData){

                if(error){
                    return res.status(500).send({
                        status: 500,
                        message: "Parece que no se pudo actualizar tu tarea",
                    });
                }

                return res.status(200).send({
                    status: 200,
                    data: {
                        name : taskData.name,
                        priority : taskData.priority,
                        expires : taskData.expires,
                        status : taskData.status,
                        description: taskData.description
                    },
                    message: "Se ha actualizado una tarea correctamente",
                });

            });

        });
    },

    delete: function(req, res) {
        
        let errors = 0;
        let errorData = {};

        if(!req.body.id){
            errorData.id = "El campo id es requerido";
            errors++;
        }

        if(errors){
            return res.status(403).send({
                status: 403,
                errors: errorData,
                message: "Por favor completa tus datos",
            });
        }

        taskModel.findOne({ 'user': `${req.token.id}`, '_id': `${req.body.id}` }, function(error, taskData){
            
            if(error){
                return res.status(500).send({
                    status: 500,
                    message: 'Error interno del servidor',
                });
            }

            if(!taskData){
                return res.status(403).send({
                    status: 403,
                    message: 'Parece que no existe la tarea que buscas',
                });
            }

            taskData.remove(function(error, taskData){

                if(error){
                    return res.status(500).send({
                        status: 500,
                        message: "Parece que no se pudo eliminar tu tarea",
                    });
                }

                return res.status(200).send({
                    status: 200,
                    message: "Se ha eliminado una tarea correctamente",
                });

            });

        });
    },

};

module.exports = taskController;