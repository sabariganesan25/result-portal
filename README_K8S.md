# ☸️ EKS Deployment Handbook

Detailed instructions for deploying the AURCC Result Portal to AWS Elastic Kubernetes Service.

## 🚀 1. Infrastructure Provisioning

Use the pre-configured `cluster-config.yaml` to create the cluster and managed nodegroups.

```bash
# Provision the cluster (approx. 15-20 minutes)
./eksctl.exe create cluster -f cluster-config.yaml

# If the cluster exists but nodegroups failed, add them specifically:
./eksctl.exe create nodegroup -f cluster-config.yaml
```

## 🏗️ 2. Build & Registry Management

Authenticate with Amazon ECR and push your production-ready containers.

```powershell
# Authenticate Docker to ECR
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 295284356306.dkr.ecr.ap-south-1.amazonaws.com

# Backend Build & Push
cd backend
docker build -t aurcc-backend .
docker tag aurcc-backend:latest 295284356306.dkr.ecr.ap-south-1.amazonaws.com/aurcc-backend:latest
docker push 295284356306.dkr.ecr.ap-south-1.amazonaws.com/aurcc-backend:latest

# Frontend Build & Push
# (Ensure Frontend/.env.production has the correct VITE_API_URL pointing to the Backend LB)
cd ../Frontend
docker build -t aurcc-frontend .
docker tag aurcc-frontend:latest 295284356306.dkr.ecr.ap-south-1.amazonaws.com/aurcc-frontend:latest
docker push 295284356306.dkr.ecr.ap-south-1.amazonaws.com/aurcc-frontend:latest
```

## 🚢 3. Deployment Orchestration

Ensure your `kubectl` context is set to the new cluster before applying manifests.

```powershell
# Update Kubeconfig
aws eks update-kubeconfig --name aurcc-portal-cluster --region ap-south-1

# Apply Kubernetes Manifests
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
```

## 🔍 4. Post-Deployment Verification

Monitor the rollout and retrieve the public endpoint.

```powershell
# Check Pod Status
kubectl get pods -w

# Retrieve Load Balancer URL
kubectl get svc aurcc-frontend
```

## ⚠️ Troubleshooting & Common Issues

- **Nodegroup Stack Conflict**: If `eksctl` reports that a stack already exists, rename the nodegroup in `cluster-config.yaml` (e.g., from `standard-nodes` to `standard-nodes-v2`) and re-run the command.
- **Image Pull Errors**: Ensure your nodes have an IAM role with `AmazonEC2ContainerRegistryReadOnly` permissions (handled automatically by `eksctl` managed node groups).
- **CORS Issues**: Ensure the frontend Load Balancer URL is added to the backend's allowed origins in `server.js` or via environment variables.

---

## 🛑 Infrastructure Deletion

Always delete the cluster when not in use to save costs.

```bash
./eksctl delete cluster --name aurcc-portal-cluster --region ap-south-1
```
