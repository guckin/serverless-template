export interface Logger {
    log(message: string): void;
}

export class ConsoleLogger {
    log(message: string) {
        console.log(message);
    }
}