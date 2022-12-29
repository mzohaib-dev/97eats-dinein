<template>
  <q-card flat>
    <q-card-section>
      <q-btn class="q-mt-md" icon="arrow_back" outline round @click="goBack" color="grey-7"></q-btn>
    </q-card-section>
    <q-card-section>
      <div class="text-h6 text-grey-8">Enter the OTP number</div>
      <div class="text-grey-7">We've sent you an SMS with the one-time password to {{phone}}</div>
    </q-card-section>
    <q-card-section class="flex justify-center">
      <VOtpInput
        ref="otpInput"
        input-classes="otp-input"
        separator=" "
        :num-inputs="4"
        :should-auto-focus="true"
        :is-input-num="true"
        :conditionalClass="['one', 'two', 'three', 'four']"
        @on-complete="handleOnComplete"
      />
      <div class="full-width"></div>
      <div class="text-caption q-mt-md text-red-7" v-if="otpError.length > 0">{{otpError}}</div>
    </q-card-section>
    <q-card-section class="text-center">
      <a href="#" v-if="!disableResend" class="text-grey-7" @click="resendCode">I haven't received the code!</a>
      <span v-else class="text-grey-7">I haven't received the code! {{countdown}}</span>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import {useRoute, useRouter} from 'vue-router';
import VOtpInput from 'vue3-otp-input';
import {onMounted, ref} from 'vue';
import {api} from 'boot/axios';
import {Loading, LocalStorage, Notify} from 'quasar';
import {User} from 'src/models/User';
import {AxiosError} from 'axios';
import {useAppStore} from 'stores/app';
import {useCartStore} from 'stores/cart';
const $route = useRoute()
const $router = useRouter()
const phone = $route.query.phone as string
const store_id = parseInt($route.params.store_id as string)
const uuid = $route.params.table_uuid as string
async function goBack() {
  await $router.push({name:'Login', params: {store_id: store_id, table_uuid: uuid}})
}
const otpError = ref('')
const appStore = useAppStore()
const otpInput = ref<typeof VOtpInput|null>(null)
onMounted(async () => {
  try {
    const res = await appStore.init()
    if(res === 'authenticated') {
      await $router.push({
        name: 'Menu',
        params: {
          store_id: store_id,
          table_uuid: uuid
        }
      })
    }
  }catch (e) {
    console.log(e)
  }
})
async function handleOnComplete(val:string) {
  Loading.show()
  if(phone) {
    try {
      const res: {
        data: {
          user: User
          token: string
        }
      } = await api.post('dine-in/verify-otp', {
        phone: phone,
        otp: val
      })
      appStore.user = res.data.user
      api.defaults.headers['Authorization'] = res.data.token
      LocalStorage.set('token',res.data.token)
        await $router.push({
          name: useCartStore().items.length > 0 ? 'Basket' : 'Menu',
          params: {
            store_id: store_id,
            table_uuid: uuid
          }
        })
    } catch (e) {
      const error = e as AxiosError
      otpInput.value?.clearInput()
      if(error.response?.status === 422) {
        otpError.value = error.response.data.message
      }
    }
  }
  Loading.hide()
}

const countdown = ref(0)
const disableResend = ref(false)
async function resendCode() {
  Loading.show()
  if(phone) {
    try {
      const res: { data: { message: string } } = await api.post('dine-in/otp', {
        phone: phone
      })
      if (res.data.message === 'success') {
        Notify.create({
          message: 'The OTP have been sent',
          type: 'positive'
        })
        disableResend.value = true
        countdown.value = 59
        let timer = setInterval(() => {
          countdown.value -= 1
          if(countdown.value == 0) {
            clearInterval(timer)
            disableResend.value = false
          }
        },1000)
      }
    } catch (e) {
      console.log(e)
    }
  }
  Loading.hide()
}
</script>
<style>
.otp-input{
  width:50px;
  height: 50px;
  border-radius: 5px;
  margin-right: 15px;
  text-align: center;
  outline: none;
  border: 1px solid #aaa;
}
</style>
