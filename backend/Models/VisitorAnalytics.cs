using System.ComponentModel.DataAnnotations;

namespace WebOnlyAPI.Models
{
    public class VisitorAnalytics
    {
        public int Id { get; set; }
        
        [Required]
        public required string PageUrl { get; set; }
        
        [Required]
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
}
