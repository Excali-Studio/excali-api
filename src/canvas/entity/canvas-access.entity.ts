import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { CanvasEntity } from './canvas.entity';

@Entity('canvas_access')
export class CanvasAccessEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CanvasEntity, { nullable: false })
  canvas: CanvasEntity;

  @ManyToOne(() => UserEntity, { nullable: false })
  user: UserEntity;

  @Column({ default: false, nullable: false })
  isOwner: boolean;
}
