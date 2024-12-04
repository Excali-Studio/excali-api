import { CanvasEntity } from './entity/canvas.entity';
import { Uuid } from '../common/common.interface';

export function canvasEntityMapper(
  data: CanvasEntity[],
  userId: Uuid,
): CanvasEntity[] {
  return data.map((canvasEntity) => {
    const ownerAccess = canvasEntity.canvasAccesses.find((ca) => ca.isOwner);

    const user = ownerAccess?.user;

    return {
      ...canvasEntity,
      isOwner: user?.id === userId,
      owner: user?.displayName,
    };
  });
}
