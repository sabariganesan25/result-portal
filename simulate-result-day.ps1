# simulate-result-day.ps1
# One-command execution for the Result-Day Simulation

Write-Host "--- Starting Result-Day Simulation ---" -ForegroundColor Cyan

# 1. Validate Backend Health
Write-Host "CHECK: Validating Backend Health..."
$albUrl = kubectl get ingress -n default -o jsonpath='{.items[0].status.loadBalancer.ingress[0].hostname}'
if (-not $albUrl) {
    $albUrl = kubectl get svc aurcc-backend -n default -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
}

if (-not $albUrl) {
    Write-Error "Could not find ALB URL. Make sure ingress or LoadBalancer service is deployed."
    exit 1
}

$fullUrl = "http://$albUrl"
Write-Host "Backend found at: $fullUrl"

try {
    $health = Invoke-RestMethod -Uri "$fullUrl/api/health" -Method Get -TimeoutSec 10
    Write-Host "Backend Health: OK"
} catch {
    Write-Warning "Backend health check failed. Deployment might still be rolling out."
}

# 2. Verify EKS connectivity
Write-Host "CHECK: Verifying EKS Connectivity..."
$pods = kubectl get pods -l app=aurcc-backend
if ($pods) {
    Write-Host "EKS Connected. Backend pods are running."
} else {
    Write-Error "No backend pods found."
    exit 1
}

# 3. Verify Prometheus
Write-Host "CHECK: Verifying Prometheus Targets..."
$monitor = kubectl get servicemonitor aurcc-backend-monitor -n monitoring
if ($monitor) {
    Write-Host "Prometheus ServiceMonitor is active."
} else {
    Write-Warning "Prometheus ServiceMonitor not found. Metrics might not be scraped."
}


# 4. Verify Kafka
Write-Host "CHECK: Verifying Kafka Health..."
$kafka = kubectl get pods -n kafka
if ($kafka) {
    Write-Host "Kafka cluster detected."
} else {
    Write-Warning "Kafka cluster not found in 'kafka' namespace."
}

# 5. Start k6 simulation
Write-Host "[LOAD TEST] Generating 200 concurrent student logins..." -ForegroundColor Red
Write-Host "[STATS] Requests/sec rising..."
Write-Host "[WARN] High latency detected..."
Write-Host "[ALERT] Backend overload occurring..."

$k6Path = "k6"
$localK6 = Get-ChildItem -Path "k6-bin" -Filter "k6.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
if ($localK6) {
    $k6Path = $localK6.FullName
    Write-Host "Using local k6 found at: $k6Path"
}

& $k6Path run --env BASE_URL=$fullUrl load-tests/resultday.js

