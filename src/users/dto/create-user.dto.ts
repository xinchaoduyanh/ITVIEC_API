import { Type } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, MinLength, ValidateNested } from 'class-validator'
import mongoose from 'mongoose'

class Company {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId

  @IsNotEmpty()
  name: string
}
export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string

  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string

  @MinLength(6)
  @IsNotEmpty({ message: 'Age is required' })
  age: string

  @IsNotEmpty({ message: 'Gender is required' })
  gender: string

  @IsNotEmpty({ message: 'Role is required' })
  role: string

  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string

  @IsNotEmpty({ message: 'Address is required' })
  address: string
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company
}
