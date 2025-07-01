import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { OrganizationalUnitType } from '../entities/organizational-unit-type.entity';
import { OrganizationalUnit } from '../entities/organizational-unit.entity';
import { User } from '../entities/user.entity';
import { Logger } from '@nestjs/common';

export default class MainSeeder implements Seeder {
    async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {

        console.log("working");
        Logger.log("Seeding Organizational Unit Type Entity....")
        const organizationalUnitTypeFactory = factoryManager.get(OrganizationalUnitType);
        const organizationalUnitType = await organizationalUnitTypeFactory.save();

        Logger.log("Seeding Organizational Unit Entity....")
        const organizationalUnitFactory = factoryManager.get(OrganizationalUnit);
        const organizationalUnit = await organizationalUnitFactory.save({
            organizationalUnitTypeId: organizationalUnitType.id
        })


        Logger.log("Seeding Super Admin User Entity....")
        const userFactory = factoryManager.get(User);
        const user = await userFactory.save({
            organizationalUnitId: organizationalUnit.id
        })


    }
}
