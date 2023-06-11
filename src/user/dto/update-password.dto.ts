import { IsString, MinLength } from 'class-validator';
import { INVALID_VALUE } from 'src/utils/message';
import { INVALID_PASSWORD_FORMAT } from '../constants/messages';

export class UpdatePasswordDto {
  @IsString({ message: INVALID_VALUE })
  @MinLength(6, { message: INVALID_PASSWORD_FORMAT })
  password: string;
}
