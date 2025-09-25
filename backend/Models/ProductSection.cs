using System.ComponentModel.DataAnnotations;

namespace WebOnlyAPI.Models
{
    public class ProductSection
    {
        public int Id { get; set; }
        
        [Required]
        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;
        
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [StringLength(2000)]
        public string? Description { get; set; }
        
        [StringLength(1000)]
        public string? MoreText { get; set; }
        
        public int OrderIndex { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
