var SerialPort = require('serialport');
var writeQueue = require("function-queue")();

var port = {};
var portName = '';
var ports = {};
var readerProvider = {};
var isClosed = false;

var Belzedoo = function (port_name) {
  this.port = new SerialPort(port_name, {
    autoOpen: false,
    baudRate: 115200,
    parser: SerialPort.parsers.readline('\n')
  });

  this.portName = port_name;
  this.readerProvider = {};
  var that = this;
  this.port.on('data', function (data) {
    console.log('read', data);

    try {
      data = JSON.parse(data);
    } catch (e) {
      console.log("not JSON " + e);
      if (data && data.id != undefined && that.readerProvider[data.id]) {
        that.readerProvider[data.id](e);
      }
    }
    if (data && data.id != undefined && that.readerProvider[data.id]) {
      that.readerProvider[data.id](null, data);
    }
  });
}

Belzedoo.prototype.getPort = function (callback) {
  if (this.port != undefined && this.port.isOpen()) {
    callback(null);
  } else {
    this.open(callback);
  }
};

Belzedoo.prototype.open = function (callback) {
  var that = this;
  this.port.open(function (err) {
    if (err) callback(err);
    else {
      callback(null, that.port)
    };
  });
};

Belzedoo.prototype.write = function (data, callback) {
  var that = this;
  this.getPort(function (err) {
    if (err) console.log('err', err);
    else {
      writeQueue.push(function (next) {
        if (!that.isClosed) {
          var callbackCalled = false;
          that.port.write(JSON.stringify(data) + '\n');
          that.read(data.id, function (err, data) {
            if (!callbackCalled) {
              next();
              if(callback)
                  callback(err, data);
              callbackCalled = true;
            }
          });

          setTimeout(function () {
            if (!callbackCalled) {
              next();
              if(callback)
                  callback(new Error('Notification Timeout'));
              callbackCalled = true;
            }
          }, 1000);
        } else {
          callback();
        }
      });
    }
  });
};

Belzedoo.prototype.read = function (id, callback) {
  this.readerProvider[id] = callback;
};

Belzedoo.prototype.close = function () {
  var that = this;
  this.getPort(function (err) {
    if (err) console.log('err', err);
    else {
      writeQueue.push(function (callback) {
        that.port.close();
        that.isClosed = true;
        callback();
      });
    }
  });
};

module.exports = Belzedoo;