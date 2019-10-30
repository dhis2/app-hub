const path = require('path')

const staticFrontendRoutes = {
    name: 'DHIS2 App Bazaar Frontend',
    register: function(server, options) {
        //Temporary route to serve frontend static build until we've flattened the project structure
        server.route([
            {
                method: 'GET',
                path: '/assets/{param*}',
                handler: {
                    directory: {
                        path: path.join(__dirname, '../../static/assets/'),
                    },
                },
            },
            {
                method: 'GET',
                path: '/js/{param*}',
                handler: {
                    directory: {
                        path: path.join(__dirname, '../../static/js/'),
                    },
                },
            },
            {
                method: 'GET',
                path: '/{param*}',
                handler: {
                    file: path.join(__dirname, '../../static/index.html'),
                },
            },
        ])
    },
}

module.exports = staticFrontendRoutes
