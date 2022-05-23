import {ShipmentCreationParams} from './RequestParams';
import ShipmentDTO from './ShipmentDTO';

interface ShipmentInterface {
  createShipment: (params: ShipmentCreationParams) => ShipmentDTO;
  getShipment: (uuid: string) => ShipmentDTO;
}

export default ShipmentInterface;
