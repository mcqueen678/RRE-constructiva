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

  create(dto: CreateAvanceDto) {
    const avance = this.avanceRepo.create(dto);
    return this.avanceRepo.save(avance);
  }

  findAll(clienteId?: string) {
    return this.avanceRepo.find({
      where: clienteId ? { clienteId } : {},
      relations: { cliente: true },
      order: { fechaRegistro: 'DESC' },
    });
  }

  async findOne(id: string) {
    const avance = await this.avanceRepo.findOne({
      where: { id },
      relations: { cliente: true },
    });
    if (!avance) throw new NotFoundException(`Avance ${id} no encontrado`);
    return avance;
  }

  async update(id: string, dto: UpdateAvanceDto) {
    const avance = await this.findOne(id);
    Object.assign(avance, dto);
    return this.avanceRepo.save(avance);
  }

  async remove(id: string) {
    const avance = await this.findOne(id);
    return this.avanceRepo.remove(avance);
  }
}
