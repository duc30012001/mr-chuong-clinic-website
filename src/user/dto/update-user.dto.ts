import { EMAIL_FORMAT } from '@/auth/constant/message';
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsEmail({}, { message: EMAIL_FORMAT })
  @IsOptional()
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
}
