import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import {
  CanvasAppState,
  CanvasElements,
  CanvasFiles,
  Uuid,
} from '../../common/common.interface';
import { CanvasEntity } from './canvas.entity';

@Entity('canvas_state')
export class CanvasStateEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'{}'",
    nullable: false,
  })
  appState: CanvasAppState;

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'{}'",
    nullable: false,
  })
  elements: CanvasElements;

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'{}'",
    nullable: false,
  })
  files: CanvasFiles;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreated: Date;

  @ManyToOne(() => CanvasEntity, { nullable: false, onDelete: 'CASCADE' })
  canvas: CanvasEntity;

  @RelationId((canvasState: CanvasStateEntity) => canvasState.canvas)
  @Column()
  canvasId: Uuid;

  public static new(canvas: CanvasEntity) {
    const newState = new CanvasStateEntity();
    newState.canvas = canvas;
    return newState;
  }
}
