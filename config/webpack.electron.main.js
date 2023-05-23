const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base')

// Base configuration.
const additionalConfig = {
  // Tells webpack to set-up some Electron specific variables.
  target: 'electron-main',
  // This is the entry point for the React application.
  // In Electron, this is known as the renderer process.
  entry: {
    main: './app/main/main.js'
  }
}

const electronMainConfigFinal = webpackMerge(baseConfig, additionalConfig)

module.exports = electronMainConfigFinal
