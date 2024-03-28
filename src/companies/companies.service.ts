/* eslint-disable @typescript-eslint/ban-ts-comment */
import { BadRequestException, Injectable } from '@nestjs/common'
import { Company, CompanyDocument } from './schemas/company.schema'
import { InjectModel } from '@nestjs/mongoose'
// import { CreateCompanyDto } from './dto/create-company.dto'
// import { UpdateCompanyDto } from './dto/update-company.dto'
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose'
import { CreateCompanyDto } from './dto/create-company.dto'
import { UserInterface } from 'src/users/users.interface'
import { UpdateCompanyDto } from './dto/update-company.dto'
import { Types } from 'mongoose'
import aqp from 'api-query-params'
import { isEmpty } from 'class-validator'

@Injectable()
export class CompaniesService {
  constructor(@InjectModel(Company.name) private companyModel: SoftDeleteModel<CompanyDocument>) {}
  create(createCompanyDto: CreateCompanyDto, user: UserInterface) {
    const { name, address, description } = createCompanyDto
    const company = this.companyModel.create({
      name,
      address,
      description,
      createdBy: {
        _id: user._id,
        enmail: user.email
      }
    })
    return company
  }

  async update(updateCompanyDto: UpdateCompanyDto, _id: string, user: UserInterface) {
    if (!Types.ObjectId.isValid(_id)) {
      throw new BadRequestException('Invalid company ID')
    }
    const company = await this.companyModel.findOneAndUpdate(
      {
        _id
      },
      {
        ...updateCompanyDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        },
        updatedAt: Date.now()
      },
      {
        new: true
      }
    )
    return company
  }
  async remove(_id: string, user: UserInterface) {
    console.log(user)

    if (!Types.ObjectId.isValid(_id)) {
      throw new BadRequestException('Invalid company ID')
    }
    await this.companyModel.findOneAndUpdate(
      {
        _id
      },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        },
        deletedAt: Date.now()
      }
    )
    return this.companyModel.softDelete({ _id })
  }
  async findAll(qs: string, page: number, limit: number) {
    const { filter, population, sort } = aqp(qs)
    delete filter.page
    delete filter.limit

    const offset = (page - 1) * limit
    const defaultLimit = limit
    const totalItems = (await this.companyModel.find(filter)).length
    const totalPages = Math.ceil(totalItems / limit)
    let sortValue = sort
    if (isEmpty(sort)) {
      // @ts-ignore: Unreachable code error
      sortValue = '-updatedAt'
    }
    const result = await this.companyModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sortValue)
      .populate(population)
      .exec()

    return {
      meta: {
        current: page,
        pageSize: limit,
        pages: totalPages,
        total: totalItems
      },
      result
    }
  }
}
