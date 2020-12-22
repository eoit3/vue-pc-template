const SpeedMeasurePlugin = require("speed-measure-webpack-plugin")
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const smp = new SpeedMeasurePlugin({
    outputFormat: 'human'
})
// SpeedMeasurePlugin 与 HardSourceWebpackPlugin 不能一起使用
const plugins = []
if(process.env.NODE_ENV === 'production') { // 为生产环境修改配置...process.env.NODE_ENV !== 'development'
	plugins.push(new BundleAnalyzerPlugin())
} else {
	// 为开发环境修改配置...
	plugins.push(new HardSourceWebpackPlugin())
}
module.exports = {
	publicPath: '/',
	productionSourceMap: false,
	devServer: {
		proxy: {
			'/api': {
				target: 'http://localhost:8080',
				changeOrigin: true,
				pathRewrite: {
					'^/api': '',
				},
			},
		},
	},
	chainWebpack: config =>{
		config.plugin('html')
		.tap(args => {
			args[0].title = "xxx"
			return args
        })
       
	},
	// configureWebpack: smp.wrap({}) // 只能用对象的形式包裹
	configureWebpack: {
		plugins: plugins,
		optimization: {
			splitChunks: {
				chunks: 'all',
				minSize: 30000,
				maxSize: 0,
				minChunks: 1,
				maxAsyncRequests: 5,
				maxInitialRequests: 3,
				automaticNameDelimiter: '-',
				name: true,
				cacheGroups: {
					vendors: {
						test: /[\\/]node_modules[\\/]/,
						priority: -10,
					},
					default: {
						minChunks: 2,
						priority: -20,
						reuseExistingChunk: true,
					},
				},
			},
		}
	}
}
