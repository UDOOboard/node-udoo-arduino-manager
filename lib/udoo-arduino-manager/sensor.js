// {"sensor":"DHT11","pin":4}
// {"sensor":"DHT22","pin":4}
// {"sensor":"TCS34725"}
// {"sensor":"HUMIDITY_BRICK"}
// {"sensor":"LIGHT_BRICK"} 

var LOG = require('./logger');
var sensor_obj = { 'sensor': ''};
var sensor_pin_obj = { 'sensor': '', 'pin': 0 };

var SensorProvider = function () {}

SensorProvider.prototype.readSensor = function (belzedoo, data) {
    var tmp_obj = sensor_obj;
    tmp_obj.sensor = data.name;
    tmp_obj.id = data.id || 0;
    LOG.D('log ' + JSON.stringify(tmp_obj));
    belzedoo.write(tmp_obj);
    belzedoo.read(data.id, callback);
};

SensorProvider.prototype.readSensorPin = function (belzedoo, data, callback) {
    var tmp_obj = sensor_pin_obj;
    tmp_obj.sensor = data.name;
    tmp_obj.pin = data.pin;
    tmp_obj.id = data.id || 0;
    belzedoo.write(tmp_obj);
    belzedoo.read(data.id, callback);
};

SensorProvider.prototype.notifySensor = function (belzedoo, data, notifyCallback) {
    var that = this;
    setInterval(function(){
        that.readSensor(belzedoo, data, notifyCallback);
    }, data.interval);
}

SensorProvider.prototype.notifySensorPin = function (belzedoo, data, notifyCallback) {
    var that = this;
    setInterval(function(){
        that.readSensorPin(belzedoo, data, notifyCallback);
    }, data.interval);
}

SensorProvider.prototype.read = function (data, belzedoo, callback) {

}

SensorProvider.prototype.write = function (data, belzedoo, calllback) {
   
};

SensorProvider.prototype.subscribe = function (data, belzedoo, callback) {
   
};


module.exports = SensorProvider;