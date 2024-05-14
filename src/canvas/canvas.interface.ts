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

export interface CanvasCreateCommand {
  name: string;
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
}

export interface GiveAccessCommand {
  canvasId: Uuid;
  userId: Uuid;
}

export interface CancelAccessCommand {
  canvasId: Uuid;
  userId: Uuid;
}

export class CanvasMetadataUpdateDTO {
  @MinLength(3)
  @MaxLength(255)
  name: string;
}

export class CanvasCreateDTO {
  @MinLength(3)
  @MaxLength(255)
  name: string;
}

export interface CanvasContentUpdateDto {
  appState: CanvasAppState;
  elements: CanvasElements;
  files: CanvasFiles;
}

export interface CanvasDTO {
  id: Uuid;
  dateCreated: Date;
  dateUpdated: Date;
  name: string;
  tags: CanvasTagDTO[];
}

export interface CanvasTagDTO {
  id: Uuid;
  name: string;
  color: string;
}

export class CanvasAccessDTO {
  @IsUUID()
  @IsNotEmpty()
  userId: Uuid;
}

export class CanvasStateFilter {
  @IsOptional()
  versionTimestamp?: string;
  @IsUUID()
  @IsNotEmpty()
  canvasId: Uuid;
}

export interface CanvasTagCreateCommand {
  name: string;
  color?: string;
}

export interface CanvasTagUpdateCommand {
  id: Uuid;
  name: string;
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
}
