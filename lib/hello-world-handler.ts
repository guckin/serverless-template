import { Logger } from './logger';
import { Handler, APIGatewayProxyResultV2 } from 'aws-lambda';

export class HelloworldHandler {

    constructor(private readonly logger: Logger) {
    }

    invoke: Handler<unknown, APIGatewayProxyResultV2<unknown>> = async () => {
        this.logger.log('Hello World');
        return {
            statusCode: 200,
            body: 'Hello World!'
        };
    }
}