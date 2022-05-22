import express, { Request, Response } from 'express';
import InventoryService from '../services/InventoryService';
import ItemDTO from '../models/ItemDTO';

export module Inventory {
    export const router = express.Router();

    const inventoryService:InventoryService = new InventoryService();
    
    router.get('/', (req:Request, res:Response) => {
        let { category, uuid } = req.query;
        
        let items:ItemDTO[] = [];
        if(typeof uuid === "string") {
            items = [ inventoryService.getItem(uuid) ];
        }
        else if(typeof category === "string") {
            items = inventoryService.getItems(category);
        }
  
        return res.send(items);
    });

    router.post('/', (req:Request, res:Response) => {
        let { name, category, count } = req.body;
        const item:ItemDTO = inventoryService.createItem(name, category, Number(count));
        return res.send(item);
    });

    router.put('/', (req:Request, res:Response) => {
        let { uuid, name, category, count } = req.body;
        if( typeof uuid !== "string") return res.status(400).send("Need valid uuid for updating");
        count = Number(count);
        let item:ItemDTO = { uuid, name, category, count };
        item = inventoryService.editItem(item);
        res.send(item);
    });

    router.delete('/', (req:Request, res:Response) => {
        let { uuid } = req.body;
        inventoryService.deleteItem(uuid);
        res.send();
    });
}