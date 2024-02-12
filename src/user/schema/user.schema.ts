import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Role } from 'src/utils/role.enum';
// import mongoosePaginate from 'mongoose-paginate-v2';

export type UserDocument = User & mongoose.Document;
@Schema({
  timestamps: true,
})
export class User {
  @Prop({ unique: true })
  username: string;

  @Prop()
  password: string;

  @Prop({ nullable: true })
  firstname: string;

  @Prop({ nullable: true })
  lastname: string;

  @Prop({
    type: String,
    required: true,
    enum: [Role.Admin, Role.Driver, Role.Employee, Role.Manager],
  })
  role: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user_created: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user_updated: User;

  @Prop({ default: 0 })
  order: number
}

export const UserSchema = SchemaFactory.createForClass(User);
