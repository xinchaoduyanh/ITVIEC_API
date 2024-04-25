import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { JobsService } from './jobs.service'
import { CreateJobDto } from './dto/create-job.dto'
import { UpdateJobDto } from './dto/update-job.dto'
import { ResponseMessage, User } from 'src/decorator/customize'

import { UserInterface } from 'src/users/users.interface'
import { mongo } from 'mongoose'

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ResponseMessage('Create a new job')
  createAJob(@Body() createJobDto: CreateJobDto, @User() user: UserInterface) {
    return this.jobsService.createAJob(createJobDto, user)
  }

  @Patch(':id')
  @ResponseMessage('Update a job')
  updateAJob(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    if (!mongo.ObjectId.isValid(id)) throw new Error('Id is not valid')
    return this.jobsService.updateAJob(id, updateJobDto)
  }

  @Delete(':id')
  @ResponseMessage('Delete a job')
  deleteAJob(@Param('id') id: string, @User() user: UserInterface) {
    return this.jobsService.deleteAJob(id, user)
  }

  @Get(':id')
  @ResponseMessage('Fetch job by id')
  fetchJobById(@Param('id') id: string) {
    return this.jobsService.fetchJobById(id)
  }

  @Get()
  @ResponseMessage('Fetch Job by Pagination')
  FetchJobByPagination(@Query('current') current: string, @Query('pageSize') pageSize: string) {
    return this.jobsService.fetchJobsByPagination(Number(current), Number(pageSize))
  }
}
