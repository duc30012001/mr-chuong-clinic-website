import { Status } from '@/utils/enum';
import { IsEnum } from 'class-validator';

export class UpdateStatusDto {
  @IsEnum(Status)
  status: Status;
}
