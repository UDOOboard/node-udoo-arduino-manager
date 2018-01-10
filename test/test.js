var Arduino = require('../lib/udoo-arduino-manager');
var arduino = new Arduino('ttyACM0');
var async = require('async');
var LOG = require('../lib//udoo-arduino-manager/logger.js');
LOG.__debugLevel = 4;

arduino.isInstalled(function (err, installed) {
    if (err && !installed) {
        console.log('Belzedoo is not installed, please wait...');
        
	arduino.uploadSketch('x86', function (err, data) {
             if(err) console.log(err);
             else console.log(data);
         });
    } else {
        arduino.version(function (err, data) {
            if(err) console.log(err);
            else console.log('version installed -> ' + data);

            async.series([
                (done) => {
                    arduino.digitalWrite(13, 1);
                    setTimeout(done, 500);
                }, 
                (done) => {
                    arduino.digitalWrite(13, 0);
                    setTimeout(done, 500);
                }, 
                (done) => {
                    arduino.digitalWrite(13, 1);
                    setTimeout(done, 500); 
                },
                (done) => {
                    arduino.digitalWrite(13, 0);
                    setTimeout(done, 500);
                }

            ], function() {
                arduino.closePort();
            });
        })
    }
});

