import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'

export type JobDocument = HydratedDocument<Job>
@Schema({ timestamps: true })
export class Job {
  @Prop()
  name: string

  @Prop({ required: true })
  skills: string[]

  @Prop({ type: Object })
  company: {
    _id: mongoose.Schema.Types.ObjectId
    email: string
  }

  @Prop()
  location: string

  @Prop()
  salary: number

  @Prop()
  quantity: number

  @Prop()
  level: string

  @Prop()
  description: string

  @Prop()
  startDate: Date

  @Prop()
  endDate: Date

  @Prop()
  isActive: boolean

  @Prop()
  createdAt: Date

  @Prop()
  updatedAt: Date

  @Prop()
  deletedAt: Date

  @Prop()
  isDeleted: boolean

  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId
    email: string
  }

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId
    email: string
  }

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId
    email: string
  }
}

export const JobSchema = SchemaFactory.createForClass(Job)
