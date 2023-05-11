export interface Restaurant {
  id: number;
  name: string;
  thumbnail: string;
  description: string;
  vat_included: boolean;
  has_dine_in_cod: boolean;
  service_charge: number;
  status: number;
}
