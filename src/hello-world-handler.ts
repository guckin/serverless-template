import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

export class HelloWorldHandler {

    invoke = (): Promise<APIGatewayProxyStructuredResultV2> => {
        console.log('Hello World');
        return Promise.resolve({
            statusCode: 200,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({hello: 'World'})
        });
    }
}

export const handler = new HelloWorldHandler().invoke;
