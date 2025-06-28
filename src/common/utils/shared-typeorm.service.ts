import { dataSourceOptions } from "@mk/database/data-source";
import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { SeederOptions } from "typeorm-extension";

@Injectable()
export class TypeOrmService implements TypeOrmOptionsFactory {
    public createTypeOrmOptions(): TypeOrmModuleOptions & SeederOptions {
        return dataSourceOptions;
    }
}

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    public createTypeOrmOptions(): TypeOrmModuleOptions & SeederOptions {
        return dataSourceOptions;
    }
}