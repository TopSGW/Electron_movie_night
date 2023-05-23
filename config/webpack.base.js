const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const basePath = path.resolve(__dirname, '..')

// Base configuration.
const baseConfig = {
  // Don't attempt to continue if there are any errors.
  bail: true,
  // Required so __dirname actually returns a directory.
  node: {
    __dirname: false
  },
  // This is where the bundled javascript file live.
  output: {
    path: path.resolve(basePath, 'bundle'),
    filename: '[name].js'
  },
  module: {
    rules: [
      // Use babel to process javascript files.
      {
        test: /\.(js|jsx)$/,
        include: [
          path.resolve(__dirname, '..', 'app'),
          path.resolve(__dirname, '..', 'config')
        ],
        loader: 'babel-loader'
      }
    ]
  },
  resolve: {
    // Tell webpack where to search for JS modules.
    modules: [
      path.resolve(basePath, 'app'),
      path.resolve(basePath, 'node_modules')
    ],
    extensions: ['.js', '.jsx']
  }
}

// Merge in the build dependent configs to get
// the final electron configuration.
const baseConfigFinal = webpackMerge(baseConfig, {
  devtool: getDevtool(),
  plugins: getPlugins()
})

function getDevtool () {
  return process.env.NODE_ENV === 'production'
    ? 'cheap-module-source-map'
    : 'cheap-module-eval-source-map'
}

function getPlugins () {
  let plugins = []
  if (process.env.NODE_ENV === 'production') {
    plugins.push(
      // Inject NODE_ENV into production builds and distributions.
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      }),
      // Optimize
      new UglifyJsPlugin()
    )
  }
  return plugins
}

module.exports = baseConfigFinal
