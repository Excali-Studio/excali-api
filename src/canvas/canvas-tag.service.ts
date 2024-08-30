import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CanvasTagEntity } from './entity/canvas-tag.entity';
import { Repository } from 'typeorm';
import {
  CanvasTagCreateCommand,
  CanvasTagDeleteCommand,
  CanvasTagUpdateCommand,
} from './canvas.interface';
import {
  ListFilter,
  PageableUtils,
  PagedResult,
} from '../common/pageable.utils';
import { Uuid } from '../common/common.interface';
import { randomColorGenerator } from '../helpers/random-color-generator';

@Injectable()
export class CanvasTagService {
  constructor(
    @InjectRepository(CanvasTagEntity)
    private readonly canvasTagRepository: Repository<CanvasTagEntity>,
  ) {}

  public async create(
    command: CanvasTagCreateCommand,
  ): Promise<CanvasTagEntity> {
    const tagName = command.name?.trim().toUpperCase();
    const existingTag = await this.canvasTagRepository.findOne({
      where: { name: tagName },
    });
    if (existingTag) {
      throw new ConflictException();
    }
    const tag = new CanvasTagEntity();
    tag.name = tagName;
    tag.description = command.description?.trim();
    tag.color = command.color?.trim() || randomColorGenerator().trim();
    await this.canvasTagRepository.save(tag);
    return tag;
  }

  public async readById(id: Uuid): Promise<CanvasTagEntity> {
    return this.canvasTagRepository.findOne({
      where: {
        id,
      },
    });
  }

  public async readAll(
    filter: ListFilter,
  ): Promise<PagedResult<CanvasTagEntity>> {
    return PageableUtils.producePagedResult(
      filter,
      await this.canvasTagRepository.findAndCount({ order: { name: 'asc' } }),
    );
  }

  public async update(
    command: CanvasTagUpdateCommand,
  ): Promise<CanvasTagEntity> {
    const tagName = command.name?.trim().toUpperCase();
    const tagToBeUpdated = await this.canvasTagRepository.findOne({
      where: { id: command.id },
    });
    const existingTag = await this.canvasTagRepository.findOne({
      where: { name: tagName },
    });
    if (existingTag && existingTag.id != command.id) {
      throw new ConflictException();
    }
    tagToBeUpdated.name = tagName;
    tagToBeUpdated.description = command.description?.trim();
    tagToBeUpdated.color = command.color?.trim();
    await this.canvasTagRepository.save(tagToBeUpdated);
    return tagToBeUpdated;
  }

  public async delete(command: CanvasTagDeleteCommand) {
    try {
      await this.canvasTagRepository.delete(command.id);
    } catch (e) {
      throw new ConflictException();
    }
  }
}
