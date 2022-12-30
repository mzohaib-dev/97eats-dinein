<template>
  <q-card flat class="bg-transparent">
    <q-card-section class="flex items-center q-mt-md">
      <q-btn
        icon="arrow_back"
        outline
        round
        @click="goBack"
        color="grey-7"
      ></q-btn>
      <div class="text-subtitle1 text-bold q-ml-lg">My Orders</div>
    </q-card-section>
    <q-card-section>
      <template v-if="model.length > 0">
        <q-card class="bg-white q-mb-md" v-for="order in model" :key="order.id">
          <q-card-section>
            <div class="text-subtitle2">{{ order.serial_no }}</div>
            <div class="text-caption">
              <q-chip
                :label="order.status === 'ACCEPTED' ? 'Preparing Order' : ''"
                color="green-9"
                outline
                size="sm"
                square
              ></q-chip>
            </div>
          </q-card-section>
        </q-card>
      </template>
      <template v-else>
        <q-card class="bg-white">
          <q-card-section class="text-center text-h6 text-grey-7">
            !! No orders !!
          </q-card-section>
        </q-card>
      </template>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { User } from 'src/models/User';
import { api } from 'boot/axios';
import { Loading, QBtn, QCard, QCardSection } from 'quasar';
import { useAppStore } from 'stores/app';
import { Order } from 'src/models/Order';
const appStore = useAppStore();
const $route = useRoute();
const $router = useRouter();
const store_id = parseInt($route.params.store_id as string);
const uuid = $route.params.table_uuid as string;
const model = ref<Order[]>([]);
onMounted(async () => {
  try {
    const res = await appStore.init();
    if (res === 'unauthenticated') {
      await $router.push({
        name: 'Menu',
        params: {
          store_id: store_id,
          table_uuid: uuid,
        },
      });
    }

    const response: { data: Order[] } = await api.get('dine-in/orders', {
      params: {
        table_uuid: uuid,
      },
    });
    model.value = response.data;
  } catch (e) {
    console.log(e);
  }
});
async function goBack() {
  await $router.push({
    name: 'Menu',
    params: { store_id: store_id, table_uuid: uuid },
  });
}
</script>
