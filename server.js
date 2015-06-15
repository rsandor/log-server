'use strict';

var express = require('express');
var bunyan = require('bunyan');
var app = express();
var theory = require('number-theory');

require('loadenv')('log-server');

var log = bunyan.createLogger({
  name: 'optimus',
  streams: [
    { stream: process.stdout }
  ],
  serializers: bunyan.stdSerializers
});
log.level(process.env.LOG_LEVEL);

log.info('Sieving all primes < 1,000,000')
var primes = theory.sieve(1000000);

app.use(require('express-bunyan-logger')({ logger: log }));

app.use(function (req, res, next) {
  res.set('Content-Type', 'text/html');
  next();
});

app.get('/', function (req, res) {
  log.info('Generating random prime');
  var randomPrime = primes[parseInt(Math.random() * primes.length)];
  log.info('Random Prime found: ' + randomPrime);
  console.log(randomPrime);
  res.end(randomPrime.toString());
});

app.use(function (req, res) {
  res.sendStatus(404);
});

app.listen(process.env.PORT, function (err) {
  if (err) {
    return log.error(err);
  }
  log.info('Server started on port ' + process.env.PORT);
});
