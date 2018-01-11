var Arduino = require('../lib/udoo-arduino-manager');
var arduino = new Arduino('ttyACM0');
var async = require('async');
var LOG = require('../lib/udoo-arduino-manager/logger');
LOG.__debugLevel = 4;

async.series([
    (done) => {
        LOG.W('RGB rainbow (fast)');
        arduino.setGrooveLED(8, 'rainbow', {n:3, delay:5});
        setTimeout(done, 6000);
    },
    (done) => {
        LOG.W('RGB rainbow (slow)');
        arduino.setGrooveLED(8, 'rainbow', {n:3, delay:50});
        setTimeout(done, 12000);
    },
    (done) => {
        LOG.W('RGB red');
        arduino.setGrooveLED(8, 'RGB', {r:255, g:0, b:0});
        setTimeout(done, 100);
    },
    (done) => {
        LOG.W('RGB off');
        arduino.setGrooveLED(8, 'RGB', {r:0, g:0, b:0});
        setTimeout(done, 100);
    },
], function() {
    arduino.closePort();
});
