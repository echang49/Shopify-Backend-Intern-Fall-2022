import ItemDTO from './ItemDTO';
import {InventoryCreationParams, InventoryEditParams} from './RequestParams';

interface InventoryInterface {
  getItem: (uuid: string) => ItemDTO;
  getItems: (category: string) => ItemDTO[];
  createItem: (params: InventoryCreationParams) => ItemDTO;
  editItem: (params: InventoryEditParams) => ItemDTO;
  deleteItem: (uuid: string) => void;
}

export default InventoryInterface;
