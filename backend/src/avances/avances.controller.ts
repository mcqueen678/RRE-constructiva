import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { v2 as cloudinary } from 'cloudinary';
import { memoryStorage } from 'multer';
import { AvancesService } from './avances.service.js';
import { CreateAvanceDto } from './dto/create-avance.dto.js';
import { UpdateAvanceDto } from './dto/update-avance.dto.js';

@Controller('avances')
export class AvancesController {
  constructor(private readonly avancesService: AvancesService) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('imagen', { storage: memoryStorage() }))
  async subirImagen(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No se envió ninguna imagen');

    const resultado = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'rr-constructiva' },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result);
        },
      );
      uploadStream.end(file.buffer);
    });

    return { url: resultado.secure_url };
  }

  @Post()
  create(@Body() dto: CreateAvanceDto) {
    return this.avancesService.create(dto);
  }

  @Get()
  findAll() {
    return this.avancesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.avancesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAvanceDto) {
    return this.avancesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.avancesService.remove(id);
  }
}
