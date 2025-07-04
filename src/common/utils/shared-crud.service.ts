import { Injectable } from "@nestjs/common";
import { DeleteResult, ObjectLiteral, Repository } from "typeorm";
import { TenantContext } from "./tenant.context";

@Injectable()
export abstract class TEntityCrudService<T extends ObjectLiteral> {
    constructor(
        protected readonly repository: Repository<T>,
        protected readonly tenantContext?: TenantContext
    ) { }

    async findAll(): Promise<T[]> {
        if (this.tenantContext && this.tenantContext?.tenantId && this.tenantContext.tenantId !== process.env.ROOT_TENANT) {
            return this.repository.find({
                where: { tenantId: this.tenantContext.tenantId } as any
            });
        }
        return await this.repository.find();
    }

    async findOne(id: string): Promise<T | null> {
        if (this.tenantContext && this.tenantContext?.tenantId && this.tenantContext.tenantId !== process.env.ROOT_TENANT) {
            return this.repository.findOne({
                where: { id: id, tenantId: this.tenantContext.tenantId } as any
            });
        }

        return await this.repository.findOne({
            where: { id } as any
        });
    }

    abstract create(itemData: any): Promise<T | T[]>;
    abstract update(id: string, itemData: any): Promise<T>;
    
    async delete(id: string): Promise<DeleteResult> {
        if (this.tenantContext && this.tenantContext?.tenantId && this.tenantContext.tenantId !== process.env.ROOT_TENANT) {
            return this.repository.delete({
                where: { id: id, tenantId: this.tenantContext.tenantId } as any
            });
        }
        
        return await this.repository.delete(id);
    }
}