<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import {onMounted} from 'vue';
import {LocalStorage} from 'quasar';
import {useCartStore} from 'stores/cart';
import {CartItem} from 'src/models/Cart';
const cartStore = useCartStore()
onMounted(() => {
  const cartItems = LocalStorage.getItem('cartItems')

  if(cartItems) {
    cartStore.items = cartItems as CartItem[]
  }
  const instructions = LocalStorage.getItem('instructions')
  if(instructions) {
    cartStore.instruction = instructions as string
  }
})
</script>
