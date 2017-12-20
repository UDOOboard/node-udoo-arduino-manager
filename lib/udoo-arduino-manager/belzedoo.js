var SerialPort = require('serialport');
var writeQueue = require("function-queue")();
var LOG = require('./logger');

function Belzedoo(port_name) {

  this.portName = port_name;
  this.port = new SerialPort(port_name, {
    autoOpen: false,
    baudRate: 115200,
  });

  this.readerProvider = {};
}

Belzedoo.prototype.__bindParser = function (callback) {
  const parsers = SerialPort.parsers;
  const Readline = SerialPort.parsers.Readline;
  
  this.parser = this.port.pipe(new Readline({ delimiter: '\n' }));
  this.parser.on('data',  (chunk) => {
    LOG.D(`read ${chunk}`);

    var data = null;
    try {
      data = JSON.parse(chunk);
    } catch (e) {
      LOG.E(`Belzedoo not JSON  ${e} => ${data}`);
      if (data && this.readerProvider[data.id]) {
        this.readerProvider[data.id](e);
      }
    }
    if (data && this.readerProvider[data.id]) {
      this.readerProvider[data.id](null, data);
    }
  });
};

Belzedoo.prototype.getPort = function (callback) {
  if (this.port && this.port.isOpen) {
    if(callback) callback(null);
  } else {
    this.open(callback);
  }
};

Belzedoo.prototype.open = function (callback) {
  var that = this;
  this.port.open( (err) => {
    if (err) callback(err);
    else {
      this.__bindParser();
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
                    callback(new Error('Belzedoo: Queue Timeout'));
                callbackCalled = true;
            }
        }, 5000);
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
