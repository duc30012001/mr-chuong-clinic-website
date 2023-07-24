import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AppointmentService } from '../appointment.service';
import { AppointmentPayloadDto } from '../dto';

@Controller('dat-lich-kham')
export class AppointmentPublicController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() createAppointmentDto: AppointmentPayloadDto) {
    return this.appointmentService.createAppointment(createAppointmentDto);
  }
}
