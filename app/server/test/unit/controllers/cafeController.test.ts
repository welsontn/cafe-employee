import "chai/register-assert.js";
import * as sinon from "sinon";

import Cafe, { ICafe } from "#src/models/cafe";
import cafeController from '#src/controllers/cafeController';
import { Helpers } from "#test/helpers";
const {faker} = require("@faker-js/faker");

describe('CafeController', function() {
  
  // create dummy data
  const dummyICafe: ICafe = {
    _id: faker.string.uuid(),
    name: faker.person.firstName(),
    description: faker.lorem.words(),
    location: faker.location.city(),
    employee_count: faker.number.int(0,10),
  }

  // declare mocks
  var mockResponse: any;
  var mockNext: any = sinon.fake();
  var query: any;

  beforeEach(function (){
    mockResponse = Helpers.createMockResponse();
    mockNext = sinon.fake();
  });

  // Run Test
  describe("GET should query Cafe", async function () {
    
    var fakeCafeFind;

    beforeEach(function(){
      fakeCafeFind = sinon.replace(Cafe, "find", sinon.fake.returns([dummyICafe] as any));
    });
    
    it("with empty query", async function (){
      query = Helpers.createQueryRequest("");
      await cafeController.get(query, mockResponse, mockNext);
  
      sinon.assert.calledWith(mockResponse.status, 200);
      sinon.assert.calledWith(mockResponse.json, [dummyICafe]);
    })

    it("with empty location", async function (){
      query = Helpers.createQueryRequest({ location: ""});
      await cafeController.get(query, mockResponse, mockNext);
  
      sinon.assert.calledWith(fakeCafeFind, {});
      sinon.assert.calledWith(mockResponse.status, 200);
      sinon.assert.calledWith(mockResponse.json, [dummyICafe]);
    })

    it("with empty location", async function (){
      query = Helpers.createQueryRequest({ location: "somewhere"});
      await cafeController.get(query, mockResponse, mockNext);
  
      sinon.assert.calledWith(mockResponse.status, 200);
      sinon.assert.calledWith(mockResponse.json, [dummyICafe]);
  
      sinon.reset()
    })
  });

  describe("POST save Cafe and return response on Success", async function () {
    
    var fakeMongoose, fakeSession;

    beforeEach(function (){
      let mockMongoose = Helpers.createMockMongoose();
      fakeMongoose = mockMongoose.fakeMongoose;
      fakeSession = mockMongoose.fakeSession;
      query = Helpers.createBodyRequest({
          name: dummyICafe.name,
          location: dummyICafe.location,
          description: dummyICafe.description,
      });
    });

    it("with success", async function (){
      sinon.replace(Cafe.prototype, "save", sinon.fake());
      
      await cafeController.post(query, mockResponse, mockNext);
  
      sinon.assert.calledWith(mockResponse.status, 200);
      sinon.assert.calledWithMatch(mockResponse.json, {
          name: sinon.match(dummyICafe.name),
          description: sinon.match(dummyICafe.description),
          location: sinon.match(dummyICafe.location),
      });
    });

    it("with error", async function (){
      sinon.replace(Cafe.prototype, "save", sinon.fake.throws("Cafe already exist"));
      
      await cafeController.post(query, mockResponse, mockNext);
  
      sinon.assert.calledWith(mockResponse.status, 422);
      sinon.assert.calledWithMatch(mockResponse.json, "Cafe already exist");
    });
  });

  describe("PUT change Cafe", async function () {
    
    var fakeMongoose, fakeSession;

    beforeEach(function (){
      let mockMongoose = Helpers.createMockMongoose();
      fakeMongoose = mockMongoose.fakeMongoose;
      fakeSession = mockMongoose.fakeSession;
      query = Helpers.createBodyRequest({
          _id: dummyICafe._id,
          name: dummyICafe.name,
          location: dummyICafe.location,
          description: dummyICafe.description,
      });
    });

    it("with success", async function(){
      sinon.replace(Cafe, "updateOne", sinon.fake(x => x));

      await cafeController.put(query, mockResponse, mockNext);
  
      sinon.assert.calledWith(mockResponse.sendStatus, 200);
      sinon.assert.notCalled(mockResponse.json);
    });

    it("with error", async function(){
      sinon.replace(Cafe, "updateOne", sinon.fake.throws("_id not found"));

      await cafeController.put(query, mockResponse, mockNext);
  
      sinon.assert.calledWith(mockResponse.status, 422);
      sinon.assert.calledWithMatch(mockResponse.json, "_id not found");
    });

  });

  describe("PUT change Cafe", async function () {
    
    var fakeMongoose, fakeSession;

    beforeEach(function (){
      let mockMongoose = Helpers.createMockMongoose();
      fakeMongoose = mockMongoose.fakeMongoose;
      fakeSession = mockMongoose.fakeSession;
      query = Helpers.createBodyRequest({
          _id: dummyICafe._id,
          name: dummyICafe.name,
          location: dummyICafe.location,
          description: dummyICafe.description,
      });
    });

    it("with success", async function(){
      sinon.replace(Cafe, "updateOne", sinon.fake(x => x));

      await cafeController.put(query, mockResponse, mockNext);
  
      sinon.assert.calledWith(mockResponse.sendStatus, 200);
    });

    it("with error", async function(){
      sinon.replace(Cafe, "updateOne", sinon.fake.throws("_id not found"));

      await cafeController.put(query, mockResponse, mockNext);
  
      sinon.assert.calledWith(mockResponse.status, 422);
      sinon.assert.calledWithMatch(mockResponse.json, "_id not found");
    });
  });


  describe("DELETE delete Cafe", async function () {

    var fakeMongoose, fakeSession;

    beforeEach(function (){
      let mockMongoose = Helpers.createMockMongoose();
      fakeMongoose = mockMongoose.fakeMongoose;
      fakeSession = mockMongoose.fakeSession;
      query = Helpers.createBodyRequest({
          _id: dummyICafe._id,
      });
    });

    it("with success", async function (){
      sinon.replace(Cafe, "findOneAndDelete", sinon.fake())

      await cafeController.delete(query, mockResponse, mockNext);

      sinon.assert.calledWith(mockResponse.sendStatus, 200);
      sinon.assert.notCalled(mockResponse.json);
    });

    it("with error", async function (){
      sinon.replace(Cafe, "findOneAndDelete", sinon.fake.throws("_id not found"))

      await cafeController.delete(query, mockResponse, mockNext);

      sinon.assert.calledWith(mockResponse.status, 422);
      sinon.assert.calledWithMatch(mockResponse.json, "_id not found");
    });
  });

});