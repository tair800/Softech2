-- Fix Equipment image URLs to match actual files in uploads folder
-- This will resolve the image errors on the equipment page

-- First, check current image URLs
SELECT 'Current image URLs:' AS Status;
SELECT Id, Name, ImageUrl FROM Equipment ORDER BY Id;

-- Fix the image URLs to match actual files
-- Equipment 1: PosClass TX-1500S
UPDATE Equipment SET ImageUrl = '/uploads/equipment/equipment1.png' WHERE Id = 1;

-- Equipment 2: saPosClass TX-1500S  
UPDATE Equipment SET ImageUrl = '/uploads/equipment/equipment1.png' WHERE Id = 2;

-- Equipment 3: PosClass TX-1500S (fix the blob URL)
UPDATE Equipment SET ImageUrl = '/uploads/equipment/equipment1.png' WHERE Id = 3;

-- Equipment 4: Honeywell Voyager 1200g
UPDATE Equipment SET ImageUrl = '/uploads/equipment/equipment2.png' WHERE Id = 4;

-- Equipment 5: Epson TM-T88VI
UPDATE Equipment SET ImageUrl = '/uploads/equipment/equipment2.png' WHERE Id = 5;

-- Equipment 6: APG Cash Drawer
UPDATE Equipment SET ImageUrl = '/uploads/equipment/equipment2.png' WHERE Id = 6;

-- Equipment 7: Verifone VX520
UPDATE Equipment SET ImageUrl = '/uploads/equipment/equipment2.png' WHERE Id = 7;

-- Equipment 8: Datalogic Memor X3
UPDATE Equipment SET ImageUrl = '/uploads/equipment/equipment2.png' WHERE Id = 8;

-- Equipment 9: Star TSP100
UPDATE Equipment SET ImageUrl = '/uploads/equipment/equipment2.png' WHERE Id = 9;

-- Equipment 10: Zebra ZD220
UPDATE Equipment SET ImageUrl = '/uploads/equipment/equipment2.png' WHERE Id = 10;

-- Verify the fix
SELECT 'After fixing image URLs:' AS Status;
SELECT Id, Name, ImageUrl FROM Equipment ORDER BY Id;

-- Also check if we need to create a default image for equipment without images
SELECT 'Equipment without images:' AS Status;
SELECT Id, Name, ImageUrl FROM Equipment WHERE ImageUrl IS NULL OR ImageUrl = '';
