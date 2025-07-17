import { ACCOUNT_TYPES } from '@mk/common/enum/account-types.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('chart_of_accounts')
export class ChartOfAccounts {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', unique: true })
    accountCode: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'varchar', length: 100 })
    accountType: ACCOUNT_TYPES;
}