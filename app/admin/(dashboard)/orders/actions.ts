"use server";

import { revalidatePath } from "next/cache";
import { adminUpdateOrderStatus } from "@/lib/admin/orders";
import { OrderStatus } from "@/lib/types";

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  await adminUpdateOrderStatus(id, status);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}
