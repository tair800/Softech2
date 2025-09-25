-- Check available Unicode-aware collations
SELECT 
    name AS CollationName,
    description AS Description
FROM sys.fn_helpcollations()
WHERE name LIKE '%Unicode%' OR name LIKE '%UTF%' OR name LIKE '%100%' OR name LIKE '%140%'
ORDER BY name;
