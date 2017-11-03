'use strict';
var path = require('path');
var nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: {
    index: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js'
  },
  target: 'node',
  externals: [nodeExternals()],
  context: __dirname,
  node: {
    __filename: false,
    __dirname: false
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'bin')
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'es2016', 'react'],
            'plugins': ['transform-class-properties']
          }
        }
      },
    ]
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.json']
  }
};