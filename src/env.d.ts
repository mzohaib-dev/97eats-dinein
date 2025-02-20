/* eslint-disable */

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
    CHECKOUT_PAYMENT_REQUEST_URL: string;
    CHECKOUT_TOKEN_URL: string;
    CHECKOUT_PUBLIC_API_KEY: string;
    GOOGLE_PAY_ENV: string;
    GOOGLE_PAY_MERCHANT_NAME: string;
    GOOGLE_PAY_MERCHANT_ID: string;
  }
}
