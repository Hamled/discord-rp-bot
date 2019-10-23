import {EntityManager, Connection} from 'typeorm';

export class FakeEntityManager extends EntityManager {
  public readonly savedEntities: any[] = [];

  constructor() {
    super((null as unknown) as Connection);
  }

  save(entity: any): Promise<any> {
    this.savedEntities.push(entity);

    entity.id = this.savedEntities.length;
    return entity;
  }
}
