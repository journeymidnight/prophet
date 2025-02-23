var formatFuncCreator = function(factor, units) {
    return function(val, axis) {
        var whole, decimal;
        var unitIndex = 0;
        var unitCount = units.length;
        while(true) {
            whole = val.toString().split('.')[0];
            decimal = val.toString().split('.')[1];

            if(whole.length > 3 && unitIndex+1 < unitCount) {
                val = val / factor;
                unitIndex += 1;
            } else { break;}
        }
        var suffix = units[unitIndex];

        if(decimal) {
            return whole + '.' + decimal.slice(0,2) + suffix;  // keep only 2 decimals
        } else {
            return whole + suffix;
        }
    }
};

var byte = formatFuncCreator(1024, [' B', ' KiB', ' MiB', ' GiB', ' TiB', ' PiB', ' EiB', ' ZiB', ' YiB']);
var bps = formatFuncCreator(1024, [' Bps', ' KiBps', ' MiBps', ' GiBps', ' TiBps', ' PiBps',
    ' EiBps', ' ZiBps', ' YiBps']);
var ms = formatFuncCreator(1000, [' ms', ' s']);
var sec = formatFuncCreator(60, [' s', ' min', ' h']);

var percent = function(val, axis) {
    var whole = val.toString().split('.')[0],
        decimal = val.toString().split('.')[1];
    if(decimal) {
        return whole + '.' + decimal.slice(0,2) + ' %';  // keep only 2 decimals
    } else {
        return whole + ' %';
    }
};


module.exports = {
    byte: byte,
    Bps: bps,
    percent: percent,
    ms: ms,
    Sec: sec
};