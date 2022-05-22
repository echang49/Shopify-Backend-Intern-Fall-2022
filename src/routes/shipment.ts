import express, { Request, Response } from 'express';
import ItemDTO from '../models/ItemDTO';
import ShipmentDTO from '../models/ShipmentDTO';
import ShipmentService from '../services/ShipmentService';


export module Shipment {
    export const router = express.Router();

    const shipmentService:ShipmentService = new ShipmentService();
    
    router.get('/', (req:Request, res:Response) => {
        let { uuid } = req.query;
        if(typeof uuid !== "string") throw new Error("Improper uuid.");

        let shipment:ShipmentDTO = shipmentService.getShipment(uuid);
        res.send(shipment);
    });

    router.post('/', (req:Request, res:Response) => {
        let { name, items } = req.body;
        let shipment:ShipmentDTO = shipmentService.createShipment(name, items);
        res.send(shipment);
    });
}