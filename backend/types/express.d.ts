import { IUser } from '../schemas/UserModel';

declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser;
  }
}