-- Fix Services Description and Clean Up
-- This script fixes corrupted descriptions and removes unnecessary articles field

USE WebOnlyAPI;
GO

-- 1. Fix the corrupted description for service ID 1
UPDATE Services 
SET Description = N'Arxivləmə prosesi sistemdəki məlumatların təhlükəsizliyini və davamlılığını təmin etmək üçün vacib funksiyadır. Bu modul vasitəsilə məlumatlar müəyyən dövrlərdə avtomatik və ya əl ilə arxivlənə bilər. Arxivlənmiş fayllar ehtiyac olduqda tez bir zamanda bərpa edilə bilir. Bu, həm yaddaşdan səmərəli istifadəni, həm də fövqəladə hallarda məlumat itkisinə qarşı qorumanı təmin edir. Eyni zamanda sistemin yüklənməsinin qarşısını alaraq ümumi performansı artırır.'
WHERE Id = 1;
GO

-- 2. Remove the Articles navigation property from Service model
-- First, drop any foreign key constraints if they exist
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_NAME = 'FK_ServiceArticles_Service')
BEGIN
    ALTER TABLE ServiceArticles DROP CONSTRAINT FK_ServiceArticles_Service;
END
GO

-- 3. Drop the ServiceArticles table if it exists
IF OBJECT_ID('ServiceArticles', 'U') IS NOT NULL
BEGIN
    DROP TABLE ServiceArticles;
    PRINT 'ServiceArticles table dropped successfully.';
END
ELSE
BEGIN
    PRINT 'ServiceArticles table does not exist.';
END
GO

-- 4. Verify the fix
SELECT 
    Id,
    Name,
    Subtitle,
    LEFT(Description, 100) + '...' as DescriptionPreview,
    LEN(Description) as DescriptionLength,
    CreatedAt,
    UpdatedAt
FROM Services 
WHERE Id = 1;
GO

-- 5. Show all services for verification
SELECT 
    Id,
    Name,
    Subtitle,
    LEN(Description) as DescriptionLength,
    CreatedAt,
    UpdatedAt
FROM Services 
ORDER BY Id;
GO

PRINT 'Services description fix completed successfully!';
PRINT 'ServiceArticles table removed.';
GO
