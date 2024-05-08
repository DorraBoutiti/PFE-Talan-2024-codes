import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Document } from '../../document/entities/document.entity';

@Entity()
export class InformationExtraites {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Document, (document) => document.informations, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_document' }) 
  document: Document;

  @Column()
  nomChamp: string; 

  @Column()
  valeur: string;
}
