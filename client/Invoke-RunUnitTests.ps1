yarn test --watchAll=false --verbose
if (!$?) {
	Write-Error "Unit tests failed"
	exit 1
}