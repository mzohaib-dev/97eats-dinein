<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="bg-grey-3">
      <q-page>
        <div class="row bg-grey-3">
          <div class="col-12 col-md-4"></div>
          <div class="col-12 col-md-4 relative-position">
            <router-view />
          </div>
          <div class="col-12 col-md-4"></div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { LocalStorage } from 'quasar';
import { CartItem } from 'src/models/Cart';
import { useRoute } from 'vue-router';
import { useCartStore } from 'stores/cart';
const $route = useRoute();
const cartStore = useCartStore();
onMounted(() => {
  const uuid = $route.params.table_uuid as string;
  cartStore.table_uuid = uuid;
  const tableUuidLocal = LocalStorage.getItem('tableUuid');
  if (tableUuidLocal) {
    if (uuid == tableUuidLocal) {
      const cartItems = LocalStorage.getItem('cartItems');
      if (cartItems) {
        cartStore.items = cartItems as CartItem[];
      } else {
        cartStore.resetCart();
        return;
      }
      const instructions = LocalStorage.getItem('instructions');
      if (instructions) {
        cartStore.instruction = instructions as string;
      }
      const tableNumber = LocalStorage.getItem('tableNumber') as string;
      if (tableNumber) {
        cartStore.table_number = tableNumber;
      } else {
        cartStore.resetCart();
        return;
      }
    }
  }
  LocalStorage.set('tableUuid', uuid);
  cartStore.table_uuid = uuid as string;
});
</script>
