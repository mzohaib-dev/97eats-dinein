<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <div v-show="!loading">
      <q-card>
        <q-card-section>
          <div class="text-h6">Select Store</div>
        </q-card-section>
        <q-separator/>
        <q-card-section>
          <q-card v-for="store in items" :key="store.id" @click="gotoStore(store.id)" class="q-mb-md">
            <q-card-section horizontal>
              <q-card-section class="col-4">
                <q-img :src="store.thumbnail" class="rounded-borders"></q-img>
              </q-card-section>
              <q-card-section class="row items-center">
                <div class="col-12">
                  <div class="text-subtitle1 text-bold">{{store.name}}</div>
                </div>
                <div class="col-12">
                  <div class="text text-grey-7">{{store.description}}</div>.
                </div>
              </q-card-section>
            </q-card-section>
          </q-card>
        </q-card-section>
      </q-card>
    </div>
  </transition>
  <q-inner-loading
    :showing="loading"
    class=""
    style="position: fixed !important"
  >
  <q-img src="~assets/gireeb-logo-animated.gif" width="100px"></q-img>
  </q-inner-loading>
</template>
<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {api} from 'boot/axios';
import {useRoute, useRouter} from 'vue-router';
import {Restaurant} from 'src/models/Restaurant';

const loading = ref(true)
const $route = useRoute()

const uuid = $route.params.table_uuid as string;
const items = ref<Restaurant[]>([])
onMounted(async () => {
  try {
    const res: { data: Restaurant[] } = await api.get('event-tables/' + uuid + '/stores')
    items.value = res.data
  } catch (e) {
    console.log(e)
  }
  loading.value = false
})
const $router = useRouter()
async function gotoStore(id: number) {
  await $router.push({
    name:'Menu',
    params:{
      store_id: id,
      table_uuid: uuid
    }
  })
}
</script>
