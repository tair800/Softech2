-- Check database collation and encoding settings
SELECT 
    name AS DatabaseName,
    collation_name AS Collation,
    DATABASEPROPERTYEX(name, 'Collation') AS CurrentCollation
FROM sys.databases 
WHERE name = 'WebOnlyAPI';

-- Check table collation
SELECT 
    t.name AS TableName,
    c.name AS ColumnName,
    c.collation_name AS ColumnCollation,
    c.user_type_id AS DataType,
    c.max_length AS MaxLength
FROM sys.tables t
JOIN sys.columns c ON t.object_id = c.object_id
WHERE t.name = 'EquipmentFeatures'
ORDER BY c.column_id;
