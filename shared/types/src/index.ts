export interface OrderItem {
  sku: string;
  quantity: number;
}

export interface OrderCreatedEvent {
  orderId: string;
  userId: string;
  items: OrderItem[];
  status: string;
  correlationId: string;
  createdAt: string;
}

export interface OrderState {
  orderId: string;
  userId: string;
  items: OrderItem[];
  status: string;
  paymentStatus: string;
  inventoryStatus: string;
  shippingStatus: string;
  createdAt: string;
  updatedAt: string;
  correlationId: string;
}
export interface OrderItem {
  sku: string;
  quantity: number;
}

export interface OrderCreatedEvent {
  orderId: string;
  userId: string;
  items: OrderItem[];
  status: string;
  correlationId: string;
  createdAt: string;
}

export interface OrderStatus {
  orderId: string;
  status: string;
  updatedAt: string;
  events?: string[];
}
