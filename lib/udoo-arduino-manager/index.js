var Method = require('./method');
var Belzedoo = require('./belzedoo');
var Servo = require('./servo');
var Sensor = require('./sensor');
var queueOpen = require("function-queue")();
var LOG = require('./logger');

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
            else LOG.E('setPinMode ' +err);
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
            else LOG.E('digitalWrite ' +err);
        }
        else {
            self.method.writeDigital(self.belzedoo, data);
        }
    });
};

ArduinoManager.prototype.timedDigitalWrite = function(pin, value, delay, callback){
    var data = {};
    data.pin = pin;
    data.value = value;
    data.delay = delay;
    data.id = 'd'.charCodeAt(0) * 10 + data.pin;
    var self = this;
    this.__getBelzedooPort(function (err) {
        if (err) {
            if(callback) callback(err);
            else LOG.E('digitalWrite ' +err);
        }
        else {
            self.method.writeTimedDigital(self.belzedoo, data);
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
            else LOG.E('digitalRead ' +err);
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
            else LOG.E('analogWrite ' +err);
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
            else LOG.E('analogRead ' +err);
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
            else LOG.E('servoAttach ' +err);
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
            else LOG.E('servoDetach ' +err);
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
            else LOG.E('servoWrite ' +err);
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
            else LOG.E('subscribeDigitalRead ' +err);
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
            else LOG.E('subscribeAnalogRead ' +err);
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
    this.method.unsubscribe('d'.charCodeAt(0) * 10 + pin);
};
ArduinoManager.prototype.unsubscribeAnalogRead = function(pin){
    this.method.unsubscribe('a'.charCodeAt(0) * 10 + pin);
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
            else LOG.E('attachInterrupt ' +err);
        }
        else {
            self.method.attachInterrupt(self.belzedoo, data);
            self.belzedoo.read(data.id, function (err, value) {
                if(!err)callback(err, value);
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
            else LOG.E('detachInterrupt ' +err);
        }
        else {
            self.method.detachInterrupt(self.belzedoo, data);
            self.belzedoo.read(data.id, function (err) {
                if(!err)callback();
            });
        }
    });
};

ArduinoManager.prototype.closePort = function(){
    var self = this;
    this.__getBelzedooPort(function (err) {
        if (!err) {
            self.belzedoo.close();
        }
    });
};

ArduinoManager.prototype.__getBelzedooPort = function (callback) {
    var that = this;
    queueOpen.push(function (next) {
        if (that.belzedoo) {
            callback(null);
            next();
        } else {
            that.belzedoo = new Belzedoo('/dev/' + that.port);
            that.belzedoo.open(function (err) {
                if (err) {
                    if(callback) callback(err);
                    else LOG.E('getBelzedoo ' +err);
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
        const port = `/dev/${this.port}`;
        this.resetArduino101(port,  (err) => {
            if(err) callback(new Error("reset port error"));
            else{
                execUpload('arduino101load',
                        ['-dfu=/usr/bin',
                            '-bin='+__dirname+'sketchs/x86.bin',
                            '-port='+port,
                            '-rtos_fw_str=',
                            '-rtos_fw_pos=0',
                            '-core=2.0.0'
                    ], callback)
            }
        });
    }else{
        if(callback) callback(new Error('board not supported'));
    }
};

ArduinoManager.prototype.unsubscribeAllAnalogDigital = function () {
    this.method.unsubscribeAll();
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
        else LOG.E(log + err);
    });

    child.on('close', function (code) {
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

ArduinoManager.prototype.resetArduino101 = function (port, callbaclk) {
    const SerialPort = require("serialport");

    var sp = new SerialPort(port, {
        baudRate : 1200
    });

    sp.on("open", function () {
        sp.set({dtr:false, rts:false});
        LOG.D("==== reset port =====");
        sp.close(null);
        LOG.D("==== close port =====");
        callbaclk(null, true);
    });

    sp.on("error", function () {
        LOG.E("==== error reset port =====");
        callbaclk(new Error("-1"), null);
    });
}
module.exports = ArduinoManager;
