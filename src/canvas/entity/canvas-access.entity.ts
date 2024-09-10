import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { CanvasEntity } from './canvas.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('canvas_access')
export class CanvasAccessEntity {
  @ApiProperty({ example: 'b28c8e5a-9999-4bcd-84f3-211790740933' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: () => CanvasEntity })
  @ManyToOne(() => CanvasEntity, { nullable: false })
  canvas: CanvasEntity;

  @ApiProperty({ type: () => UserEntity })
  @ManyToOne(() => UserEntity, { nullable: false })
  user: UserEntity;

  @ApiProperty()
  @Column({ default: false, nullable: false })
  isOwner: boolean;
}
