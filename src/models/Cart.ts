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
  id: number;
  name: string;
  price: number;
  addons: CartItemAddon[]
  instructions: string;
}
 export interface CartItemAddon {
   id: number;
   name: string;
   price: number;
 }
