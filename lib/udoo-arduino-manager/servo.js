// {"servo":"attach","pin":9}
// {"servo":"detach","pin":9}
// {"servo":"write","pin":9,"degrees":90} 

// {"success":true}

var LOG = require('./logger');

var ServoProvider = function () { }

var servo_obj = { 'servo': '', 'pin': 0 };
var servo_pin_degree_obj = { 'servo': 'write', 'pin': 0, 'degrees': 0 };

ServoProvider.prototype.attach = function (belzedoo, pin, id) {
    var tmp_obj = Object.assign({}, servo_obj);
    tmp_obj.servo = 'attach';
    tmp_obj.pin = pin;
    tmp_obj.id = id || 0;
    LOG.D('log ' + JSON.stringify(tmp_obj));
    belzedoo.write(tmp_obj);
};

ServoProvider.prototype.detach = function (belzedoo, pin, id) {
    var tmp_obj = Object.assign({}, servo_obj);
    tmp_obj.servo = 'detach';
    tmp_obj.pin = pin;
    tmp_obj.id = id || 0;
    LOG.D('log ' + JSON.stringify(tmp_obj));
    belzedoo.write(tmp_obj);
};

ServoProvider.prototype.writeServo = function (belzedoo, pin, degrees, id) {
    var tmp_obj = Object.assign({}, servo_pin_degree_obj);
    tmp_obj.servo = 'write';
    tmp_obj.pin = pin;
    tmp_obj.degrees = degrees;
    tmp_obj.id = id || 0;
    LOG.D('log ' + JSON.stringify(tmp_obj));
    belzedoo.write(tmp_obj);
};

ServoProvider.prototype.read = function (data, belzedoo, callback) { };

ServoProvider.prototype.write = function (data, belzedoo) {};

ServoProvider.prototype.subscribe = function (data, belzedoo, callback) { };

module.exports = ServoProvider;