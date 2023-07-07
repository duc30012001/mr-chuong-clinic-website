import { Status } from '@/utils/enum';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'article-category' })
export class ArticleCategoryEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ default: Status.ACTIVE })
  status: Status;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date_created: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date_modified: Date;

  @Column({ nullable: false })
  article_category_name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ unique: true })
  slug: string;
}
