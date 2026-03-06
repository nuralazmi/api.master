import appConfig from './app.config';
import databaseConfig from './database.config';
import redisConfig from './redis.config';
import mailConfig from './mail.config';
import firebaseConfig from './firebase.config';
import storageConfig from './storage.config';
import swaggerConfig from './swagger.config';
import twilioConfig from './twilio.config';

export default [
  appConfig,
  databaseConfig,
  redisConfig,
  mailConfig,
  firebaseConfig,
  storageConfig,
  swaggerConfig,
  twilioConfig,
];

export {
  appConfig,
  databaseConfig,
  redisConfig,
  mailConfig,
  firebaseConfig,
  storageConfig,
  swaggerConfig,
  twilioConfig,
};
