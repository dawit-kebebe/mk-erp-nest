import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1752366491715 implements MigrationInterface {
    name = 'Init1752366491715'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`roles\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`tenantId\` varchar(255) NOT NULL DEFAULT 'f1c59dda-1957-42f3-b80a-0848dbc2050f', \`id\` varchar(36) NOT NULL, \`name\` varchar(100) NOT NULL, \`description\` text NULL, UNIQUE INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`permission\` (\`id\` varchar(36) NOT NULL, \`feature_tag\` varchar(100) NOT NULL, \`view\` tinyint NOT NULL DEFAULT 0, \`add\` tinyint NOT NULL DEFAULT 0, \`update\` tinyint NOT NULL DEFAULT 0, \`delete\` tinyint NOT NULL DEFAULT 0, \`approve\` tinyint NOT NULL DEFAULT 0, \`roleId\` varchar(36) NULL, UNIQUE INDEX \`IDX_a65b58392316a70c5936c7649c\` (\`feature_tag\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`access-level\` (\`id\` varchar(36) NOT NULL, \`accessLevelTag\` varchar(100) NOT NULL, \`permissionId\` varchar(36) NULL, UNIQUE INDEX \`REL_a62a307fb017c44986c5dda0e4\` (\`permissionId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`organizational_unit_type\` (\`id\` varchar(36) NOT NULL, \`tag\` varchar(100) NOT NULL, \`description\` text NULL, UNIQUE INDEX \`IDX_85f5d682791839c204f6a0e8ba\` (\`tag\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`organizational_units\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`tenantId\` varchar(255) NOT NULL DEFAULT 'f1c59dda-1957-42f3-b80a-0848dbc2050f', \`id\` varchar(36) NOT NULL, \`name\` varchar(100) NOT NULL, \`description\` text NULL, \`parentOrgId\` varchar(255) NULL, \`organizationalUnitTypeId\` varchar(255) NOT NULL, \`accessLevelId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`tenantId\` varchar(255) NOT NULL DEFAULT 'f1c59dda-1957-42f3-b80a-0848dbc2050f', \`organizationalUnitId\` varchar(255) NOT NULL, \`id\` varchar(36) NOT NULL, \`fName\` varchar(100) NOT NULL, \`lName\` varchar(100) NOT NULL, \`username\` varchar(30) NOT NULL, \`password\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 0, \`roleId\` varchar(255) NULL, UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`workflow_instances\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`tenantId\` varchar(255) NOT NULL DEFAULT 'f1c59dda-1957-42f3-b80a-0848dbc2050f', \`id\` varchar(36) NOT NULL, \`workflowDefinitionId\` varchar(255) NOT NULL, \`entityId\` varchar(255) NOT NULL, \`entityType\` varchar(100) NOT NULL, \`status\` enum ('IN_PROGRESS', 'COMPLETED', 'REJECTED', 'CANCELLED', 'NEEDS_REVISION') NOT NULL DEFAULT 'IN_PROGRESS', \`currentStepId\` varchar(255) NULL, \`submittedByUserId\` varchar(255) NOT NULL, \`submissionDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`completionDate\` timestamp NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`workflow_definitions\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`tenantId\` varchar(255) NOT NULL DEFAULT 'f1c59dda-1957-42f3-b80a-0848dbc2050f', \`organizationalUnitId\` varchar(255) NOT NULL, \`id\` varchar(36) NOT NULL, \`name\` varchar(200) NOT NULL, \`description\` text NULL, \`appliesToFeature\` enum ('User', 'Role', 'Organizational Unit', 'Budget Plan') NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`workflow_step_definitions\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`tenantId\` varchar(255) NOT NULL DEFAULT 'f1c59dda-1957-42f3-b80a-0848dbc2050f', \`id\` varchar(36) NOT NULL, \`stepOrder\` int NOT NULL, \`stepName\` varchar(200) NOT NULL, \`description\` text NULL, \`approvalStrategy\` enum ('ALL_MUST_APPROVE', 'ONE_OF_MANY', 'MAJORITY') NOT NULL, \`workflowDefinitionId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`workflow_tasks\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`tenantId\` varchar(255) NOT NULL DEFAULT 'f1c59dda-1957-42f3-b80a-0848dbc2050f', \`id\` varchar(36) NOT NULL, \`workflowStepDefinitionId\` varchar(255) NOT NULL, \`workflowInstanceId\` varchar(255) NOT NULL, \`status\` enum ('IN_PROGRESS', 'COMPLETED', 'REJECTED', 'CANCELLED', 'NEEDS_REVISION') NOT NULL DEFAULT 'IN_PROGRESS', \`actedByUserId\` varchar(255) NULL, \`actionDate\` timestamp NULL, \`comments\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`workflow_step_required_roles\` (\`workflowStepDefinitionId\` varchar(36) NOT NULL, \`roleId\` varchar(36) NOT NULL, INDEX \`IDX_b1bbeb6c504b6fa0b042860ce2\` (\`workflowStepDefinitionId\`), INDEX \`IDX_256ee1d42b2823048195d09b56\` (\`roleId\`), PRIMARY KEY (\`workflowStepDefinitionId\`, \`roleId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`permission\` ADD CONSTRAINT \`FK_cdb4db95384a1cf7a837c4c683e\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`access-level\` ADD CONSTRAINT \`FK_a62a307fb017c44986c5dda0e43\` FOREIGN KEY (\`permissionId\`) REFERENCES \`permission\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` ADD CONSTRAINT \`FK_86cd7f4f5d426d72204c544ac0f\` FOREIGN KEY (\`parentOrgId\`) REFERENCES \`organizational_units\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` ADD CONSTRAINT \`FK_f25b51d7abb4a3a6b190c477b99\` FOREIGN KEY (\`organizationalUnitTypeId\`) REFERENCES \`organizational_unit_type\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` ADD CONSTRAINT \`FK_54193628bff963be1903bff5326\` FOREIGN KEY (\`accessLevelId\`) REFERENCES \`access-level\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_edfbb7b43de6b461cae42e3cbe1\` FOREIGN KEY (\`organizationalUnitId\`) REFERENCES \`organizational_units\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_368e146b785b574f42ae9e53d5e\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`workflow_instances\` ADD CONSTRAINT \`FK_4b377f691b22b8ae05721074dbd\` FOREIGN KEY (\`workflowDefinitionId\`) REFERENCES \`workflow_definitions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`workflow_instances\` ADD CONSTRAINT \`FK_6a2de91f9e14fea35af8850c396\` FOREIGN KEY (\`currentStepId\`) REFERENCES \`workflow_step_definitions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`workflow_instances\` ADD CONSTRAINT \`FK_fa0af519a8010a0ca4db07cb81d\` FOREIGN KEY (\`submittedByUserId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`workflow_definitions\` ADD CONSTRAINT \`FK_2d8eb9c88c90945caa69c1c15fb\` FOREIGN KEY (\`organizationalUnitId\`) REFERENCES \`organizational_units\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`workflow_step_definitions\` ADD CONSTRAINT \`FK_c596151efc2631d8e36ff3037a0\` FOREIGN KEY (\`workflowDefinitionId\`) REFERENCES \`workflow_definitions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`workflow_tasks\` ADD CONSTRAINT \`FK_01a7addec613445c0546cfe7beb\` FOREIGN KEY (\`workflowStepDefinitionId\`) REFERENCES \`workflow_step_definitions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`workflow_tasks\` ADD CONSTRAINT \`FK_ad3ec6b522a904b04a78a01d696\` FOREIGN KEY (\`workflowInstanceId\`) REFERENCES \`workflow_instances\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`workflow_tasks\` ADD CONSTRAINT \`FK_9e9d831a0152ca9981ffc2f9b09\` FOREIGN KEY (\`actedByUserId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`workflow_step_required_roles\` ADD CONSTRAINT \`FK_b1bbeb6c504b6fa0b042860ce2a\` FOREIGN KEY (\`workflowStepDefinitionId\`) REFERENCES \`workflow_step_definitions\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`workflow_step_required_roles\` ADD CONSTRAINT \`FK_256ee1d42b2823048195d09b561\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`workflow_step_required_roles\` DROP FOREIGN KEY \`FK_256ee1d42b2823048195d09b561\``);
        await queryRunner.query(`ALTER TABLE \`workflow_step_required_roles\` DROP FOREIGN KEY \`FK_b1bbeb6c504b6fa0b042860ce2a\``);
        await queryRunner.query(`ALTER TABLE \`workflow_tasks\` DROP FOREIGN KEY \`FK_9e9d831a0152ca9981ffc2f9b09\``);
        await queryRunner.query(`ALTER TABLE \`workflow_tasks\` DROP FOREIGN KEY \`FK_ad3ec6b522a904b04a78a01d696\``);
        await queryRunner.query(`ALTER TABLE \`workflow_tasks\` DROP FOREIGN KEY \`FK_01a7addec613445c0546cfe7beb\``);
        await queryRunner.query(`ALTER TABLE \`workflow_step_definitions\` DROP FOREIGN KEY \`FK_c596151efc2631d8e36ff3037a0\``);
        await queryRunner.query(`ALTER TABLE \`workflow_definitions\` DROP FOREIGN KEY \`FK_2d8eb9c88c90945caa69c1c15fb\``);
        await queryRunner.query(`ALTER TABLE \`workflow_instances\` DROP FOREIGN KEY \`FK_fa0af519a8010a0ca4db07cb81d\``);
        await queryRunner.query(`ALTER TABLE \`workflow_instances\` DROP FOREIGN KEY \`FK_6a2de91f9e14fea35af8850c396\``);
        await queryRunner.query(`ALTER TABLE \`workflow_instances\` DROP FOREIGN KEY \`FK_4b377f691b22b8ae05721074dbd\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_368e146b785b574f42ae9e53d5e\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_edfbb7b43de6b461cae42e3cbe1\``);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` DROP FOREIGN KEY \`FK_54193628bff963be1903bff5326\``);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` DROP FOREIGN KEY \`FK_f25b51d7abb4a3a6b190c477b99\``);
        await queryRunner.query(`ALTER TABLE \`organizational_units\` DROP FOREIGN KEY \`FK_86cd7f4f5d426d72204c544ac0f\``);
        await queryRunner.query(`ALTER TABLE \`access-level\` DROP FOREIGN KEY \`FK_a62a307fb017c44986c5dda0e43\``);
        await queryRunner.query(`ALTER TABLE \`permission\` DROP FOREIGN KEY \`FK_cdb4db95384a1cf7a837c4c683e\``);
        await queryRunner.query(`DROP INDEX \`IDX_256ee1d42b2823048195d09b56\` ON \`workflow_step_required_roles\``);
        await queryRunner.query(`DROP INDEX \`IDX_b1bbeb6c504b6fa0b042860ce2\` ON \`workflow_step_required_roles\``);
        await queryRunner.query(`DROP TABLE \`workflow_step_required_roles\``);
        await queryRunner.query(`DROP TABLE \`workflow_tasks\``);
        await queryRunner.query(`DROP TABLE \`workflow_step_definitions\``);
        await queryRunner.query(`DROP TABLE \`workflow_definitions\``);
        await queryRunner.query(`DROP TABLE \`workflow_instances\``);
        await queryRunner.query(`DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`organizational_units\``);
        await queryRunner.query(`DROP INDEX \`IDX_85f5d682791839c204f6a0e8ba\` ON \`organizational_unit_type\``);
        await queryRunner.query(`DROP TABLE \`organizational_unit_type\``);
        await queryRunner.query(`DROP INDEX \`REL_a62a307fb017c44986c5dda0e4\` ON \`access-level\``);
        await queryRunner.query(`DROP TABLE \`access-level\``);
        await queryRunner.query(`DROP INDEX \`IDX_a65b58392316a70c5936c7649c\` ON \`permission\``);
        await queryRunner.query(`DROP TABLE \`permission\``);
        await queryRunner.query(`DROP INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` ON \`roles\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
    }

}
