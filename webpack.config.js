// https://github.com/fouber/blog/issues/6
// v4 https://segmentfault.com/a/1190000014247030
// https://segmentfault.com/a/1190000015237322

// const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 分离 css 文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// 清理目录
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const path = require('path');

const devMode = process.env.NODE_ENV !== 'production';

const CDN_URL = 'https://cdn.ci.khs1994.com:10000';

let config = {
  mode: 'production',
  performance: {
    hints: 'warning',
    maxAssetSize: 250000, //单文件超过250k，命令行告警
    maxEntrypointSize: 250000, //首次加载文件总和超过250k，命令行告警
  },
  cache: true,
  // 输入文件则默认为 src/index.js，输出为 dist/main.js
  entry: {
    login: __dirname + '/js/login/main.js',
    builds: path.resolve('./js/builds/main.js'),
    profile: path.resolve('./js/profile/main.ts'),
    demo: path.resolve('./js/demo/main.js'),
    sse: path.resolve('./js/sse/main.js'),
    websocket: path.resolve('./js/websocket/main.js'),
    noIE: path.resolve('./js/library/noIE.js'),
    ad: path.resolve('./js/ad/main.js'),
    tongji: path.resolve('./js/tongji/mod.js'),
    vue: path.resolve('./js/vue/main.ts'),
    plugins: path.resolve('./js/plugins/mod.js'),
  },
  output: {
    path: devMode
      ? __dirname + '/../public/assets/'
      : __dirname + '/../public/assets/',
    // filename: 'js/[name]_[hash].js',
    filename: 'js/[name]_[chunkhash].js',
    // pathinfo: true
    // publicPath: CDN_URL + '/assets/',
    publicPath: devMode ? '/assets/' : '/assets/',
  },
  devServer: {
    contentBase: '../public',
    historyApiFallback: true,
    inline: true,
    hot: true,
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
    },
  },
  plugins: [
    // https://github.com/johnagan/clean-webpack-plugin
    new CleanWebpackPlugin({
      dry: false,
      cleanOnceBeforeBuildPatterns: [__dirname + '/../public/assets/**/*'],
      dangerouslyAllowCleanPatternsOutsideProject: true,
    }),

    // 将 js css 插入到 html
    // https://github.com/jantimon/html-webpack-plugin
    new HtmlWebpackPlugin({
      title: 'Demo',
      template: path.resolve('./html/demo/source.html'), // 模板地址
      filename: path.resolve('../public/demo/index.html'),
      showErrors: true,
      chunks: ['tongji', 'demo'], // 只包括指定的 js
      // excludeChunks: ['demo'], // 排除指定的 js
      minify: {
        // removeAttributeQuotes: true, // 移除属性的引号
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      },
    }),
    new HtmlWebpackPlugin({
      template: path.resolve('./html/builds/index.html'),
      filename: path.resolve('../public/builds/index.html'),
      showErrors: true,
      chunks: ['tongji', 'builds', 'noIE', 'ad'], // 只插入指定的 js
      // v4
      minify: true,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve('./html/vue/index.html'),
      filename: path.resolve('../public/vue/index.html'),
      showErrors: true,
      chunks: ['vue'], // 只插入指定的 js
      // v4
      minify: true,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve('./html/login/index.html'),
      filename: path.resolve('../public/login/index.html'),
      showErrors: true,
      chunks: ['tongji', 'login', 'noIE', 'ad'], // 只包括指定的 js
      minify: true,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve('./html/login/hello.html'),
      filename: path.resolve('../public/login/hello.html'),
      showErrors: true,
      chunks: ['tongji', 'login', 'noIE'], // 只包括指定的 js
      minify: true,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve('./html/profile/index.html'),
      filename: path.resolve('../public/profile/index.html'),
      showErrors: true,
      chunks: ['tongji', 'profile', 'noIE', 'ad'], // 只包括指定的 js
      minify: true,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve('./html/sse/index.html'),
      filename: path.resolve('../public/sse/index.html'),
      showErrors: true,
      chunks: ['sse'], // 只包括指定的 js
      minify: true,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve('./html/websocket/index.html'),
      filename: path.resolve('../public/websocket/index.html'),
      showErrors: true,
      chunks: ['websocket'], // 只包括指定的 js
      minify: true,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve('./html/index.html'),
      filename: path.resolve('../public/index.html'),
      showErrors: true,
      chunks: ['tongji', 'index*'], // 只包括指定的 js
      minify: true,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve('./html/plugins/index.html'),
      filename: path.resolve('../public/plugins/index.html'),
      showErrors: true,
      chunks: ['tongji', 'plugins'], // 只包括指定的 js
      minify: true,
      title: 'Plugins | PCIT',
    }),
    // 分离 css 文件
    // https://github.com/webpack-contrib/mini-css-extract-plugin
    new MiniCssExtractPlugin({
      filename: 'css/[name]_[chunkhash].css',
      chunkFilename: '[id].css',
    }),
  ],
  optimization: {
    minimize: true, //是否进行代码压缩
    emitOnErrors: false, // v5
    // noEmitOnErrors: true, // v4 //取代 new webpack.NoEmitOnErrorsPlugin()，编译错误时不打印输出资源。

    // runtimeChunk: 'single',
    // v4 add, replace CommonsChunkPlugin

    // 首先，在新版本的 webpack 会默认对代码进行拆分，拆分的规则是：
    // 模块被重复引用或者来自 node_modules 中的模块(模块被引入的次数必须大于1次)
    // 在压缩前最小为 30kb
    // 在按需加载时，请求数量小于等于 5
    // 在初始化加载时，请求数量小于等于 3

    splitChunks: {
      minSize: 0,
      cacheGroups: {
        vendors: {
          test: /node_modules/,
          priority: -10,
          minSize: 0,
        },
        pcit: {
          name: 'pcit', // 拆分出来块的名字(Chunk Names)，默认由块名和 hash 值自动生成
          test: /pcit.js/,
          priority: -10, // 表示缓存的优先级；
          minSize: 0, // 形成一个新代码块最小的体积, 30000
          chunks: 'all', // 表示显示块的范围,必须三选一： "initial" | "all" | "async"(默认)
          // async，表示只会提取异步加载模块的公共代码，
          // initial 表示只会提取初始入口模块的公共代码，
          // all表示同时提取前两者的代码。
          minChunks: 1, // 表示被引用次数，默认为 1
          maxAsyncRequests: 5, // 最大的按需(异步)加载次数，默认为 1
          maxInitialRequests: 3, // 最大的初始化加载次数，默认为 1
          // reuseExistingChunk: // 使用已经存在的块，即如果满足条件的块已经存在就使用已有的，不再创建一个新的块。
        },
      },
    },
  },
  // Webpack 中所有类型的文件都是模块，包括JS、CSS、图片、字体、JSON...
  // 万物皆模块
  module: {
    // https://github.com/webpack-contrib
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
          // 'style-loader',
          // 代码中无需再使用 style-loader。如果使用将会报错：window is not define
          // style-loader 与 MiniCssExtractPlugin 冲突
          'css-loader',
        ], // 注意顺序，由下向上执行
        // use [{loader:'style-loader'}]
        // exclude:
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
      // html-loader 是将 require 或者 import 的 html 文件转换为 html 字符串并导出。
      // html-loader 将 html 文件作为 js 的一个模块，
      // 模块向外提供编译后的 html 文件内容字符串，其实可以将其看成一个输出字符串的模块而已。

      // html-loader 与 html-webpack-plugin 冲突
      // https://www.imooc.com/article/18513?block_id=tuijian_wz

      // {
      //   test: /\.html$/,
      //   use: [
      //     {
      //       loader: 'html-loader',
      //       options: {
      //         minimize: true,
      //         interpolate: 'require',
      //       },
      //     },
      //   ],
      // },
      {
        test: /\.(gif|jpg|png)$/,
        use: [
          // {
          //   // file-loader 可以解析项目中的 url 引入（不仅限于css），
          //   // 根据我们的配置，将图片拷贝到相应的路径，再根据我们的配置，
          //   // 修改打包后文件引用路径，使之指向正确的文件。
          //   loader: 'file-loader',
          //   options: {
          //     name: '[path][name].[ext]',
          //     content: '',
          //     // outputPath: 'images/',
          //     publicPath: 'assets/images/'
          //   },
          // },
          {
            // 在处理图片和进行 base64 编码的时候，需要使用 url-loader
            // 作用是编码
            // A loader for webpack which transforms files into base64 URIs.
            // url-loader works like file-loader,
            // but can return a DataURL if the file is smaller than a byte limit.
            // css: background: url("./../assets/imgs/1.jpg") no-repeat;
            loader: 'url-loader',
            options: {
              limit: 8192, // 表示小于 8kb 的图片转为 base64,大于 8kb 的是路径
              name: '[name]_[hash].[ext]',
              content: '',
              outputPath: 'images/',
              // publicPath: '/assets/images/',
              // https://cdn.ci.khs1994.com/assets/images/
            },
          },
        ],
      },
    ],
  },
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'source-map';
  }

  if (argv.mode === 'production') {
    //
  }

  return config;
};
