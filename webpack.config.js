const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeJsPlugin = require('optimize-js-plugin');
const px2rem = require('postcss-px2rem');

const isProd = process.env.NODE_ENV === 'production';
const distPath = path.join(__dirname, isProd ? './dist' : './static'); // 打包路径

module.exports = function makeWebpackConfig(env) {
	const webpackConfig = {
	  entry: {
 	    index: './src/container/index.js',
 			vendor: [ 'react', 'react-dom', 'redux', 'react-redux', 'redux-actions', 'redux-saga', 'blueimp-md5' ],
 	  },
	  output: {
	    path: distPath,
	    filename: `js/[name]${isProd ? '-[chunkhash:8]' : ''}.js`,
			chunkFilename: `js/[name]${isProd ? '-[chunkhash:8]' : ''}.js`,
			sourceMapFilename: '[name].[chunkhash:8].map'
	  },
		devtool: isProd ? false : 'cheap-module-eval-source-map',
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
					use: [
						'css-loader?modules&camelCase&importLoaders=1&localIdentName=[local]_[hash:base64:5]',
						{
							loader: 'postcss-loader',
							options: {
								plugins: () => [
									autoprefixer({
										browsers: [ '> 5%', 'last 2 versions' ]
									}),
									px2rem({ remPrecision: 8 })
                ]
							}
						},
						'sass-loader?outputStyle=compact'
					],
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
      hints: isProd ? "warning" : false,
      maxAssetSize: 200000,
      maxEntrypointSize: 400000,
      assetFilter: function (assetFilename) {
        return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
      }
    },
		plugins: [
			new webpack.DefinePlugin({
				'process.env': {
					NODE_ENV: JSON.stringify(process.env.NODE_ENV),
				}
			}),
			new CleanWebpackPlugin(distPath, {
	      root: __dirname,
	      verbose: true,
	      dry: false
	    }),
	    new webpack.optimize.CommonsChunkPlugin({
	        names: ['vendor', 'manifest'], // manifest for runtime code
	        minChunks: Infinity,
	    }),
			new ExtractTextPlugin({
				filename: `css/index${ isProd ? '-[contenthash:8]' : '' }.css`,
			  allChunks: true
			}),
			new HtmlWebpackPlugin({
				template: './src/index.html',
				filename: 'index.html',
				minify: {
					minifyJS: isProd,
					collapseWhitespace: isProd,
					removeComments: isProd
				}
			}),
			new webpack.ProvidePlugin({
				React: 'react',
        ReactDOM: 'react-dom',
				Util: [ path.join(__dirname, './src/libs/util.js'), 'default' ],
				ActionTypes: [ path.join(__dirname, './src/constants/ActionTypes.js'), 'default' ]
			}),
		],
		devServer: {
      port: 8001,
      inline: true,
      historyApiFallback: false,
      contentBase: distPath,
      host: '0.0.0.0'
    },
		node: {
	    dgram: 'empty',
	    fs: 'empty',
	    net: 'empty',
	    tls: 'empty',
	  }
	};

	if (isProd) {
		webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
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
    }));
		webpackConfig.plugins.push(new webpack.optimize.ModuleConcatenationPlugin());
		webpackConfig.plugins.push(new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 10 }));
		webpackConfig.plugins.push(new OptimizeJsPlugin({ sourceMap: false }));
	} else {
		webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
	}
	return webpackConfig;
}
