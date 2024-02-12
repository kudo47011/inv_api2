import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { Transaction } from './transaction.schema';

export type DriverHistoryDocument = DriverHistory & mongoose.Document;
@Schema({
  timestamps: true,
})
export class DriverHistory {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Transaction.name })
  transaction: Transaction;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: User;

  @Prop()
  time: string;

  @Prop()
  end_time: Date;
}

export const DriverHistorySchema = SchemaFactory.createForClass(DriverHistory);
