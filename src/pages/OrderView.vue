<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <div v-show="!loading">
      <q-card flat class="bg-transparent">
        <q-card-section
          class="flex items-center justify-center q-mt-md relative-position"
        >
          <q-btn
            icon="arrow_back"
            size="sm"
            round
            unelevated
            text-color="grey-8"
            color="white"
            @click="goBack"
            class="absolute absolute-top-left q-ml-md q-mt-md"
          ></q-btn>
          <div class="text-subtitle1 text-bold q-ml-lg">Order Summary</div>
        </q-card-section>
        <q-card-section v-if="orderModel">
          <q-card flat class="rounded-borders">
            <q-card-section>
              <div class="row">
                <div class="col">
                  <div class="text-subtitle2">
                    Order#{{ orderModel.serial_no }}
                  </div>
                  <div class="text-caption text-grey-7">
                    {{ orderModel.created_at }}
                  </div>
                </div>
              </div>
              <div class="flex justify-between items-center">
                <div v-if="orderModel.status === 'ACCEPTED'">
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
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <div class="text-grey-8 text-subtitle2">
                {{ orderModel.store_name }} |
                {{ orderModel.table_type == 'drive_thru' ? 'Drive Thru' : 'Table: ' + orderModel.table_number }}
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <div
                class="row q-mb-md full-width"
                v-for="(item, i) in orderModel.items"
                :key="i"
              >
                <div class="col">
                  <div class="text-bold">
                    <span v-if="item.qty > 1">{{ item.qty }} x </span
                    >{{ item.item_name }}
                  </div>
                  <div class="text-caption text-grey-8">
                    {{ item.addons_text }}
                  </div>
                  <div
                    class="text-caption text-grey-7"
                    v-if="item.instructions"
                  >
                    {{ item.instructions }}
                  </div>
                </div>
                <div class="col-auto">
                  <div class="text-subtitle2 text-grey-8">
                    AED {{ item.item_total.toFixed(2) }}
                  </div>
                </div>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <div class="row">
                <div class="col text-bold">Subtotal</div>
                <div class="col text-right">
                  AED {{ orderModel.subtotal.toFixed(2) }}
                </div>
              </div>
              <div class="row" v-if="orderModel.vat_amount">
                <div class="col text-bold">VAT</div>
                <div class="col text-right">
                  AED {{ orderModel.vat_amount.toFixed(2) }}
                </div>
              </div>
              <div class="row q-mt-sm">
                <div class="col text-bold">Service Charge</div>
                <div class="col text-right">
                  AED {{ orderModel.service_charge.toFixed(2) }}
                </div>
              </div>
              <q-separator spaced />
              <div class="row">
                <div class="col text-bold">Order Total</div>
                <div class="col text-right">
                  AED {{ orderModel.grand_total.toFixed(2) }}
                </div>
              </div>
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
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { api } from 'boot/axios';
import { LocalStorage, Notify, QBtn, QCard, QCardSection } from 'quasar';
import { useAppStore } from 'stores/app';
import { Order } from 'src/models/Order';
import { useCartStore } from 'stores/cart';
const appStore = useAppStore();
const $route = useRoute();
const $router = useRouter();
const store_id = parseInt($route.params.store_id as string);
const uuid = $route.params.table_uuid as string;
const showSuccess = $route.query.success || null;
const loading = ref(true);
const cartStore = useCartStore();
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

    const response: { data: Order } = await api.get(
      'dine-in/orders/' + ($route.params.id as string)
    );
    orderModel.value = response.data;
  } catch (e) {
    console.log(e);
  }
  loading.value = false;
  if (showSuccess) {
    appStore.order = null;
    cartStore.items = [];
    cartStore.instruction = '';
    LocalStorage.remove('cartItems');
    LocalStorage.remove('orderId');
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
