import {LowSync} from 'lowdb';
import {v4 as uuidv4} from 'uuid';
import {Get, Post, Put, Delete, Route, Query, Body} from 'tsoa';

import config from '../config';
import Database from '../databases/database';
import {
  InventoryCreationParams,
  InventoryEditParams,
  InventoryDeleteParams,
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

  /**
   * Retrieves the details of an existing item.
   * Supply the unique item ID and receive corresponding item details.
   */
  @Get('/')
  public getItem(@Query() uuid: string): ItemDTO {
    const result: ItemDTO[] = this.ITEMS.data.filter(
      (element: ItemDTO) => element.uuid === uuid,
    );
    return result[0];
  }

  /**
   * Retrieves the details of a list of existing items.
   * Supply the category and receive a corresponding list of item details.
   */
  @Get('/items')
  public getItems(@Query() category: string): ItemDTO[] {
    const result: ItemDTO[] = this.ITEMS.data.filter(
      (element: ItemDTO) => element.category === category,
    );
    return result;
  }

  /**
   * Creates a new item based on the name, category, and count.
   * Returns the new corresponding item details.
   */
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

  /**
   * Edits an existing item based on the unique item ID.
   * Returns the new corresponding item details.
   * "uuid" is required but "name", "category", and "count" are optional.
   */
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

  /**
   * Deletes an existing item based on the unique item ID.
   * Deleted items are stored in a seperate database collection for deleted items.
   */
  @Delete('/')
  public deleteItem(@Body() params: InventoryDeleteParams): void {
    const index = this.ITEMS.data.findIndex(
      (element: ItemDTO) => element.uuid === params.uuid,
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
