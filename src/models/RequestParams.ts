import ItemDTO from './ItemDTO';

export interface InventoryCreationParams {
  name: string;
  category: string;
  count: number;
}

export interface InventoryEditParams {
  uuid: string;
  name?: string;
  category?: string;
  count?: number;
}

export interface ShipmentCreationParams {
  name: string;
  items: ItemDTO[];
}