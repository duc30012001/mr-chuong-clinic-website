import { Status } from '@/utils/enum';
import { INVALID_VALUE } from '@/utils/message';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { INVALID_PASSWORD_FORMAT } from '../constants';
import { UpdateUserDto } from './update-user.dto';

export class CreateUserDto extends UpdateUserDto {
  @IsString({ message: INVALID_VALUE })
  @Length(6, 50, { message: INVALID_PASSWORD_FORMAT })
  password: string;

  @IsOptional()
  @IsEnum(Status)
  status: Status;
}
