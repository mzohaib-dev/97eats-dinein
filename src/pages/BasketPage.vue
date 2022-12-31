<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <div v-show="!loading">
      <q-card flat class="full-height bg-grey-3">
        <q-card-section>
          <q-btn
            class="q-mt-md"
            icon="arrow_back"
            outline
            round
            @click="goBack"
            color="grey-7"
          ></q-btn>
        </q-card-section>
        <q-card-section>
          <q-card flat>
            <q-card-section>
              <div class="text-subtitle1">
                Table: {{ cartStore.table_number }}
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <div
                class="row q-mb-md"
                v-for="(cartItem, i) in cartStore.items"
                :key="i"
              >
                <div class="col-8">
                  <div class="text-bold">
                    <span v-if="cartItem.qty > 1">{{ cartItem.qty }} x </span
                    >{{ cartItem.name }}
                  </div>
                  <div class="text-caption text-grey-8">
                    {{ getAddons(cartItem) }}
                  </div>
                  <div class="text-subtitle2 text-grey-8">
                    {{ getCartItemTotal(cartItem) }}
                  </div>
                  <div
                    class="text-caption text-grey-7"
                    v-if="cartItem.instructions"
                  >
                    {{ cartItem.instructions }}
                  </div>
                </div>
                <div class="col-4 text-right">
                  <q-btn
                    unelevated
                    size="xs"
                    round
                    icon="remove"
                    color="grey-3"
                    text-color="grey-8"
                    @click="removeQty(cartItem, i)"
                  ></q-btn>
                  <span class="q-mx-md">{{ cartItem.qty }}</span>
                  <q-btn
                    unelevated
                    size="xs"
                    round
                    icon="add"
                    color="grey-3"
                    text-color="grey-8"
                    @click="addQty(cartItem)"
                  ></q-btn>
                </div>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <div class="row">
                <div class="col text-bold">Order Total</div>
                <div class="col text-right">
                  AED {{ cartStore.cartTotal.toFixed(2) }}
                </div>
              </div>
            </q-card-section>
          </q-card>
          <q-card flat class="q-mt-md">
            <q-card-section>
              <div
                class="card-frame"
                style="
                  height: 50px;
                  border: 1px solid #aaa;
                  border-radius: 10px;
                "
              >
                <!-- form will be added here -->
              </div>
              <div v-if="cardError" class="text-caption text-red-7">
                {{ cardError }}
              </div>
            </q-card-section>
            <q-card-actions>
              <q-btn
                label="Pay Now"
                @click="payNow"
                color="black"
                class="full-width"
              ></q-btn>
            </q-card-actions>
            <q-card-section>
              <div
                class="apple-pay-button-with-text apple-pay-button-black-with-text full-width"
              >
                <span class="text">Buy with</span>
                <span class="logo"></span>
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
    <q-spinner-gears size="50px" color="primary" />
  </q-inner-loading>
  <q-dialog full-width v-model="basketEmptyDialog" persistent>
    <q-card>
      <q-card-section>Notice</q-card-section>
      <q-separator />
      <q-card-section>
        <div class="text-grey-7">The basket is empty</div>
      </q-card-section>
      <q-card-actions>
        <q-btn
          label="Go to Menu"
          class="full-width"
          color="yellow-9"
          @click="goBack"
        ></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from 'stores/cart';
import { CartItem } from 'src/models/Cart';
import { nextTick, onMounted, ref } from 'vue';
import { useAppStore } from 'stores/app';
import { Loading, LocalStorage, Notify } from 'quasar';
import { Frames, PaymentRequestResponse } from 'src/models/Checkout';
import { api } from 'boot/axios';

const $route = useRoute();
const $router = useRouter();
const store_id = parseInt($route.params.store_id as string);
const uuid = $route.params.table_uuid as string;
const loading = ref(true);
async function goBack() {
  await $router.push({
    name: 'Menu',
    params: { store_id: store_id, table_uuid: uuid },
  });
}
const cartStore = useCartStore();
const supportApplePay = ref(false);
function getAddons(item: CartItem): string {
  let addonNames: string[] = [];
  item.addons.forEach((addon) => {
    addonNames.push(addon.name);
  });
  return addonNames.join(',');
}

function getCartItemTotal(cartItem: CartItem): string {
  let total = cartItem.price;
  cartItem.addons.forEach((addon) => {
    total += addon.price;
  });
  return 'AED ' + (total * cartItem.qty).toFixed(2);
}
const basketEmptyDialog = ref(false);
function removeQty(cartItem: CartItem, i: number) {
  if (cartItem.qty > 1) {
    cartItem.qty -= 1;
  } else {
    cartStore.removeItem(i);
  }
  nextTick(() => {
    if (cartStore.items.length == 0) {
      basketEmptyDialog.value = true;
    }
  });
  LocalStorage.set('cartItems', cartStore.items);
}
function addQty(cartItem: CartItem) {
  cartItem.qty += 1;
  LocalStorage.set('cartItems', cartStore.items);
}
const appStore = useAppStore();

const frames = window.Frames as Frames;
onMounted(async () => {
  try {
    const res = await appStore.init();
    if (res === 'unauthenticated') {
      await $router.push({
        name: 'Login',
        params: { store_id: store_id, table_uuid: uuid },
      });
    }
    if (cartStore.items.length == 0) {
      basketEmptyDialog.value = true;
    }
  } catch (e) {
    console.log(e);
  }
  await frames.init(process.env.CHECKOUT_PUBLIC_API_KEY);
  if (window.ApplePaySession) {
    supportApplePay.value = true;
    console.log('Apple Pay Supported');
    let merchantIdentifier = 'merchant.ck.ae.sandbox.eats97';
    ApplePaySession.canMakePaymentsWithActiveCard(merchantIdentifier)
      .then((canMakePayments: boolean) => {
        if (canMakePayments) {
          log.value += ' Can make payments';
        } else {
          log.value += ' Cannot make payments';
        }
      })
      .catch((e) => {
        log.value += ' ' + e;
        console.log(e);
      });
  } else {
    log.value += 'Apple pay is not ssupported';
  }
  loading.value = false;
});
const log = ref('');
const cardError = ref('');

async function payNow() {
  cardError.value = '';
  if (frames.isCardValid()) {
    Loading.show();
    try {
      const res = await frames.submitCard();
      if (res.token) {
        const token = res.token;
        try {
          const payRes: { data: PaymentRequestResponse } = await api.post(
            'dine-in/checkout/request-payment',
            {
              type: 'CARD',
              token: token,
              basket: cartStore.$state,
            }
          );
          if (payRes.data.status == 'Pending') {
            appStore.order = { id: payRes.data.order_details.order_id };
            LocalStorage.set('orderId', appStore.order.id);
            window.location.href = payRes.data._links.redirect.href;
          } else if (payRes.data.status == 'Authorized') {
            await $router.push({
              name: 'PaymentSuccess',
              params: { store_id: store_id, table_uuid: uuid },
            });
          } else {
            await $router.push({
              name: 'PaymentFailure',
              params: { store_id: store_id, table_uuid: uuid },
            });
          }
        } catch (e) {
          Notify.create({
            message: 'Payment Error. Try Again',
            type: 'negative',
          });
          frames.enableSubmitForm();
        }
      }
    } catch (e) {
      console.log(e);
    }
    Loading.hide();
  } else {
    cardError.value = 'Please enter a valid card number';
  }
}
</script>
<style scoped></style>
