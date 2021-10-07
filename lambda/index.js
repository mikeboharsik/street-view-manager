const fs = require('fs/promises');
const { mapHandler } = require('./handlers');

exports.handler = async event => {
    const { requestContext: { http: { sourceIp } } } = event;

    console.log(`Request from IP address '${sourceIp}'`);

    const handler = mapHandler(event);

    if (handler) {
        console.log(`Using handler '${JSON.stringify(handler)}' for path '${event.rawPath}'`);
        
        return handler.action(event);
    }
    
    return {
        statusCode: 404,
        headers: {
            'Content-Type': 'text/html',  
        },
        body: await fs.readFile('./404.html', 'utf8'),
    };
};
