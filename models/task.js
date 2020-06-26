'use strict';

var mongoose = require('mongoose');
mongoose.plugin(require('meanie-mongoose-to-json'));

var Schema = mongoose.Schema;

var taskSchema = new Schema({
    name: { type: String, default: null }, 
    priority: { type: String, default: null },
    expires: { type: Number, default: 0 },
    status: { type: Boolean, default: false },
    user: { type: Schema.ObjectId, ref: "users" },
},{
    timestamps: true
});

var taskModel = mongoose.model('task', taskSchema);

module.exports = taskModel;