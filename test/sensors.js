var Arduino = require('../lib/udoo-arduino-manager');
var arduino = new Arduino('ttyACM0');
var async = require('async');
var LOG = require('../lib/udoo-arduino-manager/logger');
LOG.__debugLevel = 4;

async.series([    
    (done) => {
        LOG.W('I2C sensors scanner');
        arduino.scanI2CSensors();
        setTimeout(done, 3000);
    },

    (done) => {
        LOG.W('I2C bricks (1/2)');
        arduino.readTemperatureBrick(function() {
            console.log(arguments);
        });
        setTimeout(done, 500);
    },
    (done) => {
        arduino.readLightBrick(function() {
            console.log(arguments);
        });
        setTimeout(done, 500);
    },
    (done) => {
        arduino.readHumidityBrick(function() {
            console.log(arguments);
        });
        setTimeout(done, 500);
    },

    (done) => {
        LOG.W('I2C bricks (2/2)');
        arduino.readTemperatureBrick(function() {
            console.log(arguments);
        });
        setTimeout(done, 500);
    },
    (done) => {
        arduino.readLightBrick(function() {
            console.log(arguments);
        });
        setTimeout(done, 500);
    },
    (done) => {
        arduino.readHumidityBrick(function() {
            console.log(arguments);
        });
        setTimeout(done, 500);
    }

], function() {
    arduino.closePort();
});
