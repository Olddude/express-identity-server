import process from 'process';

import ms from 'ms';

async function createConfig() {
  const logLevel = process.env.LOG_LEVEL || 'debug';
  return {
    environment: process.env.NODE_ENV || 'development',
    server: {
      secret: process.env.SERVER_SECRET || 'secret',
      sessionMaxAge: ms(process.env.SERVER_SESSION_MAX_AGE || '10s'),
      protocol: process.env.SERVER_PROTOCOL || 'https',
      port: Number.parseInt(process.env.SERVER_PORT || '3000', 10),
      host: process.env.SERVER_HOST || 'localhost',
      publicDirectory: process.env.SERVER_PUBLIC_DIRECTORY || 'public',
      logLevel,
    },
    database: {
      url: process.env.DATABASE_URL || 'mongodb://localhost:27017',
      name: process.env.DATABASE_NAME || 'stuff',
      user: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD || 'example',
      logLevel,
    },
    logger: {
      appenders: {
        out: {type: 'stdout'},
      },
      categories: {
        default: {appenders: ['out'], level: logLevel},
      },
    },
    wellKnown: {
      "issuer": "https://auth.example.com",
      "authorization_endpoint": "https://auth.example.com/authorize",
      "token_endpoint": "https://auth.example.com/token",
      "userinfo_endpoint": "https://auth.example.com/userinfo",
      "jwks_uri": "https://auth.example.com/jwks",
      "response_types_supported": [
        "code",
        "token",
        "id_token",
        "code token",
        "code id_token",
        "token id_token",
        "code token id_token"
      ],
      "subject_types_supported": [
        "public",
        "pairwise"
      ],
      "id_token_signing_alg_values_supported": [
        "RS256",
        "RS384",
        "RS512",
        "ES256",
        "ES384",
        "ES512",
        "PS256",
        "PS384",
        "PS512"
      ],
      "scopes_supported": [
        "openid",
        "profile",
        "email",
        "address",
        "phone"
      ],
      "token_endpoint_auth_methods_supported": [
        "client_secret_basic",
        "client_secret_post"
      ],
      "claims_supported": [
        "sub",
        "name",
        "given_name",
        "family_name",
        "middle_name",
        "nickname",
        "preferred_username",
        "profile",
        "picture",
        "website",
        "email",
        "email_verified",
        "gender",
        "birthdate",
        "zoneinfo",
        "locale",
        "phone_number",
        "phone_number_verified",
        "address",
        "updated_at"
      ],
      "revocation_endpoint": "https://auth.example.com/revoke",
      "end_session_endpoint": "https://auth.example.com/logout",
      "request_parameter_supported": true
    }
  };
}

export default createConfig;
