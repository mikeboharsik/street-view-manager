const { defaultHandlers } = require('./default');
const { faviconHandlers } = require('./favicon');
const { staticHandlers } = require('./static');

// order is important here; should be most specific to least specific paths
const handlers = [ ...faviconHandlers, ...staticHandlers, ...defaultHandlers ];

exports.handlers = handlers;

exports.mapHandler = event => {
    const { rawPath } = event;
    const { method } = event.requestContext.http;
    
    return handlers.find(h => {
        const methodMatch = h.method === method;
        if (h.paths) {
            return methodMatch && h.paths.some(path => rawPath.match(new RegExp(path)));
        }
        
        let { path } = h;
        let paramIds = path.match(/(:\w+)/g);
        if (paramIds) {
            paramIds.forEach(id => {
                path = path.replace(id, '(\\S+)');
            });
            
            const regexp = new RegExp(path);
            
            let match = rawPath.match(regexp);
            if (match) { 
                match = match.splice(1);
                event.params = paramIds.reduce((acc, cur, idx) => { acc[cur.replace(':', '')] = match[idx]; return acc; }, {});
            }
            
            return match;
        }
        
        return methodMatch && rawPath.match(new RegExp(path));
    });
};