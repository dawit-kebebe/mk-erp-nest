import { MigrationInterface, QueryRunner } from "typeorm";

export class OrgTenantAwareEntities1752264476567 implements MigrationInterface {
    name = 'OrgTenantAwareEntities1752264476567'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`access-level\` (\`id\` varchar(36) NOT NULL, \`accessLevelTag\` varchar(100) NOT NULL, \`permissionId\` varchar(36) NULL, UNIQUE INDEX \`REL_a62a307fb017c44986c5dda0e4\` (\`permissionId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` ADD \`accessLevelId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`roles\` ADD \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`roles\` ADD \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`roles\` ADD \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`roles\` ADD \`tenantId\` varchar(255) NOT NULL DEFAULT 'f1c59dda-1957-42f3-b80a-0848dbc2050f'`);
        await queryRunner.query(`ALTER TABLE \`organizational_unit_type\` CHANGE \`description\` \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` DROP FOREIGN KEY \`FK_86cd7f4f5d426d72204c544ac0f\``);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` CHANGE \`createdAt\` \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` CHANGE \`tenantId\` \`tenantId\` varchar(255) NOT NULL DEFAULT 'f1c59dda-1957-42f3-b80a-0848dbc2050f'`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` CHANGE \`description\` \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` CHANGE \`parentOrgId\` \`parentOrgId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`permission\` DROP FOREIGN KEY \`FK_cdb4db95384a1cf7a837c4c683e\``);
        await queryRunner.query(`ALTER TABLE \`permission\` CHANGE \`roleId\` \`roleId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`roles\` CHANGE \`description\` \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_edfbb7b43de6b461cae42e3cbe1\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_368e146b785b574f42ae9e53d5e\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`createdAt\` \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`tenantId\` \`tenantId\` varchar(255) NOT NULL DEFAULT 'f1c59dda-1957-42f3-b80a-0848dbc2050f'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`organizationalUnitId\` \`organizationalUnitId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`roleId\` \`roleId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` ADD CONSTRAINT \`FK_86cd7f4f5d426d72204c544ac0f\` FOREIGN KEY (\`parentOrgId\`) REFERENCES \`organizational_units\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` ADD CONSTRAINT \`FK_54193628bff963be1903bff5326\` FOREIGN KEY (\`accessLevelId\`) REFERENCES \`access-level\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`access-level\` ADD CONSTRAINT \`FK_a62a307fb017c44986c5dda0e43\` FOREIGN KEY (\`permissionId\`) REFERENCES \`permission\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`permission\` ADD CONSTRAINT \`FK_cdb4db95384a1cf7a837c4c683e\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_edfbb7b43de6b461cae42e3cbe1\` FOREIGN KEY (\`organizationalUnitId\`) REFERENCES \`organizational_units\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_368e146b785b574f42ae9e53d5e\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_368e146b785b574f42ae9e53d5e\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_edfbb7b43de6b461cae42e3cbe1\``);
        await queryRunner.query(`ALTER TABLE \`permission\` DROP FOREIGN KEY \`FK_cdb4db95384a1cf7a837c4c683e\``);
        await queryRunner.query(`ALTER TABLE \`access-level\` DROP FOREIGN KEY \`FK_a62a307fb017c44986c5dda0e43\``);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` DROP FOREIGN KEY \`FK_54193628bff963be1903bff5326\``);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` DROP FOREIGN KEY \`FK_86cd7f4f5d426d72204c544ac0f\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`roleId\` \`roleId\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`organizationalUnitId\` \`organizationalUnitId\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`tenantId\` \`tenantId\` varchar(255) NOT NULL DEFAULT ''default-tenant-uuid''`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`createdAt\` \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_368e146b785b574f42ae9e53d5e\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_edfbb7b43de6b461cae42e3cbe1\` FOREIGN KEY (\`organizationalUnitId\`) REFERENCES \`organizational_units\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`roles\` CHANGE \`description\` \`description\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`permission\` CHANGE \`roleId\` \`roleId\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`permission\` ADD CONSTRAINT \`FK_cdb4db95384a1cf7a837c4c683e\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` CHANGE \`parentOrgId\` \`parentOrgId\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` CHANGE \`description\` \`description\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` CHANGE \`tenantId\` \`tenantId\` varchar(255) NOT NULL DEFAULT ''default-tenant-uuid''`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` CHANGE \`createdAt\` \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` ADD CONSTRAINT \`FK_86cd7f4f5d426d72204c544ac0f\` FOREIGN KEY (\`parentOrgId\`) REFERENCES \`organizational_units\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`organizational_unit_type\` CHANGE \`description\` \`description\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`roles\` DROP COLUMN \`tenantId\``);
        await queryRunner.query(`ALTER TABLE \`roles\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`roles\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`roles\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` DROP COLUMN \`accessLevelId\``);
        await queryRunner.query(`DROP INDEX \`REL_a62a307fb017c44986c5dda0e4\` ON \`access-level\``);
        await queryRunner.query(`DROP TABLE \`access-level\``);
    }

}
