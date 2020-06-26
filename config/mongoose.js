'use strict';

var mongoose = require('mongoose');

var MONGO_URL = process.env.MONGO_URL || 'mongodb+srv://milangotera:uxpCX1MzBt5CiE3e@cluster0-yj8gs.gcp.mongodb.net/task?retryWrites=true&w=majority';

mongoose.connect(MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
.then(() => console.log('Mongo Connected!'))
.catch(err => {
    console.log(`DB Connection Error: ${err.message}`);
});

mongoose.connection.on('connected', function () {
    console.log('Connected to the database: ' + MONGO_URL);
});

mongoose.connection.on('error',function (err) {
    console.log('Error connecting to the database: ' + err);
});

mongoose.connection.on('disconnected', function () {
    console.log('Disconnected from the database');
});

process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Disconnected from the database at the end of the app');
        process.exit(0);
    });
});

module.exports = mongoose;