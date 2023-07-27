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
  date_start: Date;
  cafe_id: string;
}

export const emptyIEmployee: IEmployee = {
  name: "",
  email_address: "",
  phone_number: "",
  gender: EGender.Male,
  date_start: new Date(),
  cafe_id: "",
};