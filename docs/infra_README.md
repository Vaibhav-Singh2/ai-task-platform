# Infrastructure (Kubernetes & Argo CD) - README

## Overview

This repository contains Kubernetes manifests and GitOps configuration
for deploying the AI Task Processing Platform using Argo CD.

------------------------------------------------------------------------

## Structure

    infra/
    ├── base/
    │   ├── namespace.yaml
    │   ├── frontend/
    │   ├── backend/
    │   ├── worker/
    │   ├── redis/
    │   └── mongodb/
    ├── overlays/
    │   ├── staging/
    │   └── production/
    └── README.md

------------------------------------------------------------------------

## Kubernetes Components

### Namespace

-   Separate namespace for isolation (e.g., `ai-task-platform`)

### Deployments

-   frontend
-   backend
-   worker
-   redis
-   mongodb

### Services

-   ClusterIP services for internal communication
-   Ingress for external access

### ConfigMaps & Secrets

-   Store configuration and sensitive data securely

------------------------------------------------------------------------

## Scaling Strategy

-   Worker deployment supports multiple replicas
-   Horizontal Pod Autoscaler (HPA) can be enabled
-   Scale based on CPU or custom metrics (queue length)

------------------------------------------------------------------------

## Probes

-   Liveness probe: ensures container is running
-   Readiness probe: ensures service is ready to accept traffic

------------------------------------------------------------------------

## Resource Management

-   CPU & memory requests and limits defined
-   Prevents resource starvation and improves stability

------------------------------------------------------------------------

## Ingress

-   Expose frontend and backend APIs
-   Configure domain and routing

------------------------------------------------------------------------

## Argo CD (GitOps)

### Setup

-   Argo CD installed in cluster
-   Connect infra repo to Argo CD

### Application

-   Define Argo CD Application pointing to this repo
-   Enable auto-sync

### Flow

Code change → Git push → Argo CD detects → Auto deploy to cluster

------------------------------------------------------------------------

## Environments

### Staging

-   Used for testing
-   Separate overlay

### Production

-   Stable environment
-   Auto-scaling enabled

------------------------------------------------------------------------

## Image Updates

-   CI/CD pipeline updates image tags in manifests
-   Argo CD syncs changes automatically

------------------------------------------------------------------------

## Commands (Optional)

### Apply manually

    kubectl apply -f base/

### Check pods

    kubectl get pods -n ai-task-platform

------------------------------------------------------------------------

## Notes

-   Do not store secrets in plain text
-   Use Kubernetes Secrets or external secret managers
-   Monitor deployments using logs and metrics
