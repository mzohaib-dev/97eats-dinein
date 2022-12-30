export interface Order {
  id: number;
  serial_no: string;
  created_at: string;
  status: string;
  status_to_show: string;
  grand_total: number;
  items: OrderItem[];
  store_name: string;
  table_number: string;
}

export interface OrderItem {
  item_name: string;
  instructions: string;
  item_total: number;
  item_price: number;
  addons_text: string;
  qty: number;
}
