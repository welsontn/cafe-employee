import mongoose, { connection } from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';
import sinon from "sinon";

exports.mochaHooks = {
    beforeAll: function () {
      console.log("------------ Unit Testing Start ------------")
    },

    beforeEach: function () {
    },

    afterEach: function () {
      // sinon restore
      sinon.restore();
    },

    afterAll: function () {
      console.log("------------ Unit Testing End ------------")
    }
  };
  