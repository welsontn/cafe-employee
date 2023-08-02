import {EGender} from "#src/models/employee";
const express = require('express');
const router = express.Router();
import employeeController from "#src/controllers/employeeController";
const {check, validationResult} = require('express-validator');

// validation check
const regex_phone = /[89]\d{7,7}/;

const validationChecks = [
		check('name', 'Allowed name length of 6 to 10').isLength({min: 6, max: 10}),
		check('email_address', 'Your email is not valid').not().isEmpty().isEmail(),
		check('phone_number', 'Phone number should start with 8 or 9, and exactly 8 digits').isLength({min: 8, max: 8}).matches(regex_phone),
		check('gender', 'Either Male or Female only').isIn(EGender),
		check('date_start', 'Invalid Date').isISO8601().toDate(),
	];

// routes
router.get('/employees', employeeController.get);
router.post('/employee', 
	validationChecks,
	employeeController.post);
router.put('/employee', 
	validationChecks,
	employeeController.put);
router.delete('/employee', employeeController.delete);

export = router;