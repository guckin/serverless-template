import { Logger } from './logger';
import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

export class HelloWorldHandler {

    constructor(private readonly logger: Logger) {
    }

    invoke = (): Promise<APIGatewayProxyStructuredResultV2> => {
        this.logger.log('Hello World');
        return Promise.resolve({
            statusCode: 200,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({hello: 'World'})
        });
    }
}