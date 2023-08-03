import "chai/register-assert.js";
import * as sinon from "sinon";

import Employee, { EGender, IEmployee } from "#src/models/employee";
import employeeController from '#src/controllers/employeeController';
import { Helpers } from "#test/helpers";
import Cafe, { ICafe } from "#src/models/cafe";
const {faker} = require("@faker-js/faker");

describe('EmployeeController', function() {
  
  // create dummy data
  const dummyCafeId = faker.string.uuid();
  const dummyIEmployee: IEmployee = {
    _id: faker.string.uuid(),
    name: faker.person.firstName(),
    email_address: faker.internet.email(),
    phone_number: faker.phone.imei("91######"),
    gender: faker.helpers.enumValue(EGender),
    date_start: faker.date.past(),
    cafe_id: dummyCafeId,
  }
  const dummyICafe: ICafe = {
    _id: dummyCafeId,
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
  describe("GET should query Employee find and return response", async function () {
    
    var fakeEmployeeFind;
    var fakeCafeFind;
    var fakeCafeFindOne;

    beforeEach(function (){
      fakeEmployeeFind =  sinon.replace(Employee, "find", sinon.fake.returns([dummyIEmployee] as any));
      fakeCafeFind = sinon.replace(Cafe, "find", sinon.fake.returns({select: (name) => name} as any));
      fakeCafeFindOne = sinon.replace(Cafe, "findOne", sinon.fake.returns(dummyICafe as any));
    })
    
    it ("with empty query", async function() {
      query = Helpers.createQueryRequest("");
      await employeeController.get(query, mockResponse, mockNext);
  
      sinon.assert.calledWith(mockResponse.json, {employees: [dummyIEmployee], cafes: 'name'});
  
      sinon.reset()
    })

    it ("with named cafe", async function() {
      query = Helpers.createQueryRequest({ cafe: dummyICafe.name });
      await employeeController.get(query, mockResponse, mockNext);
  
      sinon.assert.calledWith(mockResponse.json, {employees: [dummyIEmployee], cafes: 'name'});
  
      sinon.reset()
    })
  });
  

  describe("POST save Employee", async function () {
    
    var fakeMongoose, fakeSession;
    var fakeCafeFindOneAndUpdate;

    beforeEach(function (){
      let mockMongoose = Helpers.createMockMongoose();
      fakeMongoose = mockMongoose.fakeMongoose;
      fakeSession = mockMongoose.fakeSession;
      fakeCafeFindOneAndUpdate = sinon.replace(Cafe, "findOneAndUpdate", sinon.fake.returns(dummyICafe as any))

      // send name, description, location
      query = Helpers.createBodyRequest({
        name: dummyIEmployee.name,
        email_address: dummyIEmployee.email_address,
        phone_number: dummyIEmployee.phone_number,
        gender: dummyIEmployee.gender,
        date_start: dummyIEmployee.date_start,
        cafe_id: dummyIEmployee.cafe_id,
      });
    })

    it ("with success", async function() {
      sinon.replace(Employee.prototype, "save", sinon.fake());

      await employeeController.post(query, mockResponse, mockNext);
  
      sinon.assert.calledWith(mockResponse.status, 200);
      sinon.assert.calledWithMatch(mockResponse.json, {
        name: dummyIEmployee.name,
        email_address: dummyIEmployee.email_address,
        phone_number: dummyIEmployee.phone_number,
        gender: dummyIEmployee.gender,
        date_start: dummyIEmployee.date_start,
        cafe_id: dummyIEmployee.cafe_id,
      });
    });

    it ("with error", async function() {
      sinon.replace(Employee.prototype, "save", sinon.fake.throws("Employee already exist"));

      await employeeController.post(query, mockResponse, mockNext);
  
      sinon.assert.calledWith(mockResponse.status, 422);
      sinon.assert.calledWithMatch(mockResponse.json, "Employee already exist");
    });
  });

  describe("PUT change Employee", async function () {

    var fakeMongoose, fakeSession;
    var fakeEmployeeUpdate;
    var fakeCafeFindOne;
    var fakeCafeUpdateOne;

    beforeEach(function (){
      let mockMongoose = Helpers.createMockMongoose();
      fakeMongoose = mockMongoose.fakeMongoose;
      fakeSession = mockMongoose.fakeSession;
      fakeEmployeeUpdate = sinon.replace(Employee, "updateOne", sinon.fake(x => x));
      fakeCafeFindOne = sinon.replace(Cafe, "findOne", sinon.fake.returns(dummyICafe as any));
      fakeCafeUpdateOne = sinon.replace(Cafe, "updateOne", sinon.fake(x => x));

      // send name, description, location
      query = Helpers.createBodyRequest({
        name: dummyIEmployee.name,
        email_address: dummyIEmployee.email_address,
        phone_number: dummyIEmployee.phone_number,
        gender: dummyIEmployee.gender,
        date_start: dummyIEmployee.date_start,
        cafe_id: dummyIEmployee.cafe_id,
      });
    })
    
    it("with success", async function() {
      sinon.replace(Employee, "findOneAndUpdate", sinon.fake((x) => x))
  
      await employeeController.put(query, mockResponse, mockNext);

      sinon.assert.calledWith(mockResponse.sendStatus, 200);
    });
    
    it("with error", async function() {
      sinon.replace(Employee, "findOneAndUpdate", sinon.fake.throws("_id not found"));
  
      await employeeController.put(query, mockResponse, mockNext);

      sinon.assert.calledWith(mockResponse.status, 422);
      sinon.assert.calledWithMatch(mockResponse.json, "_id not found");
    });
  });


  describe("DELETE delete Employee", async function () {

    var fakeMongoose, fakeSession;
    var fakeCafeUpdateOne;

    beforeEach(function (){
      let mockMongoose = Helpers.createMockMongoose();
      fakeMongoose = mockMongoose.fakeMongoose;
      fakeSession = mockMongoose.fakeSession;
      fakeCafeUpdateOne = sinon.replace(Cafe, "updateOne", sinon.fake(x => x));

      // send name, description, location
      query = Helpers.createQueryRequest({
        _id: dummyIEmployee._id,
      });
    })

    it("with success", async function() {
      sinon.replace(Employee, "findOneAndDelete", sinon.fake((x) => x))
  
      await employeeController.delete(query, mockResponse, mockNext);

      sinon.assert.calledWith(mockResponse.sendStatus, 200);
    });


    it("with success", async function() {
      sinon.replace(Employee, "findOneAndDelete", sinon.fake.throws("_id not found"));
  
      await employeeController.delete(query, mockResponse, mockNext);

      sinon.assert.calledWith(mockResponse.status, 422);
      sinon.assert.calledWithMatch(mockResponse.json, "_id not found");
    });

  });

});