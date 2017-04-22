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

var MethodsProvider = function () {}

MethodsProvider.prototype.hiBelzedoo = function (belzedoo, callback) {
    var tmp_obj = method_obj;
    tmp_obj.method = 'hi';
    tmp_obj.id = 666;
    console.log('log ' + JSON.stringify(tmp_obj));
    belzedoo.write(tmp_obj, function(err, data){
        if(err) callback(new Error("sketch not respond"));
        else if(data && data.version >0){
            callback(null, data.version);
        }else{
            callback(new Error("sketch not found"));
        }
    });

};

MethodsProvider.prototype.writePinMode = function (belzedoo, data) {
    var tmp_obj = method_pin_value_obj;
    tmp_obj.method = 'pinMode';
    tmp_obj.pin = data.pin;
    tmp_obj.value = data.mode;
    tmp_obj.id = data.id || 0;
    console.log('log ' + JSON.stringify(tmp_obj));
    belzedoo.write(tmp_obj);
};

MethodsProvider.prototype.writeDigital = function (belzedoo, data) {
    var tmp_obj = method_pin_value_obj;
    tmp_obj.method = 'digitalWrite';
    tmp_obj.pin = data.pin;
    tmp_obj.value = data.value;
    tmp_obj.id = data.id || 0;
    console.log('log ' + JSON.stringify(tmp_obj));
    belzedoo.write(tmp_obj);
};

MethodsProvider.prototype.attachInterrupt = function (belzedoo, data) {
    var tmp_obj = method_pin_mode_obj;
    tmp_obj.method = 'attachInterrupt';
    tmp_obj.pin = data.pin;
    tmp_obj.mode = data.mode;
    tmp_obj.id = data.id || 0;
    tmp_obj.interrupt_id = tmp_obj.id;
    console.log('log ' + JSON.stringify(tmp_obj));
    belzedoo.write(tmp_obj);
};

MethodsProvider.prototype.writeAnalog = function (belzedoo, data) {
    var tmp_obj = method_pin_value_obj;
    tmp_obj.method = 'analogWrite';
    tmp_obj.pin = data.pin;
    tmp_obj.value = data.value;
    tmp_obj.id = data.id || 0;
    console.log('log ' + JSON.stringify(tmp_obj));
    belzedoo.write(tmp_obj);
};

MethodsProvider.prototype.readDigital = function (belzedoo, data, callback) {
    var tmp_obj = method_pin_obj;
    tmp_obj.method = 'digitalRead';
    tmp_obj.pin = data.pin;
    tmp_obj.id = data.id || 0;
    console.log('log ' + JSON.stringify(tmp_obj));
    belzedoo.write(tmp_obj, callback);
};



MethodsProvider.prototype.readAnalog = function (belzedoo, data, callback) {
    var tmp_obj = method_pin_obj;
    tmp_obj.method = 'analogRead';
    tmp_obj.pin = data.pin || 0;
    tmp_obj.id = data.id || 0;
    console.log('log ' + JSON.stringify(tmp_obj));
    belzedoo.write(tmp_obj, callback);
};

MethodsProvider.prototype.notifyDigital = function (belzedoo, data, notifyCallback) {
    var that = this;
    if(!data.interval || data.interval < 100){
        data.interval = 100;
    }
    setInterval(function(){
        that.readDigital(belzedoo, data, notifyCallback);
    }, data.interval);
};

MethodsProvider.prototype.notifyAnalog = function (belzedoo, data, notifyCallback) {
    var that = this;
    if(!data.interval || data.interval < 100){
        data.interval = 100;
    }
    setInterval(function(){
        that.readAnalog(belzedoo, data, notifyCallback);
    }, data.interval);
};

MethodsProvider.prototype.read = function (data, belzedoo, callback) {
    this.hiBelzedoo(belzedoo, callback);
};

MethodsProvider.prototype.write = function (data, belzedoo) {};

MethodsProvider.prototype.subscribe = function (data, belzedoo, notifyCallback) {
    var that = this;
    if(!data.interval || data.interval < 100){
        data.interval = 100;
    }
    setInterval(function(){
        that.hiBelzedoo(data, belzedoo, notifyCallback);
    }, data.interval);
};

module.exports = MethodsProvider;