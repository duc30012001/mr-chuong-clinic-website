import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import {
  EMAIL_FORMAT,
  PASSWORD_IS_REQUIRED,
} from '../../auth/constant/message';

export class CreateUserDTO {
  @IsString({ message: PASSWORD_IS_REQUIRED })
  password: string;

  @IsEmail({}, { message: EMAIL_FORMAT })
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
