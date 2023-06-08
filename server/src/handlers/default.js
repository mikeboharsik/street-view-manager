const fs = require('fs/promises');

const rootContentGetHandler = {
    method: 'GET',
    paths: ['.json', '.png', '.svg', '.txt'],
    action: async (event) => {
        const { rawPath } = event;
        
        let contentType = 'text/plain';
        let encoding = 'utf8';
        
        if (rawPath.endsWith('css')) {
            contentType = 'text/css';
        } else if (rawPath.endsWith('js')) {
            contentType = 'application/javascript';
        } else if (rawPath.endsWith('json')) {
            contentType = 'application/json';
        } else if (rawPath.endsWith('txt')) {
            contentType = 'text/plain';
        } else if (rawPath.endsWith('ico')) {
            contentType = 'image/x-icon';
        } else if (rawPath.endsWith('png')) {
            contentType = 'image/png';
            encoding = 'binary';
        } else if (rawPath.endsWith('svg')) {
            contentType = 'image/svg+xml';
        }
        
        const body = await fs.readFile(`./build${rawPath}`, encoding);
        
        return {
            statusCode: 200,
            headers: {
                'Cache-Control': 'no-store',
                'Content-Type': contentType,
            },
            body,
        };  
    }
};

const defaultGetHandler = {
    method: 'GET',
    paths: ['/', '/oauth', '/photoEditor'],
    action: async () => {
        return {
            statusCode: 200,
            headers: {
                'content-type': 'text/html',
            },
            body: await fs.readFile('./build/index.html', 'utf8'),
        };  
    }
};

exports.defaultHandlers = [ rootContentGetHandler, defaultGetHandler ];
