# PowerShell script to check available databases
$connectionString = "Server=localhost\SQLEXPRESS;Trusted_Connection=true;TrustServerCertificate=true;"

try {
    # Create SQL connection
    $connection = New-Object System.Data.SqlClient.SqlConnection
    $connection.ConnectionString = $connectionString
    $connection.Open()
    
    Write-Host "Connected to SQL Server successfully!" -ForegroundColor Green
    
    # Get list of databases
    $command = New-Object System.Data.SqlClient.SqlCommand("SELECT name FROM sys.databases WHERE name NOT IN ('master', 'tempdb', 'model', 'msdb')", $connection)
    $reader = $command.ExecuteReader()
    
    Write-Host "Available databases:" -ForegroundColor Cyan
    while ($reader.Read()) {
        Write-Host "- $($reader['name'])" -ForegroundColor White
    }
    $reader.Close()
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    if ($connection -and $connection.State -eq 'Open') {
        $connection.Close()
        Write-Host "Database connection closed" -ForegroundColor Yellow
    }
}
