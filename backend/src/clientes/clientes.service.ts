import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClienteDto } from './dto/create-cliente.dto.js';
import { UpdateClienteDto } from './dto/update-cliente.dto.js';
import { Cliente } from './entities/cliente.entity.js';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepo: Repository<Cliente>,
  ) {}

  create(dto: CreateClienteDto) {
    const cliente = this.clienteRepo.create(dto);
    return this.clienteRepo.save(cliente);
  }

  findAll() {
    return this.clienteRepo.find({
      relations: { avances: true },
      order: { fechaRegistro: 'DESC' },
    });
  }

  async findOne(id: string) {
    const cliente = await this.clienteRepo.findOne({
      where: { id },
      relations: { avances: true },
    });
    if (!cliente) throw new NotFoundException(`Cliente ${id} no encontrado`);
    return cliente;
  }

  async update(id: string, dto: UpdateClienteDto) {
    const cliente = await this.findOne(id);
    Object.assign(cliente, dto);
    return this.clienteRepo.save(cliente);
  }

  async remove(id: string) {
    const cliente = await this.findOne(id);
    return this.clienteRepo.remove(cliente);
  }
}
