import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import config from './config';

export = async function globalSetup() {
  if (config.Memory) { 
    // Config to decided if an mongodb-memory-server instance should be used
    // it's needed in global space, because we don't want to create a new instance every test-suite
    // linux alpine does not support mongo. all test cases will be done on external mongo DB 
    const instance = await MongoMemoryServer.create();
    const uri = instance.getUri();
    (global as any).__MONGOINSTANCE = instance;
    process.env.MONGO_URI = uri.slice(0, uri.lastIndexOf('/'));
  } else {
    process.env.MONGO_URI = `mongodb://${config.User}:${config.Password}@${config.IP}:${config.Port}/${config.Database}`;
    // process.env.MONGO_URI = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB_NAME}`; 
  }
  // The following is to make sure the database is clean before an test starts
  const connection = await mongoose.connect(`${process.env.MONGO_URI}`);
  // await connection.connection.db.dropDatabase(); // permission error
  let collections = await connection.connection.db.collections();
  for (let c of collections) {
    await c.drop()
  }
  await connection.disconnect();
};