import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: 'store/:store_id/:table_uuid/menu',
        component: () => import('pages/TableMenu.vue'),
        name:'Menu'
      },
      {
        path:'store/:store_id/:table_uuid/login',
        component:() => import('pages/LoginPage.vue'),
        name: 'Login'
      },
      {
        path:'store/:store_id/:table_uuid/otp',
        component:() => import('pages/OtpPage.vue'),
        name: 'Otp'
      },
      {
        path:'store/:store_id/:table_uuid/checkout',
        component:() => import('pages/BasketPage.vue'),
        name: 'Basket',
      }
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
