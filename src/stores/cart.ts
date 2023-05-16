import { defineStore } from 'pinia';
import { CartItem } from 'src/models/Cart';
import { LocalStorage } from 'quasar';

export const useCartStore = defineStore('cart', {
  state: () => ({
    table_uuid: '',
    table_number: '',
    table_type: '',
    items: [] as CartItem[],
    instruction: '',
    vat_included: true,
    store_service_charge: 0,
    vehicle_info: ''
  }),

  getters: {
    cartTotal(): number {
      let total = 0;
      this.items.forEach((cartItem) => {
        let price = cartItem.price;
        cartItem.addons.forEach((addon) => {
          price += addon.price;
        });
        total += price * cartItem.qty;
      });
      return total;
    },
    vat(): number {
      return this.vat_included ? 0 : (this.cartTotal * 5) / 100;
    },
    serviceCharge(): number {
      return 1 + this.store_service_charge;
    },
    grandTotal(): number {
      return this.cartTotal + this.vat + this.serviceCharge;
    },
  },

  actions: {
    addItem(obj: CartItem) {
      this.items.push(obj);
      LocalStorage.set('cartItems', this.items);
    },
    removeItem(index: number) {
      this.items.splice(index, 1);
    },
    resetCart() {
      this.items = [];
      this.instruction = '';
    },
  },
});
