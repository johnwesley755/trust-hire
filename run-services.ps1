Get-ChildItem services -Directory | ForEach-Object {
    Write-Host "Starting $($_.Name)..."
    Start-Process powershell -ArgumentList "-NoExit","-Command","cd $($_.FullName); mvn spring-boot:run"
}