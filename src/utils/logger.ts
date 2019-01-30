import * as config from 'config';
import * as pino from 'pino';

const logger = pino();
logger.level = config.get('log_level');

export function logInOut<O>(tag: string, f: (...args: any[]) => O): (...args: any[]) => O {
  return function(...args: any[]) {
    logger.trace(tag, 'in', args);
    const result = f.apply(null, args);
    logger.trace(tag, 'out', result);
    return result;
  };
}

export default logger;
