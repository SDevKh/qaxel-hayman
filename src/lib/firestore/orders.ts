import { doc, setDoc, updateDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import type { OrderDoc, PaymentDoc } from './types';

export async function createOrder(params: OrderDoc) {
  try {
    const orderId = globalThis.crypto?.randomUUID?.() ?? `order_${Date.now()}`;
    const orderRef = doc(db, 'orders', orderId);
    
    // Sanitize data for Firestore (ensure plain objects and no undefined)
    const sanitizedParams = JSON.parse(JSON.stringify(params));
    
    console.log('Attempting to create order in Firestore:', orderId, sanitizedParams);
    
    await setDoc(orderRef, sanitizedParams);
    
    console.log('Order successfully created in Firestore:', orderId);
    return orderId;
  } catch (error) {
    console.error('CRITICAL: Firestore order creation failed:', error);
    // Log the actual error message to help debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
}

export async function createPayment(params: PaymentDoc) {
  const paymentId = globalThis.crypto?.randomUUID?.() ?? `payment_${Date.now()}`;
  const paymentRef = doc(db, 'payments', paymentId);
  await setDoc(paymentRef, params);
  return paymentId;
}

export async function updateOrderStatus(
  orderId: string,
  params: {
    status: OrderDoc['status'];
    paymentId?: string;
  }
) {
  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, {
    ...params,
    updatedAt: Date.now(),
  });
}

export async function getUserOrders(email: string): Promise<(OrderDoc & { id: string })[]> {
  const ordersRef = collection(db, 'orders');
  const q = query(
    ordersRef, 
    where('userEmail', '==', email),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((orderDoc) => ({
    id: orderDoc.id,
    ...(orderDoc.data() as OrderDoc),
  }));
}
