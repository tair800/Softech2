-- Export all data from WebOnlyAPI database
-- This will create INSERT statements that can be run after SQL Server reinstallation

-- Export Equipment data
SELECT '-- Equipment Data' AS ExportSection;
SELECT 'INSERT INTO Equipment (Id, Name, Version, Core, Description, ImageUrl, CreatedAt, UpdatedAt) VALUES (' +
       CAST(Id AS VARCHAR) + ', ' +
       'N''' + ISNULL(Name, '') + ''', ' +
       'N''' + ISNULL(Version, '') + ''', ' +
       'N''' + ISNULL(Core, '') + ''', ' +
       'N''' + ISNULL(Description, '') + ''', ' +
       'N''' + ISNULL(ImageUrl, '') + ''', ' +
       '''' + CONVERT(VARCHAR, CreatedAt, 121) + ''', ' +
       CASE WHEN UpdatedAt IS NULL THEN 'NULL' ELSE '''' + CONVERT(VARCHAR, UpdatedAt, 121) + '''' END +
       ');' AS InsertStatement
FROM Equipment
ORDER BY Id;

-- Export EquipmentFeatures data (even if corrupted, we'll have the structure)
SELECT '-- EquipmentFeatures Data' AS ExportSection;
SELECT 'INSERT INTO EquipmentFeatures (Id, EquipmentId, Feature, OrderIndex, CreatedAt, UpdatedAt) VALUES (' +
       CAST(Id AS VARCHAR) + ', ' +
       CAST(EquipmentId AS VARCHAR) + ', ' +
       'N''' + ISNULL(Feature, '') + ''', ' +
       CAST(OrderIndex AS VARCHAR) + ', ' +
       '''' + CONVERT(VARCHAR, CreatedAt, 121) + ''', ' +
       CASE WHEN UpdatedAt IS NULL THEN 'NULL' ELSE '''' + CONVERT(VARCHAR, UpdatedAt, 121) + '''' END +
       ');' AS InsertStatement
FROM EquipmentFeatures
ORDER BY Id;

-- Export EquipmentSpecifications data
SELECT '-- EquipmentSpecifications Data' AS ExportSection;
SELECT 'INSERT INTO EquipmentSpecifications (Id, EquipmentId, [Key], Value, OrderIndex, CreatedAt, UpdatedAt) VALUES (' +
       CAST(Id AS VARCHAR) + ', ' +
       CAST(EquipmentId AS VARCHAR) + ', ' +
       'N''' + ISNULL([Key], '') + ''', ' +
       'N''' + ISNULL(Value, '') + ''', ' +
       CAST(OrderIndex AS VARCHAR) + ', ' +
       '''' + CONVERT(VARCHAR, CreatedAt, 121) + ''', ' +
       CASE WHEN UpdatedAt IS NULL THEN 'NULL' ELSE '''' + CONVERT(VARCHAR, UpdatedAt, 121) + '''' END +
       ');' AS InsertStatement
FROM EquipmentSpecifications
ORDER BY Id;

-- Export Employees data
SELECT '-- Employees Data' AS ExportSection;
SELECT 'INSERT INTO Employees (Id, Name, Position, Description, Phone, Email, LinkedIn, ImageUrl, CreatedAt, UpdatedAt) VALUES (' +
       CAST(Id AS VARCHAR) + ', ' +
       'N''' + ISNULL(Name, '') + ''', ' +
       'N''' + ISNULL(Position, '') + ''', ' +
       'N''' + ISNULL(Description, '') + ''', ' +
       'N''' + ISNULL(Phone, '') + ''', ' +
       'N''' + ISNULL(Email, '') + ''', ' +
       'N''' + ISNULL(LinkedIn, '') + ''', ' +
       'N''' + ISNULL(ImageUrl, '') + ''', ' +
       '''' + CONVERT(VARCHAR, CreatedAt, 121) + ''', ' +
       CASE WHEN UpdatedAt IS NULL THEN 'NULL' ELSE '''' + CONVERT(VARCHAR, UpdatedAt, 121) + '''' END +
       ');' AS InsertStatement
FROM Employees
ORDER BY Id;

-- Export Products data
SELECT '-- Products Data' AS ExportSection;
SELECT 'INSERT INTO Products (Id, Name, Description, Price, CategoryId, ImageUrl, CreatedAt, UpdatedAt) VALUES (' +
       CAST(Id AS VARCHAR) + ', ' +
       'N''' + ISNULL(Name, '') + ''', ' +
       'N''' + ISNULL(Description, '') + ''', ' +
       CAST(ISNULL(Price, 0) AS VARCHAR) + ', ' +
       CAST(ISNULL(CategoryId, 0) AS VARCHAR) + ', ' +
       'N''' + ISNULL(ImageUrl, '') + ''', ' +
       '''' + CONVERT(VARCHAR, CreatedAt, 121) + ''', ' +
       CASE WHEN UpdatedAt IS NULL THEN 'NULL' ELSE '''' + CONVERT(VARCHAR, UpdatedAt, 121) + '''' END +
       ');' AS InsertStatement
FROM Products
ORDER BY Id;

-- Export Services data
SELECT '-- Services Data' AS ExportSection;
SELECT 'INSERT INTO Services (Id, Name, Description, Price, CategoryId, ImageUrl, CreatedAt, UpdatedAt) VALUES (' +
       CAST(Id AS VARCHAR) + ', ' +
       'N''' + ISNULL(Name, '') + ''', ' +
       'N''' + ISNULL(Description, '') + ''', ' +
       CAST(ISNULL(Price, 0) AS VARCHAR) + ', ' +
       CAST(ISNULL(CategoryId, 0) AS VARCHAR) + ', ' +
       'N''' + ISNULL(ImageUrl, '') + ''', ' +
       '''' + CONVERT(VARCHAR, CreatedAt, 121) + ''', ' +
       CASE WHEN UpdatedAt IS NULL THEN 'NULL' ELSE '''' + CONVERT(VARCHAR, UpdatedAt, 121) + '''' END +
       ');' AS InsertStatement
FROM Services
ORDER BY Id;

-- Export AboutLogo data
SELECT '-- AboutLogo Data' AS ExportSection;
SELECT 'INSERT INTO AboutLogo (Id, Heading, Subtext, ImageUrl, CreatedAt, UpdatedAt) VALUES (' +
       CAST(Id AS VARCHAR) + ', ' +
       'N''' + ISNULL(Heading, '') + ''', ' +
       'N''' + ISNULL(Subtext, '') + ''', ' +
       'N''' + ISNULL(ImageUrl, '') + ''', ' +
       '''' + CONVERT(VARCHAR, CreatedAt, 121) + ''', ' +
       CASE WHEN UpdatedAt IS NULL THEN 'NULL' ELSE '''' + CONVERT(VARCHAR, UpdatedAt, 121) + '''' END +
       ');' AS InsertStatement
FROM AboutLogo
ORDER BY Id;

-- Show summary
SELECT '-- DATA EXPORT SUMMARY' AS ExportSection;
SELECT 'Total records to export:' AS Summary;
SELECT 'Equipment: ' + CAST(COUNT(*) AS VARCHAR) AS Count FROM Equipment;
SELECT 'EquipmentFeatures: ' + CAST(COUNT(*) AS VARCHAR) AS Count FROM EquipmentFeatures;
SELECT 'EquipmentSpecifications: ' + CAST(COUNT(*) AS VARCHAR) AS Count FROM EquipmentSpecifications;
SELECT 'Employees: ' + CAST(COUNT(*) AS VARCHAR) AS Count FROM Employees;
SELECT 'Products: ' + CAST(COUNT(*) AS VARCHAR) AS Count FROM Products;
SELECT 'Services: ' + CAST(COUNT(*) AS VARCHAR) AS Count FROM Services;
SELECT 'AboutLogo: ' + CAST(COUNT(*) AS VARCHAR) AS Count FROM AboutLogo;
