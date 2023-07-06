import { ArticleCategoryEntity } from '@/article-category/article-category.entity';
import { UserEntity } from '@/user/user.entity';
import { Status } from '@/utils/enum';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'article' })
export class ArticleEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ default: Status.ACTIVE })
  status: Status;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date_created: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date_modified: Date;

  @Column({ nullable: false })
  article_title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: false })
  article_category_id: string;

  @Column({ nullable: true })
  user_creator: string;

  @ManyToOne(() => ArticleCategoryEntity)
  @JoinColumn({ name: 'article_category_id' })
  article_category: ArticleCategoryEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_creator' })
  creator: UserEntity;
}
