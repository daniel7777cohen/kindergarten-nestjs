import { Kindergarten } from 'src/kindergarten/kindergarten.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Kid {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true, where: 'passportId IS NOT NULL' })
  @Column()
  passportId: number;

  @Column({ nullable: false, length: 25 })
  fullName: string;

  @Column({ nullable: false, type: 'date' })
  birthDate: Date;

  @ManyToOne(() => Kindergarten, (kindergarten) => kindergarten.kids)
  kindergarten: Kindergarten;
}
