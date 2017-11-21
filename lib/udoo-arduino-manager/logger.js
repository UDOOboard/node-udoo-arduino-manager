var LOG = exports;

/**
 * @levelIdx
 * 0 -> error
 * 1 -> warn
 * 2 -> info
 * 3 -> debug
 * 4 -> verbose
 */
LOG.__debugLevel = 2;

LOG.E = (message) => { LOG.__log(0, message) };
LOG.W = (message) => { LOG.__log(1, message) };
LOG.I = (message) => { LOG.__log(2, message) };
LOG.D = (message) => { LOG.__log(3, message) };
LOG.V = (message) => { LOG.__log(4, message) };


LOG.__log = function(levelIdx, message) {
    const levels = ['\033[91mERR', '\033[93mWARN', '\033[92mINF0', '\033[94mDEB', 'VERB'];
    if(levelIdx <= LOG.__debugLevel) {
        const date = new Date().toISOString().
        replace(/T/, ' ').      // replace T with a space
        replace(/\..+/, '');
        if (typeof message !== 'string') {
            message = JSON.stringify(message);
        }
        console.log(`${date} ${levels[levelIdx]}: ${message}`+'\033[0m');
    }
};