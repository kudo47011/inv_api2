import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/user/schema/user.schema';

export type ProductDocument = Product & mongoose.Document;
@Schema({
  timestamps: true,
})
export class Product {
  @Prop()
  name: string;

  @Prop()
  image: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user_created: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user_updated: User;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
