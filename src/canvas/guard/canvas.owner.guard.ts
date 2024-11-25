import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CanvasAccessEntity } from '../entity/canvas-access.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CanvasGuard } from './canvas.guard';

@Injectable()
export class CanvasOwnerGuard implements CanActivate {
  constructor(
    private readonly canvasGuard: CanvasGuard,
    @InjectRepository(CanvasAccessEntity)
    private readonly canvasAccessRepository: Repository<CanvasAccessEntity>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const accessibleCanvas = await this.canvasGuard.canActivate(context);
    if (!accessibleCanvas) return false;

    const request = context.switchToHttp().getRequest();
    const canvasId = request.params.id;
    const userId = request.user;

    const canvasAccess = await this.canvasAccessRepository.findOne({
      where: { canvas: { id: canvasId }, user: { id: userId } },
    });

    return !!canvasAccess && canvasAccess.isOwner;
  }
}
