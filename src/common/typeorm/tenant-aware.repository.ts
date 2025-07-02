import { ObjectLiteral, Repository } from 'typeorm';

export class TenantBaseRepository<T extends ObjectLiteral> extends Repository<T> {
  findWithTenant(tenantId: string, options?: any) {
    return this.find({ ...options, where: { ...options?.where, tenantId } });
  }
}