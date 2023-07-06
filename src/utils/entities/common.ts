import { Status } from '@/utils/enum';
import {
  Column,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

export class CommonEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ default: Status.ACTIVE })
  status: Status;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_created: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_modified: Date;
}
