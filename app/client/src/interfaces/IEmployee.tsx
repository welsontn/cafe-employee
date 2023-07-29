import { ERequestMethod } from "../enums/ERequestMethod";
import utils from "../utils/utils";

export enum EGender {
  Male = "Male",
  Female = "Female"
}

export interface IEmployee {
  _id?: string;
  name: string;
  email_address: string;
  phone_number: string;
  gender: string;
  date_start: string;
  cafe_id: string;
}

export const emptyIEmployee: IEmployee = {
  name: "",
  email_address: "",
  phone_number: "",
  gender: EGender.Male,
  date_start: new Date().toISOString(),
  cafe_id: "",
};

// Modal
export interface IEmployeeModalState {
  open: boolean,
  title: string,
  data: IEmployee,
  method: ERequestMethod,
}

export const emptyIEmployeeModalState: IEmployeeModalState = {
  open: false,
  title: "",
  data: emptyIEmployee,
  method: ERequestMethod.EMPTY,
};