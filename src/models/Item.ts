export interface Item {
  id: number;
  name: string;
  thumbnail: string;
  cover: string;
  description: string;
  price_to_show: string;
  price: number;
  item_addon_categories?: ItemAddonCategory[]
}

export interface ItemAddonCategory {
  id: number;
  name: string;
  type: string;
  max_selection: number;
  min_selection: number;
  item_addons: ItemAddon[],
  selected_addon_id: number;
  selected_addon_ids: number[]
}

export interface ItemAddon {
  id: number;
  name: string;
  price: number;
  price_to_show: string;
}

export interface ItemCategory {
  id: number;
  name: string;
  items: Item[];
}
