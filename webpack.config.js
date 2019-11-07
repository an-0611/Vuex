var path = require('path')
var webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

function resolve(dir) {
  return path.resolve(__dirname, dir);
}

module.exports = {
  entry: ['./src/main.js'],
  output: {
    path: resolve('./dist'),// 打包後的根目錄資料夾dist,所有的檔案都會輸出到這裡
    publicPath: '/dist/',
    filename: 'build.js',
    // 在源码表中使用绝对路径 (对于在 IDE 中调试时很重要)
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.sass$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader?indentedSyntax'
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            'scss': [
              'vue-style-loader',
              'css-loader',
              'sass-loader'
            ],
            'sass': [
              'vue-style-loader',
              'css-loader',
              'sass-loader?indentedSyntax'
            ]
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
          test: /\.js|\.vue$/,
          use: {
              loader: 'babel-loader'
          },
          exclude: /test|\.spec\.js$/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: { // 設置模板編譯
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
      // '@': resolve('src')
      // 'vue': 'vue/dist/vue.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  // devtool: '#eval-source-map',
  devtool: 'inline-cheap-module-source-map',
  // externals: [nodeExternals({whitelist: [/^vue-awesome/,/^lodash/]})] //　<resolve vue <template> compiler question>
  externals: [nodeExternals({whitelist: [/^vue-awesome/,/^lodash/]})] //　<resolve vue <template> compiler question>
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      options: {
        build: {
          assetsPublicPath: './dist/'// https://blog.csdn.net/zhuoganliwanjin/article/details/78879566
        }
      },
    }),
    // new webpack.optimize.CommonsChunkPlugin('common.js'),
    // new webpack.ProvidePlugin({
    //      jQuery: "jquery",
    //      $: "jquery"
    // })
  ])
}
