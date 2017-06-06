// {"servo":"attach","pin":9}
// {"servo":"detach","pin":9}
// {"servo":"write","pin":9,"degrees":90} 

// {"success":true}
// {"success":true}
// {"success":true}

var ServoProvider = function () { }

var servo_obj = { 'servo': '', 'pin': 0 };
var servo_pin_degree_obj = { 'servo': 'write', 'pin': 0, 'degrees': 0 };

ServoProvider.prototype.attach = function (belzedoo, data) {
    var tmp_obj = servo_obj;
    tmp_obj.servo = 'attach';
    tmp_obj.pin = data.pin;
    tmp_obj.id = data.id || 0;
    console.log('log ' + JSON.stringify(tmp_obj));
    belzedoo.write(tmp_obj);
};

ServoProvider.prototype.detach = function (belzedoo, data) {
    var tmp_obj = servo_obj;
    tmp_obj.servo = 'detach';
    tmp_obj.pin = data.pin;
    tmp_obj.id = data.id || 0;
    console.log('log ' + JSON.stringify(tmp_obj));
    belzedoo.write(tmp_obj);
};

ServoProvider.prototype.writeServo = function (belzedoo, data) {
    this.attach(belzedoo, data);
    var tmp_obj = servo_pin_degree_obj;
    tmp_obj.servo = 'write';
    tmp_obj.pin = data.pin;
    tmp_obj.degrees = data.degrees;
    tmp_obj.id = data.id || 0;
    console.log('log ' + JSON.stringify(tmp_obj));
    belzedoo.write(tmp_obj);
};

ServoProvider.prototype.read = function (data, belzedoo, callback) { }

ServoProvider.prototype.write = function (data, belzedoo) {
    var servoData = {};
    servoData.pin = parseInt(data.pin);
    servoData.degrees = parseInt(data.value);
    this.attach(belzedoo, servoData);
    this.writeServo(belzedoo, servoData);
};

ServoProvider.prototype.subscribe = function (data, belzedoo, callback) { };

module.exports = ServoProvider;