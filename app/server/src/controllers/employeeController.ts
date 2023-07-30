import { Request, Response } from 'express';
import mongoose, { HydratedDocument } from 'mongoose';
import Cafe, { ICafe } from "../models/cafe";
import Employee, { IEmployee } from "#src/models/employee";
import asyncHandler from "express-async-handler";
import {check, validationResult} from 'express-validator';
import utils from "#src/utils/utils";

// Display Employee on GET
exports.get = asyncHandler(async (req: Request, res: Response, NextFunction): Promise<any> => {

  // get list of cafes for dropdown
  var cafe_names;
  cafe_names = await Cafe.find({}).select('name');

  // get employees
  var employees: Array<HydratedDocument<IEmployee>> = [];
  var qcafe = req.query.cafe;
  if (qcafe){
    let cf = await Cafe.findOne({name: qcafe})
    if (cf){
      employees = await Employee.find({ cafe_id: cf._id});
    }
  } else {
    employees = await Employee.find({});
  }

  return res.json({employees:employees, cafes:cafe_names});
});

// Handle Employee create on POST.
exports.post = asyncHandler(async (req: Request, res: Response, NextFunction): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }
  let remployee: IEmployee = {
    name: req.body.name,
    email_address: req.body.email_address,
    phone_number: req.body.phone_number,
    gender: req.body.gender,
    date_start: req.body.date_start,
    cafe_id: req.body.cafe_id || "",
  };

  // start transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // validate cafe exist
    if (remployee.cafe_id !== ""){
      var cafe: HydratedDocument<ICafe> | null = await Cafe.findOneAndUpdate({ _id: remployee.cafe_id},
                                                    {$inc: {employee_count:1}, new: true}).exec();
      if (cafe === null){
        throw new Error("Invalid cafe input!");
      }
    }

    // create and save model
    let employee: HydratedDocument<IEmployee> = new Employee(remployee);
    await employee.save();

    // commit transaction
    session.commitTransaction();
    session.endSession();

  } catch (err){
    session.abortTransaction();
    session.endSession();
    let msg: string = utils.errorCheck(err);
    return res.status(403).json(msg);
  }

  // send response back
  return res.sendStatus(200);
});

// Update employee
exports.put = asyncHandler(async (req: Request, res: Response, NextFunction): Promise<any> => {
  // validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }

  var qid = req.body.id;

  var qname = req.body.name;
  var qemail = req.body.email_address;
  var qphone = req.body.phone_number;
  var qgender = req.body.gender;
  var qdate = req.body.date_start;
  var qcafeid: string = req.body.cafe_id || "";

  // start transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  try {

    // validate cafe exist
    if (qcafeid.length > 0){
      let cafe: HydratedDocument<ICafe> | null = await Cafe.findOne({_id: qcafeid});
      if (cafe === null){
        throw new Error("Invalid cafe input!");
      }
    }

    // return employee with old value
    const employee: HydratedDocument<IEmployee> | null = await Employee.findOneAndUpdate(
                          {_id:qid}, 
                          { name: qname,
                            email_address: qemail,
                            phone_number: qphone,
                            gender: qgender,
                            date_start: qdate,
                            cafe_id: qcafeid},
                          {runValidators: true,
                            new: false});

    // check if employee exist
    if (employee === null){
      throw new Error("Employee does not exist!");
    }

    // reduce employee count by 1
    if (employee.cafe_id){
      await Cafe.updateOne({ _id: employee.cafe_id}, {$inc: {employee_count:-1}}).exec();
    }

    // increase employee count by one if new cafe is set
    if (qcafeid.length > 0){
      await Cafe.updateOne({_id: qcafeid}, {$inc: {employee_count: 1}});
    }

    // commit transaction
    session.commitTransaction();
    session.endSession();

  } catch (err){
    session.abortTransaction();
    session.endSession();
    let msg: string = utils.errorCheck(err);
    return res.status(403).json(msg);
  }

  // send response back
  return res.sendStatus(200);
});

// Delete employee
exports.delete = asyncHandler(async (req: Request, res: Response, NextFunction): Promise<any> => {
  var qid = req.query.id;

  // start transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // delete
    var employee = await Employee.findOneAndDelete({_id:qid});

    // reduce employee count by 1 if has cafe attached
    if (employee !== null && employee.cafe_id){
      await Cafe.updateOne({ _id: employee.cafe_id}, {$inc: {employee_count:-1}}).exec();
    }

    // commit transaction
    session.commitTransaction();
    session.endSession();
  } catch (err){
    session.abortTransaction();
    session.endSession();
    let msg: string = utils.errorCheck(err);
    return res.status(403).json(msg);
  }

  // send response back
  return res.sendStatus(200);
});
