import { MigrationInterface, QueryRunner } from "typeorm";

export class TenantAdded1751275156788 implements MigrationInterface {
    name = 'TenantAdded1751275156788'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`tenantId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`organizational_unit_type\` CHANGE \`description\` \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` DROP FOREIGN KEY \`FK_86cd7f4f5d426d72204c544ac0f\``);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` CHANGE \`createdAt\` \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` CHANGE \`description\` \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` CHANGE \`parentOrgId\` \`parentOrgId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`features\` CHANGE \`description\` \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`permission_actions\` DROP FOREIGN KEY \`FK_b2004dd36527950e27725deee44\``);
        await queryRunner.query(`ALTER TABLE \`permission_actions\` CHANGE \`permission_feature_id\` \`permission_feature_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`permission_to_features\` DROP FOREIGN KEY \`FK_f41034eb67ba03145f910f63711\``);
        await queryRunner.query(`ALTER TABLE \`permission_to_features\` DROP FOREIGN KEY \`FK_a89eb71f83f9f617b7e84a6a028\``);
        await queryRunner.query(`ALTER TABLE \`permission_to_features\` DROP FOREIGN KEY \`FK_46be4efb9f62a9a1e1cd757011c\``);
        await queryRunner.query(`ALTER TABLE \`permission_to_features\` CHANGE \`permission_id\` \`permission_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`permission_to_features\` CHANGE \`feature_id\` \`feature_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`permission_to_features\` CHANGE \`action_id\` \`action_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`permissions\` CHANGE \`description\` \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`roles\` CHANGE \`description\` \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_368e146b785b574f42ae9e53d5e\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_edfbb7b43de6b461cae42e3cbe1\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`createdAt\` \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`roleId\` \`roleId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`organizationalUnitId\` \`organizationalUnitId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` ADD CONSTRAINT \`FK_86cd7f4f5d426d72204c544ac0f\` FOREIGN KEY (\`parentOrgId\`) REFERENCES \`organizational_units\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`permission_actions\` ADD CONSTRAINT \`FK_b2004dd36527950e27725deee44\` FOREIGN KEY (\`permission_feature_id\`) REFERENCES \`permission_to_features\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`permission_to_features\` ADD CONSTRAINT \`FK_f41034eb67ba03145f910f63711\` FOREIGN KEY (\`permission_id\`) REFERENCES \`permissions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`permission_to_features\` ADD CONSTRAINT \`FK_a89eb71f83f9f617b7e84a6a028\` FOREIGN KEY (\`feature_id\`) REFERENCES \`features\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`permission_to_features\` ADD CONSTRAINT \`FK_46be4efb9f62a9a1e1cd757011c\` FOREIGN KEY (\`action_id\`) REFERENCES \`permission_actions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_368e146b785b574f42ae9e53d5e\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_edfbb7b43de6b461cae42e3cbe1\` FOREIGN KEY (\`organizationalUnitId\`) REFERENCES \`organizational_units\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_edfbb7b43de6b461cae42e3cbe1\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_368e146b785b574f42ae9e53d5e\``);
        await queryRunner.query(`ALTER TABLE \`permission_to_features\` DROP FOREIGN KEY \`FK_46be4efb9f62a9a1e1cd757011c\``);
        await queryRunner.query(`ALTER TABLE \`permission_to_features\` DROP FOREIGN KEY \`FK_a89eb71f83f9f617b7e84a6a028\``);
        await queryRunner.query(`ALTER TABLE \`permission_to_features\` DROP FOREIGN KEY \`FK_f41034eb67ba03145f910f63711\``);
        await queryRunner.query(`ALTER TABLE \`permission_actions\` DROP FOREIGN KEY \`FK_b2004dd36527950e27725deee44\``);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` DROP FOREIGN KEY \`FK_86cd7f4f5d426d72204c544ac0f\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`organizationalUnitId\` \`organizationalUnitId\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`roleId\` \`roleId\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`createdAt\` \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_edfbb7b43de6b461cae42e3cbe1\` FOREIGN KEY (\`organizationalUnitId\`) REFERENCES \`organizational_units\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_368e146b785b574f42ae9e53d5e\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`roles\` CHANGE \`description\` \`description\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`permissions\` CHANGE \`description\` \`description\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`permission_to_features\` CHANGE \`action_id\` \`action_id\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`permission_to_features\` CHANGE \`feature_id\` \`feature_id\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`permission_to_features\` CHANGE \`permission_id\` \`permission_id\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`permission_to_features\` ADD CONSTRAINT \`FK_46be4efb9f62a9a1e1cd757011c\` FOREIGN KEY (\`action_id\`) REFERENCES \`permission_actions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`permission_to_features\` ADD CONSTRAINT \`FK_a89eb71f83f9f617b7e84a6a028\` FOREIGN KEY (\`feature_id\`) REFERENCES \`features\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`permission_to_features\` ADD CONSTRAINT \`FK_f41034eb67ba03145f910f63711\` FOREIGN KEY (\`permission_id\`) REFERENCES \`permissions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`permission_actions\` CHANGE \`permission_feature_id\` \`permission_feature_id\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`permission_actions\` ADD CONSTRAINT \`FK_b2004dd36527950e27725deee44\` FOREIGN KEY (\`permission_feature_id\`) REFERENCES \`permission_to_features\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`features\` CHANGE \`description\` \`description\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` CHANGE \`parentOrgId\` \`parentOrgId\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` CHANGE \`description\` \`description\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` CHANGE \`createdAt\` \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` ADD CONSTRAINT \`FK_86cd7f4f5d426d72204c544ac0f\` FOREIGN KEY (\`parentOrgId\`) REFERENCES \`organizational_units\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`organizational_unit_type\` CHANGE \`description\` \`description\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`tenantId\``);
    }

}
