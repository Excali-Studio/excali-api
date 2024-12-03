import {
  CanvasAppState,
  CanvasElements,
  CanvasFiles,
  Uuid,
} from '../common/common.interface';
import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ListFilter, PageMetaDto } from '../common/pageable.utils';
import { Transform } from 'class-transformer';

export interface CanvasCreateCommand {
  name: string;
  description?: string;
  userId: Uuid;
}

export interface CanvasContentUpdateCommand {
  id: Uuid;
  appState: CanvasAppState;
  elements: CanvasElements;
  files: CanvasFiles;
}

export interface CanvasMetadataUpdateCommand {
  id: Uuid;
  name: string;
  description?: string;
}

export interface GiveAccessCommand {
  canvasId: Uuid;
  personId: Uuid;
}

export interface CancelAccessCommand {
  userId: Uuid;
  canvasId: Uuid;
  personId: Uuid;
}

export interface GiveAccessByTagCommand {
  userId: Uuid;
  tagIds: Uuid[];
  personIds: Uuid[];
}

export interface CancelAccessByTagCommand {
  userId: Uuid;
  tagIds: Uuid[];
}

export interface CanvasAddTagCommand {
  canvasId: Uuid;
  tagIds: Uuid[];
}

export interface CanvasRemoveTagCommand {
  canvasId: Uuid;
  tagIds: Uuid[];
}

export class CanvasMetadataUpdateDTO {
  @ApiProperty({
    minimum: 3,
    maximum: 255,
    example: 'New name example',
  })
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @ApiProperty({
    required: false,
    maximum: 255,
  })
  @IsOptional()
  @MaxLength(4000)
  description?: string;
}

export class CanvasCreateDTO {
  @ApiProperty({
    minimum: 3,
    maximum: 255,
    example: 'Canvas1',
  })
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @ApiProperty({
    required: false,
    maximum: 255,
  })
  @IsOptional()
  @MaxLength(4000)
  description?: string;
}

export class CanvasContentUpdateDTO {
  @ApiProperty({ example: { color: 'red' } })
  @IsNotEmpty()
  appState: CanvasAppState;
  @ApiProperty({ example: [{}] })
  elements: CanvasElements;
  @ApiProperty({ example: [{}] })
  files: CanvasFiles;
}

export class CanvasDTO {
  @ApiProperty({ example: '2a204754-603d-47b5-a217-5622bf8432b1' })
  id: Uuid;
  @ApiProperty()
  dateCreated: Date;
  @ApiProperty()
  dateUpdated: Date;
  @ApiProperty({ example: 'Canvas1' })
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  tags: CanvasTagDTO[];
}

export class CanvasTagDTO {
  @ApiProperty({ example: '2fc7a596-1bc2-4b9e-9800-9f6c3105e592' })
  id: Uuid;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  color: string;
}

export class CanvasAccessDTO {
  @ApiProperty({ example: '2fc7a596-1bc2-4b9e-9800-9f6c3105e592' })
  @IsUUID()
  @IsNotEmpty()
  personId: Uuid;
}

export class GiveCanvasAccessByTagDTO {
  @ApiProperty({ isArray: true })
  @IsUUID('all', { each: true })
  @IsNotEmpty({ each: true })
  @IsNotEmpty()
  tagIds: Uuid[];

  @ApiProperty({ isArray: true })
  @IsUUID('all', { each: true })
  @IsNotEmpty({ each: true })
  @IsNotEmpty()
  personIds: Uuid[];
}

export class CancelCanvasAccessByTagDTO {
  @ApiProperty({ isArray: true })
  @IsUUID('all', { each: true })
  @IsNotEmpty({ each: true })
  @IsNotEmpty()
  tagIds: Uuid[];
}

export class CanvasFilter extends ListFilter {
  @ApiProperty({ isArray: true, type: [String], required: false })
  @IsUUID('all', { each: true })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  tagIds?: Uuid[] = [];
  @ApiProperty({ required: false })
  searchQuery?: string;
}

export class CanvasStateFilter {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  versionId?: Uuid;
}

export interface CanvasTagCreateCommand {
  name: string;
  description?: string;
  color?: string;
}

export interface CanvasTagUpdateCommand {
  id: Uuid;
  name: string;
  description?: string;
  color?: string;
}

export interface CanvasTagDeleteCommand {
  id: Uuid;
}

export class CanvasTagCreateOrUpdateDTO {
  @ApiProperty({
    minimum: 3,
    maximum: 255,
  })
  @MinLength(3)
  @MaxLength(12)
  name: string;

  @ApiProperty({
    minimum: 7,
    maximum: 7,
    required: false,
  })
  @IsOptional()
  @MinLength(7)
  @MaxLength(7)
  color?: string;

  @ApiProperty({
    maximum: 1024,
    required: false,
  })
  @IsOptional()
  @MaxLength(1024)
  description?: string;
}

export class CanvasModifyTagDTO {
  @ApiProperty({ isArray: true })
  @IsUUID('all', { each: true })
  @IsNotEmpty({ each: true })
  @IsNotEmpty()
  tagIds: Uuid[];
}
