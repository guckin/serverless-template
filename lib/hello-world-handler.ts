import { Logger } from "./logger";


export class HelloworldHandler {

    constructor(private readonly logger: Logger) {
    }

    invoke = () => {
        this.logger.log('Hello World');
    }
}