import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { LoginUsuarioDto } from './dto/login-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { Usuario } from './entities/usuario.entity.js';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  async create(dto: CreateUsuarioDto): Promise<Usuario> {
    const nuevo = this.usuarioRepo.create(dto);
    return this.usuarioRepo.save(nuevo);
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepo.find();
  }

  async findOne(id: string): Promise<Usuario> {
    const usuario = await this.usuarioRepo.findOneBy({ id });
    if (!usuario) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    return usuario;
  }

  async update(id: string, dto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.usuarioRepo.preload({ id, ...dto });
    if (!usuario) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    return this.usuarioRepo.save(usuario);
  }

  async remove(id: string): Promise<void> {
    const usuario = await this.findOne(id);
    await this.usuarioRepo.remove(usuario);
  }

  async login(dto: LoginUsuarioDto): Promise<Omit<Usuario, 'password'>> {
    const usuario = await this.usuarioRepo
      .createQueryBuilder('u')
      .addSelect('u.password')
      .where('u.correo = :correo', { correo: dto.correo })
      .getOne();

    if (!usuario || usuario.password !== dto.password) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    const { password, ...datosSeguros } = usuario;
    return datosSeguros;
  }
}
