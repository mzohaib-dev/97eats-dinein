import { defineStore } from 'pinia';
import {CartItem} from 'src/models/Cart';

export const useCartStore = defineStore('cart', {
  state: () => ({
    table_number: '',
    items: [] as CartItem[],
    instruction: ''
  }),

  getters: {

  },

  actions: {
    addItem(obj: CartItem) {
      this.items.push(obj)
    }
  }
});
