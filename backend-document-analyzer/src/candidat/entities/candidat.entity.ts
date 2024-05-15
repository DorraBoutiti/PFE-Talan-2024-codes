import { Document } from '../../document/entities/document.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Candidat {
  @PrimaryGeneratedColumn()
  id_candidat: number;

  @Column({ nullable: false })
  full_name: string;

  @Column({ nullable: false })
  email: string;

  @OneToMany(() => Document, (document) => document.candidat, {
    cascade: true,
    eager: true,
  })
  docs: Document[];
}
