import oauth2orize from 'oauth2orize';

import ClientService from './services/client.service';

async function createOAuth2() {
  const server = oauth2orize.createServer();

  server.grant(
    oauth2orize.grant.token({
      scopeSeparator: ' ',
    }, (client, user, ares, issued) => {
      throw new Error(``);
    }),
  );

  server.exchange(
    oauth2orize.exchange.clientCredentials({
      scopeSeparator: ' ',
      userProperty: 'user',
    }, (client, scope, body, authInfo, issued) => {
      issued(null, 'accessToken', 'refreshToken', authInfo);
    }),
  );

  server.serializeClient((client, done) => {
    done(null, client.id);
  });

  server.deserializeClient((id, done) => {
    const client = ClientService.findById(id);
    done(null, client);
  });

  return server;
}

export default createOAuth2;
