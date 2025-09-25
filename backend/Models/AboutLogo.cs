using System.ComponentModel.DataAnnotations;

namespace WebOnlyAPI.Models
{
    public class AboutLogo
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Heading { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? HeadingEn { get; set; }

        [MaxLength(200)]
        public string? HeadingRu { get; set; }
        
        [Required]
        [MaxLength(2000)]
        public string Subtext { get; set; } = string.Empty;

        [MaxLength(2000)]
        public string? SubtextEn { get; set; }

        [MaxLength(2000)]
        public string? SubtextRu { get; set; }
        
        [MaxLength(500)]
        public string? ImageUrl { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedAt { get; set; }
    }
}
