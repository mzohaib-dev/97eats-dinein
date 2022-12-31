<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <div v-show="!loading">
      <q-card flat class="bg-transparent">
        <q-card-section class="flex items-center q-mt-md">
          <q-btn
            icon="arrow_back"
            size="sm"
            round
            unelevated
            text-color="grey-8"
            color="white"
            @click="goBack"
          ></q-btn>
          <div class="text-subtitle1 text-bold q-ml-lg">My Orders</div>
        </q-card-section>
        <q-card-section>
          <template v-if="model.length > 0">
            <q-card
              class="bg-white q-mb-md"
              v-for="order in model"
              :key="order.id"
              @click="getOrder(order.id)"
            >
              <q-card-section>
                <div class="text-subtitle2">{{ order.serial_no }}</div>
                <div class="text-caption">
                  <q-chip
                    :label="
                      order.status === 'ACCEPTED'
                        ? 'Preparing Order'
                        : 'Complete'
                    "
                    color="green-9"
                    outline
                    size="sm"
                    square
                  ></q-chip>
                </div>
              </q-card-section>
              <q-separator />
              <q-card-section>
                <div class="text-grey-8 text-subtitle2">
                  {{ order.store_name }} | Table: {{ order.table_number }}
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
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { api } from 'boot/axios';
import { QBtn, QCard, QCardSection } from 'quasar';
import { useAppStore } from 'stores/app';
import { Order } from 'src/models/Order';
const appStore = useAppStore();
const $route = useRoute();
const $router = useRouter();
const store_id = parseInt($route.params.store_id as string);
const uuid = $route.params.table_uuid as string;
const model = ref<Order[]>([]);
const loading = ref(true);
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
  loading.value = false;
});
async function goBack() {
  await $router.push({
    name: 'Menu',
    params: { store_id: store_id, table_uuid: uuid },
  });
}

async function getOrder(id: number) {
  await $router.push({
    name: 'OrderView',
    params: {
      store_id: store_id,
      table_uuid: uuid,
      id: id,
    },
  });
}
</script>
