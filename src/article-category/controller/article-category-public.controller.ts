import { PageDto } from '@/utils/dto';
import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ArticleCategoryEntity } from '../article-category.entity';
import { ArticleCategoryService } from '../article-category.service';
import { GetListArticleCategoryDto } from '../dto';

@Controller('danh-muc')
export class ArticleCategoryPublicController {
  constructor(
    private readonly articleCategoryService: ArticleCategoryService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getListArticleCategory(
    @Query() getListArticleCategoryDto: GetListArticleCategoryDto,
  ): Promise<PageDto<ArticleCategoryEntity>> {
    return this.articleCategoryService.getArticleCategoryList(
      getListArticleCategoryDto,
    );
  }
}
