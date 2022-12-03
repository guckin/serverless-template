import { HelloworldHandler } from "./hello-world-handler";
import { ConsoleLogger } from "./logger";

const logger = new ConsoleLogger();

export const helloWorldHandler = new HelloworldHandler(logger).invoke;