const winston = require("winston");
const { createLogger, format, transports,printf } = require('winston');
require("winston-daily-rotate-file");
const { FILE_PATH,ERROR_FILE_PATH } = require('./config');


const alertFormat = winston.format((info) => {
    const {message} = info;

    if (info.alert && info.alert === true) {
        info.message = `${message}`.toUpperCase();
        console.log(info.message);
        delete info.alert;
    }

    return info;
})();

const debug = createLogger({
    levels: {
        debug: 0
    },
    transports: [
        new transports.DailyRotateFile ({
            filename: FILE_PATH,
            level: 'debug',
            maxsize: '5m',
            format: format.combine(
                format.colorize(),
                format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss'
                }),
                format.printf(info => `${info.timestamp}: ${info.message}`)
            )
        }),
        new (winston.transports.Console)({level: 'debug'})
    ]
});

const info = createLogger({
    levels: {
        info: 1
    },
    transports: [
        new transports.DailyRotateFile ({
                filename: FILE_PATH,
                level: 'info',
                maxsize: '5m',
                format: format.combine(
                    format.colorize(),
                    format.timestamp({
                        format: 'YYYY-MM-DD HH:mm:ss'
                    }),
                    format.printf(info => `${info.timestamp}: ${info.message}`)
                )
            }),
        new (winston.transports.Console)( {format: winston.format.simple()})
    ]
});

const warn = new winston.createLogger({
    levels: {
        warn: 2
    },
    transports: [
        new (winston.transports.File)({ filename: FILE_PATH, level: 'warn'}),
        new (winston.transports.Console)({level: 'warn'})
    ]
});

const error = new winston.createLogger({
    levels: {
        error: 3
    },
    transports: [
        new transports.DailyRotateFile ({
            filename: ERROR_FILE_PATH,
            level: 'error',
            maxsize: '5m',
            format: format.combine(
                format.colorize(),
                format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss'
                }),
                alertFormat,
                format.printf(info => `${info.timestamp}: ${info.message}`)
            )
        }),
        new (winston.transports.Console)({level: 'error'})
    ]
});

// error.error('test message', {alert: true });



module.exports = function(fileName) {
    return {
        debug: (msg) => {
            debug.debug("[ " + fileName + " ]:" + msg);
        },
        info: (msg) => {
            info.info("[ " + fileName + " ]:" + msg);
        },
        warn: (msg) => {
            warn.warn(msg);
        },
        error: (msg, opts) => {
            error.error("[ " + fileName + " ]:" + msg, opts);
        },
        log: (level, msg) => {
            const lvl = exports[level];
            lvl(msg);
        }
    };
}
