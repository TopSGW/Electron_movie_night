const electronMainConfig = require('./config/webpack.electron.main')
const electronRendererConfig = require('./config/webpack.electron.renderer')

console.log('NODE_ENV=' + process.env.NODE_ENV)

module.exports = [
  electronRendererConfig,
  electronMainConfig
]
