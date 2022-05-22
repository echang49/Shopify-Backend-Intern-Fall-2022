import config from "../config";
import Database from "../databases/database";
import IInventoryService from "../models/IInventoryService";
import ItemDTO from "../models/ItemDTO";
import { LowSync } from "lowdb";
import { v4 as uuidv4 } from 'uuid';

class InventoryService implements IInventoryService {
    private items:LowSync<any>;
    private deleted_items:LowSync<any>;

    constructor() {
        this.items = Database.getCollection(config.ITEM_DATABASE);
        this.deleted_items = Database.getCollection(config.DELETED_ITEM_DATABASE);
    }

    getItem(uuid: string): ItemDTO {
        let result:ItemDTO[] = this.items.data.filter((element:ItemDTO) => element.uuid === uuid);
        return result[0];
    }

    getItems(category?: string | undefined): ItemDTO[] {
        let result:ItemDTO[] = this.items.data.filter((element:ItemDTO) => element.category === category);
        return result;
    }

    createItem(name: string, category: string, count: number): ItemDTO {
        if(isNaN(count)) count = 0;

        let item:ItemDTO = { uuid: uuidv4(), name, category, count };
        this.items.data.push(item);
        Database.write(this.items);
        return item;
    }

    editItem(item: ItemDTO): ItemDTO {
        let index = this.items.data.findIndex((element:ItemDTO) => element.uuid === item.uuid);
        if(index === -1) {
            throw new Error("Improper item uuid");
        }

        if(item.name !== undefined) this.items.data[index].name = item.name;
        if(item.category !== undefined) this.items.data[index].category = item.category;
        if(item.count !== undefined && !isNaN(item.count)) this.items.data[index].count = item.count;

        Database.write(this.items);

        return this.items.data[index];
    }

    deleteItem(uuid: string): void {
        let index = this.items.data.findIndex((element:ItemDTO) => element.uuid === uuid);
        if(index === -1) {
            throw new Error("Improper item uuid");
        }

        let item:ItemDTO[] = this.items.data.splice(index, 1);
        Database.write(this.items);

        this.deleted_items.data.push(item[0]);
        Database.write(this.deleted_items);
    }
}

export default InventoryService;