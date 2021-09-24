const fs = require('fs');

const faviconGetHandler = {
    method: 'GET',
    path: '/favicon.ico',
    action: async () => {
        const body = fs.readFileSync('./favicon.svg', 'utf8');
        return {
            statusCode: 200,
            headers: {
                'content-type': 'image/svg+xml',  
                'cache-control': 'no-store',
            },
            body,
        };  
    }
};

exports.faviconHandlers = [ faviconGetHandler ];