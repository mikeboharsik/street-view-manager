yarn playwright install
yarn playwright test
if (!$?) {
	Write-Error "E2e tests failed"
	exit 1
}