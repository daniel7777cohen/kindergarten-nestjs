import { Kid } from 'src/kids/kids.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Kindergarten {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 25 })
  name: string;

  @Column()
  minAge: number;

  @OneToMany(() => Kid, (kid) => kid.kindergarten)
  kids: Kid[];
}
