'use strict';

const router = require('express').Router();
const api = require('./api');

router.get('/', function (req, res) {
  res.status(200).send('API v1.0.0');
});

router.use('/api', api);

router.use('*', function(req, res){
  res.status(404).send('404 Not Found');
});

module.exports = router;