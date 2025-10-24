export interface iLog {
  email: string;
  password: string;
}
export interface logToken {
  access: string;
  user: string;
}

export enum epasswordType {
  password = 'password',
  text = 'text',
}

export interface iuserData {
  firstName: string;
  lastName: string;
  userName: string;
  age: number;
  email: string;
  gender: string;
  password: string;
}
export interface iPostDt {
  _id: string;
  firstName: string;
  lastName: string;
  message: string;
  isPublic: boolean;
  userName: string;
  comments: Array<any>;
}
export interface iComment {
  message: string;
  sender: string;
  likes: any;
}
