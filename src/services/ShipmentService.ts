import {Get, Post, Route, Query, Body} from 'tsoa';
import {LowSync} from 'lowdb';
import {v4 as uuidv4} from 'uuid';

import config from '../config';
import Database from '../databases/database';
import ItemDTO from '../models/ItemDTO';
import {ShipmentCreationParams} from '../models/RequestParams';
import ShipmentDTO from '../models/ShipmentDTO';
import ShipmentInterface from '../models/ShipmentInterface';

import InventoryService from './InventoryService';

@Route('/api/shipment')
class ShipmentService implements ShipmentInterface {
  private ITEMS: LowSync<any>;
  private SHIPMENTS: LowSync<any>;
  private inventoryService: InventoryService;

  constructor() {
    this.ITEMS = Database.getCollection(config.ITEM_DATABASE);
    this.SHIPMENTS = Database.getCollection(config.SHIPMENT_DATABASE);
    this.inventoryService = new InventoryService();
  }

  @Post('/')
  public createShipment(@Body() params: ShipmentCreationParams): ShipmentDTO {
    const shipment: ShipmentDTO = {
      uuid: uuidv4(),
      name: params.name,
      items: [],
    };
    this.validateItems(params.items);

    for (const item of params.items) {
      const index = this.ITEMS.data.findIndex(
        (element: ItemDTO) => element.uuid === item.uuid,
      );
      this.ITEMS.data[index].count -= Number(item.count);

      const order: ItemDTO = {...this.ITEMS.data[index]};
      order.count = Number(item.count);
      shipment.items.push(order);
    }
    Database.write(this.ITEMS);

    this.SHIPMENTS.data.push(shipment);
    Database.write(this.SHIPMENTS);

    return shipment;
  }

  @Get('/')
  public getShipment(@Query() uuid: string): ShipmentDTO {
    const result: ShipmentDTO[] = this.SHIPMENTS.data.filter(
      (element: ShipmentDTO) => element.uuid === uuid,
    );
    return result[0];
  }

  private validateItems(items: ItemDTO[]): void {
    for (const item of items) {
      const itemToValidate = this.inventoryService.getItem(item.uuid);
      if (itemToValidate === undefined)
        throw new Error('Invalid item to add onto shipment');
      if (
        !isNaN(Number(item.count)) &&
        itemToValidate.count !== undefined &&
        itemToValidate.count < Number(item.count)
      )
        throw new Error('Invalid count of item to add onto shipment');
    }
  }
}

export default ShipmentService;
