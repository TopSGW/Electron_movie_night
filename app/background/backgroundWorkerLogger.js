import { ipcRenderer } from 'electron'
import { LOG_MESSAGE } from '../shared/events'

const sender = 'bgWorker'

const send = (severity, message, obj) => {
  ipcRenderer.send(LOG_MESSAGE, { sender, severity, message, obj })
}

export default {
  debug (message, obj) { send('debug', message, obj) },
  info (message, obj) { send('info', message, obj) },
  warn (message, obj) { send('warn', message, obj) },
  error (message, obj) { send('error', message, obj) }
}
