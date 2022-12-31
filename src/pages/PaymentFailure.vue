<template>
  <q-card class="full-height fixed-full">
    <q-card-section class="q-pa-none bg-red-7 text-white full-height flex justify-center items-center">
      <div class="q-pa-lg text-center">
        <q-icon name="check" color="yellow-7" size="xl"></q-icon>
        <div class="full-width"></div>
        <div class="text-subtitle1 q-my-lg">Payment Failed. Try Again.</div>
        <q-btn label="Go to Basket" @click="gotoBasket" color="white" outline></q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useAppStore} from 'stores/app';
const $route = useRoute()
const $router = useRouter()
const store_id = parseInt($route.params.store_id as string)
const uuid = $route.params.table_uuid as string
const appStore = useAppStore()
onMounted(async () => {
  try {
    const res = await appStore.init()
    if(res === 'unauthenticated') {
      await $router.push({
        name:'Menu',
        params: {store_id: store_id, table_uuid: uuid}
      })
    }
  } catch (e) {
    console.log(e)
  }
})
async function gotoBasket() {
  await $router.push({
    name:'Basket',
    params: {store_id: store_id, table_uuid: uuid}
  })
}
</script>
