const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
module.exports = {
    entry:{
        page1:path.resolve(__dirname, './src/page1/index.js'),
        page2:path.resolve(__dirname, './src/page2/index.js')
    },
    output: {
        //path: __dirname + '/dist', //产出路径，放在dist目录下面
        path: path.join(__dirname, 'dist'),
        filename: "js/[name]-[chunkhash].js",
        //把为入口文件放在dist目录的js文件夹下，
        //name是文件名，chunkhash是每次打包文件的hash值，
        //目的是如果哪个文件修改，chunkhash会改变，可以只上线修改过的文件
        // publicPath: 'http://cdn.com/' //如果上线，可以改为线上地址

    },
    devServer: {
        host:'127.0.0.1',
        port:8088,
        inline:true,//打包后加入一个websocket客户端
        open:true,  //自动打开浏览器
        compress: true, //开发服务器是否启动gzip等压缩
        hot:false,  //慎用，打开热更新时，会导致修改样式可能不支持。关闭热更新，页面会强刷
        contentBase: path.resolve(__dirname, 'dist'),//开发服务运行时的文件根目录
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [ 'style-loader', 'css-loader' ]//处理css
            },
            {
                test:/\.(png|jpg|gif)$/,
                use:[{
                    loader:'url-loader',
                    options:{
                        outputPath:'images/',//输出到images文件夹
                        limit:500  //是把小于500B的文件打成Base64的格式，写入JS
                    }
                }]

            }
        ]
    },
    //现在配置
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {  // 抽离自己写的公共代码
                    chunks: "initial",
                    name: "common", // 打包后的文件名，任意命名
                    minChunks: 2,//最小引用2次
                    minSize: 0 // 只要超出0字节就生成一个新包
                },
                vendor: {   // 抽离第三方插件
                    test: /node_modules/,   // 指定是node_modules下的第三方包
                    chunks: 'initial',
                    name: 'vendor',  // 打包后的文件名，任意命名
                    // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
                    priority: 10
                },
            }
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
                filename:'page1.html',
                template:'./src/page1/index.html',
                minify: {
                    //removeComments:true,  //删除注释
                    //collapseWhitespace:true  //删除空格，压缩
                },
                chunks: ['page1']  //对称entry的入口js，这样可以按需加载js
        }),
        new HtmlWebpackPlugin({
            filename:'page2.html',
            template:'./src/page2/index.html',
            minify: {
                //removeComments:true,  //删除注释
                //collapseWhitespace:true  //删除空格，压缩
            },
            chunks: ['page2']  //对称entry的入口js，这样可以按需加载js
        }),

        new CleanWebpackPlugin(['dist']), //传入参数，指定要删除的目录
    ]
}
