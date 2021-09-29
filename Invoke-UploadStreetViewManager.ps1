[CmdletBinding(SupportsShouldProcess = $true)]
Param(
	[switch] $Dev,
	[switch] $KeepStagingFiles,
	[switch] $SkipUpload,
	[switch] $OpenStagingPath
)

Write-Verbose "`$Dev = $Dev"
Write-Verbose "`$KeepStagingFiles = $KeepStagingFiles"
Write-Verbose "`$SkipUpload = $SkipUpload"
Write-Verbose "`$OpenStagingPath = $OpenStagingPath"

$configFilePath = "$PSScriptRoot\lambda.config.json"
Write-Verbose "`$configFilePath = '$configFilePath'"

$stagingPath = "$($env:temp)\street-view-manager\staging"
Write-Verbose "`$stagingPath = '$stagingPath'"

if ($OpenStagingPath) {
	explorer (Join-Path $stagingPath "..")
	return
}

$configs = ConvertFrom-Json -AsHashtable (Get-Content -Raw $configFilePath)

if ($Dev) {
	$configName = 'dev'
} else {
	$configName = 'prod'
}

$config = $configs[$configName]
if (!$config) {
	throw "Configuration '$configName' not found in '$configFilePath'"	
}

$appClientId = $config['clientId']
if (!$appClientId) {
	throw "Configuration has an invalid clientId: '$appClientId'"
}

$appKey = $config['key']
if (!$appKey) {
	throw "Configuration has an invalid key: '$appKey'"
}

$lambdaFunctionName = $config['lambdaFunctionName']
if (!$lambdaFunctionName) {
	throw "Configuration is missing required lambda function name"
}

try {
	$initAppClientId = $env:REACT_APP_CLIENT_ID
	$initAppKey = $env:REACT_APP_KEY

	if (Test-Path $stagingPath) {
		Remove-Item -Force -Recurse $stagingPath
	}

	$uploadPackagePath = Join-Path $stagingPath "..\$lambdaFunctionName.zip"
	Write-Verbose "`$uploadPackagePath = '$uploadPackagePath'"
	if (Test-Path $uploadPackagePath) {
		Remove-Item -Force $uploadPackagePath
	}

	$env:REACT_APP_CLIENT_ID = $appClientId
	Write-Verbose "`$env:REACT_APP_CLIENT_ID = '$env:REACT_APP_CLIENT_ID'"

	$env:REACT_APP_KEY = $appKey
	Write-Verbose "`$env:REACT_APP_KEY = '$env:REACT_APP_KEY'"

	yarn build
	Write-Verbose "Command 'yarn build' completed"
	yarn git-hash
	Write-Verbose "Command 'yarn git-hash' completed"

	$buildPath = "$PSScriptRoot\build"
	Write-Verbose "`$buildPath = '$buildPath'"
	Copy-Item -Recurse $buildPath "$stagingPath\build"

	$lambdaPath = "$PSScriptRoot\lambda"
	Write-Verbose "`$lambdaPath = '$lambdaPath'"
	Copy-Item -Recurse "$lambdaPath\**" $stagingPath

	Remove-Item "$stagingPath\.gitignore" -ErrorAction SilentlyContinue

	Compress-Archive -Force -Path "$stagingPath\**" -DestinationPath $uploadPackagePath

	if (!$SkipUpload) {
		$functionNames = aws lambda list-functions
			| ConvertFrom-Json -AsHashtable
			| Select-Object -ExpandProperty Functions
			| Select-Object -ExpandProperty FunctionName
			| Sort-Object

		Write-Verbose "Found $($functionNames.length) functions associated with the current AWS account:`n$($functionNames -Join "`n")"

		if (!$functionNames.Contains($lambdaFunctionName)) {
			throw "Lambda function with name '$lambdaFunctionName' is not associated with the current AWS account"
		}

		$uploadRes = aws lambda update-function-code --function-name $lambdaFunctionName --zip-file "fileb://$uploadPackagePath"
		Write-Verbose "AWS lambda code update response:`n$($uploadRes | ConvertFrom-Json | ConvertTo-Json)"
	}

	if (!$KeepStagingFiles) {
		Remove-Item -Force -Recurse (Join-Path $stagingPath "..")
		Write-Verbose "Removed all files in path '$stagingPath'"
	}
} finally {
	$env:REACT_APP_CLIENT_ID = $initAppClientId
	$env:REACT_APP_KEY = $initAppKey
}
