using System.ComponentModel.DataAnnotations;

namespace WebOnlyAPI.Models
{
    public class Equipment
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
        public string? Version { get; set; }

        [StringLength(100)]
        public string? VersionEn { get; set; }

        [StringLength(100)]
        public string? VersionRu { get; set; }
        
        [StringLength(100)]
        public string? Core { get; set; }

        [StringLength(100)]
        public string? CoreEn { get; set; }

        [StringLength(100)]
        public string? CoreRu { get; set; }
        
        [StringLength(2000)]
        public string? Description { get; set; }

        [StringLength(2000)]
        public string? DescriptionEn { get; set; }

        [StringLength(2000)]
        public string? DescriptionRu { get; set; }
        
        [StringLength(500)]
        public string? ImageUrl { get; set; }
        
        public bool IsMain { get; set; } = false;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        public ICollection<EquipmentFeature> FeaturesList { get; set; } = new List<EquipmentFeature>();
        public ICollection<EquipmentSpecification> Specifications { get; set; } = new List<EquipmentSpecification>();
        public ICollection<EquipmentCategoryMapping> CategoryMappings { get; set; } = new List<EquipmentCategoryMapping>();
        public ICollection<EquipmentTagMapping> TagMappings { get; set; } = new List<EquipmentTagMapping>();
    }
}
