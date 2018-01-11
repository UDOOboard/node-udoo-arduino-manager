var Arduino = require('../lib/udoo-arduino-manager');
var arduino = new Arduino('ttyACM0');
var async = require('async');
var LOG = require('../lib/udoo-arduino-manager/logger');
LOG.__debugLevel = 4;

async.series([
    (done) => {
        LOG.W('Blinking LED 13');
        arduino.digitalWrite(13, 1);
        setTimeout(done, 500);
    }, 
    (done) => {
        arduino.digitalWrite(13, 0);
        setTimeout(done, 500);
    }, 
    (done) => {
        arduino.digitalWrite(13, "high");
        setTimeout(done, 500); 
    },
    (done) => {
        arduino.digitalWrite(13, "low");
        setTimeout(done, 1000);
    },

    (done) => {
        LOG.W('Blinking LED 13 (timed)');
        arduino.timedDigitalWrite(13, 1, 250);
        setTimeout(done, 600);
    }, 
    (done) => {
        arduino.timedDigitalWrite(13, 1, 250);
        setTimeout(done, 600);
    }, 

    (done) => {
        LOG.W('Digital read');
        arduino.digitalRead(10);
        setTimeout(done, 300);
    }, 

    (done) => {
        LOG.W('Analog read');
        arduino.analogRead(0);
        setTimeout(done, 300);
    }, 

    (done) => {
        LOG.W('Analog read (repeated)');
        arduino.repeatedAnalogRead(0, 6, 100);
        setTimeout(done, 1000);
    }, 

    (done) => {
        LOG.W('Analog write');
        arduino.analogWrite(9, 128);
        setTimeout(done, 100);
    }, 

    (done) => {
        LOG.W('Interrupt (attach)');
        arduino.attachInterrupt(3, 2, function() {
            console.log(arguments);
        });
        setTimeout(done, 100);
    }, 
    
    (done) => {
        arduino.attachInterrupt(5, 2, function() {
            console.log(arguments);
        });
        setTimeout(done, 100);
    }, 

    (done) => {
        LOG.W('Interrupt (detach)');
        arduino.detachInterrupt(5);
        setTimeout(done, 100);
    }
    
], function() {
    arduino.closePort();
});
