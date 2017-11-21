// {"method":"pinMode","pin":13,"value":0}       resp {"success":true} 0 -> in / 1 -> out
// {"method":"digitalWrite","pin":13,"value":0}  resp {"success":true}
// {"method":"digitalRead","pin":13}             resp {"success":true,"value":1}
// {"method":"analogRead","pin":54}              resp {"success":true,"value":1012}
// {"method":"analogWrite","pin":54,"value":0}   resp {"success":true}
// {"method":"attachInterrupt","pin":7,"mode":2} resp {"success":true}
// {"method":"detachInterrupt","pin":7}          resp {"success":true}
// {"method":"disconnect"}                       resp {"disconnected":true}

var method_obj = { 'method': '', 'id': 0 };
var method_pin_obj = { 'method': '', 'pin': 0, 'id': 0 };
var method_pin_value_obj = { 'method': '', 'pin': 0, 'value': 0, 'id': 0 };
var method_pin_mode_obj = { 'method': '', 'pin': 0, 'mode': 0, 'id': 0 };
var LOG = require('./logger');

function Method() {
 this.callbacks = [];
}

Method.prototype.hiBelzedoo = function (belzedoo, callback) {
    var tmp_obj = method_obj;
    tmp_obj.method = 'hi';
    tmp_obj.id = 666;
    LOG.D('log ' + JSON.stringify(tmp_obj));
    belzedoo.write(tmp_obj, function(err, data){
        if(err) callback(new Error("sketch not respond"));
        else if(data && data.version >0){
            callback(null, data.version);
        }else{
            callback(new Error("sketch not found"));
        }
    });

};

Method.prototype.writePinMode = function (belzedoo, data) {
    var tmp_obj = method_pin_value_obj;
    tmp_obj.method = 'pinMode';
    tmp_obj.pin = data.pin;
    tmp_obj.value = data.mode;
    tmp_obj.id = data.id || 0;
    LOG.D('log ' + JSON.stringify(tmp_obj));
    belzedoo.write(tmp_obj);
};

Method.prototype.writeDigital = function (belzedoo, data) {
    data.mode = 1;
    this.writePinMode(belzedoo, data);
    var tmp_obj = method_pin_value_obj;
    tmp_obj.method = 'digitalWrite';
    tmp_obj.pin = data.pin;
    tmp_obj.value = data.value;
    tmp_obj.id = data.id || 0;
    LOG.D('log ' + JSON.stringify(tmp_obj));
    belzedoo.write(tmp_obj);
};

//{"method":"timedDigitalWrite", "pin":13, "value":1, "delay":1000}


Method.prototype.writeTimedDigital = function (belzedoo, data) {
    var tmp_obj = method_pin_value_obj;
    tmp_obj.method = 'timedDigitalWrite';
    tmp_obj.pin = data.pin;
    tmp_obj.value = data.value;
    tmp_obj.delay = data.delay;
    tmp_obj.id = data.id || 0;
    LOG.D('log ' + JSON.stringify(tmp_obj));
    belzedoo.write(tmp_obj);
};


Method.prototype.attachInterrupt = function (belzedoo, data) {
    var tmp_obj = method_pin_mode_obj;
    tmp_obj.method = 'attachInterrupt';
    tmp_obj.pin = data.pin;
    tmp_obj.mode = data.mode;
    tmp_obj.id = data.id || 0;
    tmp_obj.interrupt_id = tmp_obj.id;
    LOG.D('log ' + JSON.stringify(tmp_obj));
    belzedoo.write(tmp_obj);
};

Method.prototype.detachInterrupt = function (belzedoo, data) {
    var tmp_obj = method_pin_mode_obj;
    tmp_obj.method = 'detachInterrupt';
    tmp_obj.pin = data.pin;
    tmp_obj.id = data.id || 0;
    LOG.D('log ' + JSON.stringify(tmp_obj));
    belzedoo.write(tmp_obj);
};


Method.prototype.writeAnalog = function (belzedoo, data) {
    var tmp_obj = method_pin_value_obj;
    tmp_obj.method = 'analogWrite';
    tmp_obj.pin = data.pin;
    tmp_obj.value = data.value;
    tmp_obj.id = data.id || 0;
    LOG.D('log ' + JSON.stringify(tmp_obj));
    belzedoo.write(tmp_obj);
};

Method.prototype.readDigital = function (belzedoo, data, callback) {
    data.mode = 0;
    this.writePinMode(belzedoo, data);
    var tmp_obj = method_pin_obj;
    tmp_obj.method = 'digitalRead';
    tmp_obj.pin = data.pin;
    tmp_obj.id = data.id || 0;
    LOG.D('log ' + JSON.stringify(tmp_obj));
    belzedoo.write(tmp_obj, callback);
};

Method.prototype.readAnalog = function (belzedoo, data, callback) {
    var tmp_obj = method_pin_obj;
    tmp_obj.method = 'analogRead';
    tmp_obj.pin = data.pin || 0;
    tmp_obj.id = data.id || 0;
    LOG.D('log ' + JSON.stringify(tmp_obj));
    belzedoo.write(tmp_obj, callback);
};

Method.prototype.notifyDigital = function (belzedoo, data, notifyCallback) {
    var that = this;
    if(!data.interval || data.interval < 100){
        data.interval = 100;
    }
    this.callbacks[data.id] = setInterval(function(){
        that.readDigital(belzedoo, data, notifyCallback);
    }, data.interval);
};

Method.prototype.notifyAnalog = function (belzedoo, data, notifyCallback) {
    var that = this;
    if(!data.interval || data.interval < 100){
        data.interval = 100;
    }
    this.callbacks[data.id] = setInterval(function(){
        that.readAnalog(belzedoo, data, notifyCallback);
    }, data.interval);
};

Method.prototype.unsubscribe = function (pin) {
    var intervalId = this.callbacks[pin];
    if(intervalId){
        clearInterval(intervalId);
    }
};

Method.prototype.unsubscribeAll = function () {
    if (this.callbacks && this.callbacks.length > 0) {
        this.callbacks.filter(function (timeoutObj) {
            return timeoutObj !== undefined;
        }).forEach(function (timeoutObj) {
            clearInterval(timeoutObj);
        });
        this.callbacks = [];
    }
};

Method.prototype.read = function (data, belzedoo, callback) {
    this.hiBelzedoo(belzedoo, callback);
};

Method.prototype.write = function (data, belzedoo) {};

Method.prototype.subscribe = function (data, belzedoo, notifyCallback) {
    var that = this;
    if(!data.interval || data.interval < 100){
        data.interval = 100;
    }
    this.callbacks[data.id] = setInterval(function(){
        that.hiBelzedoo(data, belzedoo, notifyCallback);
    }, data.interval);
};

module.exports = Method;