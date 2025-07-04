import { MigrationInterface, QueryRunner } from "typeorm";

export class FkUserAndOrgUnit1751663294885 implements MigrationInterface {
    name = 'FkUserAndOrgUnit1751663294885'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`organizational_units\` DROP FOREIGN KEY \`FK_86cd7f4f5d426d72204c544ac0f\``);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` DROP FOREIGN KEY \`FK_f25b51d7abb4a3a6b190c477b99\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_edfbb7b43de6b461cae42e3cbe1\``);
        await queryRunner.query(`CREATE TABLE \`organizational_units_closure\` (\`id_ancestor\` varchar(255) NOT NULL, \`id_descendant\` varchar(255) NOT NULL, INDEX \`IDX_0f73b36cc5ca17dad2a2e2f96e\` (\`id_ancestor\`), INDEX \`IDX_57a300aea4515e9d243fafbd59\` (\`id_descendant\`), PRIMARY KEY (\`id_ancestor\`, \`id_descendant\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`organizational_unit_type\` CHANGE \`description\` \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` CHANGE \`createdAt\` \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` CHANGE \`tenantId\` \`tenantId\` varchar(255) NOT NULL DEFAULT 'default-tenant-uuid'`);
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
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`createdAt\` \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`tenantId\` \`tenantId\` varchar(255) NOT NULL DEFAULT 'default-tenant-uuid'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`roleId\` \`roleId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`organizationalUnitId\` \`organizationalUnitId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` ADD CONSTRAINT \`FK_86cd7f4f5d426d72204c544ac0f\` FOREIGN KEY (\`parentOrgId\`) REFERENCES \`organizational_units\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` ADD CONSTRAINT \`FK_f25b51d7abb4a3a6b190c477b99\` FOREIGN KEY (\`organizationalUnitTypeId\`) REFERENCES \`organizational_unit_type\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`permission_actions\` ADD CONSTRAINT \`FK_b2004dd36527950e27725deee44\` FOREIGN KEY (\`permission_feature_id\`) REFERENCES \`permission_to_features\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`permission_to_features\` ADD CONSTRAINT \`FK_f41034eb67ba03145f910f63711\` FOREIGN KEY (\`permission_id\`) REFERENCES \`permissions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`permission_to_features\` ADD CONSTRAINT \`FK_a89eb71f83f9f617b7e84a6a028\` FOREIGN KEY (\`feature_id\`) REFERENCES \`features\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`permission_to_features\` ADD CONSTRAINT \`FK_46be4efb9f62a9a1e1cd757011c\` FOREIGN KEY (\`action_id\`) REFERENCES \`permission_actions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_368e146b785b574f42ae9e53d5e\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_edfbb7b43de6b461cae42e3cbe1\` FOREIGN KEY (\`organizationalUnitId\`) REFERENCES \`organizational_units\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`organizational_units_closure\` ADD CONSTRAINT \`FK_0f73b36cc5ca17dad2a2e2f96ef\` FOREIGN KEY (\`id_ancestor\`) REFERENCES \`organizational_units\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`organizational_units_closure\` ADD CONSTRAINT \`FK_57a300aea4515e9d243fafbd59d\` FOREIGN KEY (\`id_descendant\`) REFERENCES \`organizational_units\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`organizational_units_closure\` DROP FOREIGN KEY \`FK_57a300aea4515e9d243fafbd59d\``);
        await queryRunner.query(`ALTER TABLE \`organizational_units_closure\` DROP FOREIGN KEY \`FK_0f73b36cc5ca17dad2a2e2f96ef\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_edfbb7b43de6b461cae42e3cbe1\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_368e146b785b574f42ae9e53d5e\``);
        await queryRunner.query(`ALTER TABLE \`permission_to_features\` DROP FOREIGN KEY \`FK_46be4efb9f62a9a1e1cd757011c\``);
        await queryRunner.query(`ALTER TABLE \`permission_to_features\` DROP FOREIGN KEY \`FK_a89eb71f83f9f617b7e84a6a028\``);
        await queryRunner.query(`ALTER TABLE \`permission_to_features\` DROP FOREIGN KEY \`FK_f41034eb67ba03145f910f63711\``);
        await queryRunner.query(`ALTER TABLE \`permission_actions\` DROP FOREIGN KEY \`FK_b2004dd36527950e27725deee44\``);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` DROP FOREIGN KEY \`FK_f25b51d7abb4a3a6b190c477b99\``);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` DROP FOREIGN KEY \`FK_86cd7f4f5d426d72204c544ac0f\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`organizationalUnitId\` \`organizationalUnitId\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`roleId\` \`roleId\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`tenantId\` \`tenantId\` varchar(255) NOT NULL DEFAULT ''f1c59dda-1957-42f3-b80a-0848dbc2050f''`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`createdAt\` \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
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
        await queryRunner.query(`ALTER TABLE \`organizational_units\` CHANGE \`tenantId\` \`tenantId\` varchar(255) NOT NULL DEFAULT ''f1c59dda-1957-42f3-b80a-0848dbc2050f''`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` CHANGE \`createdAt\` \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`organizational_unit_type\` CHANGE \`description\` \`description\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`DROP INDEX \`IDX_57a300aea4515e9d243fafbd59\` ON \`organizational_units_closure\``);
        await queryRunner.query(`DROP INDEX \`IDX_0f73b36cc5ca17dad2a2e2f96e\` ON \`organizational_units_closure\``);
        await queryRunner.query(`DROP TABLE \`organizational_units_closure\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_edfbb7b43de6b461cae42e3cbe1\` FOREIGN KEY (\`organizationalUnitId\`) REFERENCES \`organizational_units\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` ADD CONSTRAINT \`FK_f25b51d7abb4a3a6b190c477b99\` FOREIGN KEY (\`organizationalUnitTypeId\`) REFERENCES \`organizational_unit_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` ADD CONSTRAINT \`FK_86cd7f4f5d426d72204c544ac0f\` FOREIGN KEY (\`parentOrgId\`) REFERENCES \`organizational_units\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
