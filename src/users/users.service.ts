import { Injectable, UnauthorizedException } from '@nestjs/common'
import { User, UserDocument } from './schemas/user.schema'
import { InjectModel } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { compareSync, genSaltSync, hashSync } from 'bcryptjs'
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose'
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: SoftDeleteModel<UserDocument>) {}

  hashPassword = (password: string) => {
    const salt = genSaltSync(10)
    const hash = hashSync(password, salt)
    return hash
  }

  async create(createUserDto: CreateUserDto) {
    const { email, password, name } = createUserDto
    const user = await this.userModel.create({ email, password: this.hashPassword(password), name })
    return user
  }

  async findOne(id: string) {
    if (mongoose.Types.ObjectId.isValid(id) === false) {
      // throw new Error('Invalid ID')
      return 'Invalid ID'
    }
    const user = await this.userModel.findOne({ _id: id })
    return user
  }
  findOnebyUsername(username: string) {
    return this.userModel.findOne({
      email: username
    })
  }
  async update(updateUserDto: UpdateUserDto) {
    const { email, _id, name } = updateUserDto
    const user = await this.userModel.findOneAndUpdate({ _id: _id }, { email, name }, { new: true })
    return user
  }
  remove(id: string) {
    if (mongoose.Types.ObjectId.isValid(id) === false) {
      // throw new Error('Invalid ID')
      return 'not found user'
    }
    return this.userModel.softDelete({ _id: id })
  }
  isValidPassword(password: string, hashPassword: string) {
    return compareSync(password, hashPassword)
  }
  async register(RegisterUserDto: RegisterUserDto) {
    const { email, password, name, gender, address, age } = RegisterUserDto
    const existEmail = await this.userModel.findOne({
      email
    })
    if (existEmail) {
      throw new UnauthorizedException('Email already exists')
    }
    const user = await this.userModel.create({
      email,
      password: this.hashPassword(password),
      name,
      age,
      gender,
      address,
      role: 'USER'
    })
    return user
  }
}
