import { IsString } from 'class-validator';

export class ResponseDto {
  @IsString()
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}
