import {
    APIGatewayProxyEventV2,
    APIGatewayProxyResultV2
} from 'aws-lambda/trigger/api-gateway-proxy';


export type Handler = (event: APIGatewayProxyEventV2) => Promise<APIGatewayProxyResultV2>;

const getDogsHandler: Handler = async () => {
    return {
        statusCode: 200,
        body: JSON.stringify({message: 'Hello from the REST API'}),
    };
}

const postDogsHandler: Handler = async () => {
    return {
        statusCode: 201,
        body: JSON.stringify({message: 'Dog created'}),
    };
}


export const handler: Handler = async event => {
    if (event.requestContext.http.method === 'GET' && event.rawPath === '/dogs') {
        return getDogsHandler(event);
    } else if (event.requestContext.http.method === 'POST' && event.rawPath === '/dogs') {
        return postDogsHandler(event);
    }
    else {
        return {
            statusCode: 404,
            body: JSON.stringify({message: 'Not found'}),
        };
    }
}
