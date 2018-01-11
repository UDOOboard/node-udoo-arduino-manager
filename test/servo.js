var Arduino = require('../lib/udoo-arduino-manager');
var arduino = new Arduino('ttyACM0');
var async = require('async');
var LOG = require('../lib/udoo-arduino-manager/logger');
LOG.__debugLevel = 4;

async.series([
    (done) => {
        LOG.W('Servo at 0 degrees');
        arduino.servoWrite(6, 0);
        setTimeout(done, 1500);
    },
    (done) => {
        LOG.W('Servo at 10 degrees');
        arduino.servoWrite(6, 10);
        setTimeout(done, 1500);
    },
    (done) => {
        LOG.W('Servo at 90 degrees');
        arduino.servoWrite(6, 90);
        setTimeout(done, 1500);
    },
    (done) => {
        LOG.W('Servo at 180 degrees');
        arduino.servoWrite(6, 180);
        setTimeout(done, 1500);
    },
    (done) => {
        LOG.W('Servo at 60 degrees');
        arduino.servoWrite(6, 60);
        setTimeout(done, 500);
    },
    (done) => {
        LOG.W('Servo at 60 degrees');
        arduino.servoWrite(6, 60);
        setTimeout(done, 500);
    },
    (done) => {
        LOG.W('Servo at 60 degrees');
        arduino.servoWrite(6, 60);
        setTimeout(done, 500);
    }
], function() {
    arduino.closePort();
});
