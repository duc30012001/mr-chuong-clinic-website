import { Status } from '@/utils/enum';
import { IsInt, Max, Min } from 'class-validator';
import { INVALID_VALUE } from '../message';

export class UpdateStatusDto {
  @IsInt({ message: INVALID_VALUE })
  @Min(-1, { message: INVALID_VALUE })
  @Max(1, { message: INVALID_VALUE })
  status: Status;
}
