/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Post, Body, Param, Get, Patch, Delete } from '@nestjs/common'
import { UsersService } from './users.service'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(
    // @Body('email') email: string, @Body('password') password: string, @Body('name') name: string
    @Body() CreateUserDto: CreateUserDto
  ) {
    return this.usersService.create(CreateUserDto)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id)
  }

  @Patch()
  update(@Body() UpdateUserDto: UpdateUserDto) {
    return this.usersService.update(UpdateUserDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id)
  }
}
