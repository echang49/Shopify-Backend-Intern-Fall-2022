import ItemDTO from "./ItemDTO";
import ShipmentDTO from "./ShipmentDTO";

interface IShipmentService {
    createShipment: (name: string, items: ItemDTO[]) => ShipmentDTO
    getShipment: (uuid: string) => ShipmentDTO
}

export default IShipmentService;