import { OrderCreatedEvent } from "@cloud-orderflow/shared-types";
import { logger } from "@cloud-orderflow/shared-utils";

export const reserveInventory = async (event: any) => {
  const message = JSON.parse(event.Records?.[0]?.body || "{}");
  const order: OrderCreatedEvent = message;

  logger("inventory.reserve", { orderId: order.orderId, items: order.items });

  return {
    statusCode: 200,
    body: JSON.stringify({ orderId: order.orderId, inventoryStatus: "RESERVED" })
  };
};
