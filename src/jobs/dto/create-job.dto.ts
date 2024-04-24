import { IsArray, IsBoolean, IsDateString, IsMongoId, IsNumber, IsObject, IsString } from 'class-validator'

class CompanyDto {
  @IsMongoId()
  _id: string

  @IsString()
  email: string
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

  @IsDateString()
  startDate: Date

  @IsDateString()
  endDate: Date

  @IsBoolean()
  isActive: boolean
}
