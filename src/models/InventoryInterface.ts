import ItemDTO from './ItemDTO';

interface InventoryInterface {
  getItem: (uuid: string) => ItemDTO;
  getItems: (category?: string) => ItemDTO[];
  createItem: (name: string, category: string, count: number) => ItemDTO;
  editItem: (item: ItemDTO) => ItemDTO;
  deleteItem: (uuid: string) => void;
}

export default InventoryInterface;
