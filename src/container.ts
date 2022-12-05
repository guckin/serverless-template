import { HelloWorldHandler } from "./hello-world-handler";
import { ConsoleLogger } from "./logger";

const logger = new ConsoleLogger();

export const helloWorldHandler = new HelloWorldHandler(logger).invoke;
export const hellowWorldPath = __filename;
export const helloWorldHandlerName = 'helloWorldHandler';
