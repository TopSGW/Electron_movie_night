const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base')

// Helpers
const basePath = path.resolve(__dirname, '..')
const isProductionBuild = () => process.env.NODE_ENV === 'production'
const bundleDir = (isProductionBuild())
  ? ''
  : 'http://localhost:3000/bundle/'
const styleLink = (isProductionBuild())
  ? '<link rel="stylesheet" href="bundle.css">'
  : ''

// Base config for renderers
const rendererBaseConfig = {
  // Tells webpack to set-up some Electron specific variables.
  target: 'electron-renderer',
  // This is the entry point for the React application.
  // In Electron, this is known as the renderer process.
  entry: {
    appWindow: './app/renderer/index.js',
    backgroundWorker: './app/background/index.js'
  },
  plugins: [
    // This plugin takes the HTML template files and turns then
    // into the html file which serve as the entry point
    // for the renderer processes. The output html file is
    // located in the bundle/ directory.
    new HtmlWebpackPlugin({
      filename: 'appWindow.html',
      template: path.join(basePath, 'app', 'renderer', 'index-template.html'),
      bundle: `${bundleDir}appWindow.js`,
      css: styleLink,
      inject: false
    }),
    new HtmlWebpackPlugin({
      filename: 'backgroundWorker.html',
      template: path.join(basePath, 'app', 'background', 'index-template.html'),
      bundle: `${bundleDir}backgroundWorker.js`,
      css: styleLink,
      inject: false
    })
  ]
}

// Merge configs to get final renderer configuration.
const rendererBaseConfigFinal = webpackMerge(rendererBaseConfig, {
  module: getAdditionalModules(),
  plugins: getAdditionalPlugins()
})
const rendererConfigFinal = webpackMerge(baseConfig, rendererBaseConfigFinal)

// Helper Functions
function getAdditionalModules () {
  let module = { rules: [] }
  if (isProductionBuild()) {
    module.rules.push(
      // The notation here is somewhat confusing.
      // "css" loader resolves paths in CSS and adds assets as dependencies.
      // "style" loader normally turns CSS into JS modules injecting <style>,
      // But unlike in development configuration, we do something different.
      // `ExtractTextPlugin` first applies the "css" loader
      // then grabs the result CSS and puts it into a
      // separate file in our isProductionBuild process. This way we actually ship
      // a single CSS file in production instead of JS code injecting <style>
      // tags. If you use code splitting, however, any async bundles will still
      // use the "style" loader inside the async code so CSS from them won't be
      // in the main CSS file.
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' })
        // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
      }
    )
  } else {
    module.rules.push(
      // "css" loader resolves paths in CSS and adds assets as dependencies.
      // "style" loader turns CSS into JS modules injecting <style> tags, i.e.,
      // all the styles will be bundled inside the bundled javascript file.
      // This allows for nice dev things like hot module replacement.
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    )
  }

  return module
}

function getAdditionalPlugins () {
  let plugins = []
  if (isProductionBuild()) {
    plugins.push(
      // Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
      // This plugin bundles all the CSS styles into a single .css file.
      // This is useful in production because the JS and CSS files can be loaded
      // in parallel.
      new ExtractTextPlugin('bundle.css')
    )
  }

  return plugins
}

// Export both the main and renderer targets.
module.exports = rendererConfigFinal
