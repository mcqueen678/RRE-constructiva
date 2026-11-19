import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAvanceDto } from './dto/create-avance.dto.js';
import { UpdateAvanceDto } from './dto/update-avance.dto.js';
import { Avance } from './entities/avance.entity.js';

@Injectable()
export class AvancesService {
  constructor(
    @InjectRepository(Avance)
    private readonly avanceRepo: Repository<Avance>,
  ) {}

  async create(dto: CreateAvanceDto): Promise<Avance> {
    const nuevo = this.avanceRepo.create(dto);
    return this.avanceRepo.save(nuevo);
  }

  async findAll(): Promise<Avance[]> {
    return this.avanceRepo.find({ order: { fechaRegistro: 'DESC' } });
  }

  async findOne(id: string): Promise<Avance> {
    const avance = await this.avanceRepo.findOneBy({ id });
    if (!avance) throw new NotFoundException(`Avance con ID ${id} no encontrado`);
    return avance;
  }

  async update(id: string, dto: UpdateAvanceDto): Promise<Avance> {
    const avance = await this.avanceRepo.preload({ id, ...dto });
    if (!avance) throw new NotFoundException(`Avance con ID ${id} no encontrado`);
    return this.avanceRepo.save(avance);
  }

  async remove(id: string): Promise<void> {
    const avance = await this.findOne(id);
    await this.avanceRepo.remove(avance);
  }
}
