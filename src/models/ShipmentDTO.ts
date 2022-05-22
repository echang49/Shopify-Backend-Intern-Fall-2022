import ItemDTO from "./ItemDTO";

type ShipmentDTO = {
    uuid: string;
    name?: string;
    items?: ItemDTO[];
}

export default ShipmentDTO;