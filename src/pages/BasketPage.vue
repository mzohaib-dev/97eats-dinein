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
            size="sm"
            round
            unelevated
            text-color="grey-8"
            color="white"
            @click="goBack"
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
                <div class="col text-bold">Subtotal</div>
                <div class="col text-right">
                  AED {{ cartStore.cartTotal.toFixed(2) }}
                </div>
              </div>
              <div class="row q-mt-sm">
                <div class="col text-bold">Service Charge</div>
                <div class="col text-right">
                  AED 1.00
                </div>
              </div>
              <q-separator spaced/>
              <div class="row">
                <div class="col text-bold">Order Total</div>
                <div class="col text-right">
                  AED {{ (cartStore.cartTotal + 1).toFixed(2) }}
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
            <q-card-section>
              <q-btn
                label="Pay Now"
                @click="payNow"
                color="black"
                class="full-width"
              ></q-btn>
            </q-card-section>
            <q-card-section v-if="supportApplePay">
              <div class="apple-pay-button-with-text apple-pay-button-black-with-text full-width cursor-pointer q-py-sm" @click="payApple">
                <span class="text">Buy with</span>
                <span class="logo"></span>
              </div>
            </q-card-section>
            <q-card-section>
              <div class="text-subtitle1" v-for="(log,i) in logs" :key="i">
                {{log}}
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
const logs = ref<string[]>([])
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
  } catch (e:any) {
    logs.value.push(e.toString())
    console.log(e);
  }
  await frames.init(process.env.CHECKOUT_PUBLIC_API_KEY);
  if (window.ApplePaySession) {
    supportApplePay.value = true;
    logs.value.push('Apple Pay Supported')
    console.log('Apple Pay Supported');
    let merchantIdentifier = 'merchant.ck.ae.sandbox.eats97';
    if(window.ApplePaySession.canMakePayments()){
      logs.value.push(' Can make payments');
    } else {
      logs.value.push(' Cannot make payments');
    }
  } else {
    logs.value.push('Apple pay is not supported');
  }
  loading.value = false;
});
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

async function payApple() {
  console.log('Clicked Apple Pay Button')
  logs.value.push('Clicked Apple Pay Button')
  if (!window.ApplePaySession) {
    return;
  }

  // Define ApplePayPaymentRequest
  const request = {
    'countryCode': 'AE',
    'currencyCode': 'AED',
    'merchantCapabilities': [
      'supports3DS'
    ],
    'supportedNetworks': [
      'visa',
      'masterCard',
      'amex',
      'discover'
    ],
    'total': {
      'label': 'Order Total',
      'type': 'final',
      'amount': (cartStore.cartTotal + 1).toFixed(2)
    }
  };

  // Create ApplePaySession
  const session = new window.ApplePaySession(3, request);
  console.log('Session:')
  console.log(session)
  logs.value.push('Session Created')
  session.onvalidatemerchant = async (event: { validationURL: string }) => {
    logs.value.push('Validation URL: '+event.validationURL)
    const res = await api.post('dine-in/apple-pay-merchant-session',{
      validation_url: event.validationURL,
    })
    logs.value.push(JSON.stringify(res.data))
    try {
      session.completeMerchantValidation(res.data)
    } catch (e:any) {
      logs.value.push(e.toString())
    };
  };

  session.onpaymentauthorized = (event:{payment:{token:{paymentData:any}}}) => {
    // Define ApplePayPaymentAuthorizationResult
    logs.value.push(JSON.stringify(event.payment))
    if(event.payment.token.paymentData) {
      const result = {
        'status': window.ApplePaySession.STATUS_SUCCESS
      };

      session.completePayment(result);
      Loading.show()
      logs.value.push('Calling Checkout')
      api.post(process.env.CHECKOUT_TOKEN_URL,{
        type: "applepay",
        token_data: event.payment.token.paymentData
      }).then((res: {data: {token: string}}) => {
        logs.value.push('Checkout Token: '+res.data.token)
        logs.value.push('Calling Request Payment')
        api.post(
          'dine-in/checkout/request-payment',
          {
            type: 'APPLE_PAY',
            token: res.data.token,
            basket: cartStore.$state,
          }
        ).then((payRes: { data: PaymentRequestResponse }) => {
          logs.value.push('Payment Response: '+JSON.stringify(payRes.data))
          if (payRes.data.status == 'Pending') {
            appStore.order = { id: payRes.data.order_details.order_id };
            LocalStorage.set('orderId', appStore.order.id);
            window.location.href = payRes.data._links.redirect.href;
          } else if (payRes.data.status == 'Authorized') {
            $router.push({
              name: 'PaymentSuccess',
              params: { store_id: store_id, table_uuid: uuid },
            }).catch(e => console.log(e));
          } else {
            $router.push({
              name: 'PaymentFailure',
              params: { store_id: store_id, table_uuid: uuid },
            }).catch(e => console.log(e));
          }
        }).catch((e) => {
          logs.value.push('Calling Checkout Failed')
          logs.value.push(e.response.data.message)
          Notify.create({
            message:'Payment Error Occurred',
            type: 'negative'
          })
        })
      }).catch((e) => {
        Notify.create({
          message:'Payment Error Occurred For Checkout',
          type: 'negative'
        })
        logs.value.push(JSON.stringify(e.response))
      }).finally(() => {
        Loading.hide()
      })
    } else {
      const result = {
        'status': window.ApplePaySession.STATUS_FAILURE
      };

      session.completePayment(result);
    }

  };


  session.oncancel = (event: any) => {
    // Payment cancelled by WebKit
  };

  session.begin();
}
</script>
<style scoped></style>
