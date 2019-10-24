import {EntityManager, Connection} from 'typeorm';

export class FakeEntityManager extends EntityManager {
  public readonly savedEntities: any[] = [];

  constructor() {
    super((null as unknown) as Connection);
  }

  save(entity: any | any[]): Promise<any> {
    if(Array.isArray(entity)) {
      entity.forEach(e => this.saveInternal(e));
    } else {
      this.saveInternal(entity);
    }

    return entity;
  }

  private saveInternal(entity: any): void {
    this.savedEntities.push(entity);
    entity.id = this.savedEntities.length;
  }
}
