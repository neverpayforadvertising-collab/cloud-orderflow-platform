import { OrderCreatedEvent } from "@cloud-orderflow/shared-types";
import { logger } from "@cloud-orderflow/shared-utils";

export const processPayment = async (event: any) => {
  const message = JSON.parse(event.Records?.[0]?.body || "{}");
  const order: OrderCreatedEvent = message;

  logger("payment.start", { orderId: order.orderId, correlationId: order.correlationId });

  return {
    statusCode: 200,
    body: JSON.stringify({ orderId: order.orderId, paymentStatus: "COMPLETED" })
  };
};
