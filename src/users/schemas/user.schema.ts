import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'

export type UserDocument = HydratedDocument<User>
@Schema({ timestamps: true })
export class User {
  @Prop()
  name: string

  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop()
  age: number

  @Prop()
  gender: string

  @Prop()
  address: string

  @Prop()
  createdAt: Date

  @Prop()
  updatedAt: Date

  @Prop()
  deletedAt: Date

  @Prop()
  isDeleted: boolean

  @Prop()
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId
    email: string
  }

  @Prop()
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId
    email: string
  }

  @Prop()
  role: string

  @Prop()
  company: {
    _id: mongoose.Schema.Types.ObjectId
    email: string
  }

  @Prop()
  refreshToken: string
}

export const UserSchema = SchemaFactory.createForClass(User)
