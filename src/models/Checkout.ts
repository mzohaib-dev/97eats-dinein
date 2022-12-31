export interface Frames {
  init(public_key?:string): void;
  isCardValid():boolean;
  submitCard():Promise<SubmitCardResponse>,
  enableSubmitForm():undefined
}
export interface SubmitCardResponse{
  type:string;
  token: string;
  expires_on: string;
  expiry_month:number;
  expiry_year:number;
  scheme:string;
  last4: string;
  bin: string;
  card_type: string;
  card_category: string;
  issuer_country: string;
  product_id: string;
  product_type: string;
}

export interface PaymentRequestResponse {
  id: string;
  action_id: string;
  amount: number;
  currency: string;
  approved: boolean;
  status: 'Authorized' | 'Pending' | 'Card Verified' | 'Declined';
  response_code: string;
  order_details: {
    order_id: number
  },
  processed_on: string;
  _links: {
    self: {
      href: string;
    },
    actions: {
      href: string;
    },
    redirect: {
      href: string;
    }
  },
  reference: string;
}
