import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Branch } from 'src/branch/schema/branch.schema';
import { Product } from 'src/product/schema/user.schema';

export type InventoryDocument = Inventory & mongoose.Document;
@Schema({
  timestamps: true,
})
export class Inventory {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Branch.name })
  branch: string;

  @Prop()
  amount: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Product.name })
  product: Product;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
