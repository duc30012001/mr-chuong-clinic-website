import { IsArray } from 'class-validator';
import { PagePaginationDto } from './page-meta.dto';

export class PageDto<T> {
  @IsArray()
  readonly data: T[];

  readonly pagination: PagePaginationDto;

  constructor(data: T[], pagination: PagePaginationDto) {
    this.data = data;
    this.pagination = pagination;
  }
}
