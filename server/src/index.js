const AWS = require('aws-sdk');
const fs = require('fs/promises');

const { mapHandler } = require('./handlers');

exports.handler = async event => {
    try {
        const handler = mapHandler(event);

        if (handler) {
            console.log(`Using handler '${JSON.stringify(handler)}' for path '${event.rawPath}'`);
            
            const result = await handler.action(event);

            return { ...result, headers: { ...result.headers, 'cache-control': `max-age=${31_536_000}` } };
        }
        
        return {
            statusCode: 404,
            headers: {
                'Content-Type': 'text/html',  
            },
            body: await fs.readFile('./404.html', 'utf8'),
        };
    } catch (e) {
        console.error('Encountered an unhandled exception:', e);

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'text/plain',
            },
            body: e.message,
        };
    }
};
