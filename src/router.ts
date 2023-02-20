import express, { Router } from 'express';

import createAuth from './auth';
import createConfig from './config';
import ClientController from './controllers/clients.controller';
import IndexController from './controllers/index.controller';
import LoginController from './controllers/login.controller';
import SessionController from './controllers/session.controller';
import UserController from './controllers/user.controller';
import createOAuth2 from './oauth2';

async function createRouter() {
  const router = Router();
  const config = await createConfig();
  const auth = await createAuth();
  const oauth2 = await createOAuth2();
  /**
   * @openapi
   * /:
   *   get:
   *     description: Welcome to Stuff!
   *     responses:
   *       200:
   *         description: Returns index html.
   */
  router.get('/', IndexController.getIndex);
  router.get('/clients', ClientController.getClients);
  router.get('/users', UserController.getUsers);
  router.get('/sessions', SessionController.getSessions);
  router.get('/login', LoginController.getLoginHtml);
  router.post(
    '/api/login',
    auth.authenticate('local'),
    LoginController.postLoginApi,
  );
  router.post(
    '/token',
    auth.authenticate(['local', 'oauth2-client-password'], {session: false}),
    oauth2.token(),
    oauth2.errorHandler(),
  );
  router.get('/.well-known', (req, res) => {
    res.json(config.wellKnown);
  });
  router.get(
    '/**',
    express.static(config.server.publicDirectory),
    (req, res) => {
      res.sendFile(req.path, {root: config.server.publicDirectory});
    },
  );
  return router;
}

export default createRouter;
