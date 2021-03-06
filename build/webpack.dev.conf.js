var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var path = require('path')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
// var WebpackMonitor = require('webpack-monitor')
var peregrine = require('../peregrine/peregrine')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: [
      {
        test: /\.css$/,
        // include: [resolve('src'), resolve('test')],
        use: [{
            loader: "style-loader" // creates style nodes from JS strings
        }, {
            loader: "css-loader" // translates CSS into CommonJS
        }]
      },
      {
        test: /\.scss$/,
        // include: [resolve('src'), resolve('test')],
        use: [{
            loader: "style-loader" // creates style nodes from JS strings
        }, {
            loader: "css-loader" // translates CSS into CommonJS
        }, {
            loader: "sass-loader" // compiles Sass to CSS
        }]
      },
      {
        test: /\.styl$/,
        // include: [resolve('src'), resolve('test')],
        use: [{
              loader: "style-loader" // creates style nodes from JS strings
          }, {
              loader: "css-loader" // translates CSS into CommonJS
          }, {
              loader: "stylus-loader" // compiles stylus to CSS
          },
          {
            loader: 'stylus-vars-loader',
            options: {
              file: './src/styles/variables/index.styl',
            }
          }
        ]
      },
    ]
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.LoaderOptionsPlugin({
      test: /\.styl$/,
      stylus: {
        // You can have multiple stylus configs with other names and use them
        // with `stylus-loader?config=otherConfig`.
        default: {
          use: [
            require('rupture')(),
            require('jeet')()
            // require('typographic')()
          ],
        },
        otherConfig: {
          // use: [other_plugin()],
        },
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new peregrine({
      config: path.join(__dirname, '../src/pages.js'),
      env: 'development'
    }),
    // https://github.com/ampedandwired/html-webpack-plugin
    new FriendlyErrorsPlugin(),
    // new WebpackMonitor({
    //   capture: true, // -> default 'true'
    //   // target: '../monitor/myStatsStore.json', // default -> '../monitor/stats.json'
    //   launch: true, // -> default 'false'
    //   port: 3030, // default -> 8081
    // })
  ]
})
