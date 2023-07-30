import "chai/register-expect.js";
import "chai/register-assert.js";
import * as sinon from "sinon";


import { NextFunction, Request, Response } from 'express';
import Cafe, { ICafe } from "#src/models/cafe";
import cafeController from '#src/controllers/cafeController';
import { Helpers } from "#test/helpers";
import mongoose from "mongoose";
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
  it("GET should query Cafe find and return response", async function () {
    
    const fakeCafeFind = sinon.replace(Cafe, "find", sinon.fake.returns([dummyICafe] as any));
    
    // send empty query
    query = Helpers.createQueryRequest("");
    await cafeController.get(query, mockResponse, mockNext);

    sinon.assert.calledWith(fakeCafeFind, {});
    sinon.assert.calledWith(mockResponse.status, 200);
    sinon.assert.calledWith(mockResponse.json, [dummyICafe]);

    sinon.reset()

    // send empty location
    query = Helpers.createQueryRequest({ location: ""});
    await cafeController.get(query, mockResponse, mockNext);

    sinon.assert.calledWith(fakeCafeFind, {});
    sinon.assert.calledWith(mockResponse.status, 200);
    sinon.assert.calledWith(mockResponse.json, [dummyICafe]);

    sinon.reset()

    // send named location
    query = Helpers.createQueryRequest({ location: "somewhere"});
    await cafeController.get(query, mockResponse, mockNext);

    sinon.assert.calledWith(fakeCafeFind, { location: "somewhere"});
    sinon.assert.calledWith(mockResponse.status, 200);
    sinon.assert.calledWith(mockResponse.json, [dummyICafe]);

    sinon.reset()
  });

  it("POST save Cafe and return response on Success", async function () {
    
    const {fakeMongoose, fakeSession} = Helpers.createMockMongoose();
    const fakeCafeSave = sinon.replace(Cafe.prototype, "save", sinon.fake());

    // send name, description, location
    query = Helpers.createBodyRequest({
        name: dummyICafe.name,
        location: dummyICafe.location,
        description: dummyICafe.description,
    });
    await cafeController.post(query, mockResponse, mockNext);

    sinon.assert.calledOnce(fakeMongoose);
    sinon.assert.calledOnce(fakeSession.startTransaction);
    sinon.assert.calledOnce(fakeSession.commitTransaction);
    sinon.assert.calledOnce(fakeSession.endSession);
    sinon.assert.notCalled(fakeSession.abortTransaction);
    assert.equal(fakeCafeSave.callCount, 1)
    sinon.assert.calledWith(mockResponse.status, 200);
    sinon.assert.calledWithMatch(mockResponse.json, {
        name: sinon.match(dummyICafe.name),
        description: sinon.match(dummyICafe.description),
        location: sinon.match(dummyICafe.location),
    });
  });

  it("POST save Cafe and return response on Error", async function () {
    
    // return error message when error
    const {fakeMongoose, fakeSession} = Helpers.createMockMongoose();
    const fakeCafeSaveError = sinon.replace(Cafe.prototype, "save", sinon.fake.throws("Cafe already exist"));

    query = Helpers.createBodyRequest({
        name: dummyICafe.name,
        location: dummyICafe.location,
        description: dummyICafe.description,
    });
    await cafeController.post(query, mockResponse, mockNext);

    sinon.assert.calledOnce(fakeMongoose);
    sinon.assert.calledOnce(fakeSession.startTransaction);
    sinon.assert.notCalled(fakeSession.commitTransaction);
    sinon.assert.calledOnce(fakeSession.endSession);
    sinon.assert.calledOnce(fakeSession.abortTransaction);
    assert.equal(fakeCafeSaveError.callCount, 1)
    sinon.assert.calledWith(mockResponse.status, 403);
    sinon.assert.calledWithMatch(mockResponse.json, "Cafe already exist");
  });

  it("PUT change Cafe and return response on Success", async function () {
    
    // return error message when error
    const {fakeMongoose, fakeSession} = Helpers.createMockMongoose();
    const fakeCafeUpdate = sinon.replace(Cafe, "updateOne", sinon.fake(x => x));

    // send name, description, location and ID
    query = Helpers.createBodyRequest({
        _id: dummyICafe._id,
        name: dummyICafe.name,
        location: dummyICafe.location,
        description: dummyICafe.description,
    });
    await cafeController.put(query, mockResponse, mockNext);

    sinon.assert.calledOnce(fakeMongoose);
    sinon.assert.calledOnce(fakeSession.startTransaction);
    sinon.assert.calledOnce(fakeSession.commitTransaction);
    sinon.assert.calledOnce(fakeSession.endSession);
    sinon.assert.notCalled(fakeSession.abortTransaction);
    assert.equal(fakeCafeUpdate.callCount, 1)
    sinon.assert.calledWith(mockResponse.sendStatus, 200);
    sinon.assert.notCalled(mockResponse.json);
  });

  it("PUT change Cafe and return response on Error", async function () {
    
    // return error message when error
    const {fakeMongoose, fakeSession} = Helpers.createMockMongoose();
    const fakeCafeUpdate = sinon.replace(Cafe, "updateOne", sinon.fake.throws("_id not found"));

    // send name, description, location and ID
    query = Helpers.createBodyRequest({
        _id: dummyICafe._id,
        name: dummyICafe.name,
        location: dummyICafe.location,
        description: dummyICafe.description,
    });
    await cafeController.put(query, mockResponse, mockNext);

    sinon.assert.calledOnce(fakeMongoose);
    sinon.assert.calledOnce(fakeSession.startTransaction);
    sinon.assert.notCalled(fakeSession.commitTransaction);
    sinon.assert.calledOnce(fakeSession.endSession);
    sinon.assert.calledOnce(fakeSession.abortTransaction);
    assert.equal(fakeCafeUpdate.callCount, 1)
    sinon.assert.calledWith(mockResponse.status, 403);
    sinon.assert.calledWithMatch(mockResponse.json, "_id not found");
  });


  it("DELETE delete Cafe and return response on Success", async function () {
    
    // return error message when error
    const {fakeMongoose, fakeSession} = Helpers.createMockMongoose();
    const fakeCafeDelete = sinon.replace(Cafe, "findOneAndDelete", sinon.fake());

    // send name, description, location and ID
    query = Helpers.createBodyRequest({
        _id: dummyICafe._id,
    });
    await cafeController.delete(query, mockResponse, mockNext);

    sinon.assert.calledOnce(fakeMongoose);
    sinon.assert.calledOnce(fakeSession.startTransaction);
    sinon.assert.calledOnce(fakeSession.commitTransaction);
    sinon.assert.calledOnce(fakeSession.endSession);
    sinon.assert.notCalled(fakeSession.abortTransaction);
    sinon.assert.calledOnce(fakeCafeDelete)
    sinon.assert.calledWith(mockResponse.sendStatus, 200);
    sinon.assert.notCalled(mockResponse.json);
  });


  it("DELETE delete Cafe and return response on Error", async function () {
    
    // return error message when error
    const {fakeMongoose, fakeSession} = Helpers.createMockMongoose();
    const fakeCafeDelete = sinon.replace(Cafe, "findOneAndDelete", sinon.fake());

    query = Helpers.createBodyRequest({
        _id: dummyICafe._id,
    });
    await cafeController.delete(query, mockResponse, mockNext);

    sinon.assert.calledOnce(fakeMongoose);
    sinon.assert.calledOnce(fakeSession.startTransaction);
    sinon.assert.calledOnce(fakeSession.commitTransaction);
    sinon.assert.calledOnce(fakeSession.endSession);
    sinon.assert.notCalled(fakeSession.abortTransaction);
    sinon.assert.calledOnce(fakeCafeDelete)
    sinon.assert.calledWith(mockResponse.sendStatus, 200);
    sinon.assert.notCalled(mockResponse.json);
  });
});