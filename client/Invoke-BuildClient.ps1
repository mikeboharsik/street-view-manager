Param(
    [Parameter(Mandatory=$true)]
    [string]$AppClientId,

    [Parameter(Mandatory=$true)]
    [string]$AppKey
)

$env:REACT_APP_CLIENT_ID = $AppClientId
Write-Host "`$env:REACT_APP_CLIENT_ID = [$env:REACT_APP_CLIENT_ID]"

$env:REACT_APP_KEY = $AppKey
Write-Host "`$env:REACT_APP_KEY = [$env:REACT_APP_KEY]"

yarn build
