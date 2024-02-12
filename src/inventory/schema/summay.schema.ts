import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Branch } from 'src/branch/schema/branch.schema';
import { Product } from 'src/product/schema/user.schema';

export type SummaryDocument = Summary & mongoose.Document;
@Schema({
  timestamps: true,
})
export class Summary {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Branch.name })
  branch: string;

  @Prop()
  amount: number;

  @Prop()
  data_of_date: Date;
}

export const SummarySchema = SchemaFactory.createForClass(Summary);
