import type { pino } from 'pino';
declare type _defaultPinoConfigHack = {
    readonly level: 'debug';
    readonly hooks: {
        readonly logMethod: (args: any[], method: pino.LogFn, level: number) => void;
    };
};
export declare type customLogger = (_defaultPinoConfig: _defaultPinoConfigHack) => pino.Logger;
export declare type NextLoggerConfig = {
    logger?: customLogger;
};
export {};
//# sourceMappingURL=custom-logger.d.ts.map