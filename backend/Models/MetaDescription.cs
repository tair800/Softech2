using System.ComponentModel.DataAnnotations;

namespace WebOnlyAPI.Models
{
    public class MetaDescription
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string PageKey { get; set; } = string.Empty; // home, about, services, etc.
        
        [Required]
        [StringLength(10)]
        public string Language { get; set; } = string.Empty; // az, en, ru
        
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        [StringLength(500)]
        public string Description { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string? OpenGraphTitle { get; set; }
        
        [StringLength(500)]
        public string? OpenGraphDescription { get; set; }
        
        [StringLength(500)]
        public string? TwitterTitle { get; set; }
        
        [StringLength(500)]
        public string? TwitterDescription { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        public bool IsActive { get; set; } = true;
    }
}
