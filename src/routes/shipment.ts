import express, {Request, Response} from 'express';

import ShipmentDTO from '../models/ShipmentDTO';
import ShipmentService from '../services/ShipmentService';

export const ShipmentRouter = express.Router();

const shipmentService: ShipmentService = new ShipmentService();

ShipmentRouter.get('/', (req: Request, res: Response) => {
  const {uuid} = req.query;
  if (typeof uuid !== 'string') throw new Error('Improper uuid.');

  const shipment: ShipmentDTO = shipmentService.getShipment(uuid);
  res.send(shipment);
});

ShipmentRouter.post('/', (req: Request, res: Response) => {
  const {name, items} = req.body;
  const shipment: ShipmentDTO = shipmentService.createShipment(name, items);
  res.send(shipment);
});
