import { HelloworldHandler } from "./hello-world-handler";

const logger = {log: jest.fn()};

test('Logs hello world', () => {
    const handler = new HelloworldHandler(logger);

    handler.invoke();
    
    expect(logger.log).toHaveBeenCalledWith('Hello World');
});
