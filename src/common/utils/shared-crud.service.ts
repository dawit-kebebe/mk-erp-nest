import { Injectable } from "@nestjs/common";
import { ObjectLiteral, Repository } from "typeorm";

@Injectable()
export class TEntityCrudService<T extends ObjectLiteral> {
    constructor(
        private readonly repository: Repository<T>,
    ) { }

    async findAll() {
        const data = await this.repository.find();
        return data
    }

    async findOne(id: string) {
        return await this.repository.findOne({
            where: {
                id
            } as any
        });
    }

    async create(itemData: any) {
        const items = this.repository.create(itemData);
        return await this.repository.insert(items);;
    }

    async update(id: string, itemData: any) {
        return await this.repository.update(id, itemData);
    }

    async delete(id: string) {
        return await this.repository.delete(id);
    }
}