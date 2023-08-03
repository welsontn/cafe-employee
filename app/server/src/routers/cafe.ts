const express = require('express');
const router = express.Router();
import cafeController from "#src/controllers/cafeController";
const { check } = require('express-validator');


const validationChecks = [
		check('name', 'Allowed name length of 6 to 10').isLength({min: 6, max: 10}),
		check('description', 'Allowed description length of 1 to 256').isLength({min: 1, max: 256}),
		check('location', 'Allowed location length of 1 to 256').isLength({min: 1, max: 256}),
	];

// routes
router.get('/cafes', cafeController.get);
router.post('/cafes', validationChecks,
	cafeController.post);
router.put('/cafes', validationChecks,
	cafeController.put);
router.delete('/cafes', cafeController.delete);

export = router;