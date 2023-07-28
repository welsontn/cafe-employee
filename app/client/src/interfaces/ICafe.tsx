import { ERequestMethod } from "../enums/ERequestMethod";

export interface ICafe {
  _id?: string;
  name: string;
  description: string;
  location: string;
  employee_count?: number;
}

export const emptyICafe: ICafe = {
  name: "",
  description: "",
  location: "",
};

// Modal
export interface ICafeModalState {
  open: boolean,
  title: string,
  data: ICafe,
  method: ERequestMethod,
}

export const emptyICafeModalState: ICafeModalState = {
  open: false,
  title: "",
  data: emptyICafe,
  method: ERequestMethod.EMPTY,
};