'use strict'

const webpack = require('webpack')
const path = require('path')
const LiveReloadPlugin = require('webpack-livereload-plugin')

const NODE_ENV = process.env.NODE_ENV || 'development'

module.exports = {
  entry: {
    histogram: './app/histogram-group.js',
    ['join-graphic']: './app/join-graphic.js',
    ['histogram-horizontal']: './app/histogram-group-horizontal.js',
    ['histogram-stack']: './app/histogram-stack.js',
    ['histogram-stack-horizontal']: './app/histogram-stack-horizontal.js'
  },
  output: {
    path: path.join(__dirname, '/public'),
    filename: '[name].js'
  },
  devtool: NODE_ENV === 'development' ? 'cheap-inline-module-source-map' : 'source-map',
  watch: NODE_ENV === 'development',
  module: {
    loaders: []
  },
  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js']
  },
  resolveLoader: {
    modulesDirectories: ['node_modules'],
    moduleTemplates: ['*-loader', '*'],
    extensions: ['', '.js']
  },
  plugins: [
    new LiveReloadPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  externals: {
  }
}
