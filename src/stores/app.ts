import { defineStore } from 'pinia';
import {User} from 'src/models/User';
import {Loading, LocalStorage} from 'quasar';
import {api} from 'boot/axios';

export const useAppStore = defineStore('app', {
  state: () => ({
    user: null as User | null,
    order: null as {id: number} | null
  }),

  getters: {

  },

  actions: {
    async init() {
      const orderId = LocalStorage.getItem('orderId')
      if(orderId){
        this.order = {id: parseInt(orderId as string)}
      }
      return new Promise<string>((resolve) => {
        const token = LocalStorage.getItem('token')
        if (token) {
          Loading.show()
          api.defaults.headers['Authorization'] = 'Bearer ' + token
          api.get('user').then((res: { data: User }) => {
            if (res.data) {
              this.user = res.data
              resolve('authenticated')
            } else {
              LocalStorage.remove('token')
              this.user = null
              resolve('unauthenticated')
            }
          }).catch((e) => {
            console.log(e)
            LocalStorage.remove('token')
            this.user = null
            resolve('unauthenticated')
          })
          Loading.hide()
        } else {
          resolve('unauthenticated')
        }
      })
    }
  }
});
