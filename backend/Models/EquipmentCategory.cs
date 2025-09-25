using System.ComponentModel.DataAnnotations;

namespace WebOnlyAPI.Models
{
    public class EquipmentCategory
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        [MaxLength(100)]
        public string? NameEn { get; set; }
        [MaxLength(100)]
        public string? NameRu { get; set; }
        
        [MaxLength(500)]
        public string? Description { get; set; }
        [MaxLength(500)]
        public string? DescriptionEn { get; set; }
        [MaxLength(500)]
        public string? DescriptionRu { get; set; }
        
        [MaxLength(10)]
        public string? Icon { get; set; }
        
        [MaxLength(7)]
        public string? Color { get; set; }
        
        public int OrderIndex { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        public virtual ICollection<EquipmentCategoryMapping> EquipmentMappings { get; set; } = new List<EquipmentCategoryMapping>();
    }
}

