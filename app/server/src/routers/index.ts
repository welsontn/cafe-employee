const express = require('express')
const app = express()
const router = express.Router()
const cafeRouter = require("./cafe");
const employeeRouter = require("./employee");


router.use('/', cafeRouter);
router.use('/', employeeRouter);

export = router;