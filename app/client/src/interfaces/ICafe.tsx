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