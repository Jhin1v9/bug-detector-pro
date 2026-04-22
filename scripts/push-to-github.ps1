# Push BugDetector Pro to GitHub
# Run: .\scripts\push-to-github.ps1

$repoName = "bug-detector-pro"
$username = Read-Host "Enter your GitHub username"
$token = Read-Host "Enter your GitHub Personal Access Token (classic)" -AsSecureString

$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($token)
$plainToken = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

$headers = @{
  Authorization = "token $plainToken"
  Accept = "application/vnd.github.v3+json"
}

$body = @{
  name = $repoName
  description = "🐛 BugDetector Pro — Developer-first bug reporting with AI"
  private = $false
  auto_init = $true
} | ConvertTo-Json

Write-Host "Creating repository on GitHub..."
try {
  $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body -ContentType "application/json"
  Write-Host "✅ Repository created: $($response.html_url)" -ForegroundColor Green
} catch {
  Write-Host "❌ Failed to create repository: $_" -ForegroundColor Red
  exit 1
}

$remoteUrl = "https://$username`:$plainToken@github.com/$username/$repoName.git"

cd $PSScriptRoot\..

git remote remove origin 2>$null
git remote add origin $remoteUrl
git branch -M main

Write-Host "Pushing to GitHub..."
git push -u origin main --force

if ($?) {
  Write-Host "✅ Push completed!" -ForegroundColor Green
  Write-Host "🔗 URL: https://github.com/$username/$repoName"
} else {
  Write-Host "❌ Push failed" -ForegroundColor Red
}
