import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Response } from 'express'
import ms from 'ms'
import { RegisterUserDto } from 'src/users/dto/create-user.dto'
import { UserInterface } from 'src/users/users.interface'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOnebyUsername(username)
    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password)
      if (isValid) {
        return user
      }
    }
    return null
  }
  async login(user: UserInterface, response: Response) {
    const { _id, email, name, role } = user
    const payload = {
      sub: 'token Login',
      iss: 'from server',
      _id,
      email,
      name,
      role
    }
    const refresh_token = this.createRefreshToken(payload)
    await this.usersService.updateUserToken(_id.toString(), refresh_token)
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES'))
    })

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id,
        email,
        name,
        role
      }
    }
  }
  async register(user: RegisterUserDto) {
    const newUser = await this.usersService.register(user)
    console.log(newUser)

    return {
      _id: newUser._id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    }
  }
  createRefreshToken(payload: any) {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: ms(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES'))
    })
    return refreshToken
  }
  async processNewToken(refresh_token: string, response: Response) {
    try {
      this.jwtService.verify(refresh_token, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET')
      })
      const user = await this.usersService.findUserByRefreshToken(refresh_token)
      if (user) {
        const { _id, email, name, role } = user
        const payload = {
          sub: 'token Login',
          iss: 'from server',
          _id,
          email,
          name,
          role
        }
        const refresh_token = this.createRefreshToken(payload)
        console.log('new refresh token', refresh_token)

        //update user with token
        await this.usersService.updateUserToken(_id.toString(), refresh_token)

        //set refresh Token as cookies
        response.clearCookie('refresh_token')
        response.cookie('refresh_token', refresh_token, {
          httpOnly: true,
          maxAge: ms(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES'))
        })
        return {
          access_token: this.jwtService.sign(payload),
          user: {
            _id,
            email,
            name,
            role
          }
        }
      }
      throw new Error('Not found user')
    } catch (error) {
      throw new BadRequestException(`Refresh Token không hợp lý. Vui lòng login lại`)
    }
  }
}
