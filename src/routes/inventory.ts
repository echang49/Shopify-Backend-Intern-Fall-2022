import express, {Request, Response} from 'express';

import InventoryService from '../services/InventoryService';
import {
  InventoryCreationParams,
  InventoryEditParams,
} from '../models/RequestParams';
import ItemDTO from '../models/ItemDTO';

export const InventoryRouter = express.Router();

const inventoryService: InventoryService = new InventoryService();

InventoryRouter.get('/', (req: Request, res: Response) => {
  const {uuid} = req.query;

  if (typeof uuid !== 'string') throw new Error('Improper UUID Format');
  const item: ItemDTO = inventoryService.getItem(uuid);
  return res.send(item);
});

InventoryRouter.get('/items', (req: Request, res: Response) => {
  const {category} = req.query;

  if (typeof category !== 'string') throw new Error('Improper UUID Format');
  const items: ItemDTO[] = inventoryService.getItems(category);
  return res.send(items);
});

InventoryRouter.post('/', (req: Request, res: Response) => {
  const {name, category, count} = req.body;
  const params: InventoryCreationParams = {
    name,
    category,
    count: Number(count),
  };
  const item: ItemDTO = inventoryService.createItem(params);
  return res.send(item);
});

InventoryRouter.put('/', (req: Request, res: Response) => {
  const {uuid, name, category} = req.body;
  if (typeof uuid !== 'string')
    return res.status(400).send('Need valid uuid for updating');
  const count = isNaN(Number(req.body.count))
    ? undefined
    : Number(req.body.count);
  const params: InventoryEditParams = {uuid, name, category, count};
  const item: ItemDTO = inventoryService.editItem(params);
  return res.send(item);
});

InventoryRouter.delete('/', (req: Request, res: Response) => {
  const {uuid} = req.body;
  inventoryService.deleteItem(req.body);
  return res.send();
});
