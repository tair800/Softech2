namespace WebOnlyAPI.DTOs
{
    public class VisitorAnalyticsDto
    {
        public int Id { get; set; }
        public required string PageUrl { get; set; }
        public required string UserAgent { get; set; }
        public string? IpAddress { get; set; }
        public string? Referrer { get; set; }
        public DateTime VisitedAt { get; set; }
        public string? SessionId { get; set; }
        public int? DurationSeconds { get; set; }
        public bool IsUniqueVisitor { get; set; }
        public string? Country { get; set; }
        public string? City { get; set; }
        public string? DeviceType { get; set; }
        public string? Browser { get; set; }
        public string? OperatingSystem { get; set; }
    }

    public class VisitorAnalyticsSummaryDto
    {
        public int TotalVisitors { get; set; }
        public int UniqueVisitors { get; set; }
        public int PageViews { get; set; }
        public double AverageSessionDuration { get; set; }
        public List<PageViewDto> TopPages { get; set; } = new();
        public List<DeviceTypeDto> DeviceTypes { get; set; } = new();
        public List<BrowserDto> Browsers { get; set; } = new();
        public List<CountryDto> Countries { get; set; } = new();
        public List<DailyVisitorDto> DailyVisitors { get; set; } = new();
    }

    public class PageViewDto
    {
        public required string PageUrl { get; set; }
        public int ViewCount { get; set; }
        public double Percentage { get; set; }
    }

    public class DeviceTypeDto
    {
        public required string DeviceType { get; set; }
        public int Count { get; set; }
        public double Percentage { get; set; }
    }

    public class BrowserDto
    {
        public required string Browser { get; set; }
        public int Count { get; set; }
        public double Percentage { get; set; }
    }

    public class CountryDto
    {
        public required string Country { get; set; }
        public int Count { get; set; }
        public double Percentage { get; set; }
    }

    public class DailyVisitorDto
    {
        public DateTime Date { get; set; }
        public int Visitors { get; set; }
        public int PageViews { get; set; }
    }
}
