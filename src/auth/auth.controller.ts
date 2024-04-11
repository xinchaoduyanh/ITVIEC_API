import { Controller, Post, UseGuards, Body, Res, Get, Req } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthService } from './auth.service'
import { Public, ResponseMessage, User } from 'src/decorator/customize'
import { LocalAuthGuard } from './local-auth.guard'
import { RegisterUserDto } from 'src/users/dto/create-user.dto'
import { Request, Response } from 'express'
import { UserInterface } from 'src/users/users.interface'

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
  handleLogin(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(req.user as UserInterface, res)
  }

  @Public()
  // @UseGuards(LocalAuthGuard)
  @Post('register')
  @ResponseMessage('Register a new user')
  register(@Body() user: RegisterUserDto) {
    return this.authService.register(user)
  }

  @ResponseMessage('Get user Information')
  @Get('/account')
  getProfile(@User() user: UserInterface) {
    return { user }
  }

  @Public()
  @ResponseMessage('Get User by Refresh Token')
  @Get('/refresh_token')
  handleRefreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const refresh_token = request.cookies['refresh_token']
    return this.authService.processNewToken(refresh_token, response)
  }

  @ResponseMessage('Logout User')
  @Get('/logout')
  handleLogOut(@Res({ passthrough: true }) response: Response, @User() user: UserInterface) {
    return this.authService.logout(response, user)
  }
}
