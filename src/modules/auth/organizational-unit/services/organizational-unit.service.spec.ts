import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationalUnitService } from './organizational-unit.service';

describe('OrganizationalUnitService', () => {
  let service: OrganizationalUnitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationalUnitService],
    }).compile();

    service = module.get<OrganizationalUnitService>(OrganizationalUnitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
