import {ItemCategory} from 'src/models/Item';

export interface TableMenu {
  store: {
    id: number;
    name: string;
    thumbnail: string;
  },
  item_categories: ItemCategory[],
  table_info: {
    table_number: string;
  }
}
