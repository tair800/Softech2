using System.ComponentModel.DataAnnotations;

namespace WebOnlyAPI.Models
{
    public class ServiceArticle
    {
        public int Id { get; set; }
        
        [Required]
        public int ServiceId { get; set; }
        public Service Service { get; set; } = null!;
        
        [Required]
        [StringLength(10)]
        public string Number { get; set; } = string.Empty;
        
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [StringLength(1000)]
        public string? Description { get; set; }
        
        public int OrderIndex { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
