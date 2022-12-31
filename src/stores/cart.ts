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
    cartTotal():number {
      let total = 0
      this.items.forEach((cartItem) => {
        let price = cartItem.price;
        cartItem.addons.forEach((addon) => {
          price += addon.price
        })
        total += price * cartItem.qty
      })
      return total
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
      this.items = []
      this.instruction = ''
    }
  }
});
