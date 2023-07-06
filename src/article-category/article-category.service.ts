import {
  PageDto,
  PagePaginationDto,
  ResponseDto,
  UpdateStatusDto,
} from '@/utils/dto';
import { Status } from '@/utils/enum';
import { generateSlug } from '@/utils/helper';
import { CREATE_SUCCESS, UPDATE_SUCCESS } from '@/utils/message';
import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ArticleCategoryEntity } from './article-category.entity';
import {
  ARTICLE_CATEGORY_ALREADY_EXIST,
  ARTICLE_CATEGORY_NOT_FOUND,
} from './constants';
import { ArticleCategoryPayloadDto, GetListArticleCategoryDto } from './dto';

@Injectable()
export class ArticleCategoryService {
  constructor(
    @InjectRepository(ArticleCategoryEntity)
    private readonly articleCategoryRepository: Repository<ArticleCategoryEntity>,
  ) {}

  public async getArticleCategoryList(
    getListArticleCategoryDto: GetListArticleCategoryDto,
  ): Promise<PageDto<ArticleCategoryEntity>> {
    const { search, status, skip, take, order, orderBy, columns } =
      getListArticleCategoryDto;
    const queryBuilder =
      this.articleCategoryRepository.createQueryBuilder('article-category');

    if (columns && columns !== '*') {
      const selectedColumns = columns
        .split(',')
        .filter((item) => item !== 'password');
      queryBuilder.select(selectedColumns.map((column) => `user.${column}`));
    }

    if (status) {
      queryBuilder.andWhere('user.status = :status', { status });
    }

    if (search) {
      const lowercaseSearch = search.toLowerCase();
      queryBuilder.andWhere('LOWER(user.email) LIKE :email', {
        email: `%${lowercaseSearch}%`,
      });
    }

    if (!columns || columns.includes('parent_id')) {
      queryBuilder.leftJoinAndSelect('article-category.parent', 'parent');
    }

    queryBuilder
      .orderBy(`article-category.${orderBy}`, order)
      .skip(skip)
      .take(take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PagePaginationDto({
      itemCount,
      pageOptionsDto: getListArticleCategoryDto,
    });

    return new PageDto(entities, pageMetaDto);
  }

  async createArticleCategory(
    createArticleCategoryDto: ArticleCategoryPayloadDto,
  ): Promise<ResponseDto> {
    const dataSubmit = {
      ...createArticleCategoryDto,
      status: Status.ACTIVE,
      id: uuidv4(),
      slug: generateSlug(createArticleCategoryDto.article_category_name),
    };
    const articleCategoryData = await this.articleCategoryRepository.findOneBy({
      article_category_name: dataSubmit.article_category_name,
    });

    if (articleCategoryData) {
      throw new NotAcceptableException(ARTICLE_CATEGORY_ALREADY_EXIST);
    }

    await this.articleCategoryRepository.save(dataSubmit);

    return new ResponseDto(CREATE_SUCCESS);
  }

  async updateStatus(
    userId: string,
    dataUpdate: UpdateStatusDto,
  ): Promise<ResponseDto> {
    await this.hasArticleCategory({ id: userId });
    await this.updateDataArticleCategoryInDB(userId, dataUpdate);
    return new ResponseDto(UPDATE_SUCCESS);
  }

  async updateArticleCategoryById(
    articleCategoryId: string,
    dataUpdate: ArticleCategoryPayloadDto,
  ): Promise<ResponseDto> {
    if (!_.isEmpty(dataUpdate)) {
      const articleCategoryData = await this.articleCategoryRepository.find({
        where: {
          article_category_name: dataUpdate.article_category_name,
        },
      });

      if (
        articleCategoryData &&
        articleCategoryData.some((item) => item.id !== articleCategoryId)
      ) {
        throw new NotAcceptableException(ARTICLE_CATEGORY_ALREADY_EXIST);
      }
      await this.hasArticleCategory({ id: articleCategoryId });
      await this.updateDataArticleCategoryInDB(articleCategoryId, dataUpdate);
    }
    return new ResponseDto(UPDATE_SUCCESS);
  }

  async updateDataArticleCategoryInDB(
    articleCategoryId: string,
    dataUpdate: ArticleCategoryPayloadDto | UpdateStatusDto,
  ) {
    const queryBuilder =
      this.articleCategoryRepository.createQueryBuilder('article-category');
    await queryBuilder
      .update(ArticleCategoryEntity)
      .set({ ...dataUpdate, date_modified: new Date() })
      .where({
        id: articleCategoryId,
      })
      .execute();
  }

  async hasArticleCategory(payload: { id: string }): Promise<boolean> {
    const data = await this.articleCategoryRepository.findOneBy(payload);
    if (data === null) {
      throw new NotFoundException(ARTICLE_CATEGORY_NOT_FOUND);
    }

    return true;
  }
}
