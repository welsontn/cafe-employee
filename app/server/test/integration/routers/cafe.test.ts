import * as sinon from "sinon";
const expect = require("chai").expect;
const request = require('supertest');
import app from '#src/app';

import { Helpers } from "#test/helpers";
import { DatabasePopulate } from "#test/databaseSeeder";
import Cafe, { ICafe } from "#src/models/cafe";
const {faker} = require("@faker-js/faker");

describe('Cafe Route and Controller', function() {
  
  var rurl;
  if (process.env.NODE_API.length > 0){
    rurl = `/${process.env.NODE_API}/cafes`;
  } else {
    rurl = `/cafes`;
  }

  var response, body;

  // GET CAFE
  describe("GET /cafe", async function(){
    it("with empty query", async function (){
      await DatabasePopulate.cafes();

      response = await request(app)
        .get(rurl)
        .set('Accept', 'application/json');

      expect(response.headers["content-type"]).match(/json/);
      expect(response.status).equal(200);
      body = response._body;
      expect(body.length).equal(5);
    });

    it("with empty location", async function (){
      await DatabasePopulate.cafes();

      response = await request(app)
        .get(rurl)
        .query({
          location: ""
        })
        .set('Accept', 'application/json');

      expect(response.headers["content-type"]).match(/json/);
      expect(response.status).equal(200);
      body = response._body;
      expect(body.length).equal(5);
    });

    it("with location West", async function (){
      await DatabasePopulate.cafes();

      response = await request(app)
        .get(rurl)
        .query({
          location: "West"
        })
        .set('Accept', 'application/json');

      expect(response.headers["content-type"]).match(/json/);
      expect(response.status).equal(200);
      body = response._body;
      expect(body.length).equal(3);
    });

    it("with location East", async function (){
      await DatabasePopulate.cafes();

      response = await request(app)
        .get(rurl)
        .query({
          location: "East"
        })
        .set('Accept', 'application/json');

      expect(response.headers["content-type"]).match(/json/);
      expect(response.status).equal(200);
      body = response._body;
      expect(body.length).equal(2);
    });

    it("with location Invalid", async function (){
      await DatabasePopulate.cafes();

      response = await request(app)
        .get(rurl)
        .query({
          location: "Invalid"
        })
        .set('Accept', 'application/json');

      expect(response.headers["content-type"]).match(/json/);
      expect(response.status).equal(200);
      body = response._body;
      expect(body.length).equal(0);
    });
  })

  // POST CAFE
  describe("POST /cafe", async function(){
    it("with valid body", async function (){
      await DatabasePopulate.cafes();

      response = await request(app)
        .post(rurl)
        .send({
          name: "Cafe 8",
          description: "Lorem Ipsum",
          location: "South",
        })
        .set('Accept', 'application/json');

      expect(response.headers["content-type"]).match(/json/);
      expect(response.status).equal(200);
      body = response._body;
      expect(body.name).equal("Cafe 8");
      expect(body.description).equal("Lorem Ipsum");
      expect(body.location).equal("South");

      const model = await Cafe.findOne({name: "Cafe 8"});
      expect(model.name).equal("Cafe 8");
      expect(model.location).equal("South");
    });

    it("with empty body", async function (){
      await DatabasePopulate.cafes();

      response = await request(app)
        .post(rurl)
        .set('Accept', 'application/json');

      expect(response.headers["content-type"]).match(/json/);
      expect(response.status).equal(422);
    });


    it("with invalid Name", async function (){
      await DatabasePopulate.cafes();

      // too short
      response = await request(app)
        .post(rurl)
        .send({
          name: "Ca",
          description: "Lorem Ipsum",
          location: "South",
        })
        .set('Accept', 'application/json');

      expect(response.headers["content-type"]).match(/json/);
      expect(response.status).equal(422);
      body = response._body[0];
      expect(body.path).equal("name");
      expect(body.msg).equal("Allowed name length of 6 to 10");

      // too long
      response = await request(app)
        .post(rurl)
        .send({
          name: "Cafenameistoolooooong",
          description: "Lorem Ipsum",
          location: "South",
        })
        .set('Accept', 'application/json');

      expect(response.headers["content-type"]).match(/json/);
      expect(response.status).equal(422);
      body = response._body[0];
      expect(body.path).equal("name");
      expect(body.msg).equal("Allowed name length of 6 to 10");
    });


    it("with invalid Description", async function (){
      await DatabasePopulate.cafes();

      // too short
      response = await request(app)
        .post(rurl)
        .send({
          name: "Cafe 8",
          description: "",
          location: "South",
        })
        .set('Accept', 'application/json');

      expect(response.headers["content-type"]).match(/json/);
      expect(response.status).equal(422);
      body = response._body[0];
      expect(body.path).equal("description");
      expect(body.msg).equal("Allowed description length of 1 to 256");

      // too long
      response = await request(app)
        .post(rurl)
        .send({
          name: "Cafe 8",
          description: faker.string.alphanumeric({length: 300}),
          location: "South",
        })
        .set('Accept', 'application/json');

      expect(response.headers["content-type"]).match(/json/);
      expect(response.status).equal(422);
      body = response._body[0];
      expect(body.path).equal("description");
      expect(body.msg).equal("Allowed description length of 1 to 256");
    });

    it("with invalid Location", async function (){
      await DatabasePopulate.cafes();

      // too short
      response = await request(app)
        .post(rurl)
        .send({
          name: "Cafe 8",
          description: "Lorem Ipsum",
          location: "",
        })
        .set('Accept', 'application/json');

      expect(response.headers["content-type"]).match(/json/);
      expect(response.status).equal(422);
      body = response._body[0];
      expect(body.path).equal("location");
      expect(body.msg).equal("Allowed location length of 1 to 256");

      // too long
      response = await request(app)
        .post(rurl)
        .send({
          name: "Cafe 8",
          description: "Lorem Ipsum",
          location:  faker.string.alphanumeric({length: 300}),
        })
        .set('Accept', 'application/json');

      expect(response.headers["content-type"]).match(/json/);
      expect(response.status).equal(422);
      body = response._body[0];
      expect(body.path).equal("location");
      expect(body.msg).equal("Allowed location length of 1 to 256");
    });

  });

  // PUT CAFE
  describe("PUT /cafe", async function(){
    it("with valid body", async function (){
      await DatabasePopulate.cafes();

      let model = await Cafe.findOne({name: "Cafe 2"});
      let modelId = model._id;

      response = await request(app)
        .put(rurl)
        .send({
          _id: modelId,
          name: "Cafe 10",
          description: "Lorem",
          location: "North",
        })
        .set('Accept', 'application/json');

      expect(response.status).equal(200);
      
      // check data is changed
      model = await Cafe.findOne({_id: modelId});
      expect(model.name).equal("Cafe 10");
      expect(model.description).equal("Lorem");
      expect(model.location).equal("North");
      
      // old data has its name changed and thus no longer there
      model = await Cafe.findOne({name: "Cafe 2"});
      expect(model).equal(null);
    });

    it("with invalid ID", async function (){
      await DatabasePopulate.cafes();

      response = await request(app)
        .put(rurl)
        .send({
          _id: "invalid ID",
          name: "Cafe 10",
          description: "Lorem",
          location: "North",
        })
        .set('Accept', 'application/json');

      expect(response.status).equal(422);
      body = response._body;
      expect(body).equal("Cafe not found");
    });

  });

  // DELETE CAFE
  describe("DELETE /cafe", async function(){
    it("with valid body", async function (){
      await DatabasePopulate.cafes();

      let model = await Cafe.findOne({name: "Cafe 2"});
      let modelId = model._id;

      response = await request(app)
        .delete(rurl)
        .send({
          _id: modelId
        })
        .set('Accept', 'application/json');

      expect(response.status).equal(200);
      
      // check data is deleted
      model = await Cafe.findOne({_id: modelId});
      expect(model).equal(null);
    });

    it("with invalid ID", async function (){
      await DatabasePopulate.cafes();

      response = await request(app)
        .delete(rurl)
        .send({
          _id: "invalid ID"
        })
        .set('Accept', 'application/json');
      
      expect(response.status).equal(422);
      body = response._body;
      expect(body).equal("Cafe not found");
    });


  });

});