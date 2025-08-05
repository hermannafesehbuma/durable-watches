'use server';

import { revalidatePath } from 'next/cache';
import { updateOrderStatus } from '../../../api/supabaseapi';

export async function updateOrderStatusAction(orderId: string, status: string) {
  const result = await updateOrderStatus(orderId, status);

  // Revalidate admin pages after successful update
  if (!result.error) {
    revalidatePath('/admin/orders');
    revalidatePath('/admin');
  }

  return result;
}
