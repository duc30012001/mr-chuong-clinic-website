import { JwtGuard } from '@/auth/guard';
import { PageDto, ResponseDto, UpdateStatusDto } from '@/utils/dto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AppointmentEntity } from '../appointment.entity';
import { AppointmentService } from '../appointment.service';
import { AppointmentPayloadDto, GetListAppointmentDto } from '../dto';

@UseGuards(JwtGuard)
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get('/list')
  @HttpCode(HttpStatus.OK)
  async getListAppointment(
    @Query() getListAppointmentDto: GetListAppointmentDto,
  ): Promise<PageDto<AppointmentEntity>> {
    return this.appointmentService.getAppointmentList(getListAppointmentDto);
  }

  @Get('/list/:id')
  @HttpCode(HttpStatus.OK)
  getUserById(@Param('id') id: string): Promise<AppointmentEntity> {
    return this.appointmentService.getAppointmentById(id);
  }

  @Patch('/update-status/:id')
  @HttpCode(HttpStatus.OK)
  updateStatus(@Param('id') id: string, @Body() dataUpdate: UpdateStatusDto) {
    return this.appointmentService.updateStatus(id, dataUpdate);
  }

  @Put('update/:id')
  @HttpCode(HttpStatus.OK)
  updateAppointment(
    @Param('id') appointmentId: string,
    @Body() dataUpdate: AppointmentPayloadDto,
  ): Promise<ResponseDto> {
    return this.appointmentService.updateAppointmentById(
      appointmentId,
      dataUpdate,
    );
  }
}
