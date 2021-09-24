[CmdletBinding(SupportsShouldProcess = $true)]
Param(
	[switch] $Dev,
	[switch] $KeepStagingFiles,
	[switch] $SkipUpload,
	[switch] $OpenStagingPath
)

$configFilePath = "$PSScriptRoot\lambda.config.json"
$stagingPath = "$($env:temp)\street-view-manager\staging"

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
	if (Test-Path $uploadPackagePath) {
		Remove-Item -Force $uploadPackagePath
	}

	Write-Verbose "Using '$appClientId' as OAuth client ID"

	$env:REACT_APP_CLIENT_ID = $appClientId

	yarn build
	yarn git-hash

	$buildPath = "$PSScriptRoot\build"
	Copy-Item -Recurse $buildPath "$stagingPath\build"

	$lambdaPath = "$PSScriptRoot\lambda"
	Copy-Item -Recurse "$lambdaPath\**" $stagingPath

	Remove-Item "$stagingPath\.gitignore" -ErrorAction SilentlyContinue

	Compress-Archive -Force -Path "$stagingPath\**" -DestinationPath $uploadPackagePath

	if (!$SkipUpload) {
		$functionNames = aws lambda list-functions
			| ConvertFrom-Json -AsHashtable
			| Select-Object -ExpandProperty Functions
			| Select-Object -ExpandProperty FunctionName

		if (!$functionNames.Contains($lambdaFunctionName)) {
			throw "Lambda function with name '$lambdaFunctionName' is not associated with the current AWS account"
		}

		aws lambda update-function-code --function-name $lambdaFunctionName --zip-file "fileb://$uploadPackagePath"
	}

	if (!$KeepStagingFiles) {
		Remove-Item -Force -Recurse (Join-Path $stagingPath "..")
	}
} finally {
	$env:REACT_APP_CLIENT_ID = $initAppClientId
	$env:REACT_APP_KEY = $initAppKey
}
