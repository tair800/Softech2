-- Add basic AboutLogo data for the dashboard to work
-- This will resolve the dashboard loading issue

-- Check current data
SELECT 'Current AboutLogo data:' AS Status;
SELECT * FROM AboutLogos;

-- Add basic AboutLogo data if table is empty
IF NOT EXISTS (SELECT 1 FROM AboutLogos)
BEGIN
    INSERT INTO AboutLogos (Heading, Subtext, ImageUrl, CreatedAt, UpdatedAt) VALUES 
    (N'Texnologiya ilə Gələcəyə Doğru', 
     N'10 illik təcrübəsi ilə ERP proqramlarının tətbiqi və avadanlıq satışı sahəsində fəaliyyət göstərir. 500-dən çox uğurlu layihə, restoranlardan istehsalat müəssisələrinə qədər geniş spektrli bizneslərin avtomatlaşdırılması və POS CLASS, POS TÜRK avadanlıqlarının rəsmi nümayəndəliyi ilə bazarda lider mövqedədir.',
     N'/assets/logo-only.png',
     GETDATE(),
     NULL);
END

-- Verify the data was added
SELECT 'After adding data:' AS Status;
SELECT * FROM AboutLogos;
