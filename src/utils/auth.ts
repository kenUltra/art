export interface iLog {
  email: string;
  password: string;
  currentOS: string;
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
  hostOS: string;
  userHardware: string;
}
export interface iPostDt extends iComment {
  _id: string;
  firstName: string;
  lastName: string;
  message: string;
  isPublic: boolean;
  userName: string;
  user: string;
  comments: Array<iComment>;
  createdAt: Date;
}
export interface iComment {
  id: string;
  message: string;
  sender: string;
  likes: any;
}
