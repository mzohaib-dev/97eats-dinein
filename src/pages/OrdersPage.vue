<template>
  <q-card flat>
    <q-card-section class="flex items-center q-mt-md">
      <q-btn icon="arrow_back" outline round @click="goBack" color="grey-7"></q-btn>
      <div class="text-subtitle1 text-bold q-ml-lg">My Orders</div>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import {useRoute, useRouter} from 'vue-router';
import {onMounted, ref} from 'vue';
import {User} from 'src/models/User';
import {api} from 'boot/axios';
import {Loading} from 'quasar';
import {useAppStore} from 'stores/app';
const appStore = useAppStore()
onMounted(async () => {
  try {
    const res = await appStore.init()
    if(res === 'unauthenticated') {
      await $router.push({
        name: 'Menu',
        params: {
          store_id: store_id,
          table_uuid: uuid
        }
      })
    }
  } catch (e) {
    console.log(e)
  }
})
const $route = useRoute()
const $router = useRouter()
const store_id = parseInt($route.params.store_id as string)
const uuid = $route.params.table_uuid as string
async function goBack() {
  await $router.push({name:'Menu', params: {store_id: store_id, table_uuid: uuid}})
}
</script>
