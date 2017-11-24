var SerialPort = require('serialport');
var writeQueue = require("function-queue")();
var LOG = require('./logger');

function Belzedoo(port_name) {
  const parsers = SerialPort.parsers;

  const parser = new parsers.Readline({
        delimiter: '\r\n'
  });
  this.portName = port_name;
  this.port = new SerialPort(port_name, {
    autoOpen: false,
    baudRate: 115200,
  });

  this.readerProvider = {};
  this.port.pipe(parser);

  this.port.on('data', function (data) {
    LOG.D('read', data);

    try {
      data = JSON.parse(data);
    } catch (e) {
      LOG.E("not JSON " + e);
      if (data && this.readerProvider[data.id]) {
        this.readerProvider[data.id](e);
      }
    }
    if (data && this.readerProvider[data.id]) {
      this.readerProvider[data.id](null, data);
    }
  }.bind(this));
}

Belzedoo.prototype.getPort = function (callback) {
  if (this.port && this.port.isOpen) {
    if(callback) callback(null);
  } else {
    this.open(callback);
  }
};

Belzedoo.prototype.open = function (callback) {
  var that = this;
  this.port.open(function (err) {
    if (err) callback(err);
    else {
      if(callback) callback(null, that.port)
    };
  });
};


Belzedoo.prototype.write = function (dataw, callback) {
    this.getPort(function (err) {
        if (err) LOG.E('err', err);
        else {
            writeQueue.push(this.__fnqueue.bind(this), [JSON.stringify(dataw), callback]);
        }
    }.bind(this));
};

Belzedoo.prototype.__fnqueue = function (next, arg) {
    var data = arg[0];
    var callback = arg[1];
    if (!this.isClosed) {
        var callbackCalled = false;
        this.port.write(data + '\n');
        this.read(JSON.parse(data).id, function (err, msg) {
            if (!callbackCalled) {
                next();
                if(callback)
                    callback(err, msg);
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
        }, 200);
    } else {
        next();
       if(callback) callback();
    }
};


Belzedoo.prototype.read = function (id, callback) {
  this.readerProvider[id] = callback;
};

Belzedoo.prototype.close = function () {
  var that = this;
  this.getPort(function (err) {
    if (err) LOG.E('err', err);
    else {
      writeQueue.push(function (callback) {
        that.port.close();
        that.isClosed = true;
        callback();
      });
    }
  });
};

process.on('exit', (code) =>{
    if(this.port) this.port.close();
});

module.exports = Belzedoo;