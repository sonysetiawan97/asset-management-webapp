import { SelectOption } from "@/types/SelectOption";

export const moduleName = "examples";

export interface Model {
  id?: string;
  name: string;
  nik: string;
  phone: string;
  age: number;
  hobbies: string[];
  address: string;
  checkbox: number[];
  citizen: string;
  dob: string;
  gender: string;
  input_date_year: string;
  input_time: string;
  married_status: boolean;
  taxpayer_number: string;
  multiple_file: FileMeta[];
  multiple_image: FileMeta[];
  profile_picture: FileMeta;
  supporting_document: FileMeta;
  status: 0 | 1;
}

export interface FileMeta {
  bucket: string;
  path: string;
  mime: string;
  filename: string;
  originalFilename: string;
}

export interface CreateModel {
  name: string;
  nik: string;
  phone: string;
  age: number;
  hobbies: string[];
  address: string;
  checkbox: number[];
  citizen: string;
  dob: string;
  gender: string;
  input_date_year: string;
  input_time: string;
  married_status: boolean;
  taxpayer_number: string;
  multiple_file: FileMeta[];
  multiple_image: FileMeta[];
  profile_picture: FileMeta;
  supporting_document: FileMeta;
  status: 0 | 1;
}

export interface ReadModel {
  id: string;
  name: string;
  nik: string;
  status: 0 | 1;
}

export interface DetailModel {
  name: string;
  nik: string;
  phone: string;
  age: number;
  hobbies: SelectOption[];
  address: string;
  checkbox: number[];
  citizen: SelectOption;
  dob: string;
  gender: string;
  input_date_year: string;
  input_time: string;
  married_status: boolean;
  taxpayer_number: string;
  multiple_file: FileMeta[];
  multiple_image: FileMeta[];
  profile_picture: FileMeta;
  supporting_document: FileMeta;
  status: 0 | 1;
}

export interface UpdateModel {
  id: string;
  name: string;
  nik: string;
  phone: string;
  age: number;
  hobbies: string[];
  address: string;
  checkbox: number[];
  citizen: string;
  dob: string;
  gender: string;
  input_date_year: string;
  input_time: string;
  married_status: boolean;
  taxpayer_number: string;
  multiple_file: FileMeta[];
  multiple_image: FileMeta[];
  profile_picture: FileMeta;
  supporting_document: FileMeta;
  status: 0 | 1;
}
