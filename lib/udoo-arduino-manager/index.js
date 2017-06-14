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

ArduinoManager.prototype.version = function(callback){
    var self = this;
    this.__getBelzedooPort(function (err) {
        if (err) callback(err);
        else {
            self.method.hiBelzedoo(self.belzedoo, callback);
        }
    });
};

ArduinoManager.prototype.isInstalled = function(callback){
    var self = this;
    this.__getBelzedooPort(function (err) {
        if (err) callback(err);
        else {
            self.method.hiBelzedoo(self.belzedoo, function (err, data) {
                if(err) {if(callback)callback(err);}
                else{
                    if(callback) callback(null, data > 0);
                }
            });
        }
    });
};

ArduinoManager.prototype.setPinMode = function(pin, mode, callback){
    var data = {};
    data.pin = pin;
    data.mode = mode;
    data.id = 'd'.charCodeAt(0) * 10 + data.pin;
    var self = this;
    this.__getBelzedooPort(function (err) {
        if (err){
            if(callback)callback(err);
            else console.log('setPinMode ' +err);
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
    data.id = 'd'.charCodeAt(0) * 10 + data.pin;
    var self = this;
    this.__getBelzedooPort(function (err) {
        if (err) {
            if(callback) callback(err);
            else console.log('digitalWrite ' +err);
        }
        else {
            self.method.writeDigital(self.belzedoo, data);
        }
    });
};

ArduinoManager.prototype.digitalRead = function(pin, callback){
    var data = {};
    data.pin = pin;
    data.id = 'd'.charCodeAt(0) * 10 + data.pin;
    var self = this;
    this.__getBelzedooPort(function (err) {
        if (err)
            if(callback) callback(err);
            else console.log('digitalRead ' +err);
        else {
            self.method.readDigital(self.belzedoo, data, callback);
        }
    });
};

ArduinoManager.prototype.analogWrite = function(pin, value, callback){
    var data = {};
    data.pin = pin;
    data.id = 'a'.charCodeAt(0) * 10 + data.pin;
    data.value = value;
    var self = this;
    this.__getBelzedooPort(function (err) {
        if (err) {
            if(callback) callback(err);
            else console.log('analogWrite ' +err);
        }
        else {
            self.method.writeAnalog(self.belzedoo, data);
        }
    });
};
ArduinoManager.prototype.analogRead = function(pin, callback){
    var data = {};
    data.pin = pin;
    data.id = 'a'.charCodeAt(0) * 10 + data.pin;
    var self = this;
    this.__getBelzedooPort(function (err) {
        if (err) {
            if(callback) callback(err);
            else console.log('analogRead ' +err);
        }
        else {
            self.method.readAnalog(self.belzedoo, data, callback);
        }
    });
};
ArduinoManager.prototype.servoAttach = function(pin, callback){
    var data = {};
    data.pin = pin;
    data.id = 'd'.charCodeAt(0) * 10 + data.pin;
    var self = this;
    this.__getBelzedooPort(function (err) {
        if (err) {
            if(callback) callback(err);
            else console.log('servoAttach ' +err);
        }
        else {
            self.servo.attach(self.belzedoo, data);
        }
    });
};
ArduinoManager.prototype.servoDetach = function(pin, callback){
    var data = {};
    data.pin = pin;
    data.id = 'd'.charCodeAt(0) * 10 + data.pin;
    var self = this;
    this.__getBelzedooPort(function (err) {
        if (err) {
            if(callback) callback(err);
            else console.log('servoDetach ' +err);
        }
        else {
            self.servo.detach(self.belzedoo, data);
        }
    });
};
ArduinoManager.prototype.servoWrite = function(pin, degrees, callback){
    var data = {};
    data.pin = pin;
    data.degrees = degrees;
    data.id = 'd'.charCodeAt(0) * 10 + data.pin;
    var self = this;
    this.__getBelzedooPort(function (err) {
        if (err) {
            if(callback) callback(err);
            else console.log('servoWrite ' +err);
        }
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
    data.id = 'd'.charCodeAt(0) * 10 + data.pin;
    var self = this;
    this.__getBelzedooPort(function (err) {
        if (err) {
            if(callback) callback(err);
            else console.log('subscribeDigitalRead ' +err);
        }
        else {
            self.method.notifyDigital(self.belzedoo, data, callback);
        }
    });
};

ArduinoManager.prototype.subscribeAnalogRead = function(pin, interval, callback){
    var data = {};
    data.pin = pin;
    data.interval = interval;
    data.id = 'a'.charCodeAt(0) * 10 + data.pin;
    var self = this;
    this.__getBelzedooPort(function (err) {
        if (err) {
            if(callback) callback(err);
            else console.log('subscribeAnalogRead ' +err);
        }
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
    data.id = 'i'.charCodeAt(0) * 10 + data.pin;
    var self = this;
    this.__getBelzedooPort(function (err) {
        if (err) {
            if(callback) callback(err);
            else console.log('attachInterrupt ' +err);
        }
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
    data.id = 'i'.charCodeAt(0) * 10 + data.pin;
    var self = this;
    this.__getBelzedooPort(function (err) {
        if (err) {
            if(callback) callback(err);
            else console.log('detachInterrupt ' +err);
        }
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
                if (err) {
                    if(callback) callback(err);
                    else console.log('getBelzedoo ' +err);
                }
                else {
                    callback(null);
                }
                next();
            });
        }
    });
};

ArduinoManager.prototype.uploadSketch = function (board, callback) {
    if (board === 'neo') {
        //udooneo-m4uploader.sh lib/sketchs/neo.fw
        execUpload('udooneo-m4uploader', [__dirname+'/sketchs/neo.fw'], callback);
    }else if(board === 'quad'){
        //bossac-udoo --port=ttymxc3 -U false -e -w -v -b quad.fw -R
        execUpload('bossac-udoo', ['--port=ttymxc3', '-U' ,'false', '-e', '-w', '-v', '-b', __dirname+'/sketchs/quad.fw', '-R'], callback);
    }else if(board === 'x86'){
        //TODO
        if(callback) callback(new Error('board not supported'));
    }else{
        if(callback) callback(new Error('board not supported'));
    }
};

function execUpload(command, args, callback) {
    var log = 'Upload sketch -> ';

    const spawn = require('child_process').spawn;
    const child = spawn(command, args, {
        detached: false,
        stdio: ['ignore', 'pipe', 'pipe']
    });

    child.stdout.on('data',function (data) {
        process.stdout.write("-");
    });

    child.stderr.on('data',function (err) {
        if (callback) callback(log + err);
        else console.error(log + err);
    });

    child.on('close', function (code) {
        console.log("");
        if(callback){
            if(code === 0) callback(null, log +'success');
            else callback(new Error('error upload sketch'));
        }
    });

    child.on('error', function (error) {
        if (error) callback(log + error);
        else console.error(log + error);
    });
}


module.exports = ArduinoManager;