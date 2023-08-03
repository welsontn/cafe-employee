'use strict';

import express, { Express, Request, Response } from 'express';
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');

const routers = require('./routers');
const connect = require('./middlewares/database');

require('dotenv').config();

export const port = process.env.NODE_PORT || 8079;

// enable cors
app.use(cors({
    origin: '*'
}));

// body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// mongo query sanitization
app.use(mongoSanitize());

// mount the router on the app
app.use(`/${process.env.NODE_API}`, routers)

// error 404 not found
app.get('*', function(req: Request, res: Response){
  res.status(404).send('404 Error');
});

// check if integration testing
if (process.env.NODE_TESTING == 'true'){
  // skip DB and listening connection
  // app.listen(port, () => console.log(`Listening on port ${port}`));
} else {
  // Connect DB and listen
  console.log("Connecting....")
  try {
    connect().then(() => {
      app.listen(port, () => console.log(`Listening on port ${port}`));
    });
  } catch (err) {
    console.log("DB connection failed, terminating server")
    throw err;
  }
  
}

export default app;