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
        name: 'Menu',
      },
      {
        path: 'store/:store_id/:table_uuid/login',
        component: () => import('pages/LoginPage.vue'),
        name: 'Login',
      },
      {
        path: 'store/:store_id/:table_uuid/otp',
        component: () => import('pages/OtpPage.vue'),
        name: 'Otp',
      },
      {
        path: 'store/:store_id/:table_uuid/checkout',
        component: () => import('pages/BasketPage.vue'),
        name: 'Basket',
      },
      {
        path: 'store/:store_id/:table_uuid/payment/success',
        component: () => import('pages/PaymentSuccess.vue'),
        name: 'PaymentSuccess',
      },
      {
        path: 'store/:store_id/:table_uuid/payment/failure',
        component: () => import('pages/PaymentFailure.vue'),
        name: 'PaymentFailure',
      },
      {
        path: 'store/:store_id/:table_uuid/orders',
        component: () => import('pages/OrdersPage.vue'),
        name: 'Orders',
      },
      {
        path: 'store/:store_id/:table_uuid/orders/:id',
        component: () => import('pages/OrderView.vue'),
        name: 'OrderView',
      },
      {
        path: 'table/:table_uuid',
        component: () => import('pages/TableStores.vue'),
        name: 'TableStores',
      },
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
