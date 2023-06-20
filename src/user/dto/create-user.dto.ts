import { INVALID_VALUE } from '@/utils/message';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Min,
} from 'class-validator';
import { INVALID_PASSWORD_FORMAT } from '../constants';

export class CreateUserDto {
  @IsString({ message: INVALID_VALUE })
  @Min(6, { message: INVALID_PASSWORD_FORMAT })
  password: string;

  @IsEmail({}, { message: INVALID_VALUE })
  email: string;

  @IsString()
  @IsOptional()
  avatar_url: string;

  @IsPhoneNumber()
  @IsOptional()
  phone_number: string;

  @IsString()
  @IsOptional()
  full_name: string;

  @IsOptional()
  @IsNumber()
  status;
}
