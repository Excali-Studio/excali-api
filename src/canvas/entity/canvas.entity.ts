import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CanvasTagEntity } from './canvas-tag.entity';
import { CanvasAccessEntity } from './canvas-access.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('canvas')
export class CanvasEntity {
  @ApiProperty({ example: 'b28c8e5a-9999-4bcd-84f3-211790740933' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ nullable: false })
  name: string;

  @ApiProperty()
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @ApiProperty()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreated: Date;

  @ApiProperty()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateUpdated: Date;

  @Column({ type: 'boolean', default: false, nullable: false })
  deleted: boolean;

  @ApiProperty({ isArray: true, type: () => CanvasTagEntity })
  @ManyToMany(() => CanvasTagEntity)
  @JoinTable({
    name: 'canvas_tags',
  })
  tags: CanvasTagEntity[];

  @ApiProperty({ isArray: true, type: () => CanvasAccessEntity })
  @OneToMany(() => CanvasAccessEntity, (canvasAccess) => canvasAccess.canvas)
  canvasAccesses: CanvasAccessEntity[];
}
