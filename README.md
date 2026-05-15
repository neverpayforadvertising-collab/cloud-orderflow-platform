# Cloud OrderFlow Platform

A senior-level flagship project demonstrating an AWS serverless, event-driven order processing pipeline that mirrors the backend patterns used at major e-commerce platforms.

## Overview

Cloud OrderFlow Platform is a distributed order processing system built with TypeScript, AWS Lambda, SQS, SNS, DynamoDB, and API Gateway. It simulates a realistic e-commerce workflow from order creation through payment processing, inventory reservation, and shipping orchestration.

This repository is designed to showcase:

- Event-driven microservices architecture
- Asynchronous order lifecycle processing
- Idempotent retry handling with DLQ support
- Observability and trace context across services
- Secure serverless AWS service boundaries
- Production-grade Node.js backend structure

## Problem Statement

Modern online commerce systems must handle large order volumes while remaining resilient to partial failures, traffic spikes, and service boundaries. Monolithic or synchronous service chains create tight coupling, brittle retries, and poor fault isolation.

This project addresses these challenges by designing a cloud-native order pipeline that:

- decouples domain services via asynchronous messaging
- uses queues and pub/sub for resilience and buffering
- models state with a scalable key-value store
- treats failures, retries, and idempotency as first-class concerns

## Architecture

The platform is intentionally event-driven. No service directly calls another.

```
flowchart TD
  Client[Client / API Consumer] --> APIGW[API Gateway]
  APIGW --> OrderLambda[Order Service Lambda]
  OrderLambda --> SQS[OrderCreated SQS Queue]
  SQS --> Payment[Payment Service Lambda]
  SQS --> Inventory[Inventory Service Lambda]
  SQS --> Shipping[Shipping Service Lambda]
  Payment --> DynamoDB[Order State Store (DynamoDB)]
  Inventory --> DynamoDB
  Shipping --> DynamoDB
  Payment --> SNS[Order Events SNS Topic]
  Inventory --> SNS
  Shipping --> SNS
  SNS --> CloudWatch[CloudWatch + S3 Audit]
  SQS --> DLQ[Dead Letter Queue]
```

### Order Lifecycle

```
sequenceDiagram
  participant C as Client
  participant A as API Gateway
  participant O as Order Service
  participant Q as SQS Queue
  participant P as Payment Service
  participant I as Inventory Service
  participant S as Shipping Service
  participant D as DynamoDB

  C->>A: POST /orders
  A->>O: invoke Lambda
  O->>Q: publish OrderCreatedEvent
  Q->>P: deliver event
  Q->>I: deliver event
  Q->>S: deliver event
  P->>D: update payment state
  I->>D: reserve inventory
  S->>D: create shipment record
  P-->>Q: ack
  I-->>Q: ack
  S-->>Q: ack
```

## Repository Structure

```
cloud-orderflow-platform/
├── services/
│   ├── order-service/
│   ├── payment-service/
│   ├── inventory-service/
│   ├── shipping-service/
├── infrastructure/
│   ├── aws-cdk/
│   ├── iam/
│   ├── sqs-sns/
├── shared/
│   ├── types/
│   ├── utils/
├── tests/
│   ├── integration/
│   ├── e2e/
├── docs/
│   ├── architecture.md
│   ├── diagrams/
├── docker-compose.yml
├── README.md
└── package.json
```

## Tech Stack

- Node.js + TypeScript
- Express / API Gateway layer
- AWS Lambda
- AWS SQS & SNS
- AWS DynamoDB
- AWS S3 (event archive)
- AWS CloudWatch (logs / metrics)
- IAM least-privilege roles
- AWS CDK for infrastructure
- Jest + Supertest for tests

## Core Features

1. **Event-driven workflow**
   - Order creation publishes a domain event
   - Downstream services consume events independently
   - No direct service-to-service calls

2. **Idempotent processing**
   - Each service stores idempotency state
   - Uses DynamoDB conditional writes
   - Protects against duplicate deliveries

3. **Retry + Dead Letter Queue**
   - SQS retries transient failures automatically
   - Failed messages move to DLQ after threshold
   - Replay endpoint supports recovery workflows

4. **Observability**
   - Structured JSON logs with correlation IDs
   - CloudWatch metrics for service health
   - Trace IDs propagated across service boundaries

5. **Security**
   - IAM roles scoped per Lambda
   - Least-privilege permissions for SQS, SNS, DynamoDB, S3
   - API Gateway request validation and auth simulation

## API Reference

### Create Order

`POST /orders`

Request body:

```json
{
  "userId": "user-123",
  "items": [
    { "sku": "SKU-001", "quantity": 2 }
  ]
}
```

Response:

```json
{
  "orderId": "ord_789",
  "status": "PENDING",
  "createdAt": "2026-05-15T10:00:00Z"
}
```

### Get Order Status

`GET /orders/{orderId}`

Response:

```json
{
  "orderId": "ord_789",
  "status": "SHIPPED",
  "updatedAt": "2026-05-15T10:00:00Z",
  "events": ["ORDER_CREATED", "PAYMENT_COMPLETED", "INVENTORY_RESERVED", "SHIPPING_STARTED"]
}
```

### Replay Failed Event

`POST /admin/events/{eventId}/replay`

Used for debugging and recovering failed DLQ events.

## Data Model

### Orders Table (DynamoDB)

- `orderId` (PK)
- `userId`
- `items`
- `status`
- `paymentStatus`
- `inventoryStatus`
- `shippingStatus`
- `createdAt`
- `updatedAt`
- `correlationId`
- `idempotencyKey`

Designed for:

- fast single-key lookup
- event-driven state updates
- minimal read latency

## Design Decisions

### Why Event-Driven Architecture?

- Decouples producer and consumer services
- Improves fault isolation
- Enables asynchronous scaling
- Handles traffic spikes gracefully

### Why AWS Lambda?

- Removes server management overhead
- Supports automatic scaling per event
- Fits event-based workloads naturally

### Why SQS instead of direct sync calls?

- Provides buffering and backpressure
- Enables retries and DLQ handling
- Prevents cascading failures across services

### Why DynamoDB instead of a relational DB?

- Offers predictable low-latency reads/writes
- Supports flexible schema for evolving order events
- Scales automatically without sharding complexity

## Failure Handling

- All event consumers are designed for at-least-once delivery
- Idempotency ensures repeated events do not duplicate effects
- Transient failures are retried with exponential backoff
- Poison messages are moved to a DLQ for manual inspection
- Admin replay endpoint supports recovery from failed events

## Scalability

- Lambda provides horizontal scaling per invocation
- SQS absorbs traffic spikes and smooths load
- Stateless services can be deployed independently
- DynamoDB scales throughput with demand
- SNS can fan out updates to observability and auditing targets

## Testing Strategy

- Unit tests for business logic using Jest
- Integration tests for API → Lambda flows
- Event-driven workflow simulation
- Local AWS mocks / LocalStack support optional

## Local Development

```bash
npm install
npm run dev
```

Optional local infrastructure:

```bash
docker-compose up
```

## Deployment

```bash
cd infrastructure/aws-cdk
cdk deploy
```

## Future Improvements

- Add OpenTelemetry distributed tracing
- Add Postgres analytics / reporting layer
- Build a React admin dashboard for order monitoring
- Add fraud detection and anomaly alerts
- Implement multi-region active/active deployment
