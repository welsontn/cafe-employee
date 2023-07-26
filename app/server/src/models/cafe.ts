import { Types, Document, Schema, Model, model } from 'mongoose';
import Employee from './employee';
import {v1 as uuid} from 'uuid';

export interface ICafe {
  _id?: string;
  name: string;
  description: string;
  location: string;
  employee_count: number;
}

// schema
export const CafeSchema: Schema = new Schema<ICafe>({
  _id: { type: String, default: uuid },
  name: { type: String, unique: true },
  description: String,
  location: { type: String },
  employee_count: { type: Number, default: 0},
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});


const Cafe = model<ICafe>("cafe", CafeSchema, "cafes")
export default Cafe;