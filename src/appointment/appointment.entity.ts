import { Status } from '@/utils/enum';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'appointment' })
export class AppointmentEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ default: Status.ACTIVE })
  status: Status;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date_created: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date_modified: Date;

  @Column({ nullable: false })
  patient_name: string;

  @Column({ nullable: false })
  appointment_time: Date;

  @Column({ nullable: true })
  patient_phone_number: string;

  @Column({ nullable: true })
  patient_address: string;

  @Column({ nullable: true })
  email: string;
}
