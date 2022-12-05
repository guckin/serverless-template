import { HelloworldHandler } from "./hello-world-handler";

const logger = {log: jest.fn()};

test('Logs hello world', async () => {
    const handler = new HelloworldHandler(logger);

    await handler.invoke();
    
    expect(logger.log).toHaveBeenCalledWith('Hello World');
});
