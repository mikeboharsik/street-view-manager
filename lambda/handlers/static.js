const fs = require('fs/promises');

const staticGetHandler = {
    method: 'GET',
    path: '/static',
    action: async (event) => {
        let { rawPath } = event;
        
        let contentType = 'text/plain';
        
        if (rawPath.includes('.css')) {
            contentType = 'text/css';
        } else if (rawPath.includes('.js')) {
            contentType = 'application/json';
        }
        
        return {
            statusCode: 200,
            headers: {
                'cache-control': 'no-store',
                'content-type': contentType,
            },
            body: await fs.readFile(`./build${rawPath}`, 'utf8'),
        };  
    }
};

exports.staticHandlers = [ staticGetHandler ];