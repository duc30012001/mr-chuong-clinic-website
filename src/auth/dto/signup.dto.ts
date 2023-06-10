import { IsEmail, IsString } from 'class-validator';
import { EMAIL_FORMAT, PASSWORD_IS_REQUIRED } from '../constant/message';

export class SignUpDTO {
  @IsString({ message: PASSWORD_IS_REQUIRED })
  password: string;

  @IsEmail({}, { message: EMAIL_FORMAT })
  email?: string;

  avatar_url: string;

  phone_number: string;

  full_name: string;
}
