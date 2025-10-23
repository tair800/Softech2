# PowerShell script to update existing slugs in the database

# Function to generate slug from text
function Generate-Slug {
    param([string]$text)
    
    if ([string]::IsNullOrWhiteSpace($text)) {
        return ""
    }
    
    # Convert to lowercase
    $text = $text.ToLower()
    
    # Replace Azerbaijani characters
    $text = $text -replace 'ə', 'e'
    $text = $text -replace 'ü', 'u'
    $text = $text -replace 'ö', 'o'
    $text = $text -replace 'ı', 'i'
    $text = $text -replace 'ğ', 'g'
    $text = $text -replace 'ç', 'c'
    $text = $text -replace 'ş', 's'
    $text = $text -replace 'q', 'q'
    
    # Replace spaces and special characters with hyphens
    $text = $text -replace '[^a-z0-9\s-]', ''
    $text = $text -replace '[\s-]+', '-'
    $text = $text.Trim('-')
    
    # Limit length
    if ($text.Length -gt 100) {
        $text = $text.Substring(0, 100).TrimEnd('-')
    }
    
    return $text
}

# Database file path
$dbPath = "webonly.db"

Write-Host "Updating existing slugs in database..."

# Update Blogs
Write-Host "Updating Blogs..."
$blogs = sqlite3 $dbPath "SELECT Id, Title1, Title1En, Title1Ru, Slug FROM Blogs WHERE Slug IS NULL OR Slug = '';"

if ($blogs) {
    $blogLines = $blogs -split "`n"
    foreach ($line in $blogLines) {
        if ($line.Trim()) {
            $parts = $line -split '\|'
            $id = $parts[0]
            $title1 = $parts[1]
            $title1En = $parts[2]
            $title1Ru = $parts[3]
            
            $nameToUse = if ($title1) { $title1 } elseif ($title1En) { $title1En } elseif ($title1Ru) { $title1Ru } else { "blog-$id" }
            $slug = Generate-Slug $nameToUse
            
            if ($slug) {
                sqlite3 $dbPath "UPDATE Blogs SET Slug = '$slug' WHERE Id = $id;"
                Write-Host "Updated Blog $id with slug: $slug"
            }
        }
    }
}

# Update Products
Write-Host "Updating Products..."
$products = sqlite3 $dbPath "SELECT Id, Name, NameEn, NameRu, Slug FROM Products WHERE Slug IS NULL OR Slug = '';"

if ($products) {
    $productLines = $products -split "`n"
    foreach ($line in $productLines) {
        if ($line.Trim()) {
            $parts = $line -split '\|'
            $id = $parts[0]
            $name = $parts[1]
            $nameEn = $parts[2]
            $nameRu = $parts[3]
            
            $nameToUse = if ($name) { $name } elseif ($nameEn) { $nameEn } elseif ($nameRu) { $nameRu } else { "product-$id" }
            $slug = Generate-Slug $nameToUse
            
            if ($slug) {
                sqlite3 $dbPath "UPDATE Products SET Slug = '$slug' WHERE Id = $id;"
                Write-Host "Updated Product $id with slug: $slug"
            }
        }
    }
}

# Update Services
Write-Host "Updating Services..."
$services = sqlite3 $dbPath "SELECT Id, Name, NameEn, NameRu, Slug FROM Services WHERE Slug IS NULL OR Slug = '';"

if ($services) {
    $serviceLines = $services -split "`n"
    foreach ($line in $serviceLines) {
        if ($line.Trim()) {
            $parts = $line -split '\|'
            $id = $parts[0]
            $name = $parts[1]
            $nameEn = $parts[2]
            $nameRu = $parts[3]
            
            $nameToUse = if ($name) { $name } elseif ($nameEn) { $nameEn } elseif ($nameRu) { $nameRu } else { "service-$id" }
            $slug = Generate-Slug $nameToUse
            
            if ($slug) {
                sqlite3 $dbPath "UPDATE Services SET Slug = '$slug' WHERE Id = $id;"
                Write-Host "Updated Service $id with slug: $slug"
            }
        }
    }
}

# Update Equipment
Write-Host "Updating Equipment..."
$equipment = sqlite3 $dbPath "SELECT Id, Name, NameEn, NameRu, Slug FROM Equipment WHERE Slug IS NULL OR Slug = '';"

if ($equipment) {
    $equipmentLines = $equipment -split "`n"
    foreach ($line in $equipmentLines) {
        if ($line.Trim()) {
            $parts = $line -split '\|'
            $id = $parts[0]
            $name = $parts[1]
            $nameEn = $parts[2]
            $nameRu = $parts[3]
            
            $nameToUse = if ($name) { $name } elseif ($nameEn) { $nameEn } elseif ($nameRu) { $nameRu } else { "equipment-$id" }
            $slug = Generate-Slug $nameToUse
            
            if ($slug) {
                sqlite3 $dbPath "UPDATE Equipment SET Slug = '$slug' WHERE Id = $id;"
                Write-Host "Updated Equipment $id with slug: $slug"
            }
        }
    }
}

Write-Host "Slug update completed!"
