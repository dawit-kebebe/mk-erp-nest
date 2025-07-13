import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowDefinitionController } from './workflow-definition.controller';
import { WorkflowDefinitionService } from '../services/workflow-definition.service';

describe('WorkflowDefinitionController', () => {
  let controller: WorkflowDefinitionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkflowDefinitionController],
      providers: [WorkflowDefinitionService],
    }).compile();

    controller = module.get<WorkflowDefinitionController>(WorkflowDefinitionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
