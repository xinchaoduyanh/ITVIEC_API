import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
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
  async login(user: UserInterface) {
    const { _id, email, name, role } = user
    const payload = {
      sub: 'token Login',
      iss: 'from server',
      _id,
      email,
      name,
      role
    }
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.createRefreshToken(payload),
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
}
