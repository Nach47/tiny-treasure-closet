export type ProductStatus = "active" | "hidden" | "draft";

export interface ProductImage {
  url: string;
  alt?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  category: string;
  subcategory?: string;
  ageGroup: string;
  sizes: string[];
  colors: string[];
  stock: number;
  sku: string;
  status: ProductStatus;
  weightGrams?: number;
  images: ProductImage[];
  tags: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  unitPrice: number;
  size: string;
  color: string;
  quantity: number;
  stock: number;
}

export interface CheckoutDetails {
  name: string;
  phone: string;
  whatsapp: string;
  email?: string;
  address: string;
  region: string;
  city: string;
  notes?: string;
}

export type PaymentMethod = "mtn" | "telecel" | "airteltigo";

export interface PlacedOrder {
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  customer: CheckoutDetails;
  paymentMethod: PaymentMethod;
  paymentScreenshotName?: string;
  createdAt: string;
}

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  customer: CheckoutDetails;
  paymentMethod: PaymentMethod;
  paymentScreenshotPath?: string | null;
  createdAt: string;
  updatedAt: string;
}

