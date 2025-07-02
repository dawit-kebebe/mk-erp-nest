import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ObjectLiteral, Repository, InsertResult, UpdateResult, DeleteResult } from "typeorm";

@Injectable()
export class TEntityCrudService<T extends ObjectLiteral> {
    constructor(
        private readonly repository: Repository<T>,
    ) { }

    async findAll(): Promise<T[]> {
        const data = await this.repository.find();
        return data;
    }

    async findOne(id: string): Promise<T | null> {
        return await this.repository.findOne({
            where: {
                id
            } as any
        });
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

    async delete(id: string): Promise<DeleteResult> {
        return await this.repository.delete(id);
    }
}