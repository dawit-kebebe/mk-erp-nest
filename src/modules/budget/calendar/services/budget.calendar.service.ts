import { TenantContext } from "@mk/common/contexts/tenant.context";
import { TEntityCrudService } from "@mk/common/utils/shared-crud.service";
import { BudgetCalendar } from "@mk/database/entities/budget-calendar.entity";
import { BadRequestException, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { isUUID } from "class-validator";
import { Repository } from "typeorm";
import { CreateBudgetCalendarDto } from "../dto/create-budget-calendar.dto";
import { UpdateBudgetCalendarDto } from "../dto/update-budget-calendar.dto";

@Injectable()
export class BudgetCalendarService extends TEntityCrudService<BudgetCalendar> {
    constructor(
        @InjectRepository(BudgetCalendar) private readonly budgetCalendarRepository: Repository<BudgetCalendar>,
        @Inject() readonly tenantContext: TenantContext
    ) {
        super(budgetCalendarRepository, tenantContext);
    }

    create(itemData: CreateBudgetCalendarDto): Promise<BudgetCalendar | BudgetCalendar[]> {
        const tenantId = this.tenantContext.tenantId;
        if (!isUUID(tenantId)) {
            throw new ForbiddenException('Tenant ID is missing from context.');
        }

        return this.budgetCalendarRepository.manager.transaction(async (manager) => {
            const budgetCalendar = manager.create(BudgetCalendar, {
                ...itemData,
                tenantId
            });

            const fromDate = new Date(itemData.from);
            const toDate = new Date(itemData.to);

            if (toDate < fromDate) {
                throw new BadRequestException('End date cannot be earlier than start date.');
            }

            return await manager.save(budgetCalendar);
        });
    }

    update(id: string, itemData: UpdateBudgetCalendarDto): Promise<BudgetCalendar> {
        const tenantId = this.tenantContext.tenantId;
        if (!isUUID(tenantId)) {
            throw new ForbiddenException('Tenant ID is missing from context.');
        }

        if (!isUUID(id)) {
            throw new BadRequestException('Invalid ID format.');
        }

        return this.budgetCalendarRepository.manager.transaction(async (manager) => {
            const budgetCalendar = await manager.findOne(BudgetCalendar, { where: { id, tenantId } });
            if (!budgetCalendar) {
                throw new BadRequestException('Budget calendar not found.');
            }

            Object.assign(budgetCalendar, itemData);

            const fromDate = new Date(budgetCalendar.from);
            const toDate = new Date(budgetCalendar.to);

            if (toDate < fromDate) {
                throw new BadRequestException('End date cannot be earlier than start date.');
            }

            return await manager.save(budgetCalendar);
        });
    }
}