import {
  PageDto,
  PagePaginationDto,
  ResponseDto,
  UpdateStatusDto,
} from '@/utils/dto';
import { Status } from '@/utils/enum';
import { CREATE_SUCCESS, UPDATE_SUCCESS } from '@/utils/message';
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AppointmentEntity } from './appointment.entity';
import { APPOINTMENT_NOT_FOUND } from './constants';
import { AppointmentPayloadDto, GetListAppointmentDto } from './dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(AppointmentEntity)
    private readonly appointmentRepository: Repository<AppointmentEntity>,
    private jwtService: JwtService,
  ) {}

  public async getAppointmentList(
    getListAppointmentDto: GetListAppointmentDto,
  ): Promise<PageDto<AppointmentEntity>> {
    const { search, status, skip, take, order, orderBy, columns } =
      getListAppointmentDto;
    const queryBuilder =
      this.appointmentRepository.createQueryBuilder('appointment');

    if (columns && columns !== '*') {
      const selectedColumns = columns
        .split(',')
        .filter((item) => item !== 'password');
      queryBuilder.select(
        selectedColumns.map((column) => `appointment.${column}`),
      );
    }

    if (status) {
      queryBuilder.andWhere('appointment.status = :status', { status });
    }

    if (search) {
      const lowercaseSearch = search.toLowerCase();
      queryBuilder.andWhere(
        'LOWER(appointment.patient_name) LIKE :patient_name',
        {
          patient_name: `%${lowercaseSearch}%`,
        },
      );
    }

    queryBuilder.orderBy(`appointment.${orderBy}`, order).skip(skip).take(take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PagePaginationDto({
      itemCount,
      pageOptionsDto: getListAppointmentDto,
    });

    return new PageDto(entities, pageMetaDto);
  }

  async getAppointmentById(appointmentId: string): Promise<AppointmentEntity> {
    const appointment = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .select()
      .where('appointment.id = :appointmentId', { appointmentId })
      .getOne();
    if (appointment === null) {
      throw new NotFoundException(APPOINTMENT_NOT_FOUND);
    }
    return appointment;
  }

  async createAppointment(
    createAppointmentDto: AppointmentPayloadDto,
  ): Promise<ResponseDto> {
    const dataSubmit = {
      ...createAppointmentDto,
      status: Status.HIDDEN,
      id: uuidv4(),
    };

    await this.appointmentRepository.save(dataSubmit);

    return new ResponseDto(CREATE_SUCCESS);
  }

  async updateStatus(
    id: string,
    dataUpdate: UpdateStatusDto,
  ): Promise<ResponseDto> {
    await this.hasAppointment({ id });
    await this.updateDataAppointmentInDB(id, dataUpdate);
    return new ResponseDto(UPDATE_SUCCESS);
  }

  async updateAppointmentById(
    appointmentId: string,
    dataUpdate: AppointmentPayloadDto,
  ): Promise<ResponseDto> {
    if (!_.isEmpty(dataUpdate)) {
      await this.hasAppointment({ id: appointmentId });
      await this.updateDataAppointmentInDB(appointmentId, dataUpdate);
    }
    return new ResponseDto(UPDATE_SUCCESS);
  }

  async updateDataAppointmentInDB(
    appointmentId: string,
    dataUpdate: AppointmentPayloadDto | UpdateStatusDto,
  ) {
    const queryBuilder =
      this.appointmentRepository.createQueryBuilder('appointment');
    await queryBuilder
      .update(AppointmentEntity)
      .set({ ...dataUpdate, date_modified: new Date() })
      .where({
        id: appointmentId,
      })
      .execute();
  }

  async hasAppointment(payload: { id: string }): Promise<boolean> {
    const data = await this.appointmentRepository.findOneBy(payload);
    if (data === null) {
      throw new NotFoundException(APPOINTMENT_NOT_FOUND);
    }

    return true;
  }
}
