// {"sensor":"DHT11","pin":4}
// {"sensor":"DHT22","pin":4}
// {"sensor":"TCS34725"}
// {"sensor":"HUMIDITY_BRICK"}
// {"sensor":"LIGHT_BRICK"} 

var LOG = require('./logger');
var sensor_obj = { 'sensor': ''};
var sensor_pin_obj = { 'sensor': '', 'pin': 0 };

var SensorProvider = function () {};

SensorProvider.prototype.readSensor = function (belzedoo, name, id, callback) {
    var tmp_obj = Object.assign({}, sensor_obj);
    tmp_obj.sensor = name;
    tmp_obj.id = id || 0;
    LOG.D('log ' + JSON.stringify(tmp_obj));
    belzedoo.write(tmp_obj);
    belzedoo.read(id, callback);
};

SensorProvider.prototype.readSensorPin = function (belzedoo, name, pin, id, callback) {
    var tmp_obj = Object.assign({}, sensor_pin_obj);
    tmp_obj.sensor = name;
    tmp_obj.pin = pin;
    tmp_obj.id = id || 0;
    belzedoo.write(tmp_obj);
    belzedoo.read(id, callback);
};

SensorProvider.prototype.notifySensor = function (belzedoo, name, id, interval, notifyCallback) {
    setInterval(() =>{
        this.readSensor(belzedoo, name, id, notifyCallback);
    }, interval);
}

SensorProvider.prototype.notifySensorPin = function (belzedoo, name, pin, id, interval, notifyCallback) {
    setInterval(()=>{
        this.readSensorPin(belzedoo, name, pin, id, notifyCallback);
    }, interval);
};

SensorProvider.prototype.scanI2CSensors = function (belzedoo, id, callback) {
    var obj = Object.assign({}, sensor_obj);
    obj.sensor = 'scanI2C';
    obj.id = id;
    LOG.D('log ' + JSON.stringify(obj));
    belzedoo.write(obj, callback);
};

SensorProvider.prototype.read = function (data, belzedoo, callback) {

};

SensorProvider.prototype.write = function (data, belzedoo, calllback) {
   
};

SensorProvider.prototype.subscribe = function (data, belzedoo, callback) {
   
};


module.exports = SensorProvider;