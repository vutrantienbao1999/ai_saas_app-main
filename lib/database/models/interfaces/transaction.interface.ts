import { Document, Types } from 'mongoose';
import { IUser } from './user.interface';

export interface ITransaction extends Document {
  createdAt: Date;
  stripeId: string;
  amount: number;
  plan: string;
  credits: number;
  buyer: Types.ObjectId | IUser;
}
