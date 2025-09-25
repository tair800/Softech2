-- Create VisitorAnalytics table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[VisitorAnalytics]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[VisitorAnalytics](
        [Id] [int] IDENTITY(1,1) NOT NULL,
        [PageUrl] [nvarchar](500) NOT NULL,
        [UserAgent] [nvarchar](1000) NOT NULL,
        [IpAddress] [nvarchar](45) NULL,
        [Referrer] [nvarchar](500) NULL,
        [VisitedAt] [datetime2](7) NOT NULL,
        [SessionId] [nvarchar](100) NULL,
        [DurationSeconds] [int] NULL,
        [IsUniqueVisitor] [bit] NOT NULL,
        [Country] [nvarchar](100) NULL,
        [City] [nvarchar](100) NULL,
        [DeviceType] [nvarchar](50) NULL,
        [Browser] [nvarchar](50) NULL,
        [OperatingSystem] [nvarchar](50) NULL,
        CONSTRAINT [PK_VisitorAnalytics] PRIMARY KEY CLUSTERED ([Id] ASC)
    )
END

-- Insert some sample data for testing
IF NOT EXISTS (SELECT 1 FROM VisitorAnalytics)
BEGIN
    INSERT INTO VisitorAnalytics (PageUrl, UserAgent, IpAddress, Referrer, VisitedAt, SessionId, DurationSeconds, IsUniqueVisitor, Country, City, DeviceType, Browser, OperatingSystem) VALUES
    (N'/', N'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', N'192.168.1.1', NULL, DATEADD(day, -1, GETDATE()), N'session1', 120, 1, N'Azerbaijan', N'Baku', N'Desktop', N'Chrome', N'Windows'),
    (N'/equipment', N'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', N'192.168.1.2', N'/', DATEADD(day, -1, GETDATE()), N'session1', 180, 0, N'Azerbaijan', N'Baku', N'Desktop', N'Chrome', N'Windows'),
    (N'/products', N'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1', N'192.168.1.3', NULL, DATEADD(day, -2, GETDATE()), N'session2', 90, 1, N'Azerbaijan', N'Ganja', N'Mobile', N'Safari', N'iOS'),
    (N'/services', N'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', N'192.168.1.4', N'/', DATEADD(day, -2, GETDATE()), N'session2', 150, 0, N'Azerbaijan', N'Ganja', N'Desktop', N'Chrome', N'macOS'),
    (N'/about', N'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/120.0.0.0 Safari/537.36', N'192.168.1.5', NULL, DATEADD(day, -3, GETDATE()), N'session3', 200, 1, N'Turkey', N'Istanbul', N'Desktop', N'Edge', N'Windows'),
    (N'/contact', N'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36', N'192.168.1.6', N'/about', DATEADD(day, -3, GETDATE()), N'session3', 80, 0, N'Turkey', N'Istanbul', N'Mobile', N'Chrome', N'Android'),
    (N'/equipment/1', N'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1', N'192.168.1.7', N'/equipment', DATEADD(day, -4, GETDATE()), N'session4', 300, 1, N'Georgia', N'Tbilisi', N'Tablet', N'Safari', N'iOS'),
    (N'/products/1', N'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Firefox/120.0', N'192.168.1.8', N'/products', DATEADD(day, -4, GETDATE()), N'session4', 250, 0, N'Georgia', N'Tbilisi', N'Desktop', N'Firefox', N'Windows'),
    (N'/', N'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', N'192.168.1.9', NULL, DATEADD(day, -5, GETDATE()), N'session5', 180, 1, N'Russia', N'Moscow', N'Desktop', N'Chrome', N'Windows'),
    (N'/equipment', N'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1', N'192.168.1.10', N'/', DATEADD(day, -5, GETDATE()), N'session5', 120, 0, N'Russia', N'Moscow', N'Mobile', N'Safari', N'iOS'),
    (N'/services', N'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Safari/17.0', N'192.168.1.11', NULL, DATEADD(day, -6, GETDATE()), N'session6', 400, 1, N'Ukraine', N'Kyiv', N'Desktop', N'Safari', N'macOS'),
    (N'/about', N'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36', N'192.168.1.12', N'/services', DATEADD(day, -6, GETDATE()), N'session6', 160, 0, N'Ukraine', N'Kyiv', N'Mobile', N'Chrome', N'Android'),
    (N'/contact', N'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Opera/120.0.0.0', N'192.168.1.13', NULL, DATEADD(day, -7, GETDATE()), N'session7', 220, 1, N'Kazakhstan', N'Almaty', N'Desktop', N'Opera', N'Windows'),
    (N'/equipment/2', N'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1', N'192.168.1.14', N'/equipment', DATEADD(day, -7, GETDATE()), N'session7', 280, 0, N'Kazakhstan', N'Almaty', N'Tablet', N'Safari', N'iOS'),
    (N'/products/2', N'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', N'192.168.1.15', N'/products', DATEADD(day, -8, GETDATE()), N'session8', 190, 1, N'Uzbekistan', N'Tashkent', N'Desktop', N'Chrome', N'Windows'),
    (N'/services/1', N'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1', N'192.168.1.16', N'/services', DATEADD(day, -8, GETDATE()), N'session8', 140, 0, N'Uzbekistan', N'Tashkent', N'Mobile', N'Safari', N'iOS'),
    (N'/', N'Mozilla/5.0 (Linux; Ubuntu 22.04; x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', N'192.168.1.17', NULL, DATEADD(day, -9, GETDATE()), N'session9', 350, 1, N'Belarus', N'Minsk', N'Desktop', N'Chrome', N'Linux'),
    (N'/equipment', N'Mozilla/5.0 (Android 13; SM-A546B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/23.0 Chrome/120.0.0.0 Mobile Safari/537.36', N'192.168.1.18', N'/', DATEADD(day, -9, GETDATE()), N'session9', 110, 0, N'Belarus', N'Minsk', N'Mobile', N'Chrome', N'Android'),
    (N'/products', N'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/120.0.0.0 Safari/537.36', N'192.168.1.19', NULL, DATEADD(day, -10, GETDATE()), N'session10', 270, 1, N'Moldova', N'Chisinau', N'Desktop', N'Edge', N'Windows'),
    (N'/about', N'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1', N'192.168.1.20', N'/products', DATEADD(day, -10, GETDATE()), N'session10', 130, 0, N'Moldova', N'Chisinau', N'Mobile', N'Safari', N'iOS')
END
