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
            },
            body,
        };  
    }
};

exports.faviconHandlers = [ faviconGetHandler ];