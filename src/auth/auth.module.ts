import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UsersModule } from 'src/users/users.module'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './passport/local.strategy'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { JwtStrategy } from './passport/jwt.strategy'
import ms from 'ms'
import { AuthController } from './auth.controller'
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: { expiresIn: ms(configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES')) }
      }),
      inject: [ConfigService]
    })
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
