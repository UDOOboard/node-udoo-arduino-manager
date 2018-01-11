var Method = require('./method');
var Belzedoo = require('./belzedoo');
var Servo = require('./servo');
var Sensor = require('./sensor');
var Actuator = require('./actuator');
var queueOpen = require("function-queue")();
var LOG = require('./logger');

function ArduinoManager (port) {
    this.method = new Method();
    this.servo = new Servo();
    this.sensor = new Sensor();
    this.actuator = new Actuator();
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
    this.__getBelzedooPort((err) =>{
        if (err) callback(err);
        else {
            this.method.hiBelzedoo(this.belzedoo, callback);
        }
    });
};

ArduinoManager.prototype.isInstalled = function (callback) {
    this.__getBelzedooPort((err) => {
        if (err) callback(err);
        else {
            this.method.hiBelzedoo(this.belzedoo, function (err, data) {
                if (err) {
                    if (callback) callback(err);
                }
                else {
                    if (callback) callback(null, data > 0);
                }
            });
        }
    });
};

ArduinoManager.prototype.setPinMode = function(pin, mode, callback){
    LOG.W('pinMode is deprecated!');

    const id = 'd'.charCodeAt(0) * 10 + pin;
    this.__getBelzedooPort((err) =>{
        if (err){
            if(callback)callback(err);
            else LOG.E('setPinMode ' +err);
        }
        else {
            this.method.writePinMode(this.belzedoo, pin ,mode, id);
        }
    });
};

ArduinoManager.prototype.digitalWrite = function(pin, value, callback){
    if (typeof value === "string") {
        if (value === "HIGH" || value === "high") value = 1;
        else value = 0;
    }

    const id = 'd'.charCodeAt(0) * 10 + pin;

    this.__getBelzedooPort((err) =>{
        if (err) {
            if(callback) callback(err);
            else LOG.E('digitalWrite ' +err);
        }
        else {
            this.method.writeDigital(this.belzedoo, pin, value, id);
        }
    });
};

ArduinoManager.prototype.timedDigitalWrite = function(pin, value, delay, callback){
    const id = 'd'.charCodeAt(0) * 10 + pin;

    this.__getBelzedooPort( (err) => {
        if (err) {
            if(callback) callback(err);
            else LOG.E('digitalWrite ' +err);
        }
        else {
            this.method.writeTimedDigital(this.belzedoo, pin, value, delay, id);
        }
    });
};

ArduinoManager.prototype.digitalRead = function(pin, callback){
    const id = 'd'.charCodeAt(0) * 10 + pin;

    this.__getBelzedooPort((err) =>{
        if (err)
            if(callback) callback(err);
            else LOG.E('digitalRead ' +err);
        else {
            this.method.readDigital(this.belzedoo, pin, id, callback);
        }
    });
};

ArduinoManager.prototype.analogWrite = function(pin, value, callback){
    const id = 'a'.charCodeAt(0) * 10 + pin;
    this.__getBelzedooPort((err) => {
        if (err) {
            if(callback) callback(err);
            else LOG.E('analogWrite ' +err);
        }
        else {
            this.method.writeAnalog(this.belzedoo, pin, value, id);
        }
    });
};
ArduinoManager.prototype.analogRead = function(pin, callback){
    const id = 'a'.charCodeAt(0) * 10 + pin;

    this.__getBelzedooPort((err) => {
        if (err) {
            if(callback) callback(err);
            else LOG.E('analogRead ' +err);
        }
        else {
            this.method.readAnalog(this.belzedoo, pin, id, callback);
        }
    });
};

ArduinoManager.prototype.repeatedAnalogRead = function(pin, samples, frequency, callback) {
    const id ='a'.charCodeAt(0) * 10 + pin;

    this.__getBelzedooPort((err) => {
        if (err) {
            if(callback) callback(err);
            else LOG.E('repeatedAnalogRead ' +err);
        }
        else {
            this.method.readAnalogRepeated(this.belzedoo, pin, samples, frequency, id, callback);
        }
    });
};

ArduinoManager.prototype.servoAttach = function(pin, callback){
    LOG.W('servoAttach is deprecated!');

    const id = 'd'.charCodeAt(0) * 10 + pin;

    this.__getBelzedooPort((err) => {
        if (err) {
            if(callback) callback(err);
            else LOG.E('servoAttach ' +err);
        }
        else {
            this.servo.attach(this.belzedoo, pin, id);
        }
    });
};
ArduinoManager.prototype.servoDetach = function(pin, callback){

    const id = 'd'.charCodeAt(0) * 10 + pin;

    this.__getBelzedooPort(function (err) {
        if (err) {
            if(callback) callback(err);
            else LOG.E('servoDetach ' +err);
        }
        else {
            this.servo.detach(this.belzedoo, pin, id);
        }
    });
};
ArduinoManager.prototype.servoWrite = function(pin, degrees, callback){
    const id = 'd'.charCodeAt(0) * 100 + pin*10 + degrees;

    this.__getBelzedooPort((err) =>{
        if (err) {
            if(callback) callback(err);
            else LOG.E('servoWrite ' +err);
        }
        else {
            this.servo.writeServo(this.belzedoo, pin, degrees, id);
        }
    });
};

ArduinoManager.prototype.setGrooveLED = function(pin, mode, args, callback) {
    const id= 'a'.charCodeAt(0) * 10 + pin + JSON.stringify(args).length;

    this.__getBelzedooPort( (err) =>{
        if (err) {
            if(callback) callback(err);
            else LOG.E('setGrooveLED ' +err);
        }
        else {
            this.actuator.setGrooveLED(this.belzedoo, pin, mode, args, id, callback);
        }
    });
};

ArduinoManager.prototype.scanI2CSensors = function(callback) {
    const id= 's'.charCodeAt(0) * 10;

    this.__getBelzedooPort( (err) =>{
        if (err) {
            if(callback) callback(err);
            else LOG.E('scanI2CSensors ' +err);
        }
        else {
            this.sensor.scanI2CSensors(this.belzedoo, id, callback);
        }
    });
};

ArduinoManager.prototype.readTemperatureBrick = function(callback) {
    const id= 's'.charCodeAt(0) * 10 + 1;

    this.__getBelzedooPort( (err) =>{
        if (err) {
            if (callback) callback(err);
            else LOG.E('readTemperatureBrick ' +err);
        }
        else {
            this.sensor.readBrick(this.belzedoo, 'TEMPERATURE_BRICK', id, callback);
        }
    });
};

ArduinoManager.prototype.readLightBrick = function(callback) {
    const id= 's'.charCodeAt(0) * 10 + 2;

    this.__getBelzedooPort( (err) =>{
        if (err) {
            if (callback) callback(err);
            else LOG.E('readLightBrick ' +err);
        }
        else {
            this.sensor.readBrick(this.belzedoo, 'LIGHT_BRICK', id, callback);
        }
    });
};

ArduinoManager.prototype.readHumidityBrick = function(callback) {
    const id= 's'.charCodeAt(0) * 10 + 3;

    this.__getBelzedooPort( (err) =>{
        if (err) {
            if (callback) callback(err);
            else LOG.E('readHumidityBrick ' +err);
        }
        else {
            this.sensor.readBrick(this.belzedoo, 'HUMIDITY_BRICK', id, callback);
        }
    });
};

ArduinoManager.prototype.readPressureBrick = function(callback) {
    const id= 's'.charCodeAt(0) * 10 + 4;

    this.__getBelzedooPort( (err) =>{
        if (err) {
            if (callback) callback(err);
            else LOG.E('readPressureBrick ' +err);
        }
        else {
            this.sensor.readBrick(this.belzedoo, 'PRESSURE_BRICK', id, callback);
        }
    });
};

ArduinoManager.prototype.dht11Read = function (pin, callback) {};
ArduinoManager.prototype.dht22Read = function () {};
ArduinoManager.prototype.humidityBrickRead = function () {};
ArduinoManager.prototype.lightBrickRead = function () {};

ArduinoManager.prototype.subscribeDigitalRead = function (pin, interval, callback) {
    const id = 'd'.charCodeAt(0) * 10 + pin;

    this.__getBelzedooPort(function (err) {
        if (err) {
            if(callback) callback(err);
            else LOG.E('subscribeDigitalRead ' +err);
        }
        else {
            this.method.notifyDigital(this.belzedoo, pin, id, interval, callback);
        }
    });
};

ArduinoManager.prototype.subscribeAnalogRead = function(pin, interval, callback){
    const id = 'a'.charCodeAt(0) * 10 + pin;

    this.__getBelzedooPort((err) =>{
        if (err) {
            if(callback) callback(err);
            else LOG.E('subscribeAnalogRead ' +err);
        }
        else {
            this.method.notifyAnalog(this.belzedoo, pin, id, interval, callback);
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
    const id = 'i'.charCodeAt(0) * 10 + pin;

    this.__getBelzedooPort((err) =>{
        if (err) {
            if(callback) callback(err);
            else LOG.E('attachInterrupt ' +err);
        }
        else {
            this.method.attachInterrupt(this.belzedoo, pin, mode, id, ()=>{
                // this.belzedoo.read(id, function (err, value) {
                //     if(!err && callback)callback(err, value);
                // });
                this.belzedoo.read(id, callback);
            });

        }
    });
};

ArduinoManager.prototype.detachInterrupt = function(pin, callback){
    const id = 'I'.charCodeAt(0) * 10 + pin;

    this.__getBelzedooPort((err) =>{
        if (err) {
            if(callback) callback(err);
            else LOG.E('detachInterrupt ' +err);
        }
        else {
            this.method.detachInterrupt(this.belzedoo, pin, id, callback);
            // this.belzedoo.read(id, function (err) {
            //     if(!err)callback();
            // });
        }
    });
};

ArduinoManager.prototype.closePort = function(){
    this.__getBelzedooPort((err) =>{
        if (!err) {
            this.belzedoo.close();
        }
    });
};

ArduinoManager.prototype.__getBelzedooPort = function (callback) {
    queueOpen.push( (next) =>{
        if (this.belzedoo) {
            if(callback) callback(null);
            next();
        } else {
            this.belzedoo = new Belzedoo('/dev/' + this.port);
            this.belzedoo.open((err) => {
                if (err) {
                    this.belzedoo = null;

                    if(callback) callback(err);
                    else LOG.E('getBelzedoo ' +err);
                }
                else {
                    if(callback) callback(null);
                }
                next();
            });
        }
    });
};

ArduinoManager.prototype.uploadSketch = function (board, callback) {
    if(this.belzedoo){
        this.unsubscribeAllAnalogDigital();
        this.belzedoo.close();
        delete this.belzedoo;
    }

    if (board === 'neo') {
        //udooneo-m4uploader.sh lib/sketches/neo.fw
        this.__execUpload('udooneo-m4uploader', [__dirname+'/sketches/neo.fw'], callback);
    }else if(board === 'quad'){
        //bossac-udoo --port=ttymxc3 -U false -e -w -v -b quad.fw -R
        this.__execUpload('bossac-udoo', ['--port=ttymxc3', '-U' ,'false', '-e', '-w', '-v', '-b', __dirname+'/sketches/quad.fw', '-R'], callback);
    }else if(board === 'x86'){
        const port = `/dev/${this.port}`;
        this.resetArduino101(port,  (err) => {
            if(err) callback("Reset port error");
            else{
                this.__execUpload('arduino101load',
                    ['-dfu=/usr/bin',
                        '-bin='+__dirname+'/sketches/x86.bin',
                        '-port='+port,
                        '-core=2.0.0'
                    ], callback)
            }
        });
    }else{
        if(callback) callback('Board not supported');
    }
};

ArduinoManager.prototype.unsubscribeAllAnalogDigital = function () {
    this.method.unsubscribeAll();
};

ArduinoManager.prototype.__execUpload = function(command, args, callback) {
    var log = 'Upload sketch -> ';

    const spawn = require('child_process').spawn;
    const child = spawn(command, args, {
        detached: false,
        stdio: ['ignore', 'pipe', 'pipe']
    });

    child.stdout.on('data',function (data) {
        LOG.D(`DATA ${data}`);
        process.stdout.write("-");
    });

    child.stderr.on('data',function (err) {
        LOG.D(`errd  ${err}`);
        if (callback) callback(log + err);
        else LOG.E(log + err);
    });

    child.on('close', (code) =>{
        LOG.D(`close  ${code}`);

        if(callback){
            if(code === 0){
                setTimeout(() => {                                            
                    if (callback) callback(null, log + 'success');                        
                }, 25000);        
            } else {
                callback("Error upload sketch");
            }
        }
    });

    child.on('error', function (error) {
        LOG.D(`error  ${error}`);
        if (error) callback(log + error);
        else console.error(log + error);
    });
};

ArduinoManager.prototype.resetArduino101 = function (port, callback) {
    const SerialPort = require("serialport");

    var sp = new SerialPort(port || `/dev/${this.port}`, {
        baudRate : 1200
    });

    sp.on("open", function () {
        sp.set({dtr:false, rts:false});
        LOG.D("==== reset port =====");
        sp.close(null);
        LOG.D("==== close port =====");
        if (callback) callback(null, true);
    });

    sp.on("error", function () {
        LOG.E("==== error reset port =====");
        if (callback) callback("Error reset port", null);
    });
};

module.exports = ArduinoManager;
