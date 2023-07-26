import { HydratedDocument, Document, Schema, Model, model } from 'mongoose';
import Cafe, { ICafe } from "./cafe";
import utils from "../utils/utils";

export interface IEmployee {
  _id?: string;
  name: string;
  email_address: string;
  phone_number: string;
  gender: string;
  date_start: Date;
  cafe_id: string;
}

export enum EGender {
  Nil = 'Nil',
  Female = 'Female',
  Male = 'Male',
};

// schema
export const EmployeeSchema: Schema = new Schema<IEmployee>({
  _id: { type: String, default: "UI" + utils.generateRandomId(7)},
  name: { type: String, minLength: 2, maxLength: 200 },
  email_address: { type: String, required: true},
  phone_number: String,
  gender: { type: String, default: EGender.Nil, enum: EGender },
  date_start: Date,
  cafe_id: String
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

// virtual method
EmployeeSchema.virtual('days_worked').get(function(this: IEmployee): number {
  return utils.dateDiff(new Date().toString(), this.date_start.toString());
});

// hook method
EmployeeSchema.pre('deleteOne', async function (this: IEmployee) {
  let employee = this;
  // reduce cafe count if attached
  if (employee.cafe_id !== ""){
    await Cafe.updateOne({ _id: employee.cafe_id}, {$inc: {employee_count:-1}}).exec();
  }
});


const Employee = model<IEmployee>("employee", EmployeeSchema, "employees");
export default Employee;