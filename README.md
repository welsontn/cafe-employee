
# About

This repository used to learn react-redux-router, NodeJS, TypeScript and dockerize. React is generated with CRA before I found out CRA is sunsetting.

What this project aims to achieve is just for me to learn how react (as client) and node (as server) communicate each others inside docker, then using MongoDB as database to store data.

Biggest challenge was getting TypeScript data typing right in React and Node environment. Interface and extend classes were simple enough and well documented. However the challenging part was what *kind* of data type is being returned from callback. Even if data type is seemingly set right, the compiler will return an error for missing parameter, or unable to detect callback function. This easily doubled the amount of work I had to put in...

# TODO

- Unit Testing (Partial finished)
- Integration Testing
- CI/CD pipeline Build

# Modules Used

ReactJS:
- Redux
- Router
- AG Grid (https://www.ag-grid.com)
- MUI (https://mui.com/)

NodeJS:
- Mongoose (https://mongoosejs.com/)

Testing tools:
- Jest for react
- Mocha, Chai and Sinon for node

# Quickstart

Built on Docker Client v4.19.0 in MacOS.

1. `cp .env.example .env.local`. Default values should be enough to quickly compose without issue.
2. Run `bash develop up` will get dev environment started.

With default `.env`, reactJS client can be accessed at `http://localhost:3000`, nodeJS server at `http://localhost:8079` and mongo express at `http://localhost:8081`. Reverse proxy is handled via NGINX container.

ReactJS container used to serve frontend web application while NodeJS container to process API and access MongoDB.

# Inspecting/debugging NodeJS

Tools used to inspect: Visual Studio Code

in `.env.local`, set `NODE_DEV_CMD=dev:inspect` to start inspecting. Refs: `https://code.visualstudio.com/docs/nodejs/nodejs-debugging`

## Seeding Database 

Ensures docker is running. Database seeding can done by running `bash develop db-seed`.

## Accessing MongoDB

Database admin can be accessed from `http://localhost:8081`. Credential is based on `.env`.

Alternatively, use your favourite database client and access via `mongodb://<MONGO_USER>:<MONGO_PASS>@localhost:27017`