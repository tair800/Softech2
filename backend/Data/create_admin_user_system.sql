-- Admin Panel User System
-- This script deletes the existing Users table and creates a new admin user system

USE WebOnlyAPI;
GO

-- 1. Delete existing Users table
IF OBJECT_ID('Users', 'U') IS NOT NULL
BEGIN
    PRINT 'Deleting existing Users table...';
    DROP TABLE Users;
    PRINT 'Users table deleted successfully.';
END
ELSE
BEGIN
    PRINT 'No existing Users table found.';
END
GO

-- 2. Create new Users table for admin panel
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL UNIQUE,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    IsRememberMe BIT NOT NULL DEFAULT 0,
    LastLoginAt DATETIME2 NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO

-- 3. Create index for better performance
CREATE INDEX IX_Users_Username ON Users(Username);
CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_Users_IsActive ON Users(IsActive);
GO

-- 4. Insert default admin user
-- Password: admin123 (you should change this in production)
INSERT INTO Users (Username, Email, PasswordHash, FirstName, LastName, IsActive, CreatedAt, UpdatedAt)
VALUES (
    N'admin',
    N'admin@webonly.com',
    N'admin123', -- In production, this should be a proper hash
    N'Admin',
    N'User',
    1,
    GETDATE(),
    GETDATE()
);
GO

-- 5. Create UserSessions table for remember me functionality
CREATE TABLE UserSessions (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    SessionToken NVARCHAR(255) NOT NULL UNIQUE,
    RememberMe BIT NOT NULL DEFAULT 0,
    ExpiresAt DATETIME2 NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    LastAccessedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);
GO

-- 6. Create index for UserSessions
CREATE INDEX IX_UserSessions_UserId ON UserSessions(UserId);
CREATE INDEX IX_UserSessions_SessionToken ON UserSessions(SessionToken);
CREATE INDEX IX_UserSessions_ExpiresAt ON UserSessions(ExpiresAt);
GO

-- 7. Create UserLoginHistory table for tracking login attempts
CREATE TABLE UserLoginHistory (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NULL, -- NULL for failed login attempts
    Username NVARCHAR(50) NOT NULL,
    LoginAttempt DATETIME2 NOT NULL DEFAULT GETDATE(),
    IsSuccessful BIT NOT NULL,
    IpAddress NVARCHAR(45) NULL, -- IPv6 support
    UserAgent NVARCHAR(500) NULL,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE SET NULL
);
GO

-- 8. Create index for UserLoginHistory
CREATE INDEX IX_UserLoginHistory_UserId ON UserLoginHistory(UserId);
CREATE INDEX IX_UserLoginHistory_Username ON UserLoginHistory(Username);
CREATE INDEX IX_UserLoginHistory_LoginAttempt ON UserLoginHistory(LoginAttempt);
GO

-- 9. Verify tables created successfully
PRINT 'Verifying tables created successfully...';
SELECT 
    TABLE_NAME,
    TABLE_TYPE
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_NAME IN ('Users', 'UserSessions', 'UserLoginHistory')
ORDER BY TABLE_NAME;
GO

-- 10. Show sample data
PRINT 'Sample user data:';
SELECT 
    Id,
    Username,
    Email,
    FirstName,
    LastName,
    IsActive,
    CreatedAt
FROM Users;
GO

PRINT 'Admin user system created successfully!';
PRINT 'Default admin credentials:';
PRINT 'Username: admin';
PRINT 'Password: admin123';
PRINT 'Email: admin@webonly.com';
GO
