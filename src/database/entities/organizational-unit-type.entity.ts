import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('organizational_unit_type')
export class OrganizationalUnitType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  tag: string;

  @Column({ type: 'text', nullable: true })
  description?: string;
}
