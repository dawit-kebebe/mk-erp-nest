import { config } from 'dotenv';
import { setSeederFactory } from 'typeorm-extension';
import { OrganizationalUnit } from '../entities/organizational-unit.entity';
import { OrganizationalUnitType } from '../entities/organizational-unit-type.entity';
config();

export const OrganizationalUnitFactory = setSeederFactory(OrganizationalUnit, () => {
    const organizationalUnit = new OrganizationalUnit();

    organizationalUnit.name = "Super Admin Unit.";
    organizationalUnit.description = "The Super Admin Unit.",
    organizationalUnit.parentOrgId = undefined;

    return organizationalUnit;
});

export const OrganizationalUnitTypeFactory = setSeederFactory(OrganizationalUnitType, () => {
    const organizationalUnitType = new OrganizationalUnitType();

    organizationalUnitType.tag = "Super Admin Unit.";
    organizationalUnitType.description = "The Super Admin is the top level organizational type."

    return organizationalUnitType;
});
