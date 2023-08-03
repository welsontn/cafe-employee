import mongoose, { connection } from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';
import sinon from "sinon";

exports.mochaHooks = {
    beforeAll: async function () {
      console.log("Startup")

      if (config.Memory) { 
        // Config to decided if an mongodb-memory-server instance should be used
        // it's needed in global space, because we don't want to create a new instance every test-suite
        // linux alpine does not support mongo. all test cases will be done on external mongo DB 
        const instance = await MongoMemoryServer.create();
        const uri = instance.getUri();
        (globalThis as any).__MONGOINSTANCE = instance;
        process.env.MONGO_URI = uri.slice(0, uri.lastIndexOf('/'));
      } else {
        process.env.MONGO_URI = `mongodb://${config.User}:${config.Password}@${config.IP}:${config.Port}/${config.Database}`;
      }

      // // tells mongoose to use ES6 implementation of promises
      // mongoose.Promise = global.Promise;

      // The following is to make sure the database is clean before an test starts
      const connection = await mongoose.connect(`${process.env.MONGO_URI}`);
      let collections = await connection.connection.db.collections();
      for (let c of collections) {
        await c.drop()
      }
    },

    beforeEach: function () {
    },

    afterEach: async function () {
      // sinon restore
      sinon.restore();

      // drop collections every test
      let collections = await mongoose.connection.db.collections();
      for (let c of collections) {
        await c.drop()
      }
    },

    afterAll: async function () {
      console.log("All done - tearing down")

      // tear down
      if (config.Memory) {
        const instance: MongoMemoryServer = (global as any).__MONGOINSTANCE;
        await instance.stop();
      }

      // disconnect
      await mongoose.disconnect();
    }
  };
  