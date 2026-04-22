# Push BugDetector Pro to GitHub (non-interactive)
# Usage: .\scripts\push-to-github-cli.ps1 -Username "youruser" -Token "ghp_xxx"
param(
  [Parameter(Mandatory=$true)]
  [string]$Username,

  [Parameter(Mandatory=$true)]
  [string]$Token
)

$repoName = "bug-detector-pro"

$headers = @{
  Authorization = "token $Token"
  Accept = "application/vnd.github.v3+json"
}

$body = @{
  name = $repoName
  description = "BugDetector Pro - Developer-first bug reporting with AI"
  private = $false
  auto_init = $true
} | ConvertTo-Json

Write-Host "Creating repository on GitHub..."
try {
  $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body -ContentType "application/json"
  Write-Host "Repository created: $($response.html_url)"
} catch {
  Write-Host "Failed to create repository: $_"
  exit 1
}

$remoteUrl = "https://$Username`:$Token@github.com/$Username/$repoName.git"

cd $PSScriptRoot\..

git remote remove origin 2>$null
git remote add origin $remoteUrl
git branch -M main

Write-Host "Pushing to GitHub..."
git push -u origin main --force

if ($?) {
  Write-Host "Push completed!"
  Write-Host "URL: https://github.com/$Username/$repoName"
} else {
  Write-Host "Push failed"
}
