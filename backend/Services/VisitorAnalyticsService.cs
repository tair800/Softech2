using Microsoft.EntityFrameworkCore;
using WebOnlyAPI.Data;
using WebOnlyAPI.DTOs;
using WebOnlyAPI.Models;
using System.Text.RegularExpressions;

namespace WebOnlyAPI.Services
{
    public interface IVisitorAnalyticsService
    {
        Task TrackVisitorAsync(VisitorAnalyticsDto visitorData);
        Task<VisitorAnalyticsSummaryDto> GetAnalyticsSummaryAsync(DateTime? startDate = null, DateTime? endDate = null);
        Task<List<VisitorAnalyticsDto>> GetRecentVisitorsAsync(int count = 10);
    }

    public class VisitorAnalyticsService : IVisitorAnalyticsService
    {
        private readonly ApplicationDbContext _context;

        public VisitorAnalyticsService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task TrackVisitorAsync(VisitorAnalyticsDto visitorData)
        {
            var visitor = new VisitorAnalytics
            {
                PageUrl = visitorData.PageUrl,
                UserAgent = visitorData.UserAgent,
                IpAddress = visitorData.IpAddress,
                Referrer = visitorData.Referrer,
                VisitedAt = DateTime.UtcNow,
                SessionId = visitorData.SessionId,
                DurationSeconds = visitorData.DurationSeconds,
                IsUniqueVisitor = visitorData.IsUniqueVisitor,
                Country = visitorData.Country,
                City = visitorData.City,
                DeviceType = GetDeviceType(visitorData.UserAgent),
                Browser = GetBrowser(visitorData.UserAgent),
                OperatingSystem = GetOperatingSystem(visitorData.UserAgent)
            };

            _context.VisitorAnalytics.Add(visitor);
            await _context.SaveChangesAsync();
        }

        public async Task<VisitorAnalyticsSummaryDto> GetAnalyticsSummaryAsync(DateTime? startDate = null, DateTime? endDate = null)
        {
            var query = _context.VisitorAnalytics.AsQueryable();

            if (startDate.HasValue)
                query = query.Where(v => v.VisitedAt >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(v => v.VisitedAt <= endDate.Value);

            var totalVisitors = await query.CountAsync();
            var uniqueVisitors = await query.Where(v => v.IsUniqueVisitor).CountAsync();
            var pageViews = await query.CountAsync();
            var averageSessionDuration = await query
                .Where(v => v.DurationSeconds.HasValue)
                .AverageAsync(v => v.DurationSeconds ?? 0);

            // Top pages
            var topPages = await query
                .GroupBy(v => v.PageUrl)
                .Select(g => new PageViewDto
                {
                    PageUrl = g.Key,
                    ViewCount = g.Count(),
                    Percentage = 0 // Will be calculated below
                })
                .OrderByDescending(p => p.ViewCount)
                .Take(10)
                .ToListAsync();

            // Calculate percentages
            if (pageViews > 0)
            {
                foreach (var page in topPages)
                {
                    page.Percentage = Math.Round((double)page.ViewCount / pageViews * 100, 1);
                }
            }

            // Device types
            var deviceTypes = await query
                .Where(v => !string.IsNullOrEmpty(v.DeviceType))
                .GroupBy(v => v.DeviceType)
                .Select(g => new DeviceTypeDto
                {
                    DeviceType = g.Key ?? "Unknown",
                    Count = g.Count(),
                    Percentage = 0
                })
                .OrderByDescending(d => d.Count)
                .ToListAsync();

            if (totalVisitors > 0)
            {
                foreach (var device in deviceTypes)
                {
                    device.Percentage = Math.Round((double)device.Count / totalVisitors * 100, 1);
                }
            }

            // Browsers
            var browsers = await query
                .Where(v => !string.IsNullOrEmpty(v.Browser))
                .GroupBy(v => v.Browser)
                .Select(g => new BrowserDto
                {
                    Browser = g.Key ?? "Unknown",
                    Count = g.Count(),
                    Percentage = 0
                })
                .OrderByDescending(b => b.Count)
                .ToListAsync();

            if (totalVisitors > 0)
            {
                foreach (var browser in browsers)
                {
                    browser.Percentage = Math.Round((double)browser.Count / totalVisitors * 100, 1);
                }
            }

            // Countries
            var countries = await query
                .Where(v => !string.IsNullOrEmpty(v.Country))
                .GroupBy(v => v.Country)
                .Select(g => new CountryDto
                {
                    Country = g.Key ?? "Unknown",
                    Count = g.Count(),
                    Percentage = 0
                })
                .OrderByDescending(c => c.Count)
                .ToListAsync();

            if (totalVisitors > 0)
            {
                foreach (var country in countries)
                {
                    country.Percentage = Math.Round((double)country.Count / totalVisitors * 100, 1);
                }
            }

            // Daily visitors (last 30 days)
            var thirtyDaysAgo = DateTime.UtcNow.AddDays(-30);
            var dailyVisitors = await query
                .Where(v => v.VisitedAt >= thirtyDaysAgo)
                .GroupBy(v => v.VisitedAt.Date)
                .Select(g => new DailyVisitorDto
                {
                    Date = g.Key,
                    Visitors = g.Count(),
                    PageViews = g.Count()
                })
                .OrderBy(d => d.Date)
                .ToListAsync();

            return new VisitorAnalyticsSummaryDto
            {
                TotalVisitors = totalVisitors,
                UniqueVisitors = uniqueVisitors,
                PageViews = pageViews,
                AverageSessionDuration = Math.Round(averageSessionDuration, 1),
                TopPages = topPages,
                DeviceTypes = deviceTypes,
                Browsers = browsers,
                Countries = countries,
                DailyVisitors = dailyVisitors
            };
        }

        public async Task<List<VisitorAnalyticsDto>> GetRecentVisitorsAsync(int count = 10)
        {
            return await _context.VisitorAnalytics
                .OrderByDescending(v => v.VisitedAt)
                .Take(count)
                .Select(v => new VisitorAnalyticsDto
                {
                    Id = v.Id,
                    PageUrl = v.PageUrl,
                    UserAgent = v.UserAgent,
                    IpAddress = v.IpAddress,
                    Referrer = v.Referrer,
                    VisitedAt = v.VisitedAt,
                    SessionId = v.SessionId,
                    DurationSeconds = v.DurationSeconds,
                    IsUniqueVisitor = v.IsUniqueVisitor,
                    Country = v.Country,
                    City = v.City,
                    DeviceType = v.DeviceType,
                    Browser = v.Browser,
                    OperatingSystem = v.OperatingSystem
                })
                .ToListAsync();
        }

        private string GetDeviceType(string userAgent)
        {
            if (string.IsNullOrEmpty(userAgent)) return "Unknown";

            userAgent = userAgent.ToLower();

            if (userAgent.Contains("mobile") || userAgent.Contains("android") || userAgent.Contains("iphone"))
                return "Mobile";
            if (userAgent.Contains("tablet") || userAgent.Contains("ipad"))
                return "Tablet";
            if (userAgent.Contains("windows") || userAgent.Contains("mac") || userAgent.Contains("linux"))
                return "Desktop";

            return "Unknown";
        }

        private string GetBrowser(string userAgent)
        {
            if (string.IsNullOrEmpty(userAgent)) return "Unknown";

            userAgent = userAgent.ToLower();

            if (userAgent.Contains("chrome"))
                return "Chrome";
            if (userAgent.Contains("firefox"))
                return "Firefox";
            if (userAgent.Contains("safari") && !userAgent.Contains("chrome"))
                return "Safari";
            if (userAgent.Contains("edge"))
                return "Edge";
            if (userAgent.Contains("opera"))
                return "Opera";

            return "Other";
        }

        private string GetOperatingSystem(string userAgent)
        {
            if (string.IsNullOrEmpty(userAgent)) return "Unknown";

            userAgent = userAgent.ToLower();

            if (userAgent.Contains("windows"))
                return "Windows";
            if (userAgent.Contains("mac os"))
                return "macOS";
            if (userAgent.Contains("linux"))
                return "Linux";
            if (userAgent.Contains("android"))
                return "Android";
            if (userAgent.Contains("ios"))
                return "iOS";

            return "Unknown";
        }
    }
}
