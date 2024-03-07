// logger.js
const winston = require('winston');
const moment = require('moment-timezone');
const { format } = winston;
const { combine, printf } = format;
const DailyRotateFile = require('winston-daily-rotate-file');

const myFormat = printf(({ level, message, timestamp }) => {
 // 使用 moment-timezone 获取本地时间
 const localTime = moment(timestamp).tz(moment.tz.guess());
 return `${localTime.format()} ${level}: ${message}`;
});

const logger = winston.createLogger({
 format: combine(
    format.timestamp(),
    myFormat
 ),
 transports: [
    new winston.transports.Console({
      format: combine(
        format.timestamp(),
        myFormat
      ),
      level: 'info'
    }),
    new DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'debug'
    })
 ]
});

module.exports = logger;