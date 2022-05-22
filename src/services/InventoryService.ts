import {LowSync} from 'lowdb';
import {v4 as uuidv4} from 'uuid';

import config from '../config';
import Database from '../databases/database';
import InventoryInterface from '../models/InventoryInterface';
import ItemDTO from '../models/ItemDTO';

class InventoryService implements InventoryInterface {
  private ITEMS: LowSync<any>;
  private DELETED_ITEMS: LowSync<any>;

  constructor() {
    this.ITEMS = Database.getCollection(config.ITEM_DATABASE);
    this.DELETED_ITEMS = Database.getCollection(config.DELETED_ITEM_DATABASE);
  }

  public getItem(uuid: string): ItemDTO {
    const result: ItemDTO[] = this.ITEMS.data.filter(
      (element: ItemDTO) => element.uuid === uuid,
    );
    return result[0];
  }

  public getItems(category?: string | undefined): ItemDTO[] {
    const result: ItemDTO[] = this.ITEMS.data.filter(
      (element: ItemDTO) => element.category === category,
    );
    return result;
  }

  public createItem(name: string, category: string, count: number): ItemDTO {
    const item: ItemDTO = {uuid: uuidv4(), name, category, count};
    if (isNaN(count)) item.count = 0;
    this.ITEMS.data.push(item);
    Database.write(this.ITEMS);
    return item;
  }

  public editItem(item: ItemDTO): ItemDTO {
    const index = this.ITEMS.data.findIndex(
      (element: ItemDTO) => element.uuid === item.uuid,
    );
    if (index === -1) {
      throw new Error('Improper item uuid');
    }

    let key: keyof typeof item;
    for (key in item) {
      if (item[key] !== undefined) this.ITEMS.data[index][key] = item[key];
    }

    Database.write(this.ITEMS);

    return this.ITEMS.data[index];
  }

  public deleteItem(uuid: string): void {
    const index = this.ITEMS.data.findIndex(
      (element: ItemDTO) => element.uuid === uuid,
    );
    if (index === -1) {
      throw new Error('Improper item uuid');
    }

    const item: ItemDTO[] = this.ITEMS.data.splice(index, 1);
    Database.write(this.ITEMS);

    this.DELETED_ITEMS.data.push(item[0]);
    Database.write(this.DELETED_ITEMS);
  }
}

export default InventoryService;
