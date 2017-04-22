var Method = require('./method');
var Belzedoo = require('./belzedoo');
var Servo = require('./servo');
var Sensor = require('./sensor');

function ArduinoManager (port) {
    this.method = new Method();
    this.servo = new Servo();
    this.sensor = new Sensor();
    this.port = port;
    this.belzedoo = {};
}


ArduinoManager.prototype.setPinMode = function(pin, mode, callback){
    var data = {};
    data.pin = pin;
    data.mode = mode;
    this.__getBelzedooPort(this.port, function (err) {
        if (err) callback(err);
        else {
            this.method.writePinMode(this.belzedoo, data);
        }
    });
};

ArduinoManager.prototype.digitalWrite = function(pin, value, callback){
    var data = {};
    data.pin = pin;
    data.value = value;
    this.__getBelzedooPort(this.port, function (err) {
        if (err) callback(err);
        else {
            this.method.writeDigital(this.belzedoo, data);
        }
    });
};

ArduinoManager.prototype.digitalRead = function(pin, callback){
    var data = {};
    data.pin = pin;
    data.id = 'd'.charCodeAt(0) + data.pin;
    this.__getBelzedooPort(this.port, function (err) {
        if (err) callback(err);
        else {
            this.method.readDigital(this.belzedoo, data, callback);
        }
    });
};

ArduinoManager.prototype.analogWrite = function(pin, value){
    var data = {};
    data.pin = pin;
    data.value = value;
    this.__getBelzedooPort(this.port, function (err) {
        if (err) callback(err);
        else {
            this.method.writeAnalog(this.belzedoo, data);
        }
    });
};
ArduinoManager.prototype.analogRead = function(pin, callback){
    var data = {};
    data.pin = pin;
    data.id = 'a'.charCodeAt(0) + data.pin;
    this.__getBelzedooPort(this.port, function (err) {
        if (err) callback(err);
        else {
            this.method.readAnalog(this.belzedoo, data, callback);
        }
    });
};
ArduinoManager.prototype.servoAttach = function(pin, callback){
    var data = {};
    data.pin = pin;
    this.__getBelzedooPort(this.port, function (err) {
        if (err) callback(err);
        else {
            this.servo.attach(this.belzedoo, data);
        }
    });
};
ArduinoManager.prototype.servoDetach = function(pin){
    var data = {};
    data.pin = pin;
    this.__getBelzedooPort(this.port, function (err) {
        if (err) callback(err);
        else {
            this.servo.detach(this.belzedoo, data);
        }
    });
};
ArduinoManager.prototype.servoWrite = function(pin, degrees, callback){
    var data = {};
    data.pin = pin;
    data.degrees = degrees;
    this.__getBelzedooPort(this.port, function (err) {
        if (err) callback(err);
        else {
            this.servo.writeServo(this.belzedoo, data);
        }
    });
};

ArduinoManager.prototype.dht11Read = function (pin, callback) {};
ArduinoManager.prototype.dht22Read = function () {};
ArduinoManager.prototype.humidityBrickRead = function () {};
ArduinoManager.prototype.lightBrickRead = function () {};

ArduinoManager.prototype.subscribeDigitalRead = function (pin, interval, callback) {
    var data = {};
    data.pin = pin;
    data.interval = interval;
    data.id = 'd'.charCodeAt(0) + data.pin;

    this.__getBelzedooPort(this.port, function (err) {
        if (err) callback(err);
        else {
            this.method.notifyDigital(this.belzedoo, data, callback);
        }
    });
};

ArduinoManager.prototype.subscribeAnalogRead = function(pin, interval, callback){
    var data = {};
    data.pin = pin;
    data.interval = interval;
    data.id = 'd'.charCodeAt(0) + data.pin;

    this.__getBelzedooPort(this.port, function (err) {
        if (err) callback(err);
        else {
            this.method.notifyAnalog(this.belzedoo, data, callback);
        }
    });
};

ArduinoManager.prototype.subscribeDht11Read = function () {};
ArduinoManager.prototype.subscribeDht22Read = function () {};
ArduinoManager.prototype.subscribeHumidityBrickRead = function () {};
ArduinoManager.prototype.subscribeLightBrickRead = function () {};

ArduinoManager.prototype.unsubscribeDigitalRead = function (pin) {
    this.method.unsubscribe(pin);
};
ArduinoManager.prototype.unsubscribeAnalogRead = function(pin){
    this.method.unsubscribe(pin);
};
ArduinoManager.prototype.unsubscribeDht11Read = function () {};
ArduinoManager.prototype.unsubscribeDht22Read = function () {};
ArduinoManager.prototype.unsubscribeHumidityBrickRead = function () {};
ArduinoManager.prototype.unsubscribeLightBrickRead = function () {};

ArduinoManager.prototype.attachInterrupt = function(pin, mode, callback){};
ArduinoManager.prototype.detachInterrupt = function(pin){};

ArduinoManager.prototype.__getBelzedooPort = function (port, callback) {
    if (this.belzedoo) {
        callback(null);
    } else {
        this.belzedoo = new Belzedoo('/dev/' + port);
        this.belzedoo.open(function (err) {
            if (err) callback(err);
            else {
                callback(null);
            }
        });
    }
};

function getIdOArduinoProvider(sensor) {
    var idOfProvider = -1;
    if (sensor === 'digital') {
        idOfProvider = 0;
    } else if (sensor === 'analog') {
        idOfProvider = 1;
    } else if (sensor === 'servo') {
        idOfProvider = 2;
    } else if (sensor === 'sensor') {
        idOfProvider = 3;
    } else if (sensor === 'status') {
        idOfProvider = 4;
    }
    return idOfProvider;
}

module.exports = ArduinoManager;