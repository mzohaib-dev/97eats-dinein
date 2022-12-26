import { defineStore } from 'pinia';
import {CartItem} from 'src/models/Cart';
import {LocalStorage} from 'quasar';

export const useCartStore = defineStore('cart', {
  state: () => ({
    table_uuid: '',
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
          if(itemAddonCategory.type == 'single') {
            if(itemAddonCategory.selected_addon_id) {
              const selectedAddon = itemAddonCategory.item_addons.find((addon) => addon.id == itemAddonCategory.selected_addon_id)
              price += selectedAddon?.price || 0
            }
          } else {
            if(itemAddonCategory.selected_addon_ids.length > 0) {
              itemAddonCategory.item_addons.forEach((addon) => {
                if(itemAddonCategory.selected_addon_ids.includes(addon.id)) {
                  price += addon.price
                }
              })
            }
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
      LocalStorage.set('cartItems',this.items)
    },
    removeItem(index: number) {
      this.items.splice(index,1)
    },
    resetCart() {
      this.table_uuid = ''
      this.table_number = ''
      this.items = []
      this.instruction = ''
    }
  }
});
