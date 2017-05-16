var Method = require('./method');
var Belzedoo = require('./belzedoo');
var Servo = require('./servo');
var Sensor = require('./sensor');
var queueOpen = require("function-queue")();

function ArduinoManager (port) {
    this.method = new Method();
    this.servo = new Servo();
    this.sensor = new Sensor();
    this.port = port;
    this.belzedoo = undefined;
}

ArduinoManager.prototype.LOW = 0x0;
ArduinoManager.prototype.HIGH = 0x1;

ArduinoManager.prototype.INPUT = 0x0;
ArduinoManager.prototype.OUTPUT = 0x1;

ArduinoManager.prototype.INT_CHANGE = 0x2;
ArduinoManager.prototype.INT_RISING = 0x3;
ArduinoManager.prototype.INT_FALLING = 0x4;

ArduinoManager.prototype.version = function(pin, mode, callback){
    var data = {};
    data.pin = pin;
    data.mode = mode;
    var self = this;
    this.__getBelzedooPort(function (err) {
        if (err) callback(err);
        else {
            self.method.hiBelzedoo(self.belzedoo, callback);
        }
    });
};

ArduinoManager.prototype.setPinMode = function(pin, mode, callback){
    var data = {};
    data.pin = pin;
    data.mode = mode;
    var self = this;
    this.__getBelzedooPort(function (err) {
        if (err){
            console.log(err);
            if(callback)callback(err);
        }
        else {
            self.method.writePinMode(self.belzedoo, data);
        }
    });
};

ArduinoManager.prototype.digitalWrite = function(pin, value, callback){
    var data = {};
    data.pin = pin;
    data.value = value;
    var self = this;
    this.__getBelzedooPort(function (err) {
        if (err) callback(err);
        else {
            self.method.writeDigital(self.belzedoo, data);
        }
    });
};

ArduinoManager.prototype.digitalRead = function(pin, callback){
    var data = {};
    data.pin = pin;
    data.id = 'd'.charCodeAt(0) + data.pin;
    var self = this;
    this.__getBelzedooPort(function (err) {
        if (err) callback(err);
        else {
            self.method.readDigital(self.belzedoo, data, callback);
        }
    });
};

ArduinoManager.prototype.analogWrite = function(pin, value){
    var data = {};
    data.pin = pin;
    data.value = value;
    var self = this;
    this.__getBelzedooPort(function (err) {
        if (err) callback(err);
        else {
            self.method.writeAnalog(self.belzedoo, data);
        }
    });
};
ArduinoManager.prototype.analogRead = function(pin, callback){
    var data = {};
    data.pin = pin;
    data.id = 'a'.charCodeAt(0) + data.pin;
    var self = this;
    this.__getBelzedooPort(function (err) {
        if (err) callback(err);
        else {
            self.method.readAnalog(self.belzedoo, data, callback);
        }
    });
};
ArduinoManager.prototype.servoAttach = function(pin, callback){
    var data = {};
    data.pin = pin;
    var self = this;
    this.__getBelzedooPort(function (err) {
        if (err) callback(err);
        else {
            self.servo.attach(self.belzedoo, data);
        }
    });
};
ArduinoManager.prototype.servoDetach = function(pin){
    var data = {};
    data.pin = pin;
    var self = this;
    this.__getBelzedooPort(function (err) {
        if (err) callback(err);
        else {
            self.servo.detach(self.belzedoo, data);
        }
    });
};
ArduinoManager.prototype.servoWrite = function(pin, degrees, callback){
    var data = {};
    data.pin = pin;
    data.degrees = degrees;
    var self = this;
    this.__getBelzedooPort(function (err) {
        if (err) callback(err);
        else {
            self.servo.writeServo(self.belzedoo, data);
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
    var self = this;
    this.__getBelzedooPort(function (err) {
        if (err) callback(err);
        else {
            self.method.notifyDigital(self.belzedoo, data, callback);
        }
    });
};

ArduinoManager.prototype.subscribeAnalogRead = function(pin, interval, callback){
    var data = {};
    data.pin = pin;
    data.interval = interval;
    data.id = 'd'.charCodeAt(0) + data.pin;
    var self = this;
    this.__getBelzedooPort(function (err) {
        if (err) callback(err);
        else {
            self.method.notifyAnalog(self.belzedoo, data, callback);
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

ArduinoManager.prototype.attachInterrupt = function(pin, mode, callback){
    var data = {};
    data.pin = pin;
    data.mode = mode;
    data.id = 'i'.charCodeAt(0) + data.pin;
    var self = this;
    this.__getBelzedooPort(function (err) {
        if (err) callback(err);
        else {
            self.method.attachInterrupt(self.belzedoo, data);
            self.belzedoo.read(data.id, function (err) {
                if(!err)callback();
            });
        }
    });
};
ArduinoManager.prototype.detachInterrupt = function(pin, callback){
    var data = {};
    data.pin = pin;
    data.id = 'i'.charCodeAt(0) + data.pin;
    var self = this;
    this.__getBelzedooPort(function (err) {
        if (err) callback(err);
        else {
            self.method.detachInterrupt(self.belzedoo, data);
            self.belzedoo.read(data.id, function (err) {
                if(!err)callback();
            });
        }
    });
};

ArduinoManager.prototype.__getBelzedooPort = function (callback) {
    var that = this;
    queueOpen.push(function (next) {
        if (that.belzedoo) {
            console.log("init");
            callback(null);
            next();
        } else {
            console.log("not init");
            that.belzedoo = new Belzedoo('/dev/' + that.port);
            that.belzedoo.open(function (err) {
                if (err) callback(err);
                else {
                    callback(null);
                }
                next();
            });
        }
    });
};

module.exports = ArduinoManager;