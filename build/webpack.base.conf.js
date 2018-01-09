var path = require('path');
var webpack = require('webpack');
var utils = require('./utils');
var config = require('../config');
var vueLoaderConfig = require('./vue-loader.conf');
var os = require('os');
var HappyPack = require('happypack');
var happThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length
});

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}
module.exports = {
  entry: {
    app: './src/module/' + config.project + '/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath:
      process.env.NODE_ENV === 'production'
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.js$/,
        loader: ['happypack/loader?id=js'],
        include: [resolve('src'), resolve('test')],
        exclude: [path.resolve('../../node_modules')]
      },

      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: path.join(__dirname, '../lib', 'vendor-mainfest.json')
    }),
    new HappyPack({
      id: 'js',
      cache: true,
      loaders: ['babel-loader?cacheDirectory=true'],
      threadPool: happThreadPool
    })
  ]
};
