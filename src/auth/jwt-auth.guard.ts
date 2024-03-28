/* eslint-disable @typescript-eslint/no-unused-vars */
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { IS_PUBLIC_KEY } from 'src/decorator/customize'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    // giup doc metadata
    super()
  }

  canActivate(context: ExecutionContext) {
    //Lay ra thong tin cua meta data
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    if (isPublic) {
      return true
    }
    return super.canActivate(context)
  }
  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException('Không có token hợp lệ được truyền tại header')
    }
    return user
  }
}
