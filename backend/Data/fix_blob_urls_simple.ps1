# Fix Equipment blob URLs to proper file paths
# This PowerShell script will replace all blob: URLs with proper image file paths

Write-Host "Starting blob URL fix..." -ForegroundColor Yellow

# Check if sqlcmd is available
try {
    $sqlcmdVersion = sqlcmd -v 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "sqlcmd found: $sqlcmdVersion" -ForegroundColor Green
    } else {
        Write-Host "sqlcmd not found. Please install SQL Server Command Line Utilities." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "sqlcmd not found. Please install SQL Server Command Line Utilities." -ForegroundColor Red
    exit 1
}

# Database connection parameters
$server = "localhost"
$database = "WebOnlyAPI"

# Create temporary SQL file
$sqlFile = "temp_fix_blob_urls.sql"
$sqlContent = @"
-- Fix Equipment blob URLs to proper file paths
USE [$database]
GO

-- First, check current image URLs to see the blob URLs
PRINT 'Current image URLs (including blob URLs):'
SELECT Id, Name, ImageUrl FROM Equipment ORDER BY Id
GO

-- Fix blob URLs by replacing them with proper file paths
-- Equipment 1-3: use equipment1.png
UPDATE Equipment 
SET ImageUrl = '/uploads/equipment/equipment1.png' 
WHERE Id IN (1, 2, 3) AND (ImageUrl LIKE 'blob:%' OR ImageUrl IS NULL)
GO

-- Equipment 4-10: use equipment2.png
UPDATE Equipment 
SET ImageUrl = '/uploads/equipment/equipment2.png' 
WHERE Id IN (4, 5, 6, 7, 8, 9, 10) AND (ImageUrl LIKE 'blob:%' OR ImageUrl IS NULL)
GO

-- Generic fix for any remaining blob URLs
UPDATE Equipment 
SET ImageUrl = '/uploads/equipment/equipment1.png' 
WHERE ImageUrl LIKE 'blob:%'
GO

-- Set default image for any equipment without images
UPDATE Equipment 
SET ImageUrl = '/uploads/equipment/equipment1.png' 
WHERE ImageUrl IS NULL OR ImageUrl = ''
GO

-- Verify the fix
PRINT 'After fixing blob URLs:'
SELECT Id, Name, ImageUrl FROM Equipment ORDER BY Id
GO

-- Check if any blob URLs remain
PRINT 'Remaining blob URLs (should be 0):'
SELECT COUNT(*) AS BlobUrlCount FROM Equipment WHERE ImageUrl LIKE 'blob:%'
GO

-- Check equipment without images
PRINT 'Equipment without images (should be 0):'
SELECT COUNT(*) AS NullCount FROM Equipment WHERE ImageUrl IS NULL OR ImageUrl = ''
GO
"@

# Write SQL content to file
$sqlContent | Out-File -FilePath $sqlFile -Encoding UTF8
Write-Host "Created SQL file: $sqlFile" -ForegroundColor Green

# Execute the SQL file
Write-Host "Executing SQL commands..." -ForegroundColor Yellow
try {
    $result = sqlcmd -S $server -d $database -i $sqlFile
    if ($LASTEXITCODE -eq 0) {
        Write-Host "SQL commands executed successfully!" -ForegroundColor Green
        Write-Host "`nOutput:" -ForegroundColor Yellow
        Write-Host $result -ForegroundColor White
    } else {
        Write-Host "Error executing SQL commands. Exit code: $LASTEXITCODE" -ForegroundColor Red
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Clean up temporary file
if (Test-Path $sqlFile) {
    Remove-Item $sqlFile
    Write-Host "Cleaned up temporary SQL file" -ForegroundColor Gray
}

Write-Host "`nBlob URL fix completed!" -ForegroundColor Green
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
