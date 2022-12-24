<template>
  <q-page>
    <div class="row bg-grey-3">
      <div class="col-12 col-md-4"></div>
      <div class="col-12 col-md-4 relative-position">
        <q-card>
          <q-card-section class="q-py-lg flex justify-around" style="background:#fdbe0f;">
            <div class="col flex justify-center items-center">
              <a href="https://gireeb.ae/app-stores" target="_blank">
                <q-img src="~assets/logo_small.png" width="150px"></q-img>
              </a>
            </div>
            <div class="col flex justify-center items-center">
              <a href="https://gireeb.ae/app-stores" target="_blank">
                <q-img src="~assets/des.png" width="150px"></q-img>
              </a>
            </div>
          </q-card-section>
        </q-card>
        <div class="" style="position: -webkit-sticky; position:sticky; top:0; z-index:10" ref="headerRef">
          <q-card flat bordered>
            <q-card-section class="flex justify-between items-center">
              <q-avatar class="shadow-3">
                <q-img placeholder-src="~assets/g.jpg" :src="model ? model.store.thumbnail : ''" ></q-img>
              </q-avatar>
              <div class="text-grey-8 text-bold" style="font-size: 1rem">Dine-in   |   طلبات داخلية</div>
              <div class="text-grey-7">Table No. {{tableNumber}}</div>
            </q-card-section>
            <q-separator />
            <q-card-section class="q-pa-none">
              <div class="row">
                <div class="col-auto flex items-center justify-center">
                  <q-btn flat icon="menu" @click="openSheet"></q-btn>
                </div>
                <q-separator vertical />
                <div class="col" v-if="model">
                  <q-tabs :model-value="active" @update:model-value="onUpdateTab" active-bg-color="grey-9"
                    active-color="white" no-caps switch-indicator outside-arrows mobile-arrows narrow-indicator>
                    <template v-for="(cat,i) in model.item_categories" :key="i">
                      <q-tab :name="i" :label="cat.name"></q-tab>
                    </template>
                  </q-tabs>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <q-card flat>
          <q-card-section v-if="model">
            <template v-for="(cat,i) in model.item_categories" :key="i">
              <q-card style="z-index:8;" flat :data-id="i" ref="refElements">
                <q-card-section>
                  <div class="text-subtitle2">{{cat.name}}</div>
                </q-card-section>
                <q-separator spaced/>
                <q-card-section class="q-pa-none">
                  <div class="row q-col-gutter-md">
                    <div class="col-6" v-for="(item,j) in cat.items" :key="j">
                      <q-card flat>
                        <div class="relative-position">
                          <q-img
                            :src="item.thumbnail"
                            class="relative-position"
                            style="border-radius: 10px"
                            placeholder-src="~assets/placeholder.png"
                            :ratio="1"
                            />
                          <q-btn
                            color="black"
                            round
                            icon="add"
                            @click="openItemDialog(item)"
                            size="sm"
                            class="absolute-bottom-right q-mb-sm q-mr-sm">
                          </q-btn>
                        </div>
                        <q-card-section>
                          <div class="text">{{item.name}}</div>
                          <div class="text text-grey-8">AED {{item.price.toFixed(2)}}</div>
                        </q-card-section>
                      </q-card>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </template>
          </q-card-section>
        </q-card>
        <div class="fixed-bottom full-width total-block" :class="totalBlockClass">
          <q-card flat>
            <q-card-section>
              <div class="row">
                <div class="col">
                  <div class="text-subtitle1 text-bold">Total</div>
                </div>
                <div class="col">
                  <div class="text-subtitle1 text-bold text-right">AED 35.00</div>
                </div>
              </div>
            </q-card-section>
            <q-card-actions>
              <q-btn color="black" class="full-width" label="Basket"></q-btn>
            </q-card-actions>
          </q-card>
        </div>
      </div>
      <div class="col-12 col-md-4"></div>
      <q-dialog v-model="menuDialog" position="bottom">
        <q-card style="width:500px; max-width: 100%;" class="rounded-borders">
          <q-card-section class="flex justify-between items-center">
            <div class="text-subtitle1 text-bold text-grey-8">Menu</div>
            <q-btn icon="close" v-close-popup flat></q-btn>
          </q-card-section>
          <q-card-section class="q-py-none">
            <q-list separator v-if="model">
              <template v-for="(cat,i) in model.item_categories" :key="i">
                <q-item clickable dense
                        @click="goto(i)" class="q-pl-none">
                  <q-item-section style="font-size: 0.9rem" class="text text-grey-8">{{cat.name}}</q-item-section>
                </q-item>
              </template>
            </q-list>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
  <q-dialog v-model="itemDialog" position="bottom">
    <q-card style="width: 500px; max-width: 100%;" v-if="cartItem">
      <div class="relative-position">
        <q-img :src="cartItem.item.cover" class="relative-position"></q-img>
        <q-btn
          color="white"
          text-color="black"
          round icon="close"
          size="sm"
          class="absolute-top-right q-mt-sm q-mr-sm"
          v-close-popup></q-btn>
      </div>
      <q-separator/>
      <q-card-section>
        <div class="text-subtitle1 text-bold">{{cartItem.item.name}}</div>
        <div class="text-grey-7 text-caption">{{cartItem.item.description}}</div>
        <div class="text-subtitle2 text-grey-8">AED {{cartItem.item.price.toFixed(2)}}</div>
      </q-card-section>
      <q-card-section>
        <div class="text-subtitle1">Instructions</div>
        <q-input type="textarea" v-model="cartItem.instructions" rows="2" outlined placeholder="Let us know if you have special requirements"></q-input>
      </q-card-section>
      <q-card-actions>
        <div class="row q-col-gutter-md full-width q-px-sm">
          <div class="col-auto flex justify-start items-center">
            <q-btn round size="sm" icon="remove" color="grey-3" text-color="black" @click="removeQty"></q-btn>
            <div class="text-subtitle2 q-mx-md">{{cartItem.qty.toString()}}</div>
            <q-btn round size="sm" icon="add" color="grey-3" text-color="black" @click="addQty"></q-btn>
          </div>
          <div class="col">
            <q-btn color="yellow-9" class="full-width" :label="cartItemButtonLabel" @click="addItem"></q-btn>
          </div>
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { QPage, QCard, QCardSection, QImg, QAvatar, QSeparator, QBtn } from 'quasar';
import {computed, nextTick, onMounted, ref, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {api} from 'boot/axios';
import {TableMenu} from 'src/models/Table';
import {Item} from 'src/models/Item';
import {CartItem} from 'src/models/Cart';
import {useCartStore} from 'stores/cart';

const cartStore = useCartStore()
const active = ref(0)
const headerRef = ref<HTMLElement | null>(null)
const refElements = ref([])

onMounted(async () => {
  const store_id = parseInt($route.params.store_id as string)
  const uuid = $route.params.table_uuid as string
  try {
    const response: { data: TableMenu } = await api.get('stores/' + store_id.toString() + '/menu?table_uuid=' + uuid)
    model.value = response.data
  } catch(e) {
    await $router.push('/')
  }
  nextTick(() => {
    const headerHeight = headerRef.value?.getBoundingClientRect().height as number +12
    const rootMargin = '-'+headerHeight+'px 0px -' + (window.innerHeight - headerHeight) + 'px' + ' 0px'
    let observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute('data-id')
        if (entry.isIntersecting) {
          console.log('yes')
          active.value = parseInt(id as string)
        }
      })
    }, {
      root: null,
      rootMargin: rootMargin,
      threshold: 0
    })

    refElements.value.forEach((item: QCard) => {
      observer.observe(item.$el)
    })
  })
})
function onUpdateTab(val: number) {
  const card = refElements.value[val] as QCard
  const el = card.$el as HTMLElement
  const headerHeight = headerRef.value?.getBoundingClientRect().height as number
  const elPos = el.getBoundingClientRect().top
  const offsetPos = elPos + window.scrollY - headerHeight
  window.scrollTo({
    top: offsetPos,
    behavior: 'smooth'
  })
}
const menuDialog = ref(false)

function openSheet() {
  menuDialog.value = true
}

function goto(i: number) {
  menuDialog.value = false
  nextTick(() => {
    onUpdateTab(i)
  })
}
const $route = useRoute()
const $router = useRouter()
const model = ref<TableMenu|null>(null)


const tableNumber = computed(() => {
  return model.value ? model.value.table_info.table_number : ''
})

const itemDialog = ref(false)

const cartItem = ref<CartItem|null>(null)
function openItemDialog(obj: Item) {
  cartItem.value = {
    item: obj,
    qty: 1,
    instructions: ''
  }
  itemDialog.value = true
}

function addQty() {
  if(cartItem.value)
    cartItem.value.qty += 1
}

function removeQty() {
  if(cartItem.value) {
    if(cartItem.value.qty > 1) {
      cartItem.value.qty -= 1
    }
  }
}

const cartItemButtonLabel = computed(() => {
  if(cartItem.value) {
    return 'Add to Basket | '+(cartItem.value.item.price * cartItem.value.qty).toFixed(2)
  }
  return ''
})

function addItem() {
  if(cartItem.value) {
    cartStore.addItem(cartItem.value)
    cartItem.value = null
    itemDialog.value = false
  }
}

const cartItems = computed(() => cartStore.items)
const totalBlockClass =ref('')
watch(cartItems.value,(newV) => {
  if(newV.length > 0) {
    totalBlockClass.value = 'show'
  } else {
    totalBlockClass.value = ''
  }
})
</script>
