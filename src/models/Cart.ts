import {Item} from 'src/models/Item';

export interface Cart{
  table_number: string;
  items: CartItem[],
  instructions: string;
  customer: {
    name: string;
    phone: string;
  }
}

export interface CartItem {
  qty: number;
  item: Item,
  instructions: string;
}
