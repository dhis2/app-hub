const path = require('path')

const staticDir = path.join(__dirname, '..', '..', 'static')

const faviconRoutes = [
    'apple-touch-icon.png',
    'favicon-32x32.png',
    'favicon-16x16.png',
].map(file => ({
    method: 'GET',
    path: `/${file}`,
    handler: {
        file: path.join(__dirname, '..', '..', 'public', file),
    },
}))

const staticFrontendRoutes = {
    name: 'DHIS2 App Hub Frontend',
    register: function(server) {
        //Temporary route to serve frontend static build until we've flattened the project structure
        server.route([
            ...faviconRoutes,
            {
                method: 'GET',
                path: '/assets/{param*}',
                handler: {
                    directory: {
                        path: path.join(staticDir, 'assets'),
                    },
                },
            },
            {
                method: 'GET',
                path: '/js/{param*}',
                handler: {
                    directory: {
                        path: path.join(staticDir, 'js'),
                    },
                },
            },
            {
                method: 'GET',
                path: '/{param*}',
                handler: {
                    file: path.join(staticDir, 'index.html'),
                },
            },
        ])
    },
}

module.exports = staticFrontendRoutes
