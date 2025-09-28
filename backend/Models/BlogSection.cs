using System.ComponentModel.DataAnnotations;

namespace WebOnlyAPI.Models
{
    public class BlogSection
    {
        public int Id { get; set; }
        
        [Required]
        public int BlogId { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Title { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string? TitleEn { get; set; }
        
        [StringLength(100)]
        public string? TitleRu { get; set; }
        
        [StringLength(2000)]
        public string? Description { get; set; }
        
        [StringLength(2000)]
        public string? DescriptionEn { get; set; }
        
        [StringLength(2000)]
        public string? DescriptionRu { get; set; }
        
        public int OrderIndex { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation property
        public Blog? Blog { get; set; }
    }
}
