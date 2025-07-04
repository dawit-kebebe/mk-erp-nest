import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ObjectLiteral, Repository } from "typeorm";
import { TEntityCrudService } from "./shared-crud.service";

@Injectable()
export class TGenericEntityCrudService<T extends ObjectLiteral> extends TEntityCrudService<T> {
    constructor(
        repository: Repository<T>
    ) {
        super(repository);
    }

    async create(itemData: any): Promise<T | T[]> {
        const item = this.repository.create(itemData);
        return await this.repository.save(item);
    }

    async update(id: string, itemData: any): Promise<T> {
        const item = await this.repository.preload({
            id,
            ...itemData,
        });

        if (!item) {
            throw new NotFoundException(`Item with id ${id} not found`);
        }

        try {
            return await this.repository.save(item);
        } catch (error) {
            throw new BadRequestException(error?.message);
        }
    }

}