import { Status } from '@/utils/enum';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ default: '' })
  full_name: string;

  @Column({ select: false })
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ nullable: true })
  avatar_url: string;

  @Column({ default: Status.ACTIVE })
  status: Status;

  @Column({ nullable: true })
  user_creator: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date_created: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date_modified: Date;
}
