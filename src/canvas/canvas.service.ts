import { Injectable, NotFoundException } from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';
import { CanvasEntity } from './entity/canvas.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CancelAccessByTagCommand,
  CancelAccessCommand,
  CanvasAddTagCommand,
  CanvasContentUpdateCommand,
  CanvasCreateCommand,
  CanvasFilter,
  CanvasMetadataUpdateCommand,
  CanvasRemoveTagCommand,
  CanvasStateFilter,
  GiveAccessByTagCommand,
  GiveAccessCommand,
} from './canvas.interface';
import { CanvasStateEntity } from './entity/canvas-state.entity';
import { Uuid } from '../common/common.interface';
import {
  ListFilter,
  PageableUtils,
  PagedResult,
} from '../common/pageable.utils';
import { CanvasAccessEntity } from './entity/canvas-access.entity';
import { UserEntity } from '../user/entity/user.entity';
import { CanvasTagEntity } from './entity/canvas-tag.entity';

@Injectable()
export class CanvasService {
  constructor(
    @InjectRepository(CanvasStateEntity)
    private readonly canvasStateRepository: Repository<CanvasStateEntity>,
    @InjectRepository(CanvasEntity)
    private readonly canvasRepository: Repository<CanvasEntity>,
    @InjectRepository(CanvasAccessEntity)
    private readonly canvasAccessRepository: Repository<CanvasAccessEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CanvasTagEntity)
    private readonly canvasTagRepository: Repository<CanvasTagEntity>,
  ) {}

  /**
   * Create new canvas
   */
  public async create(command: CanvasCreateCommand): Promise<CanvasEntity> {
    const user = await this.userRepository.findOne({
      where: { id: command.userId },
    });
    const canvas = new CanvasEntity();
    canvas.name = command.name.trim();
    canvas.description = command.description?.trim();
    await this.canvasRepository.save(canvas);
    const canvasAccess = new CanvasAccessEntity();
    canvasAccess.isOwner = true;
    canvasAccess.canvas = canvas;
    canvasAccess.user = user;
    await this.canvasAccessRepository.save(canvasAccess);
    return canvas;
  }

  /**
   * Append new CanvasState object to the DB
   */
  public async updateCanvasContent(
    command: CanvasContentUpdateCommand,
  ): Promise<CanvasEntity> {
    //Read canvas from DB
    const canvas = await this.canvasRepository.findOneBy({ id: command.id });
    if (!canvas) {
      throw new NotFoundException();
    }

    const canvasState = CanvasStateEntity.new(canvas);
    canvasState.appState = command.appState;
    canvasState.appState.collaborators = []; // Workaround for ExcaliDraw 0.17.3 initial state bug
    canvasState.elements = command.elements;
    canvasState.files = command.files;

    await this.canvasStateRepository.save(canvasState);

    canvas.dateUpdated = new Date();
    await this.canvasRepository.save(canvas);

    return canvas;
  }

  public async updateCanvasMetadata(
    command: CanvasMetadataUpdateCommand,
  ): Promise<CanvasEntity> {
    const canvas = await this.canvasRepository.findOneBy({ id: command.id });

    if (!canvas) {
      throw new NotFoundException();
    }

    canvas.name = command.name.trim();
    canvas.description = command.description?.trim();
    canvas.dateUpdated = new Date();
    await this.canvasRepository.save(canvas);

    return canvas;
  }

  public async deleteCanvasById(id: Uuid) {
    const canvas = await this.canvasRepository.findOne({
      where: {
        id,
        deleted: false,
      },
    });

    await this.canvasRepository.update({ id: canvas.id }, { deleted: true });
  }

  public async readById(id: Uuid): Promise<CanvasEntity> {
    return this.canvasRepository.findOne({
      where: {
        id,
        deleted: false,
      },
      relations: {
        tags: true,
      },
    });
  }

  public async readAll(
    canvasFilter: CanvasFilter,
    userId: Uuid,
  ): Promise<PagedResult<CanvasEntity>> {
    const queryBuilder = PageableUtils.producePagedQueryBuilder(
      canvasFilter,
      this.canvasRepository.createQueryBuilder('canvas'),
    );

    queryBuilder
      .innerJoin('canvas.canvasAccesses', 'access')
      .where('access.userId = :userId', { userId: userId });

    canvasFilter.tagIds.forEach((tagId, index) => {
      queryBuilder
        .innerJoin('canvas.tags', `tag${index}`)
        .andWhere(`tag${index}.id = :tagId${index}`)
        .setParameter(`tagId${index}`, tagId);
    });

    if (canvasFilter.searchQuery) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(canvas.name) like :searchQuery', {
            searchQuery: `%${canvasFilter.searchQuery.toLowerCase()}%`,
          }).orWhere('LOWER(canvas.description) like :searchQuery', {
            searchQuery: `%${canvasFilter.searchQuery.toLowerCase()}%`,
          });
        }),
      );
    }

    return PageableUtils.producePagedResult(
      canvasFilter,
      await queryBuilder
        .where('canvas.deleted = false')
        .leftJoinAndSelect('canvas.tags', 'tags')
        .getManyAndCount(),
    );
  }

  public async readByTags(
    tagIds: Uuid[],
    userId: Uuid,
  ): Promise<CanvasEntity[]> {
    const accessibleCanvases = await this.getAccessibleCanvases(userId);
    const qb = this.canvasRepository.createQueryBuilder('canvas');
    qb.innerJoin('canvas.tags', 'tags');
    qb.whereInIds(accessibleCanvases);
    qb.andWhere('tags.id in (:...tagIds)', { tagIds: tagIds });
    return await qb.select().getMany();
  }

  private static produceEmptyCanvasState(
    canvasId?: Uuid,
  ): Partial<CanvasStateEntity> {
    return {
      canvasId,
      appState: {},
      elements: [],
      files: {},
    };
  }

  public async readState(
    canvasId: Uuid,
    filter: CanvasStateFilter,
  ): Promise<CanvasStateEntity> {
    const canvas = await this.canvasRepository.findOne({
      where: {
        id: canvasId,
        deleted: false,
      },
    });

    if (canvas.deleted) throw new NotFoundException();

    const queryBuilder = this.canvasStateRepository
      .createQueryBuilder()
      .addOrderBy('"dateCreated"', 'DESC');
    queryBuilder.andWhere({ canvasId });

    //If no timestamp value in filter is provided, return latest version
    if (filter.versionId) {
      queryBuilder.andWhere({ id: filter.versionId });
    }

    return (
      (await queryBuilder.getOne()) ||
      (CanvasService.produceEmptyCanvasState(canvasId) as CanvasStateEntity) //If state is empty return default one
    );
  }

  public async readAllStates(
    canvasId: Uuid,
    filter: ListFilter,
  ): Promise<PagedResult<CanvasStateEntity>> {
    const qb = PageableUtils.producePagedQueryBuilder(
      filter,
      this.canvasStateRepository.createQueryBuilder('state'),
    );
    qb.where({ canvasId });
    return PageableUtils.producePagedResult(filter, await qb.getManyAndCount());
  }

  public async giveAccess(command: GiveAccessCommand) {
    const user = await this.userRepository.findOne({
      where: { id: command.personId },
    });
    const canvas = await this.canvasRepository.findOne({
      where: { id: command.canvasId },
    });
    if (!user || !canvas) {
      throw new NotFoundException();
    }
    let canvasAccess = await this.canvasAccessRepository.findOne({
      where: {
        user: { id: command.personId },
        canvas: { id: command.canvasId },
      },
    });
    if (canvasAccess) {
      return;
    }
    canvasAccess = new CanvasAccessEntity();
    canvasAccess.isOwner = false;
    canvasAccess.canvas = canvas;
    canvasAccess.user = user;
    await this.canvasAccessRepository.save(canvasAccess);
  }

  public async cancelAccess(command: CancelAccessCommand) {
    const criteria = {
      user: { id: command.personId },
      canvas: { id: command.canvasId },
    } as CanvasAccessEntity;

    if (command.userId !== command.personId) {
      criteria.isOwner = false;
    }

    await this.canvasAccessRepository.delete(criteria);
  }

  public async giveAccessByTag(command: GiveAccessByTagCommand) {
    const user = await this.userRepository.findOne({
      where: { id: command.userId },
    });
    if (!user) {
      throw new NotFoundException();
    }
    const accessibleWithTags = await this.readByTags(command.tagIds, user.id);
    accessibleWithTags.forEach((canvas) =>
      command.personIds.forEach((personId) =>
        this.giveAccess({
          canvasId: canvas.id,
          personId: personId,
        }),
      ),
    );
  }

  public async cancelAccessByTag(command: CancelAccessByTagCommand) {
    const user = await this.userRepository.findOne({
      where: { id: command.userId },
    });
    if (!user) {
      throw new NotFoundException();
    }
    const accessibleWithTags = await this.readByTags(command.tagIds, user.id);
    for (const canvas of accessibleWithTags) {
      const accessList = await this.canvasAccessRepository.find({
        where: {
          canvas: { id: canvas.id },
        },
        relations: { user: true },
      });
      accessList.forEach((access) => {
        if (access.user.id != user.id) {
          this.cancelAccess({
            userId: user.id,
            canvasId: canvas.id,
            personId: access.user.id,
          });
        }
      });
    }
  }

  public async addTags(command: CanvasAddTagCommand) {
    const canvas = await this.canvasRepository.findOne({
      where: { id: command.canvasId },
      relations: { tags: true },
    });
    if (!canvas) {
      throw new NotFoundException();
    }
    command.tagIds.forEach((tagId) => this.addTag(canvas, tagId));
    await this.canvasRepository.save(canvas);
  }

  public async removeTags(command: CanvasRemoveTagCommand) {
    const canvas = await this.canvasRepository.findOne({
      where: { id: command.canvasId },
      relations: { tags: true },
    });
    if (!canvas) {
      throw new NotFoundException();
    }
    canvas.tags = canvas.tags.filter((tag) => !command.tagIds.includes(tag.id));
    await this.canvasRepository.save(canvas);
  }

  private async addTag(canvas: CanvasEntity, tagId: Uuid) {
    const tag = await this.canvasTagRepository.findOne({
      where: { id: tagId },
    });
    if (!tag) {
      throw new NotFoundException();
    }
    if (canvas.tags.includes(tag)) {
      return;
    }
    canvas.tags.push(tag);
  }

  private async getAccessibleCanvases(userId: Uuid): Promise<Uuid[]> {
    return (
      await this.canvasAccessRepository.find({
        relations: {
          canvas: true,
        },
        where: {
          user: {
            id: userId,
          },
          canvas: {
            deleted: false,
          },
        },
      })
    ).map((access) => access.canvas.id);
  }
}
