-- Verify that the Azerbaijani character encoding fix was successful
-- This will show sample features to confirm proper Unicode display

SELECT 
    Id,
    EquipmentId,
    Feature,
    OrderIndex
FROM EquipmentFeatures 
ORDER BY EquipmentId, OrderIndex;
