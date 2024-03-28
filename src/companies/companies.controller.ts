import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query
  // ,Get,
  //  Post,
  //  Body,
  // Patch,
  // Param,
  // Delete
} from '@nestjs/common'
import { CompaniesService } from './companies.service'

import { CreateCompanyDto } from './dto/create-company.dto'
import { User } from 'src/decorator/customize'
import { UserInterface } from 'src/users/users.interface'
import { UpdateCompanyDto } from './dto/update-company.dto'
// import { UpdateCompanyDto } from './dto/update-company.dto'

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto, @User() user: UserInterface) {
    return this.companiesService.create(createCompanyDto, user)
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto, @User() user: UserInterface) {
    return this.companiesService.update(updateCompanyDto, id, user)
  }
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: UserInterface) {
    return this.companiesService.remove(id, user)
  }
  @Get()
  findAll(@Query() qs: string, @Query('page') page: string, @Query('limit') limit: string) {
    console.log(qs)

    return this.companiesService.findAll(qs, +page, +limit)
  }
}
