import { TenantOrganizationalUnitAware } from '@mk/common/entities/tenant-org-unit.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique
} from 'typeorm';
import { BudgetCalendar } from './budget-calendar.entity';
import { ChartOfAccounts } from './chart-of-accounts.entity';

@Entity('budget_plans')
export class BudgetPlan extends TenantOrganizationalUnitAware {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => BudgetCalendar)
    @JoinColumn({ name: 'calendarId' })
    calendar: BudgetCalendar;

    @Column({ type: 'uuid' })
    calendarId: string;

    @OneToMany(() => BudgetPlanItem, (item) => item.budgetPlan)
    items: BudgetPlanItem[];
}

@Entity('budget_plans_items')
@Unique(['budgetPlanId', 'plan'])
export class BudgetPlanItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100 })
    plan: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    amount: number;

    @ManyToOne(() => BudgetPlan, (budgetPlan) => budgetPlan.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'budgetPlanId' })
    budgetPlan: BudgetPlan;

    @Column({ type: 'uuid' })
    budgetPlanId: string;

    @ManyToOne(() => ChartOfAccounts)
    @JoinColumn({ name: 'accountId' })
    account: ChartOfAccounts;

    @Column({ type: 'uuid' })
    accountId: string;
}