"use client";

import * as XLSX from "xlsx";
import { Order } from "./types";

function orderRows(orders: Order[]) {
  return orders.map((o) => ({
    "Order Number": o.orderNumber,
    Status: o.status,
    Customer: o.customer.name,
    Phone: o.customer.phone,
    WhatsApp: o.customer.whatsapp,
    Email: o.customer.email || "",
    Address: o.customer.address,
    City: o.customer.city,
    Region: o.customer.region,
    Items: o.items.map((i) => `${i.name} (${i.size}/${i.color}) x${i.quantity}`).join("; "),
    Subtotal: o.subtotal,
    Shipping: o.shippingFee,
    Total: o.total,
    "Payment Method": o.paymentMethod,
    "Placed At": new Date(o.createdAt).toLocaleString(),
  }));
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportOrdersToCsv(orders: Order[]) {
  const rows = orderRows(orders);
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((h) => `"${String((row as any)[h]).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");
  downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8;" }), `orders-${Date.now()}.csv`);
}

export function exportOrdersToExcel(orders: Order[]) {
  const rows = orderRows(orders);
  if (rows.length === 0) return;
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
  XLSX.writeFile(workbook, `orders-${Date.now()}.xlsx`);
}
