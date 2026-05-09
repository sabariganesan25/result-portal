# 🎓 Academic Result Portal - AURCC

A production-grade, cloud-native academic management system for **Anna University Regional Campus Coimbatore (AURCC)**. Built with a modern microservices-ready architecture, this portal provides real-time result publication, performance analytics, and infrastructure observability.

![Architecture](https://img.shields.io/badge/Architecture-Cloud--Native-blue?style=for-the-badge)
![EKS](https://img.shields.io/badge/Platform-AWS%20EKS-orange?style=for-the-badge)
![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=for-the-badge)
![Node](https://img.shields.io/badge/Backend-Node.js%2020-339933?style=for-the-badge)

---

## 🌟 Key Features

### 👨‍🎓 For Students
- **Real-time Result Viewing**: Instant access to semester results and internal assessment marks.
- **Dynamic Grade Sheets**: Professionally formatted, print-optimized provisional grade sheets.
- **Academic Analytics**: SGPA/CGPA tracking and performance classification.
- **Departmental Leaderboard**: Live ranking system based on academic performance.

### 👩‍💼 For Administrators
- **Centralized Management**: Control result publication across departments and semesters.
- **Bulk Operations**: Seamlessly publish or revoke results for entire batches.
- **Observability Integration**: Monitor cluster health and system metrics via the SmartOps dashboard.

---

## 🏗️ Technical Architecture

The system is designed for high availability and scalability on AWS:

- **Frontend**: Single Page Application (SPA) built with React 19 and Vite.
- **Backend**: RESTful API built with Node.js/Express, utilizing Socket.io for real-time telemetry.
- **Database**: Amazon DynamoDB for low-latency data access and scalability.
- **Orchestration**: Kubernetes (AWS EKS) for container orchestration and automated scaling.
- **Observability**: Prometheus & CloudWatch integration for real-time metrics and logging.

---

## 🛠️ Getting Started

### Local Development

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd result-portal
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Configure .env with your AWS credentials and DynamoDB table
   npm run seed  # Populate DynamoDB with demo data
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../Frontend
   npm install
   npm run dev
   ```

### Infrastructure Deployment (AWS EKS)

The project includes pre-configured `eksctl` manifests for one-click cluster creation.

1. **Provision Cluster**
   ```bash
   ./eksctl.exe create cluster -f cluster-config.yaml
   ```

2. **Deploy Application**
   ```bash
   # Apply Kubernetes manifests
   kubectl apply -f k8s/secrets.yaml
   kubectl apply -f k8s/backend.yaml
   kubectl apply -f k8s/frontend.yaml
   ```

3. **Verify Status**
   ```bash
   kubectl get svc aurcc-frontend
   ```

---

## 📦 Containerization & ECR

We use Amazon ECR for secure image storage. The deployment pipeline is optimized for minimal image sizes using `node:20-slim`.

**Image Repositories:**
- Backend: `295284356306.dkr.ecr.ap-south-1.amazonaws.com/aurcc-backend`
- Frontend: `295284356306.dkr.ecr.ap-south-1.amazonaws.com/aurcc-frontend`

---

## 📊 Observability with SmartOps

This portal is integrated with the **SmartOps** dashboard, providing:
- **Live Pod Metrics**: Real-time CPU and Memory utilization.
- **Request Latency**: HTTP request duration tracking via Prometheus.
- **Cluster Logs**: Streamed directly from CloudWatch.

---

## 🧹 Infrastructure Cleanup

To decommission the environment and avoid unnecessary AWS costs:

```bash
./eksctl delete cluster --name aurcc-portal-cluster --region ap-south-1
```

---

## 📄 License
This project is for academic demonstration and internal management at AURCC.

&copy; 2025 AURCC Academic Management Team.
