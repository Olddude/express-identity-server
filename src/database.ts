import mongoose from 'mongoose';

import createConfig from './config';

async function createDatabase() {
  const config = await createConfig();
  const fullDatabaseUrl = `${config.database.url}/${config.database.name}`;
  mongoose.set('strictQuery', true);
  await mongoose.connect(fullDatabaseUrl, {
    user: config.database.user,
    pass: config.database.password,
    authSource: 'admin',
  });
}

export default createDatabase;
