import {v4} from 'uuid';

export const uuidHandler = <T extends object>(input: T): T & {id: string} => ({...input, id: v4()});
