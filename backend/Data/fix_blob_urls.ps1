# Fix Equipment blob URLs to proper file paths
# This PowerShell script will replace all blob: URLs with proper image file paths

# Database connection parameters
$server = "localhost"
$database = "WebOnlyDB"
$connectionString = "Server=$server;Database=$database;Trusted_Connection=true;"

try {
    # Create SQL connection
    $connection = New-Object System.Data.SqlClient.SqlConnection
    $connection.ConnectionString = $connectionString
    $connection.Open()
    
    Write-Host "Connected to database successfully!" -ForegroundColor Green
    
    # First, check current image URLs to see the blob URLs
    Write-Host "`nCurrent image URLs (including blob URLs):" -ForegroundColor Yellow
    $query = "SELECT Id, Name, ImageUrl FROM Equipment ORDER BY Id"
    $command = New-Object System.Data.SqlClient.SqlCommand($query, $connection)
    $reader = $command.ExecuteReader()
    
    while ($reader.Read()) {
        $id = $reader["Id"]
        $name = $reader["Name"]
        $imageUrl = $reader["ImageUrl"]
        Write-Host "ID: $id | Name: $name | ImageUrl: $imageUrl" -ForegroundColor White
    }
    $reader.Close()
    
    # Fix blob URLs by replacing them with proper file paths
    Write-Host "`nFixing blob URLs..." -ForegroundColor Yellow
    
    # Equipment 1-3: use equipment1.png
    $updateQuery1 = @"
        UPDATE Equipment 
        SET ImageUrl = '/uploads/equipment/equipment1.png' 
        WHERE Id IN (1, 2, 3) AND (ImageUrl LIKE 'blob:%' OR ImageUrl IS NULL)
"@
    
    $command1 = New-Object System.Data.SqlClient.SqlCommand($updateQuery1, $connection)
    $rowsAffected1 = $command1.ExecuteNonQuery()
    Write-Host "Updated $rowsAffected1 rows for equipment 1-3" -ForegroundColor Green
    
    # Equipment 4-10: use equipment2.png
    $updateQuery2 = @"
        UPDATE Equipment 
        SET ImageUrl = '/uploads/equipment/equipment2.png' 
        WHERE Id IN (4, 5, 6, 7, 8, 9, 10) AND (ImageUrl LIKE 'blob:%' OR ImageUrl IS NULL)
"@
    
    $command2 = New-Object System.Data.SqlClient.SqlCommand($updateQuery2, $connection)
    $rowsAffected2 = $command2.ExecuteNonQuery()
    Write-Host "Updated $rowsAffected2 rows for equipment 4-10" -ForegroundColor Green
    
    # Generic fix for any remaining blob URLs
    $updateQuery3 = @"
        UPDATE Equipment 
        SET ImageUrl = '/uploads/equipment/equipment1.png' 
        WHERE ImageUrl LIKE 'blob:%'
"@
    
    $command3 = New-Object System.Data.SqlClient.SqlCommand($updateQuery3, $connection)
    $rowsAffected3 = $command3.ExecuteNonQuery()
    Write-Host "Updated $rowsAffected3 remaining blob URLs" -ForegroundColor Green
    
    # Verify the fix
    Write-Host "`nAfter fixing blob URLs:" -ForegroundColor Yellow
    $verifyQuery = "SELECT Id, Name, ImageUrl FROM Equipment ORDER BY Id"
    $verifyCommand = New-Object System.Data.SqlClient.SqlCommand($verifyQuery, $connection)
    $verifyReader = $verifyCommand.ExecuteReader()
    
    while ($verifyReader.Read()) {
        $id = $verifyReader["Id"]
        $name = $verifyReader["Name"]
        $imageUrl = $verifyReader["ImageUrl"]
        Write-Host "ID: $id | Name: $name | ImageUrl: $imageUrl" -ForegroundColor White
    }
    $verifyReader.Close()
    
    # Check if any blob URLs remain
    $blobCountQuery = "SELECT COUNT(*) AS BlobUrlCount FROM Equipment WHERE ImageUrl LIKE 'blob:%'"
    $blobCountCommand = New-Object System.Data.SqlClient.SqlCommand($blobCountQuery, $connection)
    $blobCount = $blobCountCommand.ExecuteScalar()
    Write-Host "`nRemaining blob URLs: $blobCount (should be 0)" -ForegroundColor $(if ($blobCount -eq 0) { "Green" } else { "Red" })
    
    # Check equipment without images
    $nullCountQuery = "SELECT COUNT(*) AS NullCount FROM Equipment WHERE ImageUrl IS NULL OR ImageUrl = ''"
    $nullCountCommand = New-Object System.Data.SqlClient.SqlCommand($nullCountQuery, $connection)
    $nullCount = $nullCountCommand.ExecuteScalar()
    Write-Host "Equipment without images: $nullCount" -ForegroundColor $(if ($nullCount -eq 0) { "Green" } else { "Yellow" })
    
    # Set default image for any equipment without images
    if ($nullCount -gt 0) {
        $defaultImageQuery = "UPDATE Equipment SET ImageUrl = '/uploads/equipment/equipment1.png' WHERE ImageUrl IS NULL OR ImageUrl = ''"
        $defaultImageCommand = New-Object System.Data.SqlClient.SqlCommand($defaultImageQuery, $connection)
        $defaultImageRows = $defaultImageCommand.ExecuteNonQuery()
        Write-Host "Set default image for $defaultImageRows equipment items" -ForegroundColor Green
    }
    
    Write-Host "`nBlob URL fix completed successfully!" -ForegroundColor Green
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    if ($connection -and $connection.State -eq 'Open') {
        $connection.Close()
        Write-Host "Database connection closed." -ForegroundColor Gray
    }
}

Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
