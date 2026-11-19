import { PartialType } from '@nestjs/mapped-types';
import { CreateAvanceDto } from './create-avance.dto.js';

export class UpdateAvanceDto extends PartialType(CreateAvanceDto) {}
