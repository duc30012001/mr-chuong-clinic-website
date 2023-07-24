import { PageOptionsDto } from '@/utils/dto';
import { Status } from '@/utils/enum';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { AppointmentEntity } from '../appointment.entity';

export class GetListAppointmentDto extends PageOptionsDto {
  @IsOptional()
  orderBy?: keyof AppointmentEntity = 'date_created';

  @IsOptional()
  search?: string;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @IsOptional()
  columns?: string;

  @IsOptional()
  @IsDateString()
  date_created?: Date;
}
