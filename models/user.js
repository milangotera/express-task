'use strict';

var mongoose = require('mongoose');

mongoose.plugin(require('meanie-mongoose-to-json'));

var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: { type: String, default: null },
    password: { type: String, default: null },
    firstname: { type: String, default: null },
    lastname: { type: String, default: null },
    phone: { type: String, default: null }, 
    tasks: [{ type: Schema.ObjectId, ref: "tasks" }],
    sex: { type: String, default: null },
    token: { type: String, default: null },
    status: { type: Boolean, default: false }
},{
    timestamps: true
});

var userModel = mongoose.model('users', userSchema);

module.exports = userModel;