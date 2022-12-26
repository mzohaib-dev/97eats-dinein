import { defineStore } from 'pinia';
import {User} from 'src/models/User';
import {Loading, LocalStorage} from 'quasar';
import {api} from 'boot/axios';

export const useAppStore = defineStore('app', {
  state: () => ({
    user: null as User | null
  }),

  getters: {

  },

  actions: {
    async init() {
      return new Promise<string>((resolve, reject) => {
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
            LocalStorage.remove('token')
            this.user = null
            resolve('unauthenticated')
          })
          Loading.hide()
        }
      })
    }
  }
});
