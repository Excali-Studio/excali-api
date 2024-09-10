import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('canvas_tag')
@Unique(['name'])
export class CanvasTagEntity {
  @ApiProperty({ example: 'b28c8e5a-9999-4bcd-84f3-211790740933' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ nullable: false, unique: true })
  name: string;

  @ApiProperty()
  @Column({
    nullable: true,
    length: 7,
  })
  color: string;

  @ApiProperty()
  @Column({ length: 1024, nullable: true })
  description: string;
}
