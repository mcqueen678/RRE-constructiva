import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AvancesModule } from './avances/avances.module.js';
import { UsuariosModule } from './usuarios/usuarios.module.js';
import { ClientesModule } from './clientes/clientes.module.js';


@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '../.env', isGlobal: true }),
    ServeStaticModule.forRoot({
  rootPath: join(process.cwd(), 'uploads'),
  serveRoot: '/uploads',
}),
        TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: process.env.DB_SYNC === 'true',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    }),
    UsuariosModule,
    AvancesModule,
    ClientesModule,
  ],
})
export class AppModule {}
