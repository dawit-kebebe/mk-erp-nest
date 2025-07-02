import { BadRequestException, Inject, Logger, OnModuleInit, Injectable } from '@nestjs/common';
import {
    DataSource,
    BeforeQueryEvent,
    EntitySubscriberInterface,
    SelectQueryBuilder,
    EventSubscriber
} from 'typeorm';
import { TenantContext } from '../utils/tenant.context';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
@EventSubscriber()
export class TenantAwareSubscriber implements EntitySubscriberInterface, OnModuleInit {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        private readonly tenantContext: TenantContext
    ) {}

    onModuleInit() {
        this.dataSource.subscribers.push(this);
    }

    // Intercept any query build operation
    beforeQuery(event: BeforeQueryEvent<any>) {
        let isTenantAware = false;
        const sql = event.query;

        const meta = event.connection.entityMetadatas.find(m =>
            sql.includes(m.tableName)
        );

        if (meta) {
            if (meta.columns.some(col => col.propertyName === 'tenantId')) {
                isTenantAware = true;
            }
        }

        if (!isTenantAware || !this.tenantContext || typeof this.tenantContext.tenantId !== 'string') {
            return;
        }

        // Note: event.queryBuilder is not available in BeforeQueryEvent, so you may need to adjust your logic here.
        // You can only log or throw, but cannot modify the query at this stage.
        // If you need to enforce tenantId filtering, consider using QueryBuilder extensions or repository patterns.

        if (isTenantAware) {
            console.error("working .............", this.tenantContext.tenantId);
            try {
                // You cannot modify the query here, just log a warning if needed
                const tenantId = this.tenantContext.tenantId;
                Logger.log(`Tenant ID (${tenantId}) detected for query on ${meta?.tableName}.`);
            } catch (error) {
                Logger.warn(`Tenant ID not available for query on ${meta?.tableName}. Query might be unfiltered.`);
            }
        }
    }

    // You might also need to intercept `beforeInsert` to add tenantId to new entities
    beforeInsert(event: any) {
        const qb = event.queryBuilder as SelectQueryBuilder<any>;
        const entityMetadata = qb?.expressionMap.mainAlias?.metadata;

        if (!entityMetadata) {
            return;
        }

        const hasTenantIdColumn = entityMetadata.columns.some(col => col.propertyName === 'tenantId');

        if (hasTenantIdColumn && typeof event?.entity?.tenantId !== 'string') {
            try {
                event.entity.tenantId = this.tenantContext.tenantId;
            } catch (error) {
                // Handle case where tenantId is not available (e.g., during initial tenant creation)
                Logger.error('Failed to inject tenantId during insert:', error.message);
                throw new BadRequestException('Tenant context missing for data insertion.');
            }
        }
    }

    // Similar for beforeUpdate (ensure tenantId doesn't change, or it's always set)
    // beforeUpdate(event: { entity: any, databaseEntity: any }) { ... }
}