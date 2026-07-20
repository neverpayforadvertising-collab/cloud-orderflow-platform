
# Cloud OrderFlow Platform

A production-style, serverless order-processing platform built with **Node.js, TypeScript, AWS Lambda, API Gateway, SNS, SQS, DynamoDB, and AWS CDK**.

It demonstrates event-driven microservices, asynchronous processing, idempotency, retries, dead-letter queues, observability, and least-privilege security.

## Architecture

flowchart TD
    C["Client"] --> A["API Gateway"]
    A --> O["Order Lambda"]
    O --> D["DynamoDB"]
    O --> T["SNS Topic"]
    T --> PQ["Payment Queue"] --> P["Payment Lambda"]
    T --> IQ["Inventory Queue"] --> I["Inventory Lambda"]
    T --> SQ["Shipping Queue"] --> S["Shipping Lambda"]
    P --> D
    I --> D
    S --> D
    PQ --> DLQ["Dead-Letter Queues"]
    IQ --> DLQ
    SQ --> DLQ

SNS distributes each order event to dedicated SQS queues, allowing services to process independently without direct service-to-service calls.

## Key Features

* Event-driven SNS-to-SQS fan-out
* Independent payment, inventory, and shipping services
* DynamoDB conditional writes for idempotency
* Automatic retries and dead-letter queues
* Structured logs with correlation IDs
* CloudWatch metrics and alarms
* Least-privilege IAM roles
* AWS CDK infrastructure
* Unit, integration, and end-to-end tests

## Tech Stack

**Node.js · TypeScript · AWS Lambda · API Gateway · SNS · SQS · DynamoDB · S3 · CloudWatch · AWS CDK · Jest · Docker**

## API

### Create Order

```http
POST /orders
```

```json
{
  "userId": "user-123",
  "items": [{ "sku": "SKU-001", "quantity": 2 }]
}
```

### Get Order

```http
GET /orders/{orderId}
```

### Replay Failed Event

```http
POST /admin/events/{eventId}/replay
```

## Processing Flow

1. The client creates an order through API Gateway.
2. The Order Lambda stores it in DynamoDB.
3. An `OrderCreated` event is published to SNS.
4. SNS sends the event to dedicated SQS queues.
5. Payment, inventory, and shipping Lambdas process it independently.
6. Failed messages are retried and moved to a DLQ when necessary.

## Project Structure

```text
├── services/
│   ├── order-service/
│   ├── payment-service/
│   ├── inventory-service/
│   └── shipping-service/
├── infrastructure/aws-cdk/
├── shared/
├── tests/
├── docs/
├── docker-compose.yml
└── package.json
```

## Local Setup

```bash
npm install
npm run dev
npm test
```

Optional local AWS environment:

```bash
docker-compose up
```

## Deployment

```bash
cd infrastructure/aws-cdk
npm install
cdk bootstrap
cdk deploy
```

## Roadmap

* OpenTelemetry and AWS X-Ray tracing
* Transactional outbox pattern
* Operations dashboard
* Fraud detection
* Multi-region deployment

```
```
