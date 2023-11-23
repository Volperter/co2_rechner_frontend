const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://217.160.66.229:8080',
            changeOrigin: true,
        })
    );
};

