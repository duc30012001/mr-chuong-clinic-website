import {
  PageDto,
  PagePaginationDto,
  ResponseDto,
  UpdateStatusDto,
} from '@/utils/dto';
import { Status } from '@/utils/enum';
import { generateSlug } from '@/utils/helper';
import { CREATE_SUCCESS, UPDATE_SUCCESS } from '@/utils/message';
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ArticleEntity } from './article.entity';
import { ARTICLE_NOT_FOUND } from './constants';
import { ArticlePayloadDto, GetListArticleDto } from './dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    private jwtService: JwtService,
  ) {}

  public async getArticleList(
    getListArticleDto: GetListArticleDto,
  ): Promise<PageDto<ArticleEntity>> {
    const {
      search,
      status,
      skip,
      take,
      order,
      orderBy,
      columns,
      article_category_id,
    } = getListArticleDto;
    const queryBuilder = this.articleRepository.createQueryBuilder('article');

    if (columns && columns !== '*') {
      const selectedColumns = columns
        .split(',')
        .filter((item) => item !== 'password');
      queryBuilder.select(selectedColumns.map((column) => `article.${column}`));
    }

    if (status) {
      queryBuilder.andWhere('article.status = :status', { status });
    }

    if (article_category_id) {
      queryBuilder.andWhere(
        'article.article_category_id = :article_category_id',
        { article_category_id },
      );
    }

    if (search) {
      const lowercaseSearch = search.toLowerCase();
      queryBuilder.andWhere(
        'LOWER(article.article_title) LIKE :article_title',
        {
          article_title: `%${lowercaseSearch}%`,
        },
      );
    }

    if (!columns || columns.includes('user_creator')) {
      queryBuilder.leftJoin('article.creator', 'creator');
      queryBuilder.addSelect(['creator.id', 'creator.email']);
    }

    if (!columns || columns.includes('article_category_id')) {
      queryBuilder.leftJoin('article.article_category', 'article_category');
      queryBuilder.addSelect([
        'article_category.id',
        'article_category.article_category_name',
      ]);
    }

    queryBuilder.orderBy(`article.${orderBy}`, order).skip(skip).take(take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PagePaginationDto({
      itemCount,
      pageOptionsDto: getListArticleDto,
    });

    return new PageDto(entities, pageMetaDto);
  }

  async getArticleById(articleId: string): Promise<ArticleEntity> {
    const article = await this.articleRepository
      .createQueryBuilder('article')
      .select()
      .leftJoin('article.creator', 'creator')
      .addSelect(['creator.id', 'creator.email'])
      .leftJoin('article.article_category', 'article_category')
      .addSelect([
        'article_category.id',
        'article_category.article_category_name',
      ])
      .where('article.id = :articleId', { articleId })
      .getOne();
    if (article === null) {
      throw new NotFoundException(ARTICLE_NOT_FOUND);
    }
    return article;
  }

  async getArticleBySlug(slug: string): Promise<ArticleEntity> {
    const article = await this.articleRepository
      .createQueryBuilder('article')
      .select()
      .leftJoin('article.creator', 'creator')
      .addSelect(['creator.id', 'creator.email'])
      .leftJoin('article.article_category', 'article_category')
      .addSelect([
        'article_category.id',
        'article_category.article_category_name',
      ])
      .where('article.slug = :slug', { slug })
      .getOne();
    if (article === null) {
      throw new NotFoundException(ARTICLE_NOT_FOUND);
    }
    return article;
  }

  async createArticle(
    createArticleDto: ArticlePayloadDto,
    authorizationHeader: string,
  ): Promise<ResponseDto> {
    const token = authorizationHeader.split(' ')[1];
    const decodedToken = await this.jwtService.decode(token);
    const dataSubmit = {
      ...createArticleDto,
      status: Status.ACTIVE,
      id: uuidv4(),
      slug: generateSlug(createArticleDto.article_title),
      user_creator: decodedToken['id'],
    };

    await this.articleRepository.save(dataSubmit);

    return new ResponseDto(CREATE_SUCCESS);
  }

  async updateStatus(
    id: string,
    dataUpdate: UpdateStatusDto,
  ): Promise<ResponseDto> {
    await this.hasArticle({ id });
    await this.updateDataArticleInDB(id, dataUpdate);
    return new ResponseDto(UPDATE_SUCCESS);
  }

  async updateArticleById(
    articleId: string,
    dataUpdate: ArticlePayloadDto,
  ): Promise<ResponseDto> {
    if (!_.isEmpty(dataUpdate)) {
      await this.hasArticle({ id: articleId });
      await this.updateDataArticleInDB(articleId, dataUpdate);
    }
    return new ResponseDto(UPDATE_SUCCESS);
  }

  async updateDataArticleInDB(
    articleId: string,
    dataUpdate: ArticlePayloadDto | UpdateStatusDto,
  ) {
    const queryBuilder = this.articleRepository.createQueryBuilder('article');
    await queryBuilder
      .update(ArticleEntity)
      .set({ ...dataUpdate, date_modified: new Date() })
      .where({
        id: articleId,
      })
      .execute();
  }

  async hasArticle(payload: { id: string }): Promise<boolean> {
    const data = await this.articleRepository.findOneBy(payload);
    if (data === null) {
      throw new NotFoundException(ARTICLE_NOT_FOUND);
    }

    return true;
  }
}
