# DispatchO

> **Next-day delivery route optimization and order dispatching platform.**

DispatchO solves the hardest part of last-mile logistics: deciding *which vehicle carries which orders, and in what sequence it drives*, while satisfying real business constraints — vehicle capacity, customer priority, time windows, and owned vs. contracted fleet — all computed over real road networks.

---

## Features

- **Constraint-based optimization** — Multi-objective solver (hard / medium / soft scoring) using [OptaPlanner](https://www.optaplanner.org/)
- **Real road routing** — Actual driving distances and travel times via [GraphHopper](https://www.graphhopper.com/) on OpenStreetMap data
- **Optimization Summary Dashboard** — Fleet-wide metrics: total orders, vehicles used, distance, travel time, capacity utilization, and solver score
- **Per-vehicle Capacity Utilization** — Visual progress bar showing load vs. max capacity for every vehicle
- **Constraint / Risk Warnings** — Fleet-level alerts and per-vehicle badges surfacing real solver-confirmed violations (over-capacity, route > 50 km, too many stops, under-utilized)
- **Interactive map** — Live route visualization with per-segment polylines
- **Serverless cloud backend** — AWS CDK infrastructure: DynamoDB, S3, Cognito, ECS, Step Functions

---

## Architecture

```
┌─────────────────────────┐      ┌──────────────────────────────┐
│   React Frontend         │─────▶│  API Gateway + Lambda         │
│   (Cloudscape Design)    │      │  (order/vehicle/solver CRUD)  │
└─────────────────────────┘      └────────────┬─────────────────┘
                                               │
                                  ┌────────────▼─────────────────┐
                                  │   Step Functions              │
                                  │   (orchestrates solver job)   │
                                  └────────────┬─────────────────┘
                                               │
                                  ┌────────────▼─────────────────┐
                                  │   ECS (Spring Boot)           │
                                  │   OptaPlanner + GraphHopper   │
                                  │   Optimization Engine         │
                                  └────────────┬─────────────────┘
                                               │
                              ┌────────────────▼──────────────────┐
                              │   DynamoDB  │  S3 (OSM/GH data)   │
                              └───────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + [Cloudscape Design System](https://cloudscape.design/) + MapLibre GL |
| Optimization Engine | Java 21 + Spring Boot + OptaPlanner + GraphHopper |
| Infrastructure | AWS CDK (TypeScript) |
| Build | pnpm workspaces (frontend/infra), Gradle wrapper (engine) |
| Cloud | AWS — DynamoDB, S3, Cognito, ECS, Step Functions, Lambda |

---

## Optimization Constraints

The solver enforces the following constraints (via OptaPlanner's `HardMediumSoftLongScore`):

**Hard (must be satisfied):**
- Vehicle weight capacity must not be exceeded
- Route distance must not exceed 50 km per trip
- Orders for the same customer must not be split across vehicles when a single vehicle can carry them
- Vehicle time-group assignments must be respected
- Company-owned vehicles are preferred over contracted vehicles

**Medium (optimizer minimizes):**
- Vehicle load should be ≥ 70% of capacity (avoids underutilization)
- Max 5 destination stops per vehicle per trip
- Same customer should be served by a single vehicle

**Soft (distance minimization):**
- Minimize total travel distance across all routes

---

## Project Structure

```
├── apps_web/          # React frontend
├── apps_opt_engine/   # Java optimization engine (OptaPlanner + GraphHopper)
├── apps_infra/        # AWS CDK infrastructure
└── docs/              # Architecture and setup documentation
```

---

## Prerequisites

| Tool | Version |
|---|---|
| Node.js | ≥ 20.19 |
| pnpm | ≥ 10 |
| Java (JDK) | 21 |
| Docker | latest |
| AWS CLI | v2 (configured with credentials) |

---

## Getting Started

### 1. Configure AWS target

Edit [`apps_infra/config/default.yml`](./apps_infra/config/default.yml):
```yaml
env:
  account: "123456789012"   # your AWS account ID
  region: "us-east-1"
administratorEmail: "you@example.com"
```

### 2. Install frontend dependencies
```bash
cd apps_web
pnpm install
pnpm dev        # http://localhost:5173
```

### 3. Deploy infrastructure
```bash
cd apps_infra
pnpm install
pnpm cdk bootstrap
pnpm cdk deploy --all
```

### 4. Build & deploy the optimization engine
```bash
cd apps_opt_engine
./gradlew build
# Docker image is built and pushed to ECR as part of CDK deployment
```

---

## License

[MIT](./LICENSE) © 2024 Tejas H
