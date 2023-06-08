const AWS = require('aws-sdk');
const fs = require('fs/promises');

const { mapHandler } = require('./handlers');

async function uploadMetadataToDynamo(event) {
    try {
        const tableName = process.env.DYNAMO_METADATA_TABLE_NAME;
        if (tableName) {
            let {
                requestContext: {
                    http: {
                        method,
                        path: route,
                        sourceIp,
                    },
                },
            } = event;

            const requestSourceIp = Buffer.from(sourceIp).toString('base64');

            const pattern = /(\/static\/)(js\/|css\/)(.*)(\.js|\.css|\.map)/;
            const nonStaticFilenameMatch = route.match(pattern);
            if (nonStaticFilenameMatch) {
                route = route.replace(pattern, '$1$2source$4');
            }

            const dynamo = new AWS.DynamoDB();
            const queryResult = await dynamo.query({
                ExpressionAttributeValues: {
                    ':requestSourceIp': {
                        S: requestSourceIp,
                    },
                    ':requestRoute': {
                        S: route,
                    },
                },
                KeyConditionExpression: 'sourceIp = :requestSourceIp AND httpRoute = :requestRoute',
                ProjectionExpression: 'hitCount,httpMethod,httpRoute,sourceIp,updated',
                TableName: tableName,
            }).promise();

            let { Items: [existingRow] } = queryResult;

            if (!existingRow) {
                existingRow = {
                    hitCount: {
                        N: '0',
                    },
                    httpMethod: {
                        S: method,
                    },
                    httpRoute: {
                        S: route,
                    },
                    sourceIp: {
                        S: requestSourceIp,
                    },
                };
            }

            const newHitCount = (parseInt(existingRow.hitCount.N) + 1).toString();

            existingRow.hitCount =  { N: newHitCount };
            existingRow.updated = { S: new Date().toISOString() };

            return await dynamo.putItem({
                Item: existingRow,
                TableName: tableName,
            }).promise();
        }

        console.warn(`Env variable 'DYNAMO_METADATA_TABLE_NAME' not configured, not uploading metadata to DynamoDB`);
    } catch (e) {
        console.error(e);
    }
}

exports.handler = async event => {
    try {
        uploadMetadataToDynamo(event);

        const { requestContext: { http: { sourceIp } } } = event;

        console.log(`Request from IP address '${sourceIp}'`);

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
