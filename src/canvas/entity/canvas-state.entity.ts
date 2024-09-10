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
import { ApiProperty } from '@nestjs/swagger';

@Entity('canvas_state')
export class CanvasStateEntity {
  @ApiProperty({ example: '2a204754-603d-47b5-a217-5622bf8432b1' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'{}'",
    nullable: false,
  })
  appState: CanvasAppState;

  @ApiProperty()
  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'{}'",
    nullable: false,
  })
  elements: CanvasElements;

  @ApiProperty()
  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'{}'",
    nullable: false,
  })
  files: CanvasFiles;

  @ApiProperty()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreated: Date;

  @ApiProperty()
  @ManyToOne(() => CanvasEntity, { nullable: false })
  canvas: CanvasEntity;

  @ApiProperty({ example: '45018974-63b4-45b6-8c2b-823584fbcbbc' })
  @RelationId((canvasState: CanvasStateEntity) => canvasState.canvas)
  @Column()
  canvasId: Uuid;

  public static new(canvas: CanvasEntity) {
    const newState = new CanvasStateEntity();
    newState.canvas = canvas;
    return newState;
  }
}
