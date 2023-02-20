import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';
import { Strategy as LocalStrategy} from 'passport-local';
import { Strategy as OAuth2Strategy} from 'passport-oauth2-client-password';

import ClientService from './services/client.service';
import UserService from './services/user.service';

async function createAuth() {
  passport.serializeUser((user, done) => {
    done(null, {id: (user as any).id});
  });
  passport.deserializeUser(async (payload, done) => {
    const user = await UserService.findById((payload as any).id);
    done(null, user);
  });
  passport.use('oauth2-client-password', new OAuth2Strategy({
    passReqToCallback: true,
  }, async (req, clientId, clientSecret, done) => {
    const {scope} = req.body;
    const client = await ClientService.findByIdSecretAndScope(
      clientId,
      clientSecret,
      scope,
    );
    if (!client) {
      done('unauthorized', false);
    } else {
      done(null, client, req.user);
    }
  }));
  passport.use('jwt', new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secret',
  }, async (payload, done) => {
    throw new Error(`not implemented`);
  }));
  passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  }, async (email, password, done) => {
    const user = await UserService.findByUsernameAndPassword(email, password);
    if (!user) {
      done('unauthorized', false);
    } else {
      done(null, user);
    }
  }));
  return passport;
}

export default createAuth;
