import { PageDto } from '@/utils/dto';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { ArticleEntity } from '../article.entity';
import { ArticleService } from '../article.service';
import { GetListArticlePublicDto } from '../dto';

@Controller('tin-tuc')
export class ArticlePublicController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getListArticlePublic(
    @Query() getListArticleDto: GetListArticlePublicDto,
  ): Promise<PageDto<ArticleEntity>> {
    return this.articleService.getArticleList(getListArticleDto);
  }

  @Get('/:slug')
  @HttpCode(HttpStatus.OK)
  getArticleBySlug(@Param('slug') slug: string): Promise<ArticleEntity> {
    return this.articleService.getArticleBySlug(slug);
  }
}
