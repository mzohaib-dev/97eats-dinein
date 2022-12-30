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
      <div class="text-subtitle1 text-bold q-ml-lg">
        {{ orderModel?.serial_no }}
      </div>
    </q-card-section>
    <q-card-section class="bg-white">
      <div class="flex justify-between items-center">
        <div v-if="orderModel?.status === 'ACCEPTED'">
          <q-chip
            label="Preparing Order"
            outline
            size="sm"
            square
            color="green-8"
          ></q-chip>
        </div>
        <div v-else>
          <q-chip
            label="Complete"
            outline
            size="sm"
            square
            color="green-8"
          ></q-chip>
        </div>
        <q-space />
        <q-btn
          color="white"
          text-color="black"
          round
          flat
          icon="close"
          size="sm"
          v-close-popup
        ></q-btn>
      </div>
    </q-card-section>
    <q-card-section v-if="orderModel" class="bg-white">
      <div class="text-grey-8 text-subtitle2">
        {{ orderModel.store_name }} | Table: {{ orderModel.table_number }}
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section v-if="orderModel" class="bg-white">
      <div class="text-subtitle1 text-bold q-mb-sm">Order Items</div>
      <div class="row q-mb-md" v-for="(item, i) in orderModel.items" :key="i">
        <div class="col">
          <div class="text-bold">
            <span v-if="item.qty > 1">{{ item.qty }} x </span
            >{{ item.item_name }}
          </div>
          <div class="text-caption text-grey-8">
            {{ item.addons_text }}
          </div>
          <div class="text-subtitle2 text-grey-8">
            AED {{ item.item_total.toFixed(2) }}
          </div>
          <div class="text-caption text-grey-7" v-if="item.instructions">
            {{ item.instructions }}
          </div>
        </div>
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section v-if="orderModel" class="bg-white">
      <div class="row">
        <div class="col text-bold">Order Total</div>
        <div class="col text-right">
          AED {{ orderModel.grand_total.toFixed(2) }}
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { api } from 'boot/axios';
import { Notify, QBtn, QCard, QCardSection, useQuasar } from 'quasar';
import { useAppStore } from 'stores/app';
import { Order } from 'src/models/Order';
const appStore = useAppStore();
const $route = useRoute();
const $router = useRouter();
const store_id = parseInt($route.params.store_id as string);
const uuid = $route.params.table_uuid as string;
const showSuccess = $route.query.success || null;
const $q = useQuasar();
onMounted(async () => {
  $q.loading.show();
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

    const response: { data: Order } = await api.get(
      'dine-in/orders/' + ($route.params.id as string)
    );
    orderModel.value = response.data;
  } catch (e) {
    console.log(e);
  }
  $q.loading.hide();
  if (showSuccess) {
    Notify.create({
      message: 'Payment is successful',
      type: 'positive',
    });
  }
});
async function goBack() {
  await $router.push({
    name: 'Orders',
    params: { store_id: store_id, table_uuid: uuid },
  });
}

const orderModel = ref<Order | null>(null);
</script>
