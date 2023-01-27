<template>
  <q-card flat>
    <q-card-section>
      <q-btn class="q-mt-md" icon="arrow_back" size="sm" round unelevated text-color="grey-8" color="white"
        @click="goBack"></q-btn>
    </q-card-section>
    <q-card-section>
      <div class="text-h6 text-grey-9">Enter your phone number</div>
      <div class="text-grey-8">We will send you an SMS with a one-time password (OTP), to verify your phone</div>
    </q-card-section>
    <q-card-section>
      <q-form ref="formRef">
        <label class="text-subtitle2">Your Phone Number</label>
        <q-input v-model="model.phone" type="number" prefix="+971" outlined inputmode="numeric" pattern="[0-9]*"
          novalidate dense lazy-rules :rules="[v => !!v || 'Required']" :error="errors.phone.length > 0"
          :error-message="errors.phone" color="grey-7"></q-input>
      </q-form>
    </q-card-section>
    <q-card-actions>
      <q-btn class="full-width" color="grey-8" label="Send OTP" :disable="!model.phone" @click="sendOtp"></q-btn>
    </q-card-actions>
  </q-card>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { User } from 'src/models/User';
import { api } from 'boot/axios';
import { Loading } from 'quasar';
import { useAppStore } from 'stores/app';

onMounted(async () => {
  try {
    const res = await appStore.init()
    if (res === 'authenticated') {
      await $router.push({
        name: 'Menu',
        params: {
          store_id: store_id,
          table_uuid: uuid
        }
      })
    }
  } catch (e) {
    console.log(e)
  }
})
const $route = useRoute()
const $router = useRouter()
const store_id = parseInt($route.params.store_id as string)
const uuid = $route.params.table_uuid as string
async function goBack() {
  await $router.push({ name: 'Menu', params: { store_id: store_id, table_uuid: uuid } })
}
const appStore = useAppStore()
const model = ref<User>({
  phone: '',
  country_code: '+971'
})

const errors = ref({
  phone: ''
})
async function sendOtp() {
  Loading.show()
  if (model.value.phone) {
    let phone = model.value.phone
    if (phone.at(0) == '0') {
      phone = phone.substring(1)
    }
    if (phone.length !== 9) {
      errors.value.phone = 'Invalid Phone Number'
      return
    }
    try {
      const res: { data: { message: string } } = await api.post('dine-in/otp', model.value)
      if (res.data.message === 'success') {
        await $router.push({
          name: 'Otp',
          params: {
            store_id: store_id,
            table_uuid: uuid
          },
          query: {
            phone: phone
          }
        })
      }
    } catch (e) {
      console.log(e)
    }
  }
  Loading.hide()
}
</script>
