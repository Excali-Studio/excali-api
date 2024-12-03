import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { SelectQueryBuilder } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class ListFilter {
  @ApiProperty({ required: false, default: 1 })
  @Transform(({ value }) => Math.max(Number(value), 1))
  @IsNumber()
  @IsOptional()
  public page?: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @Transform(({ value }) => Math.max(Number(value), 1))
  @IsNumber()
  @IsOptional()
  public pageSize?: number = 10;

  @ApiProperty({ required: false })
  @IsOptional()
  public orderBy?: string;

  @ApiProperty({ required: false })
  @IsEnum(SortOrder)
  @IsOptional()
  public sortOrder?: SortOrder = SortOrder.DESC;
}

export interface PagedResult<T> {
  page: {
    totalItems: number;
    totalPages: number;
    pageSize: number;
    pageNumber: number;
  };
  data: T[];
}

export class PageMetaDto {
  @ApiProperty()
  readonly totalItems: number;
  @ApiProperty()
  readonly totalPages: number;
  @ApiProperty()
  readonly pageSize: number;
  @ApiProperty()
  readonly pageNumber: number;
}
export class PagedResultDto<T> implements PagedResult<T> {
  @ApiProperty({ type: () => PageMetaDto })
  page: PageMetaDto;
  @ApiProperty({ isArray: true })
  data: T[];
}

function pageNumberToOffset(filter: ListFilter): number {
  return (filter.page - 1) * filter.pageSize;
}

export class PageableUtils {
  public static producePagedQueryBuilder<ENTITY>(
    filter: ListFilter,
    queryBuilder: SelectQueryBuilder<ENTITY>,
  ): SelectQueryBuilder<ENTITY> {
    queryBuilder.take(filter.pageSize).offset(pageNumberToOffset(filter));

    if (filter.orderBy) {
      queryBuilder.addOrderBy(filter.orderBy, filter.sortOrder);
    }

    return queryBuilder;
  }

  public static producePagedResult<T>(
    filter: ListFilter,
    [data, count]: [T[], number],
  ): PagedResult<T> {
    return {
      page: {
        totalItems: count,
        totalPages: Math.ceil(count / filter.pageSize),
        pageSize: filter.pageSize,
        pageNumber: filter.page,
      },
      data: data,
    };
  }
}
