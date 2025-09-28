using System.ComponentModel.DataAnnotations;

namespace WebOnlyAPI.Models
{
    public class Blog
    {
        public int Id { get; set; }

        // Required first section
        [Required]
        [StringLength(100)]
        public string Title1 { get; set; } = string.Empty;
        
        [StringLength(2000)]
        public string? Desc1 { get; set; }
        
        [StringLength(100)]
        public string? Title1En { get; set; }
        
        [StringLength(100)]
        public string? Title1Ru { get; set; }
        
        [StringLength(2000)]
        public string? Desc1En { get; set; }
        
        [StringLength(2000)]
        public string? Desc1Ru { get; set; }

        // Required second section
        [Required]
        [StringLength(100)]
        public string Title2 { get; set; } = string.Empty;
        
        [StringLength(2000)]
        public string? Desc2 { get; set; }
        
        [StringLength(100)]
        public string? Title2En { get; set; }
        
        [StringLength(100)]
        public string? Title2Ru { get; set; }
        
        [StringLength(2000)]
        public string? Desc2En { get; set; }
        
        [StringLength(2000)]
        public string? Desc2Ru { get; set; }

        // Required features (JSON array string: [{ iconUrl, title, description }, ...])
        [Required]
        public string Features { get; set; } = string.Empty;

        public string? MainImageUrl { get; set; }
        public string? DetailImg1Url { get; set; }
        public string? DetailImg2Url { get; set; }
        public string? DetailImg3Url { get; set; }
        public string? DetailImg4Url { get; set; }

        public DateTimeOffset? PublishedAt { get; set; }
        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
        
        // Navigation property for dynamic sections
        public ICollection<BlogSection> Sections { get; set; } = new List<BlogSection>();
    }
}


