<template>
  <q-card flat class="full-height bg-grey-3">
    <q-card-section>
      <q-btn class="q-mt-md" icon="arrow_back" outline round @click="goBack" color="grey-7"></q-btn>
    </q-card-section>
    <q-card-section>
      <q-card flat>
        <q-card-section>
          <div class="text-subtitle1">Table: {{cartStore.table_number}}</div>
        </q-card-section>
        <q-separator/>
        <q-card-section>
          <div class="row q-mb-md" v-for="(cartItem,i) in cartStore.items" :key="i">
            <div class="col-8">
              <div class="text-bold"><span v-if="cartItem.qty > 1">{{cartItem.qty}} x </span>{{cartItem.item.name}}</div>
              <div class="text-caption text-grey-8">
                {{getAddons(cartItem.item)}}
              </div>
              <div class="text-subtitle2 text-grey-8">{{ getCartItemTotal(cartItem) }}</div>
              <div class="text-caption text-grey-7" v-if="cartItem.instructions">{{cartItem.instructions}}</div>
            </div>
            <div class="col-4 text-right">
              <q-btn unelevated size="xs" round icon="remove" color="grey-3" text-color="grey-8" @click="removeQty(cartItem,i)"></q-btn>
              <span class="q-mx-md">{{cartItem.qty}}</span>
              <q-btn unelevated size="xs" round icon="add" color="grey-3" text-color="grey-8" @click="addQty(cartItem,i)"></q-btn>
            </div>
          </div>
        </q-card-section>
        <q-separator/>
        <q-card-section>
          <div class="row">
            <div class="col text-bold">
              Order Total
            </div>
            <div class="col text-right">
              AED {{cartStore.cartTotal}}
            </div>
          </div>
        </q-card-section>
      </q-card>
      <q-card flat class="q-mt-md">
        <q-card-section>
          <div class="card-frame">
            <!-- form will be added here -->
          </div>
        </q-card-section>
        <q-card-actions>
          <q-btn label="Pay Now" @click="payNow" color="black" class="full-width"></q-btn>
        </q-card-actions>
      </q-card>
    </q-card-section>
  </q-card>
  <q-dialog full-width v-model="basketEmptyDialog" persistent>
    <q-card>
      <q-card-section>Notice</q-card-section>
      <q-separator/>
      <q-card-section>
        <div class="text-grey-7">The basket is empty</div>
      </q-card-section>
      <q-card-actions>
        <q-btn label="Go to Menu" class="full-width" color="yellow-9" @click="goBack"></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import {useRoute, useRouter} from 'vue-router';
import {useCartStore} from 'stores/cart';
import {Item} from 'src/models/Item';
import {CartItem} from 'src/models/Cart';
import {nextTick, onMounted, ref} from 'vue';
import {useAppStore} from 'stores/app';
import {LocalStorage} from 'quasar';

const $route = useRoute()
const $router = useRouter()
const store_id = parseInt($route.params.store_id as string)
const uuid = $route.params.table_uuid as string
async function goBack() {
  await $router.push({name:'Menu', params: {store_id: store_id, table_uuid: uuid}})
}
const cartStore = useCartStore()

function getAddons(item:Item):string {
  let addonNames:string[] = []
  item.item_addon_categories?.forEach((addonCat) => {
    if(addonCat.type == 'single') {
      if(addonCat.selected_addon_id) {
        addonNames.push(addonCat.item_addons.find((addon) => addon.id === addonCat.selected_addon_id)?.name || '')
      }
    } else {
      if(addonCat.selected_addon_ids.length > 0) {
        addonCat.item_addons.forEach((addon) => {
          if(addonCat.selected_addon_ids.includes(addon.id)) {
            addonNames.push(addon.name)
          }
        })
      }
    }
  })
  return addonNames.join(',')
}

function getCartItemTotal(cartItem:CartItem):string {
  let total = cartItem.item.price
  cartItem.item.item_addon_categories?.forEach((addonCat) => {
    if(addonCat.type == 'single') {
      if(addonCat.selected_addon_id) {
        total += addonCat.item_addons.find((addon) => addon.id === addonCat.selected_addon_id)?.price || 0
      }
    } else {
      if(addonCat.selected_addon_ids.length > 0) {
        addonCat.item_addons.forEach((addon) => {
          if(addonCat.selected_addon_ids.includes(addon.id)) {
            total += addon.price
          }
        })
      }
    }
  })
  return 'AED ' + (total * cartItem.qty).toFixed(2)
}
const basketEmptyDialog = ref(false)
function removeQty(cartItem:CartItem,i:number) {
  if(cartItem.qty > 1) {
    cartItem.qty -= 1
  } else {
    cartStore.removeItem(i)
  }
  nextTick(() => {
    if(cartStore.items.length == 0) {
      basketEmptyDialog.value = true
    }
  })
  LocalStorage.set('cartItems',cartStore.items)
}
function addQty(cartItem:CartItem,i:number) {
  cartItem.qty += 1
  LocalStorage.set('cartItems',cartStore.items)
}
const appStore = useAppStore()
onMounted(async () => {
  try {
    const res = await appStore.init()
    if(res === 'unauthenticated') {
      await $router.push({
        name:'Login',
        params: {store_id: store_id, table_uuid: uuid}
      })
    }
    if(cartStore.items.length == 0) {
      basketEmptyDialog.value = true
    }
  } catch (e) {
    console.log(e)
  }
  window.Frames.init('pk_sbox_4gpm6juoifix5xw2r46jmyxj2e4')
})

async function payNow() {
  if(window.Frames.isCardValid()) {
    try {
      const res = await window.Frames.submitCard()
      console.log(res)
    } catch (e) {
      console.log(e)
    }
  }
}
</script>
