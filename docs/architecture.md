# Architecture Overview

This repository implements a serverless event-driven order processing platform designed to simulate a modern e-commerce order lifecycle.

## System Components

- **Order Service**: receives order creation requests and publishes domain events.
- **Payment Service**: consumes order events and simulates payment processing.
- **Inventory Service**: reserves stock based on order items.
- **Shipping Service**: triggers shipment creation and fulfillment.
- **SQS**: buffers order events and ensures at-least-once delivery.
- **SNS**: publishes order state changes and audit notifications.
- **DynamoDB**: stores order state and idempotency markers.
- **S3**: archives event payloads and audit logs.
