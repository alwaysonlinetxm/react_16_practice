const nodeExternals = require('webpack-node-externals');
const path = require('path');
const webpack = require("webpack");

module.exports = function makeWebpackConfig(env) {
  return serverConfig = {
    context: path.join(__dirname, '../'),
    entry: {
      index: './src/container/app',
    },
    output: {
      path: path.join(__dirname, '../dist_server'),
      filename: "[name].ssr.js",
      libraryTarget: 'commonjs2' //设置导出类型，web端默认是var，node需要module.exports = xxx的形式
    },
    module: {
      rules: [{
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          // options: {
          //   plugins: ['dynamic-import-webpack', 'remove-webpack'],
          // }
        }
      }, {
        test: /\.(scss|css)$/,          //node端不能 require('xx.css')，会报错
        use: ['null-loader']
      }]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) || JSON.stringify('development')
      }),
      new webpack.ProvidePlugin({
				React: 'react',
        ReactDOM: 'react-dom',
				Util: [ path.join(__dirname, '../src/libs/util.js'), 'default' ],
				ActionTypes: [ path.join(__dirname, '../src/constants/ActionTypes.js'), 'default' ]
			}),
    ],
    target: 'node',
    devtool: 'sourcemap',
    externals: [ nodeExternals() ] //不把node_modules中的文件打包
  };
}
