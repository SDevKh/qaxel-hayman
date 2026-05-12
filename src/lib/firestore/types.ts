export type OrderStatus = 'created' | 'paid' | 'failed';

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface OrderDoc {
  userEmail: string;
  userFullName?: string;
  items: OrderItem[];
  subtotal: number;
  shippingAddress: {
    email: string;
    fullName: string;
    address: string;
    city: string;
    country: string;
  };
  status: OrderStatus;
  createdAt: number; // epoch millis
}

export interface PaymentDoc {
  orderId: string;
  userEmail: string;
  amount: number;
  currency: string;
  provider: string; // e.g. "demo"
  status: 'succeeded' | 'failed' | 'pending';
  createdAt: number; // epoch millis
}

