import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/user/schema/user.schema';

export type BranchDocument = Branch & mongoose.Document;
@Schema({
  timestamps: true,
})
export class Branch {
  @Prop()
  name: string;

  @Prop()
  lat: string;

  @Prop()
  lng: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  manager: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user_created: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user_updated: User;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);
