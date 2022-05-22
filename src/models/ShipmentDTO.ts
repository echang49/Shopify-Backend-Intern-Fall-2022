import ItemDTO from './ItemDTO';

interface ShipmentDTO {
  uuid: string;
  name: string;
  items: ItemDTO[];
}

export default ShipmentDTO;
