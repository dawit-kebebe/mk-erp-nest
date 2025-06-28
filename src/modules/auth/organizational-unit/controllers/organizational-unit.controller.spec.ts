import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationalUnitController } from './organizational-unit.controller';

describe('OrganizationalUnitController', () => {
  let controller: OrganizationalUnitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationalUnitController],
    }).compile();

    controller = module.get<OrganizationalUnitController>(OrganizationalUnitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
