using System.ComponentModel.DataAnnotations;

namespace WebOnlyAPI.Models
{
    public class Service
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(100)]
        public string? NameEn { get; set; }

        [StringLength(100)]
        public string? NameRu { get; set; }
        
        [StringLength(100)]
        public string? Subtitle { get; set; }

        [StringLength(100)]
        public string? SubtitleEn { get; set; }

        [StringLength(100)]
        public string? SubtitleRu { get; set; }
        
        [StringLength(100)]
        public string? Icon { get; set; }
        
        [StringLength(500)]
        public string? DetailImage { get; set; }
        
        [StringLength(2000)]
        public string? Description { get; set; }

        [StringLength(2000)]
        public string? DescriptionEn { get; set; }

        [StringLength(2000)]
        public string? DescriptionRu { get; set; }
        
        [StringLength(1000)]
        public string? Subtext { get; set; }

        [StringLength(1000)]
        public string? SubtextEn { get; set; }

        [StringLength(1000)]
        public string? SubtextRu { get; set; }
        
        [StringLength(500)]
        public string? ImageUrl { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
