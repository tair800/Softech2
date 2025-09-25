-- Fix References table by replacing blob URLs with actual logo images
-- First, clear the existing references with blob URLs
DELETE FROM References;

-- Reset identity column
DBCC CHECKIDENT ('References', RESEED, 0);

-- Insert new references with correct logo paths
INSERT INTO References (Name, ImageUrl, Alt, CreatedAt) VALUES
('Logo 1', '/assets/logo1.png', 'Company Logo 1', GETDATE()),
('Logo 2', '/assets/logo2.png', 'Company Logo 2', GETDATE()),
('Logo 3', '/assets/logo3.png', 'Company Logo 3', GETDATE()),
('Logo 4', '/assets/logo4.png', 'Company Logo 4', GETDATE()),
('Logo 5', '/assets/logo5.png', 'Company Logo 5', GETDATE()),
('Logo 6', '/assets/logo6.png', 'Company Logo 6', GETDATE()),
('Logo 7', '/assets/logo7.png', 'Company Logo 7', GETDATE()),
('Logo 8', '/assets/logo8.png', 'Company Logo 8', GETDATE()),
('Logo 9', '/assets/logo9.png', 'Company Logo 9', GETDATE()),
('Logo 10', '/assets/logo10.png', 'Company Logo 10', GETDATE()),
('Logo 11', '/assets/logo11.png', 'Company Logo 11', GETDATE()),
('Logo 12', '/assets/logo12.png', 'Company Logo 12', GETDATE()),
('Logo 13', '/assets/logo13.png', 'Company Logo 13', GETDATE()),
('Logo 14', '/assets/logo14.png', 'Company Logo 14', GETDATE()),
('Logo 15', '/assets/logo15.png', 'Company Logo 15', GETDATE()),
('Logo 16', '/assets/logo16.png', 'Company Logo 16', GETDATE()),
('Logo 17', '/assets/logo17.png', 'Company Logo 17', GETDATE()),
('Logo 18', '/assets/logo18.png', 'Company Logo 18', GETDATE()),
('Logo 19', '/assets/logo19.png', 'Company Logo 19', GETDATE()),
('Logo 20', '/assets/logo20.png', 'Company Logo 20', GETDATE()),
('Logo 21', '/assets/logo21.png', 'Company Logo 21', GETDATE()),
('Logo 22', '/assets/logo22.png', 'Company Logo 22', GETDATE()),
('Logo 23', '/assets/logo23.png', 'Company Logo 23', GETDATE());

-- Verify the references were added
SELECT COUNT(*) as ReferenceCount FROM References;
