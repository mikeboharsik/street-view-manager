[CmdletBinding(SupportsShouldProcess = $true)]
Param(
	[string] $ClientPath = (Resolve-Path "$PSScriptRoot/../client"),

	[Parameter(Mandatory=$true)]
	[string] $AppClientId,

	[Parameter(Mandatory=$true)]
	[string] $AppKey,

	[Parameter(Mandatory=$true)]
	[string] $LambdaFunctionName,

	[Parameter(Mandatory=$true)]
	[string] $CloudFrontDistributionID,

	[Parameter(Mandatory=$false)]
	[string[]] $CloudFrontInvalidationPaths = @("/*"),

	[switch] $Prod,
	[switch] $SkipTests
)

Write-Host "`$ClientPath = [$ClientPath]"

Write-Host "`$AppClientId = [$AppClientId]"
Write-Host "`$AppKey = [$AppKey]"
Write-Host "`$LambdaFunctionName = [$LambdaFunctionName]"
Write-Host "`$CloudFrontDistributionID = [$CloudFrontDistributionID]"
Write-Host "`$CloudFrontInvalidationPaths = [$CloudFrontInvalidationPaths]"

$stagingPath = "$PSScriptRoot\build\staging"
Write-Host "`$stagingPath = [$stagingPath]"

if (!$AppClientId) {
	throw "Missing clientId: [$AppClientId]"
}

if (!$AppKey) {
	throw "Missing appKey: [$AppKey]"
}

if (!$LambdaFunctionName) {
	throw "Missing lambda function name: [$LambdaFunctionName]"
}

$uploadPackagePath = Join-Path $stagingPath "../$LambdaFunctionName.zip"
Write-Host "`$uploadPackagePath = [$uploadPackagePath]"

$env:REACT_APP_CLIENT_ID = $AppClientId
Write-Host "`$env:REACT_APP_CLIENT_ID = [$env:REACT_APP_CLIENT_ID]"

$env:REACT_APP_KEY = $AppKey
Write-Host "`$env:REACT_APP_KEY = [$env:REACT_APP_KEY]"

Push-Location $ClientPath

yarn

yarn test --watchAll=false --verbose
if (!$?) {
	Write-Error "Unit tests failed"
	exit 1
}

<#
Start-Job { yarn start }
$success = $false
$attempts = 0
while (!$success -and $attempts -lt 30) {
	try {
		$attempts += 1
		Invoke-WebRequest 'http://localhost:3000'
		$success = $true
		break
	} catch {}
}
if (!$success) {
	Write-Error "Failed to start local server for integration tests"
	exit 1
}

yarn cypress run --browser chrome
if (!$?) {
	Write-Error "Integration tests failed"
	exit 1
}
#>

yarn build
Write-Host "Command 'yarn build' completed"

$clientGitHash = $ENV:GITHUB_SHA
Write-Host "`$clientGitHash=[$clientGitHash]"

Pop-Location

$clientBuildPath = "$ClientPath/build"
Write-Host "`$clientBuildPath = [$clientBuildPath]"
Copy-Item -Recurse $clientBuildPath "$stagingPath/build"

yarn
$lambdaPath = $PSScriptRoot
Write-Host "`$lambdaPath = [$lambdaPath]"
Copy-Item -Recurse "$lambdaPath/src/**" $stagingPath
Copy-Item -Recurse "$lambdaPath/node_modules" $stagingPath

ConvertTo-Json -Depth 10 @{ client = $clientGitHash }
	| Set-Content "$stagingPath/build/static/version.json"

Compress-Archive -Force -Path "$stagingPath/**" -DestinationPath $uploadPackagePath

$uploadRes = aws lambda update-function-code --function-name $LambdaFunctionName --zip-file "fileb://$uploadPackagePath"
Write-Host "AWS lambda code update response:`n$($uploadRes | ConvertFrom-Json | ConvertTo-Json)"

Write-Host "Lambda function [$LambdaFunctionName] updated"

Write-Host "Invalidating CloudFront distribution [$CloudFrontDistributionID] paths [$CloudFrontInvalidationPaths]"

$result = aws cloudfront create-invalidation --distribution-id $CloudFrontDistributionID --paths "$CloudFrontInvalidationPaths"
Write-Host ($result | ConvertFrom-Json | ConvertTo-Json -Depth 10)

Write-Host "CloudFront distribution cache invalidated"
