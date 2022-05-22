import config from "../config";
import Database from "../databases/database";
import InventoryService from "./InventoryService";
import IShipmentService from "../models/IShipmentService";
import ItemDTO from "../models/ItemDTO";
import { LowSync } from "lowdb";
import ShipmentDTO from "../models/ShipmentDTO";
import { v4 as uuidv4 } from 'uuid';

class ShipmentService implements IShipmentService {
    private items:LowSync<any>;
    private shipments:LowSync<any>;
    private inventoryService:InventoryService;

    constructor() {
        this.items = Database.getCollection(config.ITEM_DATABASE);
        this.shipments = Database.getCollection(config.SHIPMENT_DATABASE);
        this.inventoryService = new InventoryService();
    }

    createShipment(name: string, items: ItemDTO[]): ShipmentDTO {
        let shipment:ShipmentDTO = { uuid: uuidv4(), name, items: [] };
        for(let item of items) {
            let itemToValidate = this.inventoryService.getItem(item.uuid);
            if(itemToValidate === undefined) throw new Error("Invalid item to add onto shipment");
            if(!isNaN(Number(item.count)) && itemToValidate.count < Number(item.count)) throw new Error("Invalid count of item to add onto shipment");
        }
        
        for(let item of items) {
            let index = this.items.data.findIndex((element:ItemDTO) => element.uuid === item.uuid);
            this.items.data[index].count = this.items.data[index].count - Number(item.count);
            
            let order:ItemDTO = Object.assign({}, this.items.data[index]);
            order.count = Number(item.count);
            shipment.items.push(order);
        }
        Database.write(this.items);

        this.shipments.data.push(shipment);
        Database.write(this.shipments);

        return shipment;
    }

    getShipment(uuid: string): ShipmentDTO {
        let result:ShipmentDTO[] = this.shipments.data.filter((element:ShipmentDTO) => element.uuid === uuid);
        return result[0];
    }
}

export default ShipmentService;