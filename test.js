var Arduino = require('./lib/');

var arduino = new Arduino('ttyACM1');


arduino.setPinMode(7, 1);
arduino.digitalWrite(7, 0);
// arduino.digitalWrite(7, 1);