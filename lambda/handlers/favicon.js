const fs = require('fs/promises');

const faviconGetHandler = {
    method: 'GET',
    path: '/favicon.ico',
    action: async () => {
        const body = await fs.readFile('./build/favicon.svg', 'utf8');
        return {
            statusCode: 200,
            headers: {
                'content-type': 'image/svg+xml',
            },
            body,
        };  
    }
};

exports.faviconHandlers = [ faviconGetHandler ];