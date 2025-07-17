import { Tenant } from '@mk/common/entities/tenant.entity';
import { BUDGET_CALENDAR_STATUS } from '@mk/common/enum/budget-calendar-status.enum';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn
} from 'typeorm';
 
@Entity('budget_calendars')
export class BudgetCalendar extends Tenant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 50, unique: true })
    name: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'timestamp', nullable: true })
    from: Date;

    @Column({ type: 'timestamp', nullable: true })
    to: Date;

    @Column({ type: 'varchar', default: BUDGET_CALENDAR_STATUS.OPEN })
    status: BUDGET_CALENDAR_STATUS;
}