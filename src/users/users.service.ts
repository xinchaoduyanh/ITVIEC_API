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
      throw new Error('Invalid ID')
      // return 'Invalid ID'
    }
    const user = await this.userModel.findOne({ _id: id })
    return {
      message: 'User found successfully',
      user
    }
  }
  findOnebyUsername(username: string) {
    return this.userModel.findOne({
      email: username
    })
  }
  async updateUser(updateUserDto: UpdateUserDto) {
    // const user = await this.userModel.findOneAndUpdate({ _id: _id }, updateUserDto, { new: true })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, _id, ...updateUserDtoWithoutEmail } = updateUserDto
    const user = await this.userModel.findOneAndUpdate({ _id: _id }, updateUserDtoWithoutEmail, { new: true })
    if (!user) {
      throw new UnauthorizedException('User not found')
    }
    return user
  }
  async remove(id: string) {
    if (mongoose.Types.ObjectId.isValid(id) === false) {
      // throw new Error('Invalid ID')
      throw new Error('Invalid ID')
    }
    const user = await this.userModel.softDelete({ _id: id })
    return {
      message: 'User soft deleted successfully',
      user
    }
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
  async createUser(user: CreateUserDto) {
    const existEmail = await this.userModel.findOne({
      email: user.email
    })
    if (existEmail) {
      throw new UnauthorizedException('Email already exists')
    }
    const newUser = await this.userModel.create(user)
    return newUser
  }
  async findAllUser(page: number, limit: number) {
    const users = await this.userModel
      .find()
      .select('-password')
      .skip((page - 1) * limit)
      .limit(limit)
    const total = await this.userModel.countDocuments()
    return {
      message: 'All users fetch successfully',
      meta: {
        current: page,
        pageSize: limit,
        pages: Math.ceil(total / limit),
        total: total
      },
      result: users
    }
  }
  async updateUserToken(_id: string, refreshToken: string) {
    const user = await this.userModel.findOneAndUpdate({ _id }, { refreshToken }, { new: true })
    return user
  }
  async findUserByRefreshToken(refreshToken: string) {
    const user = await this.userModel.findOne({
      refreshToken
    })
    if (!user) {
      throw new UnauthorizedException('User not found')
    }
    return user
  }
}
