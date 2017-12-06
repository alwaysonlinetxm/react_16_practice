const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeJsPlugin = require('optimize-js-plugin');
const nodeExternals = require('webpack-node-externals');
const px2rem = require('postcss-px2rem');

const IS_PROD = process.env.NODE_ENV === 'production';
const IS_CLIENT = process.env.BUILD_ENV !== 'server';
const CLIENT_DIST = path.join(__dirname, IS_PROD ? './dist' : './static');
const SERVER_DIST = path.join(__dirname,'./dist_server');

module.exports = function makeWebpackConfig(env) {
	const webpackConfig = {
	  entry: IS_CLIENT ? {
 	    index: './src/container/index',
 			vendor: [ 'react', 'react-dom', 'redux', 'react-redux', 'redux-actions', 'redux-saga', 'blueimp-md5' ],
 	  } : {
			index: './src/container/app'
		},
	  output: {
	    path: IS_CLIENT ? CLIENT_DIST : SERVER_DIST,
	    filename: IS_CLIENT ? `js/[name]${IS_PROD ? '-[chunkhash:8]' : ''}.js` : '[name].ssr.js',
			chunkFilename: `js/[name]${IS_PROD ? '-[chunkhash:8]' : ''}.js`,
			sourceMapFilename: '[name].[chunkhash:8].map',
			libraryTarget: IS_CLIENT ? 'umd' : 'commonjs2'
	  },
		devtool: IS_PROD ? false : 'cheap-module-eval-source-map',
		// resolve: {
	  //   alias: {
	  //   }
	  // },
		module: {
			rules: [{
	      test: /\.js$/,
				enforce: 'pre',
	      use: [{
					loader: 'eslint-loader',
					options: {
				    configFile: '.eslintrc',
				    emitWarning: false,
				    emitError: true,
				    formatter: require('eslint-friendly-formatter'),
				    quiet: true
				  }
				}]
	    }, {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
	    }, {
	      test: /\.scss$/,
	      exclude: /node_modules/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [{
	          loader: 'css-loader',
	          options: {
							modules: true,
							camelCase: true, // transform 'aa-bb' to 'aaBb' (useful in js)
							importLoaders: 1,
							localIdentName: '[local]_[hash:base64:5]',
	            minimize: IS_PROD,
	            sourceMap: !IS_PROD
	          },
	        }, {
						loader: 'postcss-loader',
						options: {
							plugins: () => [
								autoprefixer({
									browsers: [ '> 5%', 'last 2 versions' ]
								}),
								px2rem({ remPrecision: 8 })
              ]
						}
					}, {
						loader: 'sass-loader',
						options: {
							sourceMap: !IS_PROD,
							outputStyle: 'compact'
						}
					}],
					publicPath: '../'
				})
	    }, {
	      test: /\.(png|jpg|gif)$/,
	      exclude: /node_modules/,
	      use: 'url-loader?limit=8192&name=images/[name]-[hash:8].[ext]'
	    }, {
	      test: /\.(woff|svg|eot|ttf)$/,
	      exclude: /node_modules/,
	      use: 'url-loader?limit=10000&name=fonts/[name]-[hash:8].[ext]'
	    }]
		},
		performance: {
      hints: IS_PROD ? "warning" : false,
      maxAssetSize: 200000,
      maxEntrypointSize: 400000,
      assetFilter: function (assetFilename) {
        return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
      }
    },
		plugins: [
			new webpack.DefinePlugin({
				'process.env': {
					NODE_ENV: JSON.stringify(process.env.NODE_ENV)
				}
			}),
			new CleanWebpackPlugin(IS_CLIENT ? CLIENT_DIST : SERVER_DIST, {
	      root: __dirname,
	      verbose: true,
	      dry: false
	    }),
			new ExtractTextPlugin({
				filename: `css/index${ IS_PROD ? '-[contenthash:8]' : '' }.css`,
			  allChunks: true
			}),
			new webpack.ProvidePlugin({
				React: 'react',
        ReactDOM: 'react-dom',
				Util: [ path.join(__dirname, './src/libs/util.js'), 'default' ],
				ActionTypes: [ path.join(__dirname, './src/constants/ActionTypes.js'), 'default' ]
			})
		].concat(IS_CLIENT ? [
			new webpack.optimize.CommonsChunkPlugin({
	        names: ['vendor', 'manifest'], // manifest for runtime code
	        minChunks: Infinity,
	    }),
			new HtmlWebpackPlugin({
				template: './src/index.html',
				filename: 'index.html',
				minify: {
					minifyJS: IS_PROD,
					collapseWhitespace: IS_PROD,
					removeComments: IS_PROD
				}
			})
		].concat(IS_PROD ? [
			new webpack.optimize.UglifyJsPlugin({
				compress: {
		      sequences: true,
		      dead_code: true,
		      conditionals: true,
		      booleans: true,
		      unused: true,
		      if_return: true,
		      join_vars: true,
		      drop_console: true,
					drop_debugger: true,
					warnings: false,
					loops: true,
					properties: true
		    },
		    mangle: {
		      except: [ 'exports', 'require' ]
		    },
		    output: {
		      comments: false
		    }
	    }),
			new webpack.optimize.ModuleConcatenationPlugin(),
			new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 10 }),
			new OptimizeJsPlugin({ sourceMap: false })
		] : [
			new webpack.HotModuleReplacementPlugin()
		]) : []),
		devServer: {
      port: 8001,
      inline: true,
      historyApiFallback: false,
      contentBase: CLIENT_DIST,
      host: '0.0.0.0'
    },
		target: IS_CLIENT ? 'web' : 'node',
		node: {
	    dgram: 'empty',
	    fs: 'empty',
	    net: 'empty',
	    tls: 'empty',
	  },
		externals: IS_CLIENT ? [] : [ nodeExternals() ] //不把node_modules中的文件打包
	};
	return webpackConfig;
}
