import express, {Request, Response} from 'express';

import InventoryService from '../services/InventoryService';
import ItemDTO from '../models/ItemDTO';

export const InventoryRouter = express.Router();

const inventoryService: InventoryService = new InventoryService();

InventoryRouter.get('/', (req: Request, res: Response) => {
  const {category, uuid} = req.query;

  let items: ItemDTO[] = [];
  if (typeof uuid === 'string') {
    items = [inventoryService.getItem(uuid)];
  } else if (typeof category === 'string') {
    items = inventoryService.getItems(category);
  }

  return res.send(items);
});

InventoryRouter.post('/', (req: Request, res: Response) => {
  const {name, category, count} = req.body;
  const item: ItemDTO = inventoryService.createItem(
    name,
    category,
    Number(count),
  );
  return res.send(item);
});

InventoryRouter.put('/', (req: Request, res: Response) => {
  const {uuid, name, category} = req.body;
  if (typeof uuid !== 'string')
    return res.status(400).send('Need valid uuid for updating');
  const count = isNaN(Number(req.body.count))
    ? undefined
    : Number(req.body.count);
  let item: ItemDTO = {uuid, name, category, count};
  item = inventoryService.editItem(item);
  return res.send(item);
});

InventoryRouter.delete('/', (req: Request, res: Response) => {
  const {uuid} = req.body;
  inventoryService.deleteItem(uuid);
  return res.send();
});
