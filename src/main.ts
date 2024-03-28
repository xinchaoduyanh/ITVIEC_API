import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import { JwtAuthGuard } from './auth/jwt-auth.guard'
import { TransformInterceptor } from './core/transform.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  const reflector = app.get(Reflector)
  app.useGlobalGuards(new JwtAuthGuard(reflector))
  app.useGlobalInterceptors(new TransformInterceptor(reflector))

  app.useGlobalPipes(new ValidationPipe())
  await app.listen(configService.get('PORT'))
}
bootstrap()