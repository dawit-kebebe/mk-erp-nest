import { OrganizationalUnit } from '@mk/database/entities/organizational-unit.entity';
import { Role } from '@mk/database/entities/role.entity';
import { WorkflowDefinition } from '@mk/database/entities/workflow-definition.entity';
import { WorkflowInstance } from '@mk/database/entities/workflow-instance.entity';
import { WorkflowDefinitionService } from '@mk/modules/workflow/services/workflow-definition.service';
import { WorkflowInstanceService } from '@mk/modules/workflow/services/workflow-intance.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContextModule } from './context.module';
@Module({
    imports: [
        ContextModule,
        TypeOrmModule.forFeature([
            Role, OrganizationalUnit, WorkflowDefinition, WorkflowInstance
        ]),
        JwtModule
    ],
    providers: [WorkflowDefinitionService, WorkflowInstanceService],
    exports: [
        TypeOrmModule.forFeature([
            Role, OrganizationalUnit, WorkflowDefinition, WorkflowInstance
        ]),
        WorkflowDefinitionService, WorkflowInstanceService, JwtModule
    ],
})
export class DependanciesModule { }
