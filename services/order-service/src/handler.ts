import { OrderCreatedEvent } from "@cloud-orderflow/shared-types";
import { logger } from "@cloud-orderflow/shared-utils";

export const createOrder = async (event: any) => {
  const payload = JSON.parse(event.body || "{}");
  const orderEvent: OrderCreatedEvent = {
    orderId: `ord-${Date.now()}`,
    userId: payload.userId,
    items: payload.items || [],
    status: "PENDING",
    correlationId: event.headers?.["x-correlation-id"] || `corr-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  logger("order.create", { orderId: orderEvent.orderId, correlationId: orderEvent.correlationId });

  return {
    statusCode: 202,
    body: JSON.stringify({ orderId: orderEvent.orderId, status: orderEvent.status, createdAt: orderEvent.createdAt })
  };
};
