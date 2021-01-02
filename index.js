const asgLogger = require("./logWrapper")(__filename);

const { ENVIRONMENT } = require('./config');



asgLogger.info('Hello World');
asgLogger.debug('Debugging Info');
asgLogger.error('This is Error');
asgLogger.error('This is Error', { alert:true });

// asgLogger.debug('Debugging info');
// asgLogger.info(`Your env is ${ENVIRONMENT}`);