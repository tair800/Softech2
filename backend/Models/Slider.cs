using System.ComponentModel.DataAnnotations;

namespace WebOnlyAPI.Models
{
    public class Slider
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string? NameEn { get; set; }
        
        [StringLength(100)]
        public string? NameRu { get; set; }
        
        [StringLength(500)]
        public string? ImageUrl { get; set; }
        
        public int? ProductId { get; set; }
        
        public int OrderIndex { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
