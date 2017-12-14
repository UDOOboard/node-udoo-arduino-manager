var Arduino = require('./lib/udoo-arduino-manager');

var arduino = new Arduino('ttyACM0');
var SerialPort = require('serialport');


// arduino.setPinMode(7, 1);
// arduino.digitalWrite(7, 0);
// arduino.digitalWrite(7, 1);

// arduino.uploadSketch('x86', function (err, data) {
//     if(err) console.log(err);
//     else console.log(data);
// });

arduino.isInstalled(function (err, installed) {
    if(err && !installed){
        console.log('not installed ....');
        
	arduino.uploadSketch('x86', function (err, data) {
             if(err) console.log(err);
             else console.log(data);
         });
    }else {
     arduino.version(function (err, data) {
            if(err) console.log(err);
            else console.log('version installed -> ' + data);
            arduino.digitalWrite(13, 1, null);

            setTimeout(()=>{        
                arduino.closePort();
            }, 5000);

        })
    }
});
