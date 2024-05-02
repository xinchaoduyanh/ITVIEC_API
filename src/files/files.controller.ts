/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  ParseFilePipeBuilder,
  HttpStatus
} from '@nestjs/common'
import { FilesService } from './files.service'
import { CreateFileDto } from './dto/create-file.dto'
import { UpdateFileDto } from './dto/update-file.dto'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          //THu vien khong check extension ma no check mimetype
          fileType: /^(image\/jpeg|image\/png|image\/gif|text\/plain|application\/pdf|application\/msword)$/i
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 // 1MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
        })
    )
    file: Express.Multer.File
  ) {
    console.log(file)
  }
}
