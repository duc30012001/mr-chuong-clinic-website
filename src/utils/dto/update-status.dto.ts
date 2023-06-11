import { IsInt, Max, Min } from 'class-validator';
import { Status } from 'src/utils/enum';
import { INVALID_VALUE } from '../message';

export class UpdateStatusDto {
  @IsInt({ message: INVALID_VALUE })
  @Min(-1, { message: INVALID_VALUE })
  @Max(1, { message: INVALID_VALUE })
  status: Status;
}
