import { Injectable } from '@nestjs/common'
import { CreateJobDto } from './dto/create-job.dto'
import { UpdateJobDto } from './dto/update-job.dto'
import { Job, JobDocument } from './schemas/job.schema'
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { UserInterface } from 'src/users/users.interface'

@Injectable()
export class JobsService {
  constructor(@InjectModel(Job.name) private readonly jobModel: SoftDeleteModel<JobDocument>) {}
  async createAJob(createJobDto: CreateJobDto, user: UserInterface) {
    //Kiem tra sau nay co ton tai company nua khong ?
    const { name, skills, company, startDate, salary, quantity, level, description, endDate, isActive } = createJobDto
    const job = await this.jobModel.create({
      name,
      skills,
      company,
      startDate,
      salary,
      quantity,
      level,
      description,
      endDate,
      isActive,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return {
      _id: job._id,
      createAt: job.createdAt
    }
  }

  async updateAJob(id: string, updateJobDto: UpdateJobDto) {
    const result = await this.jobModel.findOneAndUpdate(
      { _id: id },
      {
        $set: updateJobDto
      },
      { new: true }
    )
    return result
  }

  async deleteAJob(id: string, user: UserInterface) {
    await this.jobModel.updateOne({ _id: id }, { $set: { deletedBy: { _id: user._id, email: user.email } } })
    return await this.jobModel.softDelete({ _id: id })
  }
  async fetchJobById(id: string) {
    // console.log(id)
    return await this.jobModel.findOne({ _id: id })
  }
  async fetchJobsByPagination(current: number, pageSize: number) {
    const total = await this.jobModel.countDocuments() // Tính tổng số công việc
    const pages = Math.ceil(total / pageSize) // Tính tổng số trang

    const jobs = await this.jobModel
      .find()
      .skip((current - 1) * pageSize)
      .limit(pageSize)

    return {
      meta: {
        current,
        pageSize,
        pages,
        total
      },
      result: jobs
    }
  }
}
