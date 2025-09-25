-- Clear References table to remove invalid blob URLs
DELETE FROM References;

-- Reset identity column if using SQL Server
DBCC CHECKIDENT ('References', RESEED, 0);
