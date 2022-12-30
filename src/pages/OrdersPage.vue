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
                  order.status === 'ACCEPTED' ? 'Preparing Order' : 'Complete'
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
  <q-dialog position="bottom" v-model="orderViewDialog">
    <q-card style="width: 500px; max-width: 100%" flat>
      <q-card-section>
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
      <q-card-section v-if="orderModel">
        <div class="text-caption text-grey-7">{{ orderModel.serial_no }}</div>
        <div class="text-grey-8 text-subtitle2">
          {{ orderModel.store_name }} | Table: {{ orderModel.table_number }}
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section v-if="orderModel">
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
      <q-card-section v-if="orderModel">
        <div class="row">
          <div class="col text-bold">Order Total</div>
          <div class="col text-right">
            AED {{ orderModel.grand_total.toFixed(2) }}
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { api } from 'boot/axios';
import { Loading, QBtn, QCard, QCardSection } from 'quasar';
import { useAppStore } from 'stores/app';
import { Order } from 'src/models/Order';
const orderViewDialog = ref(false);
const appStore = useAppStore();
const $route = useRoute();
const $router = useRouter();
const store_id = parseInt($route.params.store_id as string);
const uuid = $route.params.table_uuid as string;
const model = ref<Order[]>([]);
onMounted(async () => {
  Loading.show();
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
  Loading.hide();
});
async function goBack() {
  await $router.push({
    name: 'Menu',
    params: { store_id: store_id, table_uuid: uuid },
  });
}

const orderModel = ref<Order | null>(null);

async function getOrder(id: number) {
  Loading.show();
  try {
    const res: { data: Order } = await api.get(
      'dine-in/orders/' + id.toString()
    );
    orderModel.value = res.data;
    orderViewDialog.value = true;
  } catch (e) {
    console.log(e);
  }
  Loading.hide();
}
</script>
