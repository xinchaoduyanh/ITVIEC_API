/* eslint-disable @typescript-eslint/no-unused-vars */
import { Transform } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'
import dayjs from 'dayjs'

class CompanyDto {
  @IsMongoId()
  _id: string

  @IsString()
  email: string
}

@ValidatorConstraint({ name: 'isAfterStartDate', async: false })
export class IsAfterStartDateConstraint implements ValidatorConstraintInterface {
  validate(endDate: any, args: ValidationArguments) {
    const startDate = args.object['startDate']
    return dayjs(endDate).isAfter(startDate)
  }

  defaultMessage(args: ValidationArguments) {
    return 'endDate phải sau startDate'
  }
}

export function IsAfterStartDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsAfterStartDateConstraint
    })
  }
}

@ValidatorConstraint({ name: 'isIsoDateString', async: false })
export class IsIsoDateStringConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    return dayjs(value, 'YYYY-MM-DDTHH:mm:ss.SSSZ', true).isValid()
  }

  defaultMessage(args: ValidationArguments) {
    return 'Phải là một chuỗi định dạng ISO 8601'
  }
}

export function IsIsoDateString(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsIsoDateStringConstraint
    })
  }
}

export class CreateJobDto {
  @IsString()
  name: string

  @IsArray({ message: 'Skills phải là 1 mảng' })
  @IsString({ each: true, message: 'Mỗi kỹ năng truyền vào phải là 1 string' })
  skills: string[]

  @IsNumber()
  salary: number

  @IsObject()
  company: CompanyDto

  @IsNumber()
  quantity: number

  @IsString()
  level: string

  @IsString()
  description: string

  @IsNotEmpty({ message: 'startDate không được để trống' })
  @Transform(({ value }) => new Date(value))
  @IsIsoDateString() // Sử dụng decorator mới
  startDate: string

  @IsNotEmpty({ message: 'endDate không được để trống' })
  @Transform(({ value }) => new Date(value))
  @IsIsoDateString() // Sử dụng decorator mới
  @IsAfterStartDate() // Thêm decorator mới kiểm tra endDate sau startDate
  endDate: string

  @IsNotEmpty({ message: 'IsActive không được để trống' })
  @IsBoolean({ message: 'isActive phải là boolean' })
  isActive: boolean
}
