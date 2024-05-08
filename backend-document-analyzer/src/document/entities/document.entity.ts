import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { InformationExtraites } from 'src/informations-extraites/entities/informations-extraite.entity';
import { Candidat } from 'src/candidat/entities/candidat.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column()
  type: string;

  @Column({ type: 'datetime' })
  dateTelechargement: Date;

  @Column({ type: 'longblob' })
  file: string;

  @Column()
  status: string;

  @OneToMany(
    () => InformationExtraites,
    (informationExtraites) => informationExtraites.document,
    { cascade: true, eager: true },
  )
  informations: InformationExtraites[];

  @ManyToOne(() => Candidat, (candidat) => candidat.docs, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_candidat' })
  candidat: Candidat;

}
