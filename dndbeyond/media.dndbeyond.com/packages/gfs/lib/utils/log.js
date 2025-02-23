export var LOG_LEVEL;
(function (LOG_LEVEL) {
    LOG_LEVEL[LOG_LEVEL["INFO"] = 0] = "INFO";
    LOG_LEVEL[LOG_LEVEL["WARN"] = 1] = "WARN";
    LOG_LEVEL[LOG_LEVEL["ERROR"] = 2] = "ERROR";
    LOG_LEVEL[LOG_LEVEL["NONE"] = 3] = "NONE";
})(LOG_LEVEL || (LOG_LEVEL = {}));
var logLevel = LOG_LEVEL.NONE;
export function log(level, msg) {
    if (process.env.NODE_ENV === 'development') {
        if (level >= logLevel) {
            switch (level) {
                case LOG_LEVEL.INFO: {
                    console.log("%c FEATURE ENGINE :> " + msg + " ", 'background: #aaaaff11; color: #00aaff');
                    break;
                }
                case LOG_LEVEL.WARN: {
                    console.log("%c FEATURE ENGINE :> " + msg + " ", 'background: #aaffff11; color: #ffffaa');
                    break;
                }
                case LOG_LEVEL.ERROR: {
                    console.log("%c FEATURE ENGINE :> " + msg + " ", 'background: #ffaaaa11; color: #ff5555');
                    break;
                }
            }
        }
    }
    if (process.env.NODE_ENV === 'test') {
        if (level >= logLevel) {
            switch (level) {
                case LOG_LEVEL.INFO: {
                    console.log("%c FEATURE ENGINE :> " + msg + " ", 'background: #aaaaff11; color: #00aaff');
                    break;
                }
                case LOG_LEVEL.WARN: {
                    console.log("%c FEATURE ENGINE :> " + msg + " ", 'background: #aaffff11; color: #ffffaa');
                    break;
                }
                case LOG_LEVEL.ERROR: {
                    console.log("%c FEATURE ENGINE :> " + msg + " ", 'background: #ffaaaa11; color: #ff5555');
                    break;
                }
            }
        }
    }
}
