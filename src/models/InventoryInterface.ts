import ItemDTO from './ItemDTO';
import {
  InventoryCreationParams,
  InventoryEditParams,
  InventoryDeleteParams,
} from './RequestParams';

interface InventoryInterface {
  getItem: (uuid: string) => ItemDTO;
  getItems: (category: string) => ItemDTO[];
  createItem: (params: InventoryCreationParams) => ItemDTO;
  editItem: (params: InventoryEditParams) => ItemDTO;
  deleteItem: (params: InventoryDeleteParams) => void;
}

export default InventoryInterface;
