import ItemDTO from './ItemDTO';
import ShipmentDTO from './ShipmentDTO';

interface ShipmentInterface {
  createShipment: (name: string, items: ItemDTO[]) => ShipmentDTO;
  getShipment: (uuid: string) => ShipmentDTO;
}

export default ShipmentInterface;
