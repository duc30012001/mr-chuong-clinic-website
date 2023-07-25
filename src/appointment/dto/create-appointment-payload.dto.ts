import { IsDateString, IsEmail, IsOptional, IsString } from 'class-validator';

export class AppointmentPayloadDto {
  @IsString()
  patient_name: string;

  @IsDateString()
  appointment_time: Date;

  @IsString()
  patient_phone_number: string;

  @IsString()
  reason: string;

  @IsString()
  @IsOptional()
  patient_address: string;

  @IsEmail()
  @IsOptional()
  email: string;
}
