const initPostHandler = {
    method: 'POST',
    path: '/api/init',
    action: async (event) => {
        let { body } = event;
        
        console.log(`init payload: ${body}`);
        
        return {
            statusCode: 200,
        };  
    }
};

exports.initHandlers = [ initPostHandler ];