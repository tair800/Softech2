-- Start Fresh: Clear References table completely
DELETE FROM References;

-- Reset identity column to start from 1
DBCC CHECKIDENT ('References', RESEED, 0);

-- Verify the table is empty
SELECT COUNT(*) as ReferenceCount FROM References;
