import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1751978324086 implements MigrationInterface {
    name = 'Init1751978324086'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`permission\` (\`id\` varchar(36) NOT NULL, \`feature_tag\` varchar(100) NOT NULL, \`view\` tinyint NOT NULL DEFAULT 0, \`add\` tinyint NOT NULL DEFAULT 0, \`update\` tinyint NOT NULL DEFAULT 0, \`delete\` tinyint NOT NULL DEFAULT 0, \`approve\` tinyint NOT NULL DEFAULT 0, \`roleId\` varchar(36) NULL, UNIQUE INDEX \`IDX_a65b58392316a70c5936c7649c\` (\`feature_tag\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(100) NOT NULL, \`description\` text NULL, UNIQUE INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`organizational_unit_type\` (\`id\` varchar(36) NOT NULL, \`tag\` varchar(100) NOT NULL, \`description\` text NULL, UNIQUE INDEX \`IDX_85f5d682791839c204f6a0e8ba\` (\`tag\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`organizational_units\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`tenantId\` varchar(255) NOT NULL DEFAULT 'default-tenant-uuid', \`id\` varchar(36) NOT NULL, \`name\` varchar(100) NOT NULL, \`description\` text NULL, \`parentOrgId\` varchar(255) NULL, \`organizationalUnitTypeId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`tenantId\` varchar(255) NOT NULL DEFAULT 'default-tenant-uuid', \`id\` varchar(36) NOT NULL, \`fName\` varchar(100) NOT NULL, \`lName\` varchar(100) NOT NULL, \`username\` varchar(30) NOT NULL, \`password\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 0, \`roleId\` varchar(255) NULL, \`organizationalUnitId\` varchar(255) NULL, UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`permission\` ADD CONSTRAINT \`FK_cdb4db95384a1cf7a837c4c683e\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` ADD CONSTRAINT \`FK_86cd7f4f5d426d72204c544ac0f\` FOREIGN KEY (\`parentOrgId\`) REFERENCES \`organizational_units\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` ADD CONSTRAINT \`FK_f25b51d7abb4a3a6b190c477b99\` FOREIGN KEY (\`organizationalUnitTypeId\`) REFERENCES \`organizational_unit_type\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_368e146b785b574f42ae9e53d5e\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_edfbb7b43de6b461cae42e3cbe1\` FOREIGN KEY (\`organizationalUnitId\`) REFERENCES \`organizational_units\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_edfbb7b43de6b461cae42e3cbe1\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_368e146b785b574f42ae9e53d5e\``);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` DROP FOREIGN KEY \`FK_f25b51d7abb4a3a6b190c477b99\``);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` DROP FOREIGN KEY \`FK_86cd7f4f5d426d72204c544ac0f\``);
        await queryRunner.query(`ALTER TABLE \`permission\` DROP FOREIGN KEY \`FK_cdb4db95384a1cf7a837c4c683e\``);
        await queryRunner.query(`DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`organizational_units\``);
        await queryRunner.query(`DROP INDEX \`IDX_85f5d682791839c204f6a0e8ba\` ON \`organizational_unit_type\``);
        await queryRunner.query(`DROP TABLE \`organizational_unit_type\``);
        await queryRunner.query(`DROP INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` ON \`roles\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
        await queryRunner.query(`DROP INDEX \`IDX_a65b58392316a70c5936c7649c\` ON \`permission\``);
        await queryRunner.query(`DROP TABLE \`permission\``);
    }

}
