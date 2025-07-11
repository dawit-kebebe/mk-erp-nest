import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { OrganizationalUnit } from './organizational-unit.entity';
import { Permission } from './permission.entity';

@Entity('access-level')
export class AccessLevel {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100, nullable: false })
    accessLevelTag: string;

    @OneToMany(() => OrganizationalUnit, (unit) => unit.accessLevel, {
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
        eager: true, // optional: auto-loads permissions
        nullable: true
    })
    organizationalUnits?: OrganizationalUnit[];

    @OneToOne(() => Permission, (perm) => perm.accessLevel)
    @JoinColumn({ name: 'permissionId' })
    permission: Permission;
}