const express = require('express');
const router = express.Router();
const cafeController = require("../controllers/cafeController");
const {check, validationResult} = require('express-validator');


const validationChecks = [
		check('name', 'Allowed name length of 6 to 10').isLength({min: 6, max: 10}),
		check('description', 'Allowed description length of 1 to 256').isLength({min: 1, max: 256}),
		check('location', 'Allowed location length of 1 to 256').isLength({min: 1, max: 256}),
	];

// routes
router.get('/cafes', cafeController.get);
router.post('/cafe', validationChecks,
	cafeController.post);
router.put('/cafe', validationChecks,
	cafeController.put);
router.delete('/cafe', cafeController.delete);

export = router;