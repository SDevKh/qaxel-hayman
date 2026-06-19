export type OrderStatus = 'created' | 'paid' | 'failed' | 'cod_pending' | 'processing' | 'shipped' | 'delivered';

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

export interface OrderDoc {
  userEmail: string;
  userFullName?: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  shippingAddress: {
    email: string;
    fullName: string;
    address: string;
    city: string;
    country: string;
  };
  status: OrderStatus;
  paymentMethod?: 'online' | 'cod';
  paymentId?: string;
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

