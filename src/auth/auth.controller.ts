import { Controller, Request, Post, UseGuards, Body, Res } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthService } from './auth.service'
import { Public, ResponseMessage } from 'src/decorator/customize'
import { LocalAuthGuard } from './local-auth.guard'
import { RegisterUserDto } from 'src/users/dto/create-user.dto'
import { Response } from 'express'
@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private authService: AuthService
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Login user')
  @Post('login')
  handleLogin(@Request() req, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(req.user, res)
  }

  @Public()
  // @UseGuards(LocalAuthGuard)
  @Post('register')
  @ResponseMessage('Register a new user')
  register(@Body() user: RegisterUserDto) {
    return this.authService.register(user)
  }
}
