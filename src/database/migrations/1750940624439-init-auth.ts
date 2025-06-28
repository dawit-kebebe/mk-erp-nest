import { MigrationInterface, QueryRunner } from "typeorm";

export class InitAuth1750940624439 implements MigrationInterface {
    name = 'InitAuth1750940624439'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`features\` (\`id\` varchar(36) NOT NULL, \`feature_tag\` varchar(100) NOT NULL, \`description\` text NULL, UNIQUE INDEX \`IDX_550a2ac6b1e51642fef6499930\` (\`feature_tag\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`permission_actions\` (\`id\` varchar(36) NOT NULL, \`view\` tinyint NOT NULL DEFAULT 0, \`add\` tinyint NOT NULL DEFAULT 0, \`delete\` tinyint NOT NULL DEFAULT 0, \`permission_feature_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`permission_to_features\` (\`id\` varchar(36) NOT NULL, \`permission_id\` varchar(36) NULL, \`feature_id\` varchar(36) NULL, \`action_id\` varchar(36) NULL, UNIQUE INDEX \`REL_46be4efb9f62a9a1e1cd757011\` (\`action_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`permissions\` (\`id\` varchar(36) NOT NULL, \`tag\` varchar(100) NOT NULL, \`description\` text NULL, UNIQUE INDEX \`IDX_fec84f4e78c0a68776179b0da8\` (\`tag\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(100) NOT NULL, \`description\` text NULL, \`permissionId\` varchar(36) NOT NULL, UNIQUE INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`organizational_unit_type\` (\`id\` varchar(36) NOT NULL, \`tag\` varchar(100) NOT NULL, \`description\` text NULL, UNIQUE INDEX \`IDX_85f5d682791839c204f6a0e8ba\` (\`tag\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`organizational_units\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(100) NOT NULL, \`description\` text NULL, \`parentOrgId\` varchar(255) NULL, \`organizationalUnitTypeId\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_4b93bf856fbf0717aa24b1076f\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`fName\` varchar(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`lName\` varchar(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`username\` varchar(30) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`password\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`isActive\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`roleId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`organizationalUnitId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`id\` \`id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`permission_actions\` ADD CONSTRAINT \`FK_b2004dd36527950e27725deee44\` FOREIGN KEY (\`permission_feature_id\`) REFERENCES \`permission_to_features\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`permission_to_features\` ADD CONSTRAINT \`FK_f41034eb67ba03145f910f63711\` FOREIGN KEY (\`permission_id\`) REFERENCES \`permissions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`permission_to_features\` ADD CONSTRAINT \`FK_a89eb71f83f9f617b7e84a6a028\` FOREIGN KEY (\`feature_id\`) REFERENCES \`features\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`permission_to_features\` ADD CONSTRAINT \`FK_46be4efb9f62a9a1e1cd757011c\` FOREIGN KEY (\`action_id\`) REFERENCES \`permission_actions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`roles\` ADD CONSTRAINT \`FK_23a97f7d96517373f5ea98841c9\` FOREIGN KEY (\`permissionId\`) REFERENCES \`permissions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` ADD CONSTRAINT \`FK_86cd7f4f5d426d72204c544ac0f\` FOREIGN KEY (\`parentOrgId\`) REFERENCES \`organizational_units\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` ADD CONSTRAINT \`FK_f25b51d7abb4a3a6b190c477b99\` FOREIGN KEY (\`organizationalUnitTypeId\`) REFERENCES \`organizational_unit_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_368e146b785b574f42ae9e53d5e\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_edfbb7b43de6b461cae42e3cbe1\` FOREIGN KEY (\`organizationalUnitId\`) REFERENCES \`organizational_units\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_edfbb7b43de6b461cae42e3cbe1\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_368e146b785b574f42ae9e53d5e\``);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` DROP FOREIGN KEY \`FK_f25b51d7abb4a3a6b190c477b99\``);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` DROP FOREIGN KEY \`FK_86cd7f4f5d426d72204c544ac0f\``);
        await queryRunner.query(`ALTER TABLE \`roles\` DROP FOREIGN KEY \`FK_23a97f7d96517373f5ea98841c9\``);
        await queryRunner.query(`ALTER TABLE \`permission_to_features\` DROP FOREIGN KEY \`FK_46be4efb9f62a9a1e1cd757011c\``);
        await queryRunner.query(`ALTER TABLE \`permission_to_features\` DROP FOREIGN KEY \`FK_a89eb71f83f9f617b7e84a6a028\``);
        await queryRunner.query(`ALTER TABLE \`permission_to_features\` DROP FOREIGN KEY \`FK_f41034eb67ba03145f910f63711\``);
        await queryRunner.query(`ALTER TABLE \`permission_actions\` DROP FOREIGN KEY \`FK_b2004dd36527950e27725deee44\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`organizationalUnitId\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`roleId\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`isActive\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`password\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`username\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`lName\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`fName\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`name\` varchar(255) NOT NULL`);
        await queryRunner.query(`DROP INDEX \`IDX_4b93bf856fbf0717aa24b1076f\` ON \`organizational_units\``);
        await queryRunner.query(`DROP TABLE \`organizational_units\``);
        await queryRunner.query(`DROP INDEX \`IDX_85f5d682791839c204f6a0e8ba\` ON \`organizational_unit_type\``);
        await queryRunner.query(`DROP TABLE \`organizational_unit_type\``);
        await queryRunner.query(`DROP INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` ON \`roles\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
        await queryRunner.query(`DROP INDEX \`IDX_fec84f4e78c0a68776179b0da8\` ON \`permissions\``);
        await queryRunner.query(`DROP TABLE \`permissions\``);
        await queryRunner.query(`DROP INDEX \`REL_46be4efb9f62a9a1e1cd757011\` ON \`permission_to_features\``);
        await queryRunner.query(`DROP TABLE \`permission_to_features\``);
        await queryRunner.query(`DROP TABLE \`permission_actions\``);
        await queryRunner.query(`DROP INDEX \`IDX_550a2ac6b1e51642fef6499930\` ON \`features\``);
        await queryRunner.query(`DROP TABLE \`features\``);
    }

}
