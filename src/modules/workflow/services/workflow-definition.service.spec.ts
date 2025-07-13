import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowDefinitionService } from './workflow-definition.service';

describe('WorkflowDefinitionService', () => {
  let service: WorkflowDefinitionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkflowDefinitionService],
    }).compile();

    service = module.get<WorkflowDefinitionService>(WorkflowDefinitionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
