const path = require('path')
const logger = require('electron-log')
const { logPath, logName } = require('../../config')

// Override default log level with LOG_LEVEL env variable
const levels = ['error', 'warn', 'info', 'debug']
const logLevel = () => {
  let override = process.env.LOG_LEVEL
  return (override && levels.indexOf(override) > -1)
    ? override
    : 'info'
}

logger.transports.console.level = logLevel()
logger.transports.file.level = logLevel()
logger.transports.file.file = path.join(logPath, logName)
logger.transports.file.maxSize = 5 * 1024 * 1024 // 5 MB

const doLog = ({ sender, severity, message, obj }) => {
  if (obj) {
    logger[severity](`[${sender}] ${message}`, obj)
  } else {
    logger[severity](`[${sender}] ${message}`)
  }
}

const sender = 'main'
const logMain = (severity, message, obj) => doLog({ sender, severity, message, obj })

module.exports = {
  log (logMessage) { doLog(logMessage) },
  debug (message, obj) { logMain('debug', message, obj) },
  info (message, obj) { logMain('info', message, obj) },
  warn (message, obj) { logMain('warn', message, obj) },
  error (message, obj) { logMain('error', message, obj) },
  logLevel
}
