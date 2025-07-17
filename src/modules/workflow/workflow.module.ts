import { Module } from '@nestjs/common';
import { WorkflowDefinitionService } from './services/workflow-definition.service';
import { WorkflowDefinitionController } from './controllers/workflow-definition.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowDefinition } from '@mk/database/entities/workflow-definition.entity';
import { WorkflowStepDefinition } from '@mk/database/entities/workflow-step-definition.entity';
import { OrganizationalUnit } from '@mk/database/entities/organizational-unit.entity';
import { ContextModule } from '@mk/common/modules/context.module';
import { DependanciesModule } from '@mk/common/modules/dependancies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WorkflowDefinition,
      WorkflowStepDefinition,
      OrganizationalUnit
    ]),
    ContextModule,
    DependanciesModule
  ],
  controllers: [WorkflowDefinitionController],
  providers: [WorkflowDefinitionService],
})
export class WorkflowModule {}
