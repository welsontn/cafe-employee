import { Request, Response } from 'express';
import mongoose, { HydratedDocument } from 'mongoose';
import Cafe, { ICafe } from "#src/models/cafe";
import asyncHandler from "express-async-handler";
import {check, validationResult} from 'express-validator';
import utils from "#src/utils/utils";

const CafeController = {

  // Display Cafe on GET
  get: asyncHandler(async (req: Request, res: Response, NextFunction): Promise<any>  => {

    var cafes: ICafe[];
    var location:string = req.query.location as string;

    // query
    if (location){
      cafes = await Cafe.find({location: location});
    } else {
      cafes = await Cafe.find({});
    }

    return res.status(200).json(cafes);
  }),

  // Handle Cafe create on POST.
  post: asyncHandler(async (req: Request, res: Response, NextFunction): Promise<any>  => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(errors.array());
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
      return res.status(403).json(msg);
    }

    // response data
    return res.status(200).json(cafe);
  }),

  // Update Cafe
  put: asyncHandler(async (req: Request, res: Response, NextFunction): Promise<any>  => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(errors.array());
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
      return res.status(403).json(msg);
    }

    return res.sendStatus(200);
  }),

  // Delete Cafe
  delete: asyncHandler(async (req: Request, res: Response, NextFunction): Promise<any>  => {
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
      return res.status(403).json(msg);
    }

    // send response back
    return res.sendStatus(200);
  }),

}

export default CafeController;