interface ItemDTO {
  uuid: string;
  name: string;
  category: string;
  count: number;
}

export default ItemDTO;

export interface PartialItemDTO {
  uuid: string;
  count: number;
}
