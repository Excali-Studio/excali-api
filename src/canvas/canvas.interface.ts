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
import { ListFilter } from '../common/pageable.utils';
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
  @MinLength(3)
  @MaxLength(255)
  name: string;
  @IsOptional()
  @MaxLength(4000)
  description?: string;
}

export class CanvasCreateDTO {
  @MinLength(3)
  @MaxLength(255)
  name: string;
  @IsOptional()
  @MaxLength(4000)
  description?: string;
}

export class CanvasContentUpdateDTO {
  @IsNotEmpty()
  appState: CanvasAppState;
  elements: CanvasElements;
  files: CanvasFiles;
}

export interface CanvasDTO {
  id: Uuid;
  dateCreated: Date;
  dateUpdated: Date;
  name: string;
  description: string;
  tags: CanvasTagDTO[];
}

export interface CanvasTagDTO {
  id: Uuid;
  name: string;
  description: string;
  color: string;
}

export class CanvasAccessDTO {
  @IsUUID()
  @IsNotEmpty()
  personId: Uuid;
}

export class GiveCanvasAccessByTagDTO {
  @IsUUID('all', { each: true })
  @IsNotEmpty({ each: true })
  @IsNotEmpty()
  tagIds: Uuid[];
  @IsUUID('all', { each: true })
  @IsNotEmpty({ each: true })
  @IsNotEmpty()
  personIds: Uuid[];
}

export class CancelCanvasAccessByTagDTO {
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
  @MinLength(3)
  @MaxLength(12)
  name: string;
  @IsOptional()
  @MinLength(7)
  @MaxLength(7)
  color?: string;
  @IsOptional()
  @MaxLength(1024)
  description?: string;
}

export class CanvasModifyTagDTO {
  @IsUUID('all', { each: true })
  @IsNotEmpty({ each: true })
  @IsNotEmpty()
  tagIds: Uuid[];
}
