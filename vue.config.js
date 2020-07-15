const CompressionWebpackPlugin = require('compression-webpack-plugin')
const compress = new CompressionWebpackPlugin(
    {
        filename: info => {
            return `${info.path}.gz${info.query}`
        },
        algorithm: 'gzip',
        threshold: 1024,
        test: new RegExp(
            '\\.(' +
            ['js'].join('|') +
            ')$'
        ),
        minRatio: 1.0,
        deleteOriginalAssets: false
    }
);
module.exports = {
    publicPath:'/',
    productionSourceMap: process.env.NODE_ENV === 'production' ? false : true,
    devServer: {
        port: 8085,
        before:(app, server)=> {
            app.get(/.*.(js)$/, (req, res, next) => {
                if(req.url.indexOf('hot-update')>=0){
                    next()
                }else {
                    req.url = req.url + '.gz';
                    res.set('Content-Encoding', 'gzip');
                    next();
                }
            })
        }
        // ,
        // host: '0.0.0.0',
        // disableHostCheck: true
    },
    configureWebpack: {
        plugins: [compress]
    },
    css: {
        extract: true
    }
}