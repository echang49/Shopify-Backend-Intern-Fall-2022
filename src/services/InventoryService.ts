import {LowSync} from 'lowdb';
import {v4 as uuidv4} from 'uuid';
import {Get, Post, Put, Delete, Route, Query, Body} from 'tsoa';

import config from '../config';
import Database from '../databases/database';
import {
  InventoryCreationParams,
  InventoryEditParams,
} from '../models/RequestParams';
import InventoryInterface from '../models/InventoryInterface';
import ItemDTO from '../models/ItemDTO';

@Route('/api/inventory')
class InventoryService implements InventoryInterface {
  private ITEMS: LowSync<any>;
  private DELETED_ITEMS: LowSync<any>;

  constructor() {
    this.ITEMS = Database.getCollection(config.ITEM_DATABASE);
    this.DELETED_ITEMS = Database.getCollection(config.DELETED_ITEM_DATABASE);
  }

  @Get('/')
  public getItem(@Query() uuid: string): ItemDTO {
    const result: ItemDTO[] = this.ITEMS.data.filter(
      (element: ItemDTO) => element.uuid === uuid,
    );
    return result[0];
  }

  @Get('/items')
  public getItems(@Query() category: string): ItemDTO[] {
    const result: ItemDTO[] = this.ITEMS.data.filter(
      (element: ItemDTO) => element.category === category,
    );
    return result;
  }

  @Post('/')
  public createItem(@Body() params: InventoryCreationParams): ItemDTO {
    const item: ItemDTO = {
      uuid: uuidv4(),
      name: params.name,
      category: params.category,
      count: params.count,
    };
    if (isNaN(params.count)) item.count = 0;
    this.ITEMS.data.push(item);
    Database.write(this.ITEMS);
    return item;
  }

  @Put('/')
  public editItem(@Body() params: InventoryEditParams): ItemDTO {
    const index = this.ITEMS.data.findIndex(
      (element: ItemDTO) => element.uuid === params.uuid,
    );
    if (index === -1) {
      throw new Error('Improper item uuid');
    }

    let key: keyof typeof params;
    for (key in params) {
      if (params[key] !== undefined) this.ITEMS.data[index][key] = params[key];
    }

    Database.write(this.ITEMS);

    return this.ITEMS.data[index];
  }

  @Delete('/')
  public deleteItem(@Body() uuid: string): void {
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
