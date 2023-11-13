#!/bin/sh
# oc apply -f database/database-deployment.yaml
# oc apply -f database/database-service.yaml
oc apply -f backend/backend-deployment.yaml
oc apply -f backend/backend-service.yaml
oc apply -f frontend/frontend-deployment.yaml
oc apply -f frontend/frontend-service.yaml
oc apply -f nlu-model-api/nlu-model-api-deployment.yaml
oc apply -f nlu-model-api/nlu-model-api-service.yaml
oc apply -f route-definition.yaml