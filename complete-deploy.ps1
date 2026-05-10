# complete-deploy.ps1
Write-Host "Starting deployment to the new cluster..."

# 1. Update Kubeconfig
aws eks update-kubeconfig --name aurcc-portal-cluster --region ap-south-1

# 2. Apply Secrets
kubectl apply -f k8s/secrets.yaml

# 3. Apply Backend
kubectl apply -f k8s/backend.yaml

# 4. Wait for Backend LB URL
Write-Host "Waiting for Backend LoadBalancer URL..."
$backendUrl = ""
for ($i=0; $i -lt 30; $i++) {
    $backendUrl = kubectl get svc aurcc-backend -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
    if ($backendUrl) { break }
    Start-Sleep -Seconds 10
}

if (-not $backendUrl) {
    Write-Error "Backend LoadBalancer failed to provision in time."
    exit 1
}

Write-Host "Backend URL: http://$backendUrl"

# 5. Update Frontend Env
$fullBackendUrl = "http://$backendUrl/api"
$envFile = "Frontend/.env.production"
$content = Get-Content $envFile
$content = $content -replace 'VITE_API_URL=.*', "VITE_API_URL=$fullBackendUrl"
$content = $content -replace 'VITE_SMARTOPS_API_URL=.*', "VITE_SMARTOPS_API_URL=$fullBackendUrl"
$content = $content -replace 'VITE_SMARTOPS_SOCKET_URL=.*', "VITE_SMARTOPS_SOCKET_URL=http://$backendUrl"
$content | Set-Content $envFile

# 6. Build and Push Frontend
Write-Host "Building and pushing frontend image..."
cd Frontend
docker build -t aurcc-frontend .
docker tag aurcc-frontend:latest 295284356306.dkr.ecr.ap-south-1.amazonaws.com/aurcc-frontend:latest
docker push 295284356306.dkr.ecr.ap-south-1.amazonaws.com/aurcc-frontend:latest
cd ..

# 7. Apply Frontend
kubectl apply -f k8s/frontend.yaml

# 8. Wait for Frontend LB URL
Write-Host "Waiting for Frontend LoadBalancer URL..."
$frontendUrl = ""
for ($i=0; $i -lt 30; $i++) {
    $frontendUrl = kubectl get svc aurcc-frontend -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
    if ($frontendUrl) { break }
    Start-Sleep -Seconds 10
}

if (-not $frontendUrl) {
    Write-Error "Frontend LoadBalancer failed to provision in time."
    exit 1
}

Write-Host "------------------------------------------------"
Write-Host "DONE! Application is live at: http://$frontendUrl"
Write-Host "------------------------------------------------"
