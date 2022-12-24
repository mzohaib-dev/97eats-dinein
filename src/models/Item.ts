export interface Item {
  id: number;
  name: string;
  thumbnail: string;
  cover: string;
  description: string;
  price_to_show: string;
  price: number;
}

export interface ItemCategory {
  id: number;
  name: string;
  items: Item[];
}
