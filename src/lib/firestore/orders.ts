import { doc, setDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import type { OrderDoc, PaymentDoc } from './types';

export async function createOrder(params: OrderDoc) {
  try {
    const orderId = (globalThis as any).crypto?.randomUUID?.() ?? `order_${Date.now()}`;
    const orderRef = doc(db, 'orders', orderId);
    
    console.log('Attempting to create order in Firestore:', orderId, params);
    
    await setDoc(orderRef, params);
    
    console.log('Order successfully created in Firestore:', orderId);
    return orderId;
  } catch (error) {
    console.error('CRITICAL: Firestore order creation failed:', error);
    throw error;
  }
}

export async function createPayment(params: PaymentDoc) {
  const paymentId = (globalThis as any).crypto?.randomUUID?.() ?? `payment_${Date.now()}`;
  const paymentRef = doc(db, 'payments', paymentId);
  await setDoc(paymentRef, params);
  return paymentId;
}

export async function getUserOrders(email: string): Promise<(OrderDoc & { id: string })[]> {
  const ordersRef = collection(db, 'orders');
  const q = query(
    ordersRef, 
    where('userEmail', '==', email),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
}
