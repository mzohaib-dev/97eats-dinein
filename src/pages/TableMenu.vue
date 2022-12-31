<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <div v-show="!loading">
      <q-card>
        <q-card-section
          class="q-py-lg flex justify-around"
          style="background: #fdbe0f"
        >
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
      <div
        class=""
        style="position: -webkit-sticky; position: sticky; top: 0; z-index: 10"
        ref="headerRef"
      >
        <q-card flat bordered>
          <q-card-section
            class="flex justify-between items-center q-py-xs q-pr-xs"
          >
            <q-avatar class="shadow-3" size="sm">
              <q-img
                placeholder-src="~assets/g.jpg"
                :src="model ? model.store.thumbnail : ''"
              ></q-img>
            </q-avatar>
            <div class="text-grey-7 text-caption">
              Table No. {{ tableNumber }}
            </div>
            <template v-if="appStore.user">
              <q-btn
                icon="account_circle"
                size="md"
                round
                flat
                @click="accountDialog = true"
              ></q-btn>
            </template>
            <template v-else>
              <q-btn
                icon="account_circle"
                size="md"
                round
                flat
                :to="{
                  name: 'Login',
                  params: { store_id: store_id, table_uuid: uuid },
                }"
              ></q-btn>
            </template>
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pa-none">
            <div class="row">
              <div class="col-auto flex items-center justify-center">
                <q-btn flat icon="menu" @click="openSheet"></q-btn>
              </div>
              <q-separator vertical />
              <div class="col" v-if="model">
                <q-tabs
                  :model-value="active"
                  @update:model-value="onUpdateTab"
                  active-bg-color="yellow-9"
                  active-color="white"
                  no-caps
                  switch-indicator
                  outside-arrows
                  mobile-arrows
                >
                  <template v-for="(cat, i) in model.item_categories" :key="i">
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
          <template v-for="(cat, i) in model.item_categories" :key="i">
            <q-card style="z-index: 8" flat :data-id="i" ref="refElements">
              <q-card-section>
                <div class="text-subtitle1 text-bold">{{ cat.name }}</div>
              </q-card-section>
              <q-separator spaced />
              <q-card-section class="q-pa-none">
                <div class="row q-col-gutter-md">
                  <div class="col-6" v-for="(item, j) in cat.items" :key="j">
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
                          class="absolute-bottom-right q-mb-sm q-mr-sm"
                        >
                        </q-btn>
                      </div>
                      <q-card-section>
                        <div class="text">{{ item.name }}</div>
                        <div class="text text-grey-8" v-if="item.price > 0">
                          AED {{ item.price.toFixed(2) }}
                        </div>
                        <q-chip
                          color="grey-2"
                          class="q-ma-none"
                          text-color="grey-8"
                          square
                          v-else
                          >Price on Selection</q-chip
                        >
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </template>
          <div class="window-height flex justify-center items-center">
            <q-img src="~assets/logo_small.png" width="200px" />
          </div>
        </q-card-section>
      </q-card>
      <div
        class="fixed-bottom full-width total-block show"
        v-show="cartStore.items.length > 0"
      >
        <q-card flat>
          <div class="bg-yellow-9" style="height: 3px"></div>
          <q-card-section>
            <div class="row">
              <div class="col">
                <div class="text-subtitle1 text-bold">Total</div>
              </div>
              <div class="col">
                <div class="text-subtitle1 text-bold text-right">
                  AED {{ cartStore.cartTotal.toFixed(2) }}
                </div>
              </div>
            </div>
          </q-card-section>
          <q-card-actions>
            <q-btn
              color="yellow-9"
              text-color="white"
              class="full-width"
              label="Basket"
              @click="gotoBasket"
            ></q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </transition>
  <q-inner-loading
    :showing="loading"
    class=""
    style="position: fixed !important"
  >
    <q-spinner-gears size="50px" color="primary" />
  </q-inner-loading>
  <q-dialog v-model="menuDialog" position="bottom">
    <q-card style="width: 500px; max-width: 100%" class="rounded-borders">
      <q-card-section class="flex justify-between items-center">
        <div class="text-subtitle1 text-bold text-grey-8">Menu</div>
        <q-btn icon="close" v-close-popup flat></q-btn>
      </q-card-section>
      <q-card-section class="q-py-none">
        <q-list separator v-if="model">
          <template v-for="(cat, i) in model.item_categories" :key="i">
            <q-item clickable dense @click="goto(i)" class="q-pl-none">
              <q-item-section
                style="font-size: 0.9rem"
                class="text text-grey-8"
                >{{ cat.name }}</q-item-section
              >
            </q-item>
          </template>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
  <q-dialog v-model="itemDialog" position="bottom">
    <div class="bg-grey-3" ref="itemDialogRef">
      <template v-if="itemModel">
        <q-card style="width: 500px; max-width: 100%" flat>
          <div class="relative-position">
            <q-img
              :src="itemModel.item.cover"
              class="relative-position"
            ></q-img>
            <q-btn
              color="white"
              text-color="black"
              round
              flat
              icon="close"
              size="sm"
              class="absolute-top-right q-mt-sm q-mr-sm"
              v-close-popup
            ></q-btn>
          </div>
          <q-separator />
          <q-card-section>
            <div class="text-subtitle1 text-bold">
              {{ itemModel.item.name }}
            </div>
            <div class="text-grey-7 text-caption">
              {{ itemModel.item.description }}
            </div>
            <div class="text-subtitle2 text-grey-8">
              AED {{ itemModel.item.price.toFixed(2) }}
            </div>
          </q-card-section>
        </q-card>
        <template
          v-for="(addon_cat, k) in itemModel.item.item_addon_categories"
          :key="k"
        >
          <q-card class="q-my-xs" flat ref="cartCatRefs">
            <q-card-section>
              <div class="row justify-between">
                <div class="col">
                  <div class="text-bold">{{ addon_cat.name }}</div>
                </div>
                <div class="col-auto" v-if="addon_cat.type === 'single'">
                  <div class="text-caption text-red-7">Required</div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="text-caption text-red-7">
                    <template v-if="addon_cat.type === 'single'"
                      >Choose 1</template
                    >
                    <template v-else>
                      <template v-if="addon_cat.min_selection === 0">
                        <span
                          class="text-grey-8"
                          v-if="
                            addon_cat.max_selection ===
                              addon_cat.item_addons.length ||
                            addon_cat.max_selection == 0
                          "
                          >Optional</span
                        >
                        <span class="text-grey-8" v-else
                          >Optional. Max selection upto
                          {{ addon_cat.max_selection }}</span
                        >
                      </template>
                      <template
                        v-else-if="
                          addon_cat.item_addons.length ===
                          addon_cat.max_selection
                        "
                      >
                        Select at least {{ addon_cat.min_selection }}
                      </template>
                      <template v-else>
                        Select at least {{ addon_cat.min_selection }} upto
                        {{ addon_cat.max_selection }}
                      </template>
                    </template>
                  </div>
                </div>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section class="q-pa-none">
              <q-list>
                <q-item
                  v-ripple
                  v-for="(addon, m) in addon_cat.item_addons"
                  :key="m"
                >
                  <q-item-section avatar>
                    <q-radio
                      v-if="addon_cat.type === 'single'"
                      :val="addon.id"
                      v-model="addon_cat.selected_addon_id"
                    ></q-radio>
                    <q-checkbox
                      v-else
                      :val="addon.id"
                      v-model="addon_cat.selected_addon_ids"
                    ></q-checkbox>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      {{ addon.name }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    AED {{ addon.price.toFixed(2) }}
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </template>
        <q-card>
          <q-card-section>
            <div class="text-subtitle1">Instructions</div>
            <q-input
              type="textarea"
              v-model="itemModel.instructions"
              rows="2"
              outlined
              placeholder="Let us know if you have special requirements"
            ></q-input>
          </q-card-section>
          <q-card-actions>
            <div class="row q-col-gutter-md full-width q-px-sm">
              <div class="col-auto flex justify-start items-center">
                <q-btn
                  round
                  size="sm"
                  icon="remove"
                  color="grey-3"
                  text-color="black"
                  @click="removeQty"
                ></q-btn>
                <div class="text-subtitle2 q-mx-md">
                  {{ itemModel.qty.toString() }}
                </div>
                <q-btn
                  round
                  size="sm"
                  icon="add"
                  color="grey-3"
                  text-color="black"
                  @click="addQty"
                ></q-btn>
              </div>
              <div class="col">
                <q-btn
                  color="yellow-9"
                  class="full-width"
                  :label="itemModelButtonLabel"
                  @click="addItem"
                ></q-btn>
              </div>
            </div>
          </q-card-actions>
        </q-card>
      </template>
    </div>
  </q-dialog>
  <q-dialog v-model="accountDialog" position="bottom">
    <div class="bg-grey-3">
      <q-card style="width: 500px; max-width: 100%" flat>
        <q-card-section>
          <q-list>
            <q-item
              clickable
              :to="{
                name: 'Orders',
                params: { store_id: store_id, table_uuid: uuid },
              }"
              class="text-grey-8"
            >
              <q-item-section avatar>
                <q-icon name="list_alt"></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label> My Orders </q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable @click="logoutFn" class="text-red-7">
              <q-item-section avatar>
                <q-icon name="logout"></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label> Logout </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </q-dialog>
</template>
<script lang="ts" setup>
import {
  QCard,
  QCardSection,
  QImg,
  QAvatar,
  QSeparator,
  QBtn,
  QItem,
  LocalStorage,
  Dialog,
  Notify,
  useQuasar,
} from 'quasar';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from 'boot/axios';
import { TableMenu } from 'src/models/Table';
import { Item } from 'src/models/Item';
import { CartItem, CartItemAddon } from 'src/models/Cart';
import { useCartStore } from 'stores/cart';
import { useAppStore } from 'stores/app';

const cartStore = useCartStore();
const active = ref(0);
const headerRef = ref<HTMLElement | null>(null);
const refElements = ref([]);
let observer: IntersectionObserver | null = null;
const itemDialogRef = ref<HTMLElement | null>(null);
const appStore = useAppStore();
const $route = useRoute();
const $router = useRouter();
const store_id = parseInt($route.params.store_id as string);
const uuid = $route.params.table_uuid as string;
const accountDialog = ref(false);
const loading = ref(true);
onMounted(async () => {
  await appStore.init();
  try {
    const response: { data: TableMenu } = await api.get(
      'stores/' + store_id.toString() + '/menu?table_uuid=' + uuid
    );
    model.value = response.data;
    LocalStorage.set('tableNumber', model.value.table_info.table_number);
  } catch (e) {
    await $router.push('/');
  }
  loading.value = false;
  await nextTick(async () => {
    const rootMargin =
      '-121px 0px -' + (window.innerHeight - 121) + 'px' + ' 0px';
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('data-id');
          if (entry.isIntersecting) {
            active.value = parseInt(id as string);
          }
        });
      },
      {
        root: null,
        rootMargin: rootMargin,
        threshold: 0,
      }
    );
    await nextTick(() => {
      refElements.value.forEach((item: QCard) => {
        observer?.observe(item.$el);
      });
    });
  });

  window.addEventListener('resize', function () {
    refElements.value.forEach((item: QCard) => {
      observer?.unobserve(item.$el);
      const rootMargin =
        '-121px 0px -' + (window.innerHeight - 121) + 'px' + ' 0px';
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const id = entry.target.getAttribute('data-id');
            if (entry.isIntersecting) {
              active.value = parseInt(id as string);
            }
          });
        },
        {
          root: null,
          rootMargin: rootMargin,
          threshold: 0,
        }
      );
      refElements.value.forEach((item: QCard) => {
        observer?.observe(item.$el);
      });
    });
  });
});

function onUpdateTab(val: number) {
  const card = refElements.value[val] as QCard;
  const el = card.$el as HTMLElement;
  const headerHeight = headerRef.value?.getBoundingClientRect()
    .height as number;
  const elPos = el.getBoundingClientRect().top;
  const offsetPos = elPos + window.scrollY - headerHeight;
  window.scrollTo({
    top: offsetPos,
    behavior: 'smooth',
  });
}
const menuDialog = ref(false);

function openSheet() {
  menuDialog.value = true;
}

function goto(i: number) {
  menuDialog.value = false;
  nextTick(() => {
    onUpdateTab(i);
  });
}

const model = ref<TableMenu | null>(null);

const tableNumber = computed(() => {
  return model.value ? model.value.table_info.table_number : '';
});

const itemDialog = ref(false);

const itemModel = ref<{ item: Item; qty: number; instructions: string } | null>(
  null
);

function openItemDialog(obj: Item) {
  itemModel.value = {
    item: JSON.parse(JSON.stringify(obj)) as Item,
    qty: 1,
    instructions: '',
  };
  itemDialog.value = true;
}

function addQty() {
  if (itemModel.value) itemModel.value.qty += 1;
}

function removeQty() {
  if (itemModel.value) {
    if (itemModel.value.qty > 1) {
      itemModel.value.qty -= 1;
    }
  }
}

const itemModelButtonLabel = computed(() => {
  if (itemModel.value) {
    let price = itemModel.value.item.price;
    itemModel.value.item.item_addon_categories?.forEach((itemAddonCategory) => {
      if (
        itemAddonCategory.type == 'single' &&
        itemAddonCategory.selected_addon_id
      ) {
        const selectedAddon = itemAddonCategory.item_addons.find(
          (addon) => addon.id == itemAddonCategory.selected_addon_id
        );
        price += selectedAddon?.price || 0;
      }
    });
    const total = price * itemModel.value.qty;
    return 'Add to Basket | AED ' + total.toFixed(2);
  }
  return '';
});

function addItem() {
  if (itemModel.value) {
    let flag = true;
    itemModel.value.item.item_addon_categories?.every((cat, i) => {
      if (cat.type == 'single') {
        if (!cat.selected_addon_id) {
          const catRef = cartCatRefs.value[i] as QItem;
          catRef.$el.scrollIntoView({
            behavior: 'smooth',
          });
          flag = false;
          return false;
        }
      } else {
        if (cat.min_selection > 0) {
          if (cat.selected_addon_ids.length < cat.min_selection) {
            flag = false;
            return false;
          }
        }
        if (cat.max_selection > 0) {
          if (cat.selected_addon_ids.length > cat.max_selection) {
            flag = false;
            return false;
          }
        }
      }
      return true; // This is required for Array.every() function (JS)
    });
    if (flag) {
      let addNew = true;
      let updateIndex: number | null = null;
      cartStore.items.every((cItem, index) => {
        if (cItem.id == itemModel.value?.item.id) {
          if (cItem.instructions == itemModel.value.instructions) {
            const selectedAddons1: number[] = [];
            cItem.addons.forEach((addon) => {
              selectedAddons1.push(addon.id);
            });
            const selectedAddons2: number[] = [];
            itemModel.value.item.item_addon_categories?.every((addonCat) => {
              if (addonCat.type == 'single') {
                selectedAddons2.push(addonCat.selected_addon_id);
              } else {
                if (addonCat.selected_addon_ids) {
                  addonCat.selected_addon_ids.forEach((id) => {
                    selectedAddons2.push(id);
                  });
                }
              }
            });
            if (
              selectedAddons1.sort().join() == selectedAddons2.sort().join()
            ) {
              addNew = false;
              updateIndex = index;
            }
          }
          return false;
        }
        return true;
      });
      if (addNew) {
        const obj: CartItem = {
          id: itemModel.value.item.id,
          name: itemModel.value.item.name,
          qty: itemModel.value.qty,
          instructions: itemModel.value.instructions,
          price: itemModel.value.item.price,
          addons: [],
        };
        const addons: CartItemAddon[] = [];
        itemModel.value.item.item_addon_categories?.forEach((addonCat) => {
          if (addonCat.type == 'single') {
            addonCat.item_addons.every((a) => {
              if (a.id == addonCat.selected_addon_id) {
                addons.push({
                  id: a.id,
                  name: a.name,
                  price: a.price,
                });
                return false;
              }
              return true;
            });
          } else {
            addonCat.item_addons.forEach((a) => {
              if (addonCat.selected_addon_ids.includes(a.id)) {
                addons.push({
                  id: a.id,
                  name: a.name,
                  price: a.price,
                });
              }
            });
          }
        });
        obj.addons = addons;
        cartStore.addItem(obj);
      } else {
        if (updateIndex !== null)
          cartStore.items[updateIndex].qty += itemModel.value.qty;
      }
      itemModel.value = null;
      itemDialog.value = false;
    }
  }
}

const itemModels = computed(() => cartStore.items);
const totalBlockClass = ref('');
watch(itemModels.value, (newV) => {
  if (newV.length > 0) {
    totalBlockClass.value = 'show';
  } else {
    totalBlockClass.value = '';
  }
});

const cartCatRefs = ref<QItem[]>([]);

async function gotoBasket() {
  await $router.push({
    name: 'Basket',
    params: {
      store_id: store_id,
      table_uuid: uuid,
    },
  });
}

function logoutFn() {
  Dialog.create({
    title: 'Confirm',
    message: 'Do you want to logout?',
    ok: {
      label: 'Yes',
      flat: true,
      color: 'red-8',
    },
    cancel: {
      label: 'No',
      color: 'green',
      unelevated: true,
      flat: false,
    },
  }).onOk(async () => {
    try {
      const res: { data: { message: string } } = await api.post(
        'dine-in/logout'
      );
      if (res.data.message === 'success') {
        accountDialog.value = false;
        Notify.create({
          message: 'You have logged out successfully',
          type: 'info',
        });
        delete api.defaults.headers['Authorization'];
        LocalStorage.remove('token');
        appStore.user = null;
      }
    } catch (e) {
      console.log(e);
    }
  });
}
</script>
