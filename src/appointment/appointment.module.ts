import { JwtStrategy } from '@/auth/strategy';
import { entities } from '@/utils/entities';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentService } from './appointment.service';
import {
  AppointmentController,
  AppointmentPublicController,
} from './controller';

@Module({
  imports: [TypeOrmModule.forFeature(entities), JwtModule.register({})],
  controllers: [AppointmentController, AppointmentPublicController],
  providers: [AppointmentService, JwtStrategy],
})
export class AppointmentModule {}
