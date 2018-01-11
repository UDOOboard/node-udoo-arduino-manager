var LOG = require('./logger');

var ActuatorProvider = function () {}

ActuatorProvider.prototype.setGrooveLED = function (belzedoo, pin, mode, args, id) {
    var obj = Object.assign({
        'id': id,
        'actuator': 'P9813',
        'pin': pin,
        'mode': mode.toLowerCase()
    }, args);
    LOG.D('log ' + JSON.stringify(obj));
    belzedoo.write(obj);
};

module.exports = ActuatorProvider;
