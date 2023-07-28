import { Request, Response } from 'express';
import mongoose, { HydratedDocument } from 'mongoose';
import Cafe, { ICafe } from "../models/cafe";
import Employee, { IEmployee } from "../models/employee";
import asyncHandler from "express-async-handler";
import {check, validationResult} from 'express-validator';
import utils from "../utils/utils";

// Display Cafe on GET
exports.get = asyncHandler(async (req: Request, res: Response, NextFunction): Promise<any>  => {
  var cafe;
  var location = req.query.location;

  // query
  if (location){
    cafe = await Cafe.find({ location: location});
  } else {
    cafe = await Cafe.find({});
  }

  // morph data
  var result = [];
  for (const c of cafe) {
    let temp = c.toObject({virtuals: true});
    result.push(temp)
  };

  return res.send(result);
});

// Handle Cafe create on POST.
exports.post = asyncHandler(async (req: Request, res: Response, NextFunction): Promise<any>  => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).jsonp(errors.array());
  }
  
  var qname: string = req.body.name;
  var qdescription: string = req.body.description;
  var qlocation: string = req.body.location;

  // start transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  var cafe;
  try {
    // create model
    cafe = new Cafe({   
                      name: qname,
                      description: qdescription,
                      location: qlocation,
                      employee_count: 0
                    });
    await cafe.save();
    
    // commit transaction
    session.commitTransaction();
    session.endSession();
  } catch (err){
    session.abortTransaction();
    session.endSession();
    let msg: string = utils.errorCheck(err);
    res.status(403).send(msg);
  }

  // response data
  res.status(200).send(cafe);
});

// Update Cafe
exports.put = asyncHandler(async (req: Request, res: Response, NextFunction): Promise<any>  => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).jsonp(errors.array());
  }

  var qid = req.body._id || req.body.id;

  var qname: string = req.body.name;
  var qdescription: string = req.body.description;
  var qlocation: string = req.body.location;

  // start transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  var result;
  try {
    result = await Cafe.updateOne({_id:qid}, 
                                  { name: qname,
                                    description: qdescription,
                                    location: qlocation},
                                    {runValidators: true});

    // commit transaction
    session.commitTransaction();
    session.endSession();
  } catch (err){
    session.abortTransaction();
    session.endSession();
    let msg: string = utils.errorCheck(err);
    return res.status(403).send(msg);
  }

  return res.sendStatus(200);
});

// Delete Cafe
exports.delete = asyncHandler(async (req: Request, res: Response, NextFunction): Promise<any>  => {
  var qid = req.body._id || req.body.id;

  // start transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // delete
    var cafe = await Cafe.findOneAndDelete({_id:qid});

    // commit transaction
    session.commitTransaction();
    session.endSession();
  } catch (err){
    session.abortTransaction();
    session.endSession();
    let msg: string = utils.errorCheck(err);
    return res.status(403).send(msg);
  }

  // send response back
  return res.sendStatus(200);
});
