import path from 'path';

import bodyParser from 'body-parser';
import MongoStore from 'connect-mongo';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import createConfig from './config';
import createDatabase from './database';
import createLogger from './logger';
import createRouter from './router';
import ClientService from './services/client.service';
import UserService from './services/user.service';
import createSwagger from './swagger';

async function createApp() {
  const app = express();
  const logger = await createLogger(createApp.name);
  const config = await createConfig();
  const router = await createRouter();
  const fullDatabaseUrl = `${config.database.url}/${config.database.name}`;
  await createDatabase();
  const sessionStore = MongoStore.create({
    mongoUrl: fullDatabaseUrl,
    mongoOptions: {
      authSource: 'admin',
      auth: {
        username: config.database.user,
        password: config.database.password,
      },
    },
  });
  const createdUser = await UserService.createOne();
  logger.info(createdUser);
  const createdClient = await ClientService.createOne();
  logger.info(createdClient);
  const swaggerSpec = await createSwagger();
  app.use(helmet());
  app.use(session({
    secret: config.server.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: config.server.sessionMaxAge,
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    },
    store: sessionStore,
  }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(morgan('combined', {
    stream: {
      write: (msg) => logger.info(`${msg.trimEnd()}`),
    },
  }));
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use(router);
  app.set('views', path.resolve(__dirname, './views'));
  app.set('view engine', 'ejs');
  return app;
}

export default createApp;
