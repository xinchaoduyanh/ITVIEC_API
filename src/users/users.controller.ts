/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Post, Body, Param, Get, Patch, Delete, Query } from '@nestjs/common'
import { UsersService } from './users.service'

import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Public } from 'src/decorator/customize'
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAllUser(@Query('page') page: number, @Query('limit') limit: number) {
    const pageNumber = Number(page)
    const limitNumber = Number(limit)
    return this.usersService.findAllUser(pageNumber, limitNumber)
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id)
  }

  @Patch()
  update(@Body() UpdateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(UpdateUserDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id)
  }

  @Post()
  createUser(@Body() user: CreateUserDto) {
    return this.usersService.createUser(user)
  }
}
