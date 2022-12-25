import { defineStore } from 'pinia';
import {CartItem} from 'src/models/Cart';

export const useCartStore = defineStore('cart', {
  state: () => ({
    table_number: '',
    items: [] as CartItem[],
    instruction: ''
  }),

  getters: {
    cartTotal():string {
      let total = 0
      this.items.forEach((cartItem) => {
        let price = cartItem.item.price;
        cartItem.item.item_addon_categories?.forEach((itemAddonCategory) => {
          if(itemAddonCategory.type == 'single' && itemAddonCategory.selected_addon_id) {
            const selectedAddon = itemAddonCategory.item_addons.find((addon) => addon.id == itemAddonCategory.selected_addon_id)
            price += selectedAddon?.price || 0
          }
        })
        total += price * cartItem.qty
      })
      return total.toFixed(2)
    }
  },

  actions: {
    addItem(obj: CartItem) {
      this.items.push(obj)
    }
  }
});
