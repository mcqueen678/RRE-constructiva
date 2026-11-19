import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avance } from './entities/avance.entity.js';
import { AvancesController } from './avances.controller.js';
import { AvancesService } from './avances.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Avance])],
  controllers: [AvancesController],
  providers: [AvancesService],
})
export class AvancesModule {}
