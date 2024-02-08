import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Branch } from 'src/branch/schema/branch.schema';
import { Product } from 'src/product/schema/user.schema';
import { User } from 'src/user/schema/user.schema';

export type TransactionDocument = Transaction & mongoose.Document;
@Schema({
  timestamps: true,
})
export class Transaction {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Product.name })
  product: Product;

  @Prop()
  amount: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Branch.name })
  branch: Branch;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user_created: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user_updated: User;

  @Prop({ default: 'Waiting' })
  status: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
